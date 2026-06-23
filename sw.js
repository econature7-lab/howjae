/**
 * sw.js — Service Worker (PWA 오프라인 캐시)
 * 하우재 공인중개사사무소
 * 전략: 네트워크 우선 → 실패 시 캐시 폴백 (항상 최신 버전 표시)
 */

const CACHE_NAME = 'hawujae-v12';

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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] 일부 파일 캐시 실패 (무시):', err);
      });
    })
  );
  self.skipWaiting();
});

// 활성화: 구버전 캐시 삭제
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 요청 처리: 모든 파일 네트워크 우선, 오프라인일 때만 캐시 사용
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // 외부 CDN / Firebase는 SW 처리 안 함
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

  // 네트워크 우선 — 실패 시 캐시 폴백
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
