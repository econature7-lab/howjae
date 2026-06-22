/**
 * sw.js — Service Worker (PWA 오프라인 캐시)
 * 하우재 공인중개사사무소
 */

const CACHE_NAME = 'hawujae-v7';

// 캐시할 핵심 파일들
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

// 설치: 핵심 파일 캐시
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 캐시 설치 중...');
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
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log('[SW] 구버전 캐시 삭제:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

// 네트워크 요청: 네트워크 우선, 실패 시 캐시 폴백
self.addEventListener('fetch', (e) => {
  // Firebase / 외부 CDN 요청은 캐시하지 않음
  const url = e.request.url;
  if (
    url.includes('firebaseio.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('unpkg.com') ||
    url.includes('fonts.googleapis') ||
    url.includes('kakao')
  ) {
    return; // 브라우저 기본 처리
  }

  // JS/CSS 정적 파일: stale-while-revalidate (캐시 즉시 반환 + 백그라운드 업데이트)
  const isStaticAsset =
    url.includes('/js/') || url.includes('/css/') || url.includes('/assets/');

  if (isStaticAsset) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(e.request).then((cached) => {
          const networkFetch = fetch(e.request).then((res) => {
            if (res && res.status === 200) cache.put(e.request, res.clone());
            return res;
          }).catch(() => null);
          // 캐시 있으면 즉시 반환, 없으면 네트워크 기다림
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // HTML 등 나머지: 네트워크 우선, 실패 시 캐시 폴백
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
