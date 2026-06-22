/**
 * sw.js — Service Worker (PWA 오프라인 캐시)
 * 하우재 공인중개사사무소
 */

const CACHE_NAME = 'hawujae-v3';

// 캐시할 핵심 파일들
const CORE_ASSETS = [
  '/budongsan-saju/app.html',
  '/budongsan-saju/css/style.css',
  '/budongsan-saju/js/firebase-config.js',
  '/budongsan-saju/js/db.js',
  '/budongsan-saju/js/lunar.js',
  '/budongsan-saju/js/moving.js',
  '/budongsan-saju/js/partner.js',
  '/budongsan-saju/js/checklist.js',
  '/budongsan-saju/js/register.js',
  '/budongsan-saju/js/data.js',
  '/budongsan-saju/js/listings.js',
  '/budongsan-saju/js/calculator.js',
  '/budongsan-saju/js/map.js',
  '/budongsan-saju/js/app.js',
  '/budongsan-saju/assets/logo.png',
  '/budongsan-saju/manifest.json'
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

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // 성공하면 캐시도 업데이트
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 오프라인 시 캐시에서 응답
        return caches.match(e.request);
      })
  );
});
