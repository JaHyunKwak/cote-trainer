// Pyodide 채점 워커: 케이스 1개씩 실행, 타임아웃은 메인 스레드가 terminate로 처리
"use strict";

const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
let pyodide = null;

const HARNESS = `
import sys, io, traceback

class _OutputLimit(Exception):
    pass

class _LimitedOut(io.StringIO):
    def __init__(self, limit):
        super().__init__()
        self._limit = limit
    def write(self, s):
        if self.tell() + len(s) > self._limit:
            raise _OutputLimit()
        return super().write(s)

def run_case(code, stdin_text, output_limit):
    old_in, old_out = sys.stdin, sys.stdout
    sys.stdin = io.StringIO(stdin_text)
    out = _LimitedOut(int(output_limit))
    sys.stdout = out
    verdict = "ok"
    err = ""
    try:
        g = {"__name__": "__main__"}
        exec(compile(code, "solution.py", "exec"), g)
    except _OutputLimit:
        verdict = "output_limit"
    except SystemExit:
        pass  # sys.exit()는 정상 종료로 취급
    except BaseException:
        verdict = "error"
        err = traceback.format_exc()
        # 하니스 프레임 제거: solution.py 이후만 남긴다
        idx = err.find('File "solution.py"')
        if idx > 0:
            err = "Traceback (most recent call last):\\n  " + err[idx:]
    finally:
        sys.stdin, sys.stdout = old_in, old_out
    return {"verdict": verdict, "stdout": out.getvalue(), "stderr": err[:2000]}
`;

async function init() {
  importScripts(PYODIDE_BASE + "pyodide.js");
  pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });
  pyodide.runPython(HARNESS);
  // 워밍업 (첫 exec의 컴파일 지연 제거)
  pyodide.globals.get("run_case")("print(0)", "", 1000);
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    try {
      await init();
      postMessage({ type: "ready" });
    } catch (err) {
      postMessage({ type: "init-error", error: String(err) });
    }
    return;
  }
  if (msg.type === "case") {
    const t0 = performance.now();
    let out;
    try {
      const res = pyodide.globals.get("run_case")(msg.code, msg.input, msg.outputLimit);
      const m = res.toJs();
      if (res.destroy) res.destroy();
      out = Object.fromEntries(m);
    } catch (err) {
      out = { verdict: "error", stdout: "", stderr: String(err).slice(0, 2000) };
    }
    postMessage({
      type: "case-result",
      id: msg.id,
      elapsedMs: Math.round(performance.now() - t0),
      ...out,
    });
  }
};
