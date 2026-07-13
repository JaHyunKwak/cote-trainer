"use strict";

const $ = (s) => document.querySelector(s);
const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

const OUTPUT_LIMIT = 1_000_000;
const TIME_MULT = 3; // WASM은 네이티브보다 느려서 제한시간 ×3
const VERDICT_LABEL = {
  pass: "✅ 정답", fail: "❌ 오답", error: "💥 런타임 오류",
  timeout: "⏱ 시간 초과", output_limit: "📤 출력 제한 초과", skipped: "⏭ 중단",
};

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const vclass = (v) => (VERDICT_LABEL[v] ? v : "error");

function normalizeOut(text) {
  const lines = String(text).split("\n").map((l) => l.replace(/[ \t\r]+$/, ""));
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines.join("\n");
}

/* ── 기록 저장 (localStorage) ─────────────────────── */
const store = {
  subs() { try { return JSON.parse(localStorage.getItem("ct2-subs") || "[]"); } catch { return []; } },
  saveSubs(v) { localStorage.setItem("ct2-subs", JSON.stringify(v)); },
  add(pid, verdict, elapsedMs) {
    const v = this.subs();
    v.push({ pid, verdict, elapsedMs, ts: Date.now() });
    this.saveSubs(v);
  },
  solved() { return new Set(this.subs().filter((s) => s.verdict === "pass").map((s) => s.pid)); },
  merge(remote) {
    const key = (s) => `${s.ts}|${s.pid}|${s.verdict}`;
    const map = new Map(this.subs().map((s) => [key(s), s]));
    for (const s of remote || []) if (s && s.ts && s.pid) map.set(key(s), s);
    const merged = [...map.values()].sort((a, b) => a.ts - b.ts);
    this.saveSubs(merged);
    return merged;
  },
  gist() { try { return JSON.parse(localStorage.getItem("ct2-gist") || "{}"); } catch { return {}; } },
  saveGist(v) { localStorage.setItem("ct2-gist", JSON.stringify(v)); },
  // 백준 풀이 체크 (problemId → 체크 시각)
  boj() { try { return JSON.parse(localStorage.getItem("ct2-boj") || "{}"); } catch { return {}; } },
  saveBoj(v) { localStorage.setItem("ct2-boj", JSON.stringify(v)); },
  toggleBoj(id) {
    const v = this.boj();
    if (v[id]) delete v[id]; else v[id] = Date.now();
    this.saveBoj(v);
    return !!v[id];
  },
  mergeBoj(remote) {
    const v = this.boj();
    for (const [k, ts] of Object.entries(remote || {})) if (!v[k]) v[k] = ts;
    this.saveBoj(v);
  },
};
const draftKey = (id) => `ct2-draft-${id}`;

/* ── Python 채점 (Pyodide 워커) ───────────────────── */
class PyJudge {
  constructor() { this.worker = null; this.readyP = null; this.seq = 0; }
  setStatus(t) { $("#engine-status").textContent = t; }
  ensure() {
    if (this.readyP) return this.readyP;
    this.setStatus("Python 엔진 로딩 중… (최초 1회)");
    this.worker = new Worker("py-worker.js");
    this.readyP = new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.type === "ready") { this.setStatus("Python 준비됨"); resolve(); }
        else if (e.data.type === "init-error") {
          this.setStatus("Python 로드 실패");
          this.worker.terminate(); this.worker = null; this.readyP = null;
          reject(new Error(e.data.error));
        }
      };
      this.worker.postMessage({ type: "init" });
    });
    return this.readyP;
  }
  kill() {
    if (this.worker) this.worker.terminate();
    this.worker = null; this.readyP = null;
    this.setStatus("Python 엔진 대기");
  }
  async runCase(code, input, timeoutMs) {
    await this.ensure();
    const id = ++this.seq;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.kill();
        resolve({ verdict: "timeout", elapsedMs: timeoutMs, stdout: "", stderr: "" });
      }, timeoutMs);
      this.worker.onmessage = (e) => {
        const d = e.data;
        if (d.type === "case-result" && d.id === id) { clearTimeout(timer); resolve(d); }
      };
      this.worker.postMessage({ type: "case", id, code, input, outputLimit: OUTPUT_LIMIT });
    });
  }
}
const pyJudge = new PyJudge();

