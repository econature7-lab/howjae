/**
 * sw.js — Service Worker (PWA 오프라인 캐시)
 * 하우재 공인중개사사무소
 * 전략: 네트워크 우선 → 실패 시 캐시 폴백 + 새 버전 시 자동 새로고침
 */

const CACHE_NAME = 'hawujae-v16';

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

// 설치
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).catch((err) =>
        console.warn('[SW] 일부 파일 캐시 실패 (무시):', err)
      )
    )
  );
  self.skipWaiting();
});

// 활성화: 구버전 삭제 → 클라이언트 인수 → 자동 새로고침 알림
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

// 요청 처리: 네트워크 우선, 오프라인만 캐시 사용
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
