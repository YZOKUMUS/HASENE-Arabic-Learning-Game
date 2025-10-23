// HASENE Service Worker for offline functionality

const CACHE_NAME = 'hasene-v2.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './data.json',
  './ayetoku.json',
  './dualar.json',
  './manifest.json',
  './party-effects.js',
  './sounds/audio-generator.js',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // If both cache and network fail, return offline page for documents
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
          // For other resources, return a simple response
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Message event for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});