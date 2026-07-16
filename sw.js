// 서비스워커: 한 번 접속한 뒤에는 오프라인에서도 열리도록 자산을 캐시한다.
// 전략: 같은 출처(앱 파일) = 네트워크 우선(업데이트 즉시 반영, 실패 시 캐시),
//       CDN(Pyodide·sql.js·CodeMirror 등) = 캐시 우선(버전 고정 URL이라 안전).
"use strict";

const CACHE = "cote-trainer-v1";
const SHELL = [
  "./", "index.html", "style.css", "app.js",
  "problems.js", "solutions.js", "guide.js", "kit.js",
  "py-worker.js", "sql-worker.js", "manifest.json",
  "icon-192.png", "icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;

  if (sameOrigin) {
    // 네트워크 우선: 새 배포가 바로 반영되고, 오프라인이면 캐시로
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
  } else {
    // CDN: 캐시 우선 (Pyodide 같은 큰 파일의 재다운로드 방지 + 오프라인 동작)
    e.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          if (res.ok || res.type === "opaque") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
      )
    );
  }
});
