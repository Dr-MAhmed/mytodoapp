const CACHE_NAME = 'todify-v1';
const BASE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(BASE_URLS).catch((err) => {
        console.log('Cache addAll error:', err);
        // Non-critical error, service worker can still work
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event Handler - Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Network first strategy for API calls and dynamic content
  if (url.pathname.includes('/api/') || url.pathname.includes('/supabase/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const clonedResponse = response.clone();
          
          // Cache successful responses
          if (response.status === 200 && request.method === 'GET') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page or empty response
            return new Response(
              JSON.stringify({
                error: 'Offline - please check your internet connection',
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'application/json',
                }),
              }
            );
          });
        })
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const clonedResponse = response.clone();

            // Cache the successful response
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clonedResponse);
            });

            return response;
          })
          .catch(() => {
            // Return cached response if available, otherwise return offline asset
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }

              // Return a custom offline page if needed
              if (request.destination === 'document') {
                return caches.match('/index.html');
              }

              // Return empty response for other asset types
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain',
                }),
              });
            });
          });
      })
    );
  }
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