/* ── SQL 채점 (sql.js 워커) ───────────────────────── */
class SqlJudge {
  constructor() { this.worker = null; this.readyP = null; this.seq = 0; }
  ensure() {
    if (this.readyP) return this.readyP;
    this.worker = new Worker("sql-worker.js");
    this.readyP = new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.type === "ready") resolve();
        else if (e.data.type === "init-error") {
          this.worker.terminate(); this.worker = null; this.readyP = null;
          reject(new Error(e.data.error));
        }
      };
      this.worker.postMessage({ type: "init" });
    });
    return this.readyP;
  }
  kill() { if (this.worker) this.worker.terminate(); this.worker = null; this.readyP = null; }
  async run(payload, timeoutMs) {
    await this.ensure();
    const id = ++this.seq;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.kill();
        resolve({ verdict: "timeout", elapsedMs: timeoutMs });
      }, timeoutMs);
      this.worker.onmessage = (e) => {
        const d = e.data;
        if (d.type === "sql-result" && d.id === id) { clearTimeout(timer); resolve(d); }
      };
      this.worker.postMessage({ type: "run", id, ...payload });
    });
  }
}
const sqlJudge = new SqlJudge();

/* ── UI 상태 ──────────────────────────────────────── */
let editor = null;
let currentProblem = null;
let openToken = 0;
let judging = false;

function setView(v) {
  document.body.className = `view-${v}`;
  document.querySelectorAll("#mtabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === v));
}

function diffBadge(d) {
  const cls = d === "쉬움" ? "b-easy" : d === "중간" ? "b-mid" : "b-hard";
  return `<span class="badge ${cls}">${escapeHtml(d)}</span>`;
}
const tagBadges = (tags) =>
  tags.map((t) => `<span class="badge b-tag">${escapeHtml(t)}</span>`).join("");

function renderList() {
  const diff = $("#f-diff").value, type = $("#f-type").value;
  const unsolvedOnly = $("#f-unsolved").checked;
  const solved = store.solved();
  const ul = $("#plist");
  ul.innerHTML = "";
  const filtered = PROBLEMS.filter((p) =>
    (!diff || p.difficulty === diff) && (!type || p.type === type) &&
    (!unsolvedOnly || !solved.has(p.id)));
  if (!filtered.length) {
    ul.innerHTML = `<li class="empty">조건에 맞는 문제가 없습니다</li>`;
    return;
  }
  for (const p of filtered) {
    const li = document.createElement("li");
    li.dataset.id = p.id;
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    if (currentProblem?.id === p.id) li.classList.add("active");
    li.innerHTML =
      diffBadge(p.difficulty) + tagBadges(p.tags) +
      (solved.has(p.id) ? `<span class="badge b-solved">해결</span>` : "") +
      `<br>${escapeHtml(p.title)}`;
    li.onclick = () => openProblem(p.id);
    li.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProblem(p.id); }
    };
    ul.appendChild(li);
  }
}

function ensureEditor() {
  if (editor) return;
  editor = CodeMirror.fromTextArea($("#code"), {
    mode: "python", theme: "material-darker", lineNumbers: true,
    indentUnit: 4, tabSize: 4, indentWithTabs: false,
    inputStyle: "contenteditable", // 모바일 가상 키보드 호환
    autocapitalize: false, autocorrect: false, spellcheck: false,
    extraKeys: {
      Tab: (cm) => cm.replaceSelection("    ", "end"),
      "Cmd-Enter": () => grade(true),
      "Ctrl-Enter": () => grade(true),
      "Shift-Enter": () => grade(false),
    },
  });
  editor.on("change", () => {
    if (currentProblem) {
      try { localStorage.setItem(draftKey(currentProblem.id), editor.getValue()); } catch {}
    }
  });
}

