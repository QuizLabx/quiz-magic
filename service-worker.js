const CACHE_NAME = 'quizmagic-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/contact.html',
    '/privacy.html',
    '/terms.html',
    '/assets/css/style.css',
    '/assets/js/app.js',
    '/assets/js/quizzes.js',
    '/assets/js/loadPartials.js',
    '/assets/js/service-worker-registration.js',
    '/partials/header.html',
    '/partials/footer.html',
    '/partials/index-main-content.html',
    '/partials/base.html',
    '/favicon.png',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
    // Add your image assets here if they are static and you want them cached
    // '/assets/images/dragon.jpg',
    // '/assets/images/phoenix.jpg',
    // etc.
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
