const CACHE_VERSION = 'quizmagic-v15-themed-buttons';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/assets/css/style.css',
  '/assets/js/config.js',
  '/assets/js/audio.js',
  '/assets/js/quizzes.js',
  '/assets/js/app.js',
  '/assets/js/profile.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                // 🛡️ إضافة الموارد واحدة تلو الأخرى مع معالجة الأخطاء
                return Promise.all(ASSETS.map(url => {
                    return cache.add(url).catch(err => {
                        console.warn('⚠️ Failed to cache:', url, err);
                        // نستمر حتى لو فشل بعض الموارد
                    });
                }));
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 🔄 Stale-while-revalidate strategy
// يعرض النسخة المخزّنة فوراً (سريع) لكن يجلب النسخة الجديدة بالخلفية
// وحدّثها للزيارة التالية. هذا يضمن رؤية المستخدم لأي تحديث مستقبلي.
self.addEventListener('fetch', event => {
  // نتجاهل الطلبات غير GET (مثل POST) وطلبات التتبّع
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async cache => {
      const cachedResponse = await cache.match(event.request);

      // اجلب من الشبكة بالخلفية وحدّث الكاش
      const networkFetch = fetch(event.request).then(networkResponse => {
        // نتأكد من أن الاستجابة صالحة قبل تخزينها
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // عند فشل الشبكة نرجع للمخزّن (يعمل offline)
        return cachedResponse;
      });

      // أرجع المخزّن فوراً إن وُجد، وإلا انتظر الشبكة
      return cachedResponse || networkFetch;
    })
  );
});
