/**
 * firebase-config.js — Firebase 프로젝트 설정
 *
 * ─────────────────────────────────────────────
 * 설정 방법:
 * 1. https://console.firebase.google.com 접속
 * 2. 새 프로젝트 생성 (예: hawujae-realestate)
 * 3. 프로젝트 설정 → 웹 앱 추가 → SDK snippet 복사
 * 4. 아래 YOUR_* 값들을 실제 값으로 교체
 * 5. Firestore Database → 데이터베이스 만들기 → 테스트 모드
 * ─────────────────────────────────────────────
 */
window.FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
