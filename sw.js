/* 
 * ШАВКИ SERVICE WORKER — максимально ёбаный профессиональный
 * Кэширует всё, что перечислил. Версия 2.0.1
 */

const CACHE_NAME = 'shavki-cache-v2.0.1';
const OFFLINE_URL = '/index.html'; // офлайн-страница

// ***** СПИСОК ФАЙЛОВ ДЛЯ ПРЕКЭШИРОВАНИЯ (100% твой список) *****
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/seznam-wmt-wOB5Xz3sYgBBRf4VhjARdUEKa3TO91qc.txt',
  '/pinterest-9713b.html',
  '/googlee5d8d673778c47e8.html',
  '/yandex_7650a59384e3038e.html',
  '/mstile-70x70.png',
  '/mstile-150x150.png',
  '/mstile-310x310.png',
  '/assets/screenshot-mobile.png',
  '/assets/screenshot-desktop.png',
  '/assets/logo/Logo.png',
  '/assets/logo/Logo-EN.png',
  '/assets/favicon/site.webmanifest',
  '/assets/favicon/android-chrome-36x36.png',
  '/assets/favicon/android-chrome-48x48.png',
  '/assets/favicon/android-chrome-72x72.png',
  '/assets/favicon/android-chrome-96x96.png',
  '/assets/favicon/android-chrome-144x144.png',
  '/assets/favicon/android-chrome-168x168.png',
  '/assets/favicon/android-chrome-192x192.png',
  '/assets/favicon/android-chrome-256x256.png',
  '/assets/favicon/android-chrome-384x384.png',
  '/assets/favicon/android-chrome-512x512.png',
  '/assets/favicon/android-chrome-1024x1024.png',
  '/assets/favicon/apple-touch-icon.png',
  '/assets/favicon/apple-touch-icon-57x57.png',
  '/assets/favicon/apple-touch-icon-60x60.png',
  '/assets/favicon/apple-touch-icon-72x72.png',
  '/assets/favicon/apple-touch-icon-76x76.png',
  '/assets/favicon/apple-touch-icon-114x114.png',
  '/assets/favicon/apple-touch-icon-120x120.png',
  '/assets/favicon/apple-touch-icon-144x144.png',
  '/assets/favicon/apple-touch-icon-152x152.png',
  '/assets/favicon/apple-touch-icon-167x167.png',
  '/assets/favicon/browserconfig.xml',
  '/assets/favicon/favicon.svg',
  '/assets/favicon/favicon-16x16.ico',
  '/assets/favicon/favicon-16x16.png',
  '/assets/favicon/favicon-16x16.webp',
  '/assets/favicon/favicon-32x32.ico',
  '/assets/favicon/favicon-32x32.png',
  '/assets/favicon/favicon-32x32.webp',
  '/assets/favicon/favicon-48x48.ico',
  '/assets/favicon/favicon-48x48.png',
  '/assets/favicon/favicon-48x48.webp',
  '/assets/favicon/favicon-96x96.png',
  '/assets/favicon/favicon-120x120.ico',
  '/assets/favicon/favicon-120x120.png',
  '/assets/favicon/favicon-120x120.webp',
  '/assets/favicon/favicon-180x180.ico',
  '/assets/favicon/favicon-180x180.png',
  '/assets/favicon/favicon-180x180.webp',
  '/assets/favicon/maskable-icon-192x192.png',
  '/assets/favicon/maskable-icon-512x512.png',
  '/assets/favicon/maskable-icon-1024x1024.png',
  '/assets/favicon/mstile-70x70.png',
  '/assets/favicon/mstile-150x150.png',
  '/assets/favicon/mstile-310x310.png'
];

// =============== УСТАНОВКА: кэшируем всё нахрен ===============
self.addEventListener('install', event => {
  console.log('[SW] Установка, сука, началась');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Кэшируем пре-кэш список');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// =============== АКТИВАЦИЯ: выкидываем старые кэши ===============
self.addEventListener('activate', event => {
  console.log('[SW] Активация, старые кэши полетят в пизду');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Удаляем старый кэш:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// =============== ОБРАБОТКА ЗАПРОСОВ: умная стратегия ===============
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const request = event.request;

  // 1. Если запрос к Google Analytics, Yandex Metrica и тп – не трогаем (network-only)
  if (url.hostname.includes('analytics') || url.hostname.includes('mc.yandex')) {
    return;
  }

  // 2. Для HTML-страниц (навигация) – сначала сеть, если нет сети – кэш (офлайн)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 3. Для статики (css, js, шрифты, изображения, фавиконки, манифесты)
  // Используем стратегию "Cache first, fallback to network"
  // (Изображения можно кэшировать агрессивно)
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Фоновое обновление для некритичных ресурсов (stale-while-revalidate)
        if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|webmanifest|xml|txt)$/)) {
          event.waitUntil(
            fetch(request).then(networkResponse => {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
            }).catch(() => {})
          );
        }
        return cachedResponse;
      }
      // Если в кэше нет – идём в сеть, кэшируем результат
      return fetch(request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        // Клонируем ответ, чтобы положить в кэш
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Если вообще нихуя нет – показываем офлайн-страницу (только для навигации)
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});