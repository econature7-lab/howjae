/**
 * db.js — Firestore 연동 레이어
 * 설정 안 됐으면 localStorage 폴백, 설정되면 Firestore 우선
 */
window.DB = (function () {
  const COL = 'listings';
  const LOCAL_KEY = 'hawujae_listings';
  let _db = null;
  let _ready = false;
  let _usingFirestore = false;

  /* ── 설정 확인 ── */
  function isConfigured() {
    const c = window.FIREBASE_CONFIG;
    return c && c.apiKey && !c.apiKey.startsWith('YOUR_');
  }

  /* ── 초기화 ── */
  async function init() {
    if (!isConfigured()) {
      console.info('[DB] firebase-config.js 미설정 → localStorage 모드');
      _ready = true;
      _usingFirestore = false;
      return false;
    }
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      _db = firebase.firestore();
      // 연결 테스트
      await _db.collection(COL).limit(1).get();
      _ready = true;
      _usingFirestore = true;
      console.info('[DB] ✅ Firestore 연결 성공');
      return true;
    } catch (e) {
      console.warn('[DB] Firestore 연결 실패, localStorage 폴백:', e.message);
      _ready = true;
      _usingFirestore = false;
      return false;
    }
  }

  function usingFirestore() { return _usingFirestore; }

  /* ────────── FIRESTORE 操作 ────────── */

  /* 전체 읽기 */
  async function getAll() {
    if (_usingFirestore) {
      try {
        const snap = await _db.collection(COL).orderBy('id').get();
        return snap.docs.map(d => d.data());
      } catch (e) {
        console.error('[DB] getAll error:', e);
      }
    }
    // localStorage 폴백
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
    // data.js 기본값
    return window.AppData ? JSON.parse(JSON.stringify(AppData.properties)) : [];
  }

  /* 단일 저장 (등록/수정) */
  async function save(listing) {
    // 항상 localStorage에도 백업
    _syncLocal(listing);

    if (_usingFirestore) {
      try {
        await _db.collection(COL).doc(String(listing.id)).set(listing);
        return true;
      } catch (e) {
        console.error('[DB] save error:', e);
        return false;
      }
    }
    return true; // localStorage만 사용
  }

  /* 삭제 */
  async function remove(id) {
    _removeLocal(id);

    if (_usingFirestore) {
      try {
        await _db.collection(COL).doc(String(id)).delete();
        return true;
      } catch (e) {
        console.error('[DB] remove error:', e);
        return false;
      }
    }
    return true;
  }

  /* 다음 ID 생성 */
  async function nextId() {
    if (_usingFirestore) {
      try {
        const snap = await _db.collection(COL).orderBy('id', 'desc').limit(1).get();
        if (!snap.empty) return snap.docs[0].data().id + 1;
        return 100;
      } catch (e) { /* fall through */ }
    }
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      return list.length ? Math.max(...list.map(p => p.id)) + 1 : 100;
    }
    if (window.AppData) return Math.max(...AppData.properties.map(p => p.id)) + 1;
    return 100;
  }

  /* 전체 목록을 Firestore → localStorage 동기화 (admin용) */
  async function seedFirestore(listings) {
    if (!_usingFirestore) return;
    const batch = _db.batch();
    listings.forEach(p => {
      const ref = _db.collection(COL).doc(String(p.id));
      batch.set(ref, p);
    });
    await batch.commit();
  }

  /* ────────── localStorage 헬퍼 ────────── */

  function _getLocal() {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
    if (window.AppData) return JSON.parse(JSON.stringify(AppData.properties));
    return [];
  }

  function _syncLocal(listing) {
    const list = _getLocal();
    const idx = list.findIndex(p => p.id === listing.id);
    if (idx >= 0) list[idx] = listing; else list.push(listing);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }

  function _removeLocal(id) {
    const list = _getLocal().filter(p => p.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }

  return { init, isConfigured, usingFirestore, getAll, save, remove, nextId, seedFirestore };
})();
