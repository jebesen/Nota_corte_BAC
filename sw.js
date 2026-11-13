/* Service worker: la web funciona sin conexión una vez visitada.
   Al publicar cambios, sube VERSION para que los navegadores descarguen los archivos nuevos. */
var VERSION = 'simuladores-v4';
var FILES = [
  './', 'index.html', 'bac.html', 'pau.html', 'cortes.html', 'js/cortes.js', 'manifest.webmanifest',
  'css/styles.css',
  'js/common.js', 'js/unisearch.js', 'js/weights.js',
  'js/data-bac.js', 'js/i18n-bac.js', 'js/calc-bac.js', 'js/app-bac.js',
  'js/data-pau.js', 'js/i18n-pau.js', 'js/calc-pau.js', 'js/app-pau.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];
/* cache:'reload' evita guardar copias viejas de la caché HTTP del navegador */
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){
    return c.addAll(FILES.map(function(f){ return new Request(f, {cache:'reload'}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  /* Todo (páginas, CSS, JS): primero la red, revalidando con el servidor, para que la página
     y sus archivos sean siempre de la misma versión. Sin conexión, la copia guardada. */
  var nav = req.mode === 'navigate';
  var netReq = req;
  try { netReq = new Request(req, {cache:'no-cache'}); } catch (err) {}
  e.respondWith(fetch(netReq).then(function(res){
    if (res.ok){ var copy = res.clone(); caches.open(VERSION).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(req, {ignoreSearch:true}).then(function(r){ return r || (nav ? caches.match('index.html') : Response.error()); });
  }));
});