function openProblem(id) {
  if (judging) return; // 채점 중 전환 방지 (엔진이 하나뿐)
  const p = PROBLEMS.find((x) => x.id === id);
  if (!p || currentProblem?.id === id) { closeDrawer(); return; }
  openToken++;
  currentProblem = p;
  document.querySelectorAll("#plist li").forEach((li) =>
    li.classList.toggle("active", li.dataset.id == id));
  $("#placeholder").classList.add("hidden");
  $("#workspace").classList.remove("hidden");
  $("#prob-meta").innerHTML =
    `<h2>${escapeHtml(p.title)}</h2>` + diffBadge(p.difficulty) + tagBadges(p.tags) +
    ` <span class="badge b-limit">제한 시간 ${escapeHtml(p.timeLimit * (p.type === "algo" ? TIME_MULT : 1))}초</span>`;
  $("#statement").innerHTML = DOMPurify.sanitize(marked.parse(p.statement));
  $("#results").innerHTML = "";
  $("#status").textContent = "";

  ensureEditor();
  editor.setOption("mode", p.type === "sql" ? "text/x-sql" : "python");
  const draft = localStorage.getItem(draftKey(p.id));
  editor.setValue(draft ?? (p.starterCode || ""));
  $("#btn-run").textContent = p.type === "sql" ? "▶ 실행 (미리보기)" : "▶ 실행 (예제)";

  closeDrawer();
  setView("problem");
  if (p.type === "algo") pyJudge.ensure().catch(() => {}); // 미리 로드 시작
  setTimeout(() => editor.refresh(), 0);
}

/* ── 결과 렌더링 ──────────────────────────────────── */
function renderAlgoResult(result, isSubmit) {
  const overall = VERDICT_LABEL[result.verdict] || escapeHtml(result.verdict);
  let html = `<div class="overall v-${vclass(result.verdict)}">` +
    `${isSubmit ? "제출 결과: " : "실행 결과: "}${overall}` +
    ` <small>(총 ${Number(result.elapsedMs)}ms)</small></div>`;
  for (const c of result.cases) {
    const label = VERDICT_LABEL[c.verdict] || escapeHtml(c.verdict);
    html += `<div class="case-row v-${vclass(c.verdict)}">케이스 ${Number(c.idx)}` +
      `${c.isSample ? " (예제)" : ""}${c.label ? ` · ${escapeHtml(c.label)}` : ""}` +
      ` — ${label} · ${Number(c.elapsedMs)}ms</div>`;
    if (c.verdict !== "pass" && c.verdict !== "skipped") {
      let d = "";
      if (c.input !== undefined) d += `<b>입력</b>\n${escapeHtml(c.input)}\n`;
      if (c.expected !== undefined) d += `<b>기대 출력</b>\n${escapeHtml(c.expected)}\n`;
      if (c.actual !== undefined) d += `<b>실제 출력</b>\n${escapeHtml(c.actual) || "(없음)"}\n`;
      if (c.stderr) d += `<b>오류</b>\n${escapeHtml(c.stderr)}`;
      html += `<div class="case-detail">${d}</div>`;
    }
  }
  $("#results").innerHTML = html;
}

function sqlTable(rows) {
  if (!rows || !rows.columns.length) return "<p class='hint'>(결과 없음)</p>";
  let h = "<table><thead><tr>" +
    rows.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("") + "</tr></thead><tbody>";
  for (const row of rows.values) {
    h += "<tr>" + row.map((v) => `<td>${v === null ? "<i>NULL</i>" : escapeHtml(v)}</td>`).join("") + "</tr>";
  }
  return h + "</tbody></table>";
}

function renderSqlResult(r, isSubmit) {
  let html;
  if (r.verdict === "preview") {
    html = `<div class="overall">실행 결과 <small>(${Number(r.rowCount)}행 · ${Number(r.elapsedMs)}ms)</small></div>` +
      sqlTable(r.userRows);
  } else if (r.verdict === "error") {
    html = `<div class="overall v-error">💥 쿼리 오류</div>` +
      `<div class="case-detail">${escapeHtml(r.error || "")}</div>`;
  } else if (r.verdict === "timeout") {
    html = `<div class="overall v-timeout">⏱ 시간 초과</div>`;
  } else {
    const label = VERDICT_LABEL[r.verdict] || escapeHtml(r.verdict);
    html = `<div class="overall v-${vclass(r.verdict)}">제출 결과: ${label}` +
      ` <small>(${Number(r.elapsedMs)}ms)</small></div>` +
      `<b class="tbl-title">내 결과</b>` + sqlTable(r.userRows);
    if (r.expectedRows) html += `<b class="tbl-title">기대 결과</b>` + sqlTable(r.expectedRows);
  }
  $("#results").innerHTML = html;
}

