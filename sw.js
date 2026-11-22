const CACHE_NAME = 'dabo-portfolio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/assets/dabol.png',
  '/assets/senegal.png',
  '/assets/isi.png',
  '/assets/bio-amarie.png',
  '/assets/home-school.png'
];

// Installation : Mise en cache des fichiers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Mise en cache des fichiers réussie');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Ancien cache supprimé:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie Fetch : On regarde dans le cache d'abord, sinon on va sur le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si le fichier est dans le cache, on le renvoie
      if (response) {
        return response;
      }
      // Sinon, on le télécharge depuis internet
      return fetch(event.request).then((networkResponse) => {
        // On met aussi en cache les nouvelles ressources si besoin
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Si tout échoue et qu'on est hors-ligne, on peut afficher une page de secours
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});