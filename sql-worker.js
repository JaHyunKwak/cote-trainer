// sql.js(SQLite WASM) 채점 워커. 매 실행마다 새 인메모리 DB → 상태 오염 없음.
"use strict";

const SQLJS_BASE = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/";
let SQLReady = null;

function ensureSql() {
  if (!SQLReady) {
    importScripts(SQLJS_BASE + "sql-wasm.min.js");
    SQLReady = initSqlJs({ locateFile: (f) => SQLJS_BASE + f });
  }
  return SQLReady;
}

function runQuery(db, q) {
  const res = db.exec(q); // [{columns, values}]
  return res.length ? res[0] : { columns: [], values: [] };
}

function isSelectOnly(q) {
  const s = q.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
  if (!/^(select|with)\b/i.test(s)) return false;
  // 세미콜론은 끝에 하나만 허용 (다중 구문 차단)
  return !s.replace(/;\s*$/, "").includes(";");
}

const norm = (v) => (typeof v === "number" && Number.isInteger(v) ? v : v === null ? null : String(v));
const rowKey = (row) => JSON.stringify(row.map(norm));

function compare(user, sol, orderSensitive) {
  if (user.columns.length !== sol.columns.length) return "fail";
  const uc = user.columns.map((c) => c.toLowerCase());
  const sc = sol.columns.map((c) => c.toLowerCase());
  if (uc.join(",") !== sc.join(",")) return "fail";
  const u = user.values.map(rowKey);
  const s = sol.values.map(rowKey);
  if (!orderSensitive) { u.sort(); s.sort(); }
  return u.length === s.length && u.every((r, i) => r === s[i]) ? "pass" : "fail";
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    try {
      await ensureSql();
      postMessage({ type: "ready" });
    } catch (err) {
      postMessage({ type: "init-error", error: String(err) });
    }
    return;
  }
  if (msg.type !== "run") return;

  const t0 = performance.now();
  const reply = (o) =>
    postMessage({ type: "sql-result", id: msg.id, elapsedMs: Math.round(performance.now() - t0), ...o });

  if (!isSelectOnly(msg.userQuery)) {
    reply({ verdict: "error", error: "SELECT (또는 WITH) 단일 쿼리만 제출할 수 있습니다." });
    return;
  }
  let db = null;
  try {
    const SQL = await ensureSql();
    db = new SQL.Database();
    db.exec(msg.schemaSql);
    db.exec(msg.seedSql);
    let user;
    try {
      user = runQuery(db, msg.userQuery);
    } catch (err) {
      reply({ verdict: "error", error: String(err.message || err) });
      return;
    }
    const userRows = { columns: user.columns, values: user.values.slice(0, 100) };
    if (msg.mode === "preview") {
      reply({ verdict: "preview", userRows, rowCount: user.values.length });
      return;
    }
    const sol = runQuery(db, msg.solutionQuery);
    const verdict = compare(user, sol, msg.orderSensitive);
    reply({
      verdict,
      userRows,
      expectedRows: verdict === "fail" ? { columns: sol.columns, values: sol.values.slice(0, 100) } : null,
    });
  } catch (err) {
    reply({ verdict: "error", error: String(err.message || err) });
  } finally {
    if (db) db.close();
  }
};