/* ── 채점 실행 ────────────────────────────────────── */
async function grade(isSubmit) {
  if (!currentProblem || judging) return;
  const p = currentProblem;
  const token = openToken;
  judging = true;
  const btns = [$("#btn-run"), $("#btn-submit")];
  btns.forEach((b) => (b.disabled = true));
  $("#results").innerHTML = "";
  try {
    if (p.type === "algo") {
      $("#status").textContent = "엔진 준비 중…";
      try { await pyJudge.ensure(); }
      catch {
        $("#results").innerHTML =
          `<div class="overall v-error">Python 엔진 로드 실패 — 인터넷 연결을 확인하고 새로고침하세요.</div>`;
        return;
      }
      const code = editorCode(); // 채점 시작 시점의 코드로 고정
      const cases = p.testcases.map(resolveCase).filter((c) => !isSubmit ? c.isSample : true);
      const timeoutMs = p.timeLimit * 1000 * TIME_MULT + 1000;
      const results = [];
      let overall = "pass", total = 0, aborted = false;
      for (let i = 0; i < cases.length; i++) {
        if (aborted) {
          results.push({ idx: i + 1, isSample: cases[i].isSample, label: cases[i].label, verdict: "skipped", elapsedMs: 0 });
          continue;
        }
        $("#status").textContent = `${isSubmit ? "채점" : "실행"} 중… (${i + 1}/${cases.length})`;
        const r = await pyJudge.runCase(code, cases[i].input, timeoutMs);
        total += r.elapsedMs;
        let cv;
        if (r.verdict === "ok") {
          cv = normalizeOut(r.stdout) === normalizeOut(cases[i].expected) ? "pass" : "fail";
        } else cv = r.verdict;
        const item = { idx: i + 1, isSample: cases[i].isSample, label: cases[i].label, verdict: cv, elapsedMs: r.elapsedMs };
        if (cv !== "pass") {
          item.input = cases[i].input.slice(0, 2000);
          item.expected = cases[i].expected.slice(0, 2000);
          item.actual = (r.stdout || "").slice(0, 2000);
          if (r.stderr) item.stderr = r.stderr;
          if (overall === "pass") overall = cv;
          if (cv === "timeout") aborted = true; // 엔진 재로드가 필요하므로 이후 중단
        }
        results.push(item);
      }
      if (token !== openToken) return;
      renderAlgoResult({ verdict: overall, elapsedMs: total, cases: results }, isSubmit);
      if (isSubmit) store.add(p.id, overall, total);
    } else {
      $("#status").textContent = "SQL 실행 중…";
      const fx = p.sqlFixture;
      const r = await sqlJudge.run({
        schemaSql: fx.schemaSql, seedSql: fx.seedSql,
        solutionQuery: fx.solutionQuery, orderSensitive: fx.orderSensitive,
        userQuery: editorCode(), mode: isSubmit ? "compare" : "preview",
      }, p.timeLimit * 1000 + 3000);
      if (token !== openToken) return;
      renderSqlResult(r, isSubmit);
      if (isSubmit && (r.verdict === "pass" || r.verdict === "fail" || r.verdict === "timeout"))
        store.add(p.id, r.verdict, r.elapsedMs || 0);
    }
    renderList(); // 해결 뱃지 갱신
    if (isMobile()) setView("result");
  } finally {
    judging = false;
    $("#status").textContent = "";
    btns.forEach((b) => (b.disabled = false));
  }
}
const editorCode = () => editor.getValue();

/* ── 기록 모달: 백업/가져오기/Gist ─────────────────── */
function openRecords() {
  const subs = store.subs();
  const solved = store.solved();
  $("#rec-stats").textContent =
    `내 문제 해결 ${solved.size}/${PROBLEMS.length} · 제출 ${subs.length}회 · 백준 체크 ${Object.keys(store.boj()).length}개 (이 기기 기준)`;
  const g = store.gist();
  $("#gist-token").value = g.token || "";
  $("#gist-id").value = g.gistId || "";
  $("#sync-status").textContent = g.lastSync ? `마지막 동기화: ${new Date(g.lastSync).toLocaleString()}` : "";
  $("#records-modal").classList.remove("hidden");
}

