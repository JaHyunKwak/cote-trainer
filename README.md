# 코테 트레이너 (웹 버전)

**https://cote-trainer.netlify.app** — 서버 없이 브라우저 안에서 채점하는 정적 웹앱. PC·핸드폰 어디서든 접속만 하면 됩니다.

- Python 채점: Pyodide(WebAssembly)를 Web Worker에서 실행. 무한루프는 워커 강제 종료로 방어, 제한 시간은 네이티브 대비 ×3.
- SQL 채점: sql.js(SQLite WASM). 윈도우 함수 포함, SELECT 단일 쿼리만 허용.
- 기록: 기기별 localStorage + JSON 내보내기/가져오기 + GitHub Gist 동기화(선택). 우상단 "기록" 버튼.
- 폰에서는 하단 탭(문제/코드/결과) + 빠른 입력 심볼바. 홈 화면에 추가하면 앱처럼 실행(PWA).

## 재배포 방법

파일 수정 후 [Netlify Deploys 페이지](https://app.netlify.com/projects/cote-trainer/deploys)에 이 폴더(또는 zip)를 드래그하면 끝.

## 파일 구조

```
index.html      # 레이아웃 (CDN: CodeMirror, marked, DOMPurify)
app.js          # UI·채점 오케스트레이션·기록 저장
problems.js     # 문제 5개 (성능 케이스는 함수로 생성)
py-worker.js    # Pyodide 채점 워커
sql-worker.js   # sql.js 채점 워커
style.css       # 다크 테마 + 모바일 레이아웃
manifest.json   # PWA
```

로컬 서버 버전(FastAPI)은 `../cote-trainer/`에 그대로 있음.
