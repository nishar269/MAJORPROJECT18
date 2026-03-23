const CACHE_NAME = 'toursafe-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg',
    '/logo192.png',
    '/logo512.png',
    '/favicon.ico'
];

// 1. Install Event: Cache Static Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 PWA: Caching static assets...');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('🗑️ PWA: Clearing old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event: Intelligent Strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and external resources (except maps maybe)
    if (request.method !== 'GET') return;

    // A. API Requests: Network First (Stale fallback)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // B. Static Assets: Cache First
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});

// 4. Background Notification Push Listener
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'TourSafe Update', body: 'New safety alert in your area' };
    const options = {
        body: data.body,
        icon: '/logo192.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: 'safety-alert',
        actions: [
            { action: 'view', title: 'View Alert' },
            { action: 'close', title: 'Dismiss' }
        ]
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

// 5. Notification Click Action
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/alerts')
    );
});