function exportRecords() {
  const blob = new Blob([JSON.stringify({ subs: store.subs(), boj: store.boj() }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "cote-records.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importRecords(file) {
  try {
    const data = JSON.parse(await file.text());
    const merged = store.merge(data.subs || []);
    store.mergeBoj(data.boj);
    $("#sync-status").textContent = `가져오기 완료 — 총 ${merged.length}건`;
    openRecordsRefresh();
  } catch {
    $("#sync-status").textContent = "가져오기 실패: JSON 형식이 아닙니다";
  }
}

function openRecordsRefresh() {
  const solved = store.solved();
  $("#rec-stats").textContent =
    `해결 ${solved.size}/${PROBLEMS.length}문제 · 제출 ${store.subs().length}회 (이 기기 기준)`;
  renderList();
}

async function gistSync() {
  const token = $("#gist-token").value.trim();
  let gistId = $("#gist-id").value.trim();
  const st = $("#sync-status");
  if (!token) { st.textContent = "토큰을 입력하세요"; return; }
  st.textContent = "동기화 중…";
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  try {
    if (gistId) {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers });
      if (res.ok) {
        const g = await res.json();
        const content = g.files?.["cote-records.json"]?.content;
        if (content) {
          try {
            const remote = JSON.parse(content);
            store.merge(remote.subs || []);
            store.mergeBoj(remote.boj);
          } catch {}
        }
      } else if (res.status !== 404) throw new Error(`읽기 실패 (${res.status})`);
    }
    const body = JSON.stringify({
      description: "코테 트레이너 풀이 기록",
      public: false,
      files: { "cote-records.json": { content: JSON.stringify({ subs: store.subs(), boj: store.boj() }) } },
    });
    const res2 = gistId
      ? await fetch(`https://api.github.com/gists/${gistId}`, { method: "PATCH", headers, body })
      : await fetch("https://api.github.com/gists", { method: "POST", headers, body });
    if (!res2.ok) throw new Error(`쓰기 실패 (${res2.status}) — 토큰의 gist 권한을 확인하세요`);
    const g2 = await res2.json();
    gistId = g2.id;
    $("#gist-id").value = gistId;
    store.saveGist({ token, gistId, lastSync: Date.now() });
    st.textContent = `동기화 완료 — 총 ${store.subs().length}건`;
    openRecordsRefresh();
  } catch (e) {
    st.textContent = `동기화 실패: ${e.message}`;
  }
}

/* ── 백준 실전 모드 (solved.ac) ────────────────────── */
const TIER_NAMES = ["U", "B5","B4","B3","B2","B1", "S5","S4","S3","S2","S1",
  "G5","G4","G3","G2","G1", "P5","P4","P3","P2","P1", "D5","D4","D3","D2","D1",
  "R5","R4","R3","R2","R1"];
const tierClass = (lv) => lv >= 16 ? "t-plat" : lv >= 11 ? "t-gold" : lv >= 6 ? "t-silver" : "t-bronze";

function setMode(mode) {
  const boj = mode === "boj";
  $("#mode-local").classList.toggle("active", !boj);
  $("#mode-boj").classList.toggle("active", boj);
  $("#filters").classList.toggle("hidden", boj);
  $("#plist").classList.toggle("hidden", boj);
  $("#boj-panel").classList.toggle("hidden", !boj);
  if (boj && !$("#boj-list").children.length) bojSearch();
}

function renderBojList(items, count) {
  const solved = store.boj();
  const unsolvedOnly = $("#boj-unsolved").checked;
  const ul = $("#boj-list");
  ul.innerHTML = "";
  const shown = items.filter((it) => !unsolvedOnly || !solved[it.problemId]);
  $("#boj-status").textContent =
    `${count}문제 중 상위 ${shown.length}개 (많이 푼 순) — 클릭하면 백준으로`;
  for (const it of shown) {
    const li = document.createElement("li");
    const done = !!solved[it.problemId];
    li.className = done ? "boj-done" : "";
    li.innerHTML =
      `<label class="boj-check"><input type="checkbox" ${done ? "checked" : ""}></label>` +
      `<a href="https://www.acmicpc.net/problem/${Number(it.problemId)}" target="_blank" rel="noopener">` +
      `<span class="badge ${tierClass(it.level)}">${TIER_NAMES[it.level] || "?"}</span>` +
      `${escapeHtml(it.titleKo)} <small>${Number(it.acceptedUserCount).toLocaleString()}명 해결</small></a>`;
    li.querySelector("input").onchange = () => {
      store.toggleBoj(it.problemId);
      li.classList.toggle("boj-done");
    };
    ul.appendChild(li);
  }
  if (!shown.length) ul.innerHTML = `<li class="empty">조건에 맞는 문제가 없습니다</li>`;
}

let bojCache = { items: [], count: 0 };
// 호스팅 환경에 따라 되는 경로가 다름: 직접 호출 → Netlify 프록시 → 공개 CORS 프록시 순으로 시도
const SOLVEDAC_ROUTES = [
  (qs) => `https://solved.ac/api/v3/search/problem?${qs}`,
  (qs) => `/api/solvedac/v3/search/problem?${qs}`,
  (qs) => `https://corsproxy.io/?url=${encodeURIComponent(`https://solved.ac/api/v3/search/problem?${qs}`)}`,
  (qs) => `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://solved.ac/api/v3/search/problem?${qs}`)}`,
];
let bojRouteIdx = null; // 성공한 경로 기억

async function bojSearch() {
  const st = $("#boj-status");
  st.textContent = "검색 중…";
  const q = `*${$("#boj-t1").value}..${$("#boj-t2").value}` +
    ($("#boj-tag").value ? ` #${$("#boj-tag").value}` : "");
  const qs = `query=${encodeURIComponent(q)}&sort=solved&direction=desc&page=1`;
  const order = bojRouteIdx === null
    ? SOLVEDAC_ROUTES.map((_, i) => i)
    : [bojRouteIdx, ...SOLVEDAC_ROUTES.map((_, i) => i).filter((i) => i !== bojRouteIdx)];
  for (const i of order) {
    try {
      const res = await fetch(SOLVEDAC_ROUTES[i](qs));
      if (!res.ok) continue;
      const j = await res.json();
      if (!Array.isArray(j.items)) continue;
      bojRouteIdx = i;
      bojCache = { items: j.items, count: j.count || 0 };
      renderBojList(bojCache.items, bojCache.count);
      return;
    } catch { /* 다음 경로 시도 */ }
  }
  st.textContent = "검색 실패 — 네트워크를 확인하고 다시 시도하세요";
}

