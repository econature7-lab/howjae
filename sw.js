/**
 * sw.js ??Service Worker (PWA ?ㅽ봽?쇱씤 罹먯떆)
 * ?섏슦??怨듭씤以묎컻?ъ궗臾댁냼
 * ?꾨왂: ?ㅽ듃?뚰겕 ?곗꽑 ???ㅽ뙣 ??罹먯떆 ?대갚 + ??踰꾩쟾 ???먮룞 ?덈줈怨좎묠
 */

const CACHE_NAME = 'hawujae-v19';

const CORE_ASSETS = [
  '/howjae/app.html',
  '/howjae/css/style.css',
  '/howjae/js/firebase-config.js',
  '/howjae/js/db.js',
  '/howjae/js/lunar.js',
  '/howjae/js/moving.js',
  '/howjae/js/market.js',
  '/howjae/js/partner.js',
  '/howjae/js/checklist.js',
  '/howjae/js/register.js',
  '/howjae/js/data.js',
  '/howjae/js/listings.js',
  '/howjae/js/calculator.js',
  '/howjae/js/map.js',
  '/howjae/js/app.js',
  '/howjae/assets/logo.png',
  '/howjae/manifest.json'
];

// ?ㅼ튂
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).catch((err) =>
        console.warn('[SW] ?쇰? ?뚯씪 罹먯떆 ?ㅽ뙣 (臾댁떆):', err)
      )
    )
  );
  self.skipWaiting();
});

// ?쒖꽦?? 援щ쾭????젣 ???대씪?댁뼵???몄닔 ???먮룞 ?덈줈怨좎묠 ?뚮┝
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
      })
  );
});

// ?붿껌 泥섎━: ?ㅽ듃?뚰겕 ?곗꽑, ?ㅽ봽?쇱씤留?罹먯떆 ?ъ슜
self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (
    url.includes('firebaseio.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('unpkg.com') ||
    url.includes('fonts.googleapis') ||
    url.includes('kakao')
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
