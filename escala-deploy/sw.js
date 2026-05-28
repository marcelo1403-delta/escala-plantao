// sw.js - Service Worker Escala Plantao
const CACHE = "escala-plantao-v8";
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
  "/manifest-gestao.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (
    event.request.url.includes("firebasejs") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("gstatic")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
