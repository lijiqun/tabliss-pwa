// 最小 Service Worker：仅为满足 Chrome PWA 安装条件（需注册 + fetch handler）。
// 壳页自身离线兜底；Tabliss iframe 的请求照常走网络，不缓存。
const SHELL = 'tabliss-shell-v10';   // v10：图标100%撑满画布（用户逐档放大最终选定）
const SHELL_FILES = ['index.html', 'pwa.json', 'appicon-192.png', 'appicon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // 顶层导航：强制绕过缓存拿最新壳页（离线才回落缓存），其余请求照常联网
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => caches.match('index.html')));
  }
});
