/* ============================================================
   Service Worker - Estrategia Híbrida (Challenge 02)
   ------------------------------------------------------------
   Recurso        | Estrategia
   -------------- | ---------------------------------
   HTML (páginas) | Network First (evitar versiones viejas)
   JS / CSS       | Cache First (por el HASH del build)
   Imágenes       | Cache First + Stale While Revalidate
   APIs (/api/)   | Network First (datos actualizados)
   ============================================================ */

const CACHE_VERSION = 'mis-contactos-v1';
const CACHE_SHELL = `${CACHE_VERSION}-shell`;
const CACHE_ASSETS = `${CACHE_VERSION}-assets`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;
const CACHE_API = `${CACHE_VERSION}-api`;

// App shell que se precachea al instalar
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

/* ---------- INSTALL: precache del app shell ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

/* ---------- ACTIVATE: limpiar caches viejos ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

/* ---------- FETCH: estrategia híbrida ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones que no sean GET (POST, PUT, etc.)
  if (request.method !== 'GET') return;

  // Solo manejar peticiones http/https (misma app y recursos externos)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  /* 1) HTML / navegaciones -> NETWORK FIRST
     Se intenta la red para no servir versiones viejas;
     si falla, se cae al app shell cacheado (offline). */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_SHELL).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/')))
    );
    return;
  }

  /* 2) JS / CSS (assets con hash) -> CACHE FIRST
     Los archivos cambian de nombre con cada build, así que
     la versión cacheada siempre es válida. */
  if (url.pathname.startsWith('/assets/') && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_ASSETS).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  /* 3) Imágenes -> CACHE FIRST + STALE WHILE REVALIDATE
     Se responde al instante con la caché y en paralelo se
     actualiza la copia guardada para la próxima visita. */
  if (/\.(png|jpe?g|gif|svg|webp|avif|ico)(\?.*)?$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_IMAGES).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);

        // Si ya hay copia, respondemos con ella y refrescamos en segundo plano
        if (cached) {
          networkFetch.then(() => {});
          return cached;
        }
        return networkFetch;
      })
    );
    return;
  }

  /* 4) APIs (/api/...) -> NETWORK FIRST
     Se pide a la red para tener datos actualizados; si no
     hay conexión, se responde con la última respuesta cacheada. */
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_API).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* 5) Otros recursos (fuentes de Google, etc.) -> CACHE FIRST
     Con fallback a red y actualización en segundo plano. */
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_ASSETS).then((cache) => cache.put(request, copy));
          return response;
        })
    )
  );
});