$("#mode-local").onclick = () => setMode("local");
$("#mode-boj").onclick = () => setMode("boj");
$("#boj-search").onclick = bojSearch;
$("#boj-unsolved").onchange = () => renderBojList(bojCache.items, bojCache.count);

/* ── 모바일 UI: 탭·드로어·심볼바 ───────────────────── */
function closeDrawer() {
  $("#problem-list").classList.remove("open");
  $("#list-backdrop").classList.remove("show");
}
$("#btn-menu").onclick = () => {
  $("#problem-list").classList.toggle("open");
  $("#list-backdrop").classList.toggle("show");
};
$("#list-backdrop").onclick = closeDrawer;
document.querySelectorAll("#mtabs button").forEach((b) => {
  b.onclick = () => {
    setView(b.dataset.view);
    if (b.dataset.view === "code" && editor) setTimeout(() => editor.refresh(), 0);
  };
});
document.querySelectorAll("#symbar button").forEach((b) => {
  b.addEventListener("mousedown", (e) => e.preventDefault()); // 에디터 포커스 유지
  b.onclick = () => { if (editor) { editor.replaceSelection(b.dataset.ins, "end"); editor.focus(); } };
});

/* ── 이벤트 바인딩 ────────────────────────────────── */
$("#btn-run").onclick = () => grade(false);
$("#btn-submit").onclick = () => grade(true);
$("#f-diff").onchange = renderList;
$("#f-type").onchange = renderList;
$("#f-unsolved").onchange = renderList;
$("#btn-records").onclick = openRecords;
$("#btn-close-modal").onclick = () => $("#records-modal").classList.add("hidden");
$("#records-modal").onclick = (e) => { if (e.target === $("#records-modal")) $("#records-modal").classList.add("hidden"); };
$("#btn-export").onclick = exportRecords;
$("#imp-file").onchange = (e) => { if (e.target.files[0]) importRecords(e.target.files[0]); e.target.value = ""; };
$("#btn-sync").onclick = gistSync;

renderList();
