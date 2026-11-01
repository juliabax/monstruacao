// Rede primeiro (pega atualizações), cache como reserva para funcionar offline.
const CACHE = 'ciclo-v11';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
  'assets/bg.jpg', 'assets/bar.png', 'assets/bar-rose.png', 'assets/tab-calendario.png', 'assets/tab-historico.png', 'assets/tab-backup.png', 'assets/big-square.png', 'assets/big-square-dark.png', 'assets/sq2-dark.png', 'assets/sq1.png', 'assets/sq2.png', 'assets/sq3.png',
  'assets/head.png', 'assets/eyes-open.png', 'assets/pupil.png', 'assets/eyes-closed.png', 'assets/mouth.png', 'assets/hand.png', 'assets/fonts/pangolin.woff2', 'assets/fonts/grenze-gotisch.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
  );
});
