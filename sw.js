// sw.js — Service Worker Escala Plantão
const CACHE = "escala-plantao-v5";
const ASSETS = [
  "/",
  "/css_canonico_limpo.css",
  "/css/impressao.css",
  "/js/sandbox.js",
  "/js/cadastro.js",
  "/js/firebase-sync.js",
  "/js/dados-servidores.js",
  "/js/impressao.js",
  "/brasao_republica.png",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Firebase e CDN externo: sempre rede
  if (event.request.url.includes("firebasejs") ||
      event.request.url.includes("googleapis") ||
      event.request.url.includes("gstatic")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
