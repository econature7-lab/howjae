/**
 * app.js — 하우재 부동산사주 SPA 메인
 * 다크 네이비 + 골드 다이아몬드 테마 (Stitch 디자인)
 */

/* ── 하우재 로고 ── */
const LOGO_SM  = `<img src="assets/logo.png" class="logo-img-sm" alt="하우재">`;
const LOGO_MD  = `<img src="assets/logo.png" class="logo-img" alt="하우재">`;
const LOGO_LG  = `<img src="assets/logo.png" class="logo-img-lg" alt="하우재">`;

/* 하위 호환 별칭 */
const DIAMOND_SVG    = LOGO_SM;
const DIAMOND_SVG_LG = LOGO_LG;

/* ── 전역 상태 ── */
let S = {
  tab: 'home',
  detailId: null,
  favorites: JSON.parse(localStorage.getItem('fav') || '[]')
};

const NAV_ITEMS = [
  { key:'home',      icon:'⌂',  label:'홈'      },
  { key:'listings',  icon:'⊞',  label:'매물'     },
  { key:'partner',   icon:'🔨', label:'파트너'    },
  { key:'checklist', icon:'✅', label:'체크리스트' },
  { key:'register',  icon:'📝', label:'등록'     },
  { key:'consult',   icon:'💬', label:'상담'     },
];

/* ── 앱 껍데기 ── */
function renderShell() {
  document.getElementById('app').innerHTML = `
    <div id="screen-wrap" style="flex:1;overflow-y:auto;min-height:0;-webkit-overflow-scrolling:touch"></div>

    <!-- 카카오 상담 FAB -->
    <a href="https://pf.kakao.com/_hawujae" target="_blank" class="kakao-fab" title="카카오 상담">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <ellipse cx="11" cy="10.5" rx="9.5" ry="8.5" fill="#3A1D1D" opacity=".1"/>
        <path d="M11 2C6.029 2 2 5.358 2 9.5c0 2.58 1.638 4.858 4.123 6.233l-1.05 3.893c-.092.34.263.608.562.418L10.178 17c.268.034.542.05.822.05 4.971 0 9-3.358 9-7.5S15.971 2 11 2z" fill="#391B1B"/>
      </svg>
      카카오 상담
    </a>

    <nav class="bottom-nav" id="bottom-nav">
      ${NAV_ITEMS.map(n=>`
        <button class="nav-item ${S.tab===n.key?'active':''}" onclick="goTab('${n.key}')">
          <span class="nav-icon">${n.icon}</span>
          <span class="nav-label">${n.label}</span>
        </button>`).join('')}
    </nav>`;
}

/* ── 탭 전환 ── */
function goTab(tab) {
  S.tab = tab;
  S.detailId = null;
  document.querySelectorAll('.nav-item').forEach((b,i) =>
    b.classList.toggle('active', NAV_ITEMS[i].key === tab));
  renderScreen();
  if (tab === 'map') MapView.mount();
}

/* ── 화면 렌더 ── */
function renderScreen() {
  const wrap = document.getElementById('screen-wrap');
  if (!wrap) return;
  if (S.detailId !== null) { wrap.innerHTML = renderDetailPage(); return; }
  switch(S.tab) {
    case 'home':       wrap.innerHTML = renderHome();             break;
    case 'listings':   wrap.innerHTML = renderListings();         break;
    case 'partner':    PartnerView.render();    return;
    case 'checklist':  ChecklistView.render();  return;
    case 'register':   RegisterView.render();   return;
    case 'consult':    wrap.innerHTML = renderConsult();          break;
    // 숨겨진 경로 (버튼으로 접근 가능)
    case 'map':        wrap.innerHTML = MapView.renderScreen();   break;
    case 'calc':       wrap.innerHTML = CalcView.render();        break;
    case 'loan':       wrap.innerHTML = CalcView.renderLoanPage(); break;
    case 'moving':     MovingView.render(); return;
    case 'market':     MarketView.render(); return;
    default:           wrap.innerHTML = renderHome();             break;
  }
  wrap.scrollTop = 0;
}

/* ══════════════════════════════════════════════
   홈 화면
══════════════════════════════════════════════ */
function renderHome() {
  const today = new Date();
  const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()} · ${dayNames[today.getDay()]}`;

  const recs = AppData.properties.slice(0,3);
  const recCards = recs.map(p => `
    <div class="rec-card" onclick="openListingDetail(${p.id})">
      <div class="rec-thumb" data-type="${p.type}" style="background:linear-gradient(135deg,var(--navy2),var(--navy3))"></div>
      <div class="rec-info">
        <div class="rec-type">${p.typeLabel} · ${p.shortAddr}</div>
        <div class="rec-title">${p.title}</div>
        <div class="rec-price">${AppData.dealLabel(p.deal)}</div>
      </div>
      <div style="font-size:18px;color:rgba(255,255,255,.25);align-self:center">›</div>
    </div>`).join('');

  return `
  <div class="fade-in" style="background:var(--bg);min-height:100%;padding-bottom:70px">

    <!-- HERO HEADER -->
    <div class="home-hero">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:10px">
          ${LOGO_SM}
          <div>
            <div style="font-size:13px;font-weight:700;color:white;letter-spacing:-.3px">하우재</div>
            <div style="font-size:9px;color:var(--gold);letter-spacing:2px;text-transform:uppercase">공인중개사사무소</div>
          </div>
        </div>
        <span style="font-size:10px;color:var(--on-navy);letter-spacing:1px">${dateStr}</span>
      </div>
      <div class="home-title">언제나 <span class="home-title-gold">당신 편,</span><br>하우재</div>
      <div class="home-sub">마포구 홍대·연남·합정·상수 일대<br>원룸·오피스텔부터 건물·토지까지<br>
        <span style="font-size:10px;color:rgba(255,255,255,.65)">인테리어·건축 전문가와 함께하는 공인중개사사무소</span>
      </div>
    </div>

    <div style="padding:16px 16px 0">

      <!-- 바로가기 (최상단) -->
      <div class="section-title" style="margin-bottom:10px">바로가기</div>
      <div class="quick-menu" style="margin-bottom:16px">
        <button class="quick-btn" onclick="goTab('listings')">
          <span class="quick-icon">⊞</span><span>매물</span>
        </button>
        <button class="quick-btn" onclick="goTab('map')">
          <span class="quick-icon">◎</span><span>지도</span>
        </button>
        <button class="quick-btn" onclick="goTab('calc')">
          <span class="quick-icon">⊟</span><span>계산기</span>
        </button>
        <button class="quick-btn" onclick="goTab('market')">
          <span class="quick-icon">📊</span><span>시세</span>
        </button>
        <button class="quick-btn" onclick="goTab('loan')">
          <span class="quick-icon">💰</span><span>대출</span>
        </button>
        <button class="quick-btn" onclick="ChecklistView.setTab('pungsu');goTab('checklist')">
          <span class="quick-icon">🧭</span><span>풍수지리</span>
        </button>
      </div>

      <!-- 손없는날 바로 확인 배너 -->
      <button onclick="goTab('moving')" style="width:100%;cursor:pointer;
        background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);
        border:1px solid rgba(196,164,90,.35);
        border-left:3px solid var(--gold);
        border-radius:4px;padding:16px 18px;margin-bottom:16px;
        display:flex;align-items:center;gap:14px;font-family:inherit;text-align:left;
        box-shadow:0 4px 20px rgba(15,22,40,.15)">
        <div style="font-size:28px;flex-shrink:0">📅</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:800;color:var(--gold);font-size:14px;margin-bottom:5px;letter-spacing:-.2px">손없는날 바로 확인</div>
          <div style="font-size:12px;color:rgba(255,255,255,.7);line-height:1.5">이사에 좋은 날을 달력으로 확인하고<br>카카오 상담으로 계약 날짜를 잡아보세요</div>
        </div>
        <div style="flex-shrink:0;font-size:20px;color:var(--gold)">›</div>
      </button>

      <!-- 어떤 분이세요? -->
      <div class="section-title" style="margin-bottom:4px">어떤 분이세요?</div>
      <div style="font-size:11px;color:var(--on-muted);margin-bottom:10px">매도·매수·임대·임차 — 더불어 함께합니다</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        <button onclick="goTab('register')" style="background:var(--navy2);border:1px solid rgba(196,164,90,.22);border-radius:6px;padding:14px 12px;text-align:left;cursor:pointer;font-family:inherit">
          <div style="font-size:22px;margin-bottom:6px">🏗️</div>
          <div style="font-size:13px;font-weight:700;color:white;margin-bottom:3px">매도자</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.5">건물 매도·처분<br>전문가 상담</div>
        </button>
        <button onclick="goTab('listings')" style="background:var(--navy2);border:1px solid rgba(196,164,90,.22);border-radius:6px;padding:14px 12px;text-align:left;cursor:pointer;font-family:inherit">
          <div style="font-size:22px;margin-bottom:6px">💼</div>
          <div style="font-size:13px;font-weight:700;color:white;margin-bottom:3px">매수자</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.5">건물 매입 탐색<br>전문가 상담 연결</div>
        </button>
        <button onclick="goTab('register')" style="background:var(--navy2);border:1px solid rgba(196,164,90,.22);border-radius:6px;padding:14px 12px;text-align:left;cursor:pointer;font-family:inherit">
          <div style="font-size:22px;margin-bottom:6px">🗝️</div>
          <div style="font-size:13px;font-weight:700;color:white;margin-bottom:3px">임대인</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.5">공간 임대 등록<br>세입자 연결</div>
        </button>
        <button onclick="goTab('listings')" style="background:var(--navy2);border:1px solid rgba(196,164,90,.22);border-radius:6px;padding:14px 12px;text-align:left;cursor:pointer;font-family:inherit">
          <div style="font-size:22px;margin-bottom:6px">🔍</div>
          <div style="font-size:13px;font-weight:700;color:white;margin-bottom:3px">임차인</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.5">상가·사무실 임차<br>권리금 정보</div>
        </button>
      </div>

      <!-- 추천 매물 -->
      <div class="section-title" style="margin-bottom:12px">추천 매물</div>
      <div style="background:var(--surface);border-radius:4px;overflow:hidden;border:1px solid var(--border);margin-bottom:16px">
        ${recCards}
      </div>

      <!-- 서류 발급 사이트 -->
      <div class="section-title" style="margin-bottom:10px">서류 발급 사이트</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        <a href="https://www.courtauction.go.kr" target="_blank"
          style="background:var(--surface);border:1px solid var(--border);
          border-radius:4px;padding:12px;text-decoration:none;
          display:flex;flex-direction:column;gap:3px">
          <div style="font-size:18px">🏛️</div>
          <div style="font-size:12px;font-weight:700;color:var(--navy)">법원 경매정보</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.4">낙찰가·입찰 일정 조회</div>
        </a>
        <a href="https://rt.molit.go.kr" target="_blank"
          style="background:var(--surface);border:1px solid var(--border);
          border-radius:4px;padding:12px;text-decoration:none;
          display:flex;flex-direction:column;gap:3px">
          <div style="font-size:18px">🏠</div>
          <div style="font-size:12px;font-weight:700;color:var(--navy)">국토부 실거래가</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.4">아파트·상가·토지 실거래</div>
        </a>
        <a href="https://www.iros.go.kr" target="_blank"
          style="background:var(--surface);border:1px solid var(--border);
          border-radius:4px;padding:12px;text-decoration:none;
          display:flex;flex-direction:column;gap:3px">
          <div style="font-size:18px">📑</div>
          <div style="font-size:12px;font-weight:700;color:var(--navy)">인터넷 등기소</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.4">등기부등본 열람·발급</div>
        </a>
        <a href="https://www.gov.kr/portal/main" target="_blank"
          style="background:var(--surface);border:1px solid var(--border);
          border-radius:4px;padding:12px;text-decoration:none;
          display:flex;flex-direction:column;gap:3px">
          <div style="font-size:18px">🏢</div>
          <div style="font-size:12px;font-weight:700;color:var(--navy)">건축물대장</div>
          <div style="font-size:10px;color:var(--on-muted);line-height:1.4">위반건축물·용도 확인</div>
        </a>
      </div>

      <!-- 소개 -->
      <div style="background:var(--surface);border-radius:4px;border:1px solid var(--border);
        padding:18px;border-left:3px solid var(--gold);margin-bottom:12px">
        <div class="section-title" style="margin-bottom:10px">하우재 공인중개사사무소</div>
        <p class="info-text" style="line-height:1.85;font-size:13px">
          마포구 홍대·연남·합정·상수동 일대.<br>
          원룸·오피스텔부터 건물·토지까지 전 유형 취급.<br>
          <span style="color:var(--gold);font-size:12px;opacity:.8">인테리어·건축 전문가와 함께하는 공인중개사사무소</span>
        </p>
      </div>

      <!-- 법정 공시 (공인중개사법 제18조의2) -->
      <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);
        border-radius:4px;padding:14px 16px;margin-bottom:4px">
        <div style="font-size:10px;color:var(--gold);letter-spacing:1.5px;font-weight:700;margin-bottom:8px">
          ⚖️ 법정 공시
        </div>
        <div style="font-size:11px;color:var(--on-muted);line-height:2">
          상호: 하우재 공인중개사사무소 ·
          등록관청: 마포구청<br>
          소재지: 서울특별시 마포구 홍대입구 인근
        </div>
        <div style="margin-top:8px;display:flex;gap:12px">
          <a href="privacy.html" target="_blank"
            style="font-size:11px;color:var(--gold);text-decoration:none;opacity:.8">
            개인정보처리방침 →
          </a>
          <a href="tel:02-333-1234"
            style="font-size:11px;color:var(--on-muted);text-decoration:none">
            📞 02-333-1234
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════
   매물 리스트
══════════════════════════════════════════════ */
function renderListings() {
  return `
  <div style="padding:0 16px;min-height:100%;background:var(--bg);padding-bottom:70px">
    <div class="page-header">
      <div class="page-header-title">매물</div>
      <div class="page-header-sub">홍대 · 마포구 전 유형 ${AppData.properties.length}건</div>
    </div>
    ${ListingView.renderList()}
  </div>`;
}

/* ── 매물 상세 ── */
function renderDetailPage() {
  return `
  <div style="background:var(--bg);min-height:100%;padding-bottom:70px">
    <div class="app-bar app-bar-dark">
      <button class="back-btn" onclick="backFromDetail()">←</button>
      <span class="app-bar-title">하우재 · 매물 상세</span>
      <button class="fav-heart-btn" onclick="toggleFav(${S.detailId})" id="fav-btn">
        ${S.favorites.includes(S.detailId)?'❤️':'🤍'}
      </button>
    </div>
    ${ListingView.renderDetail(S.detailId)}
  </div>`;
}

function openListingDetail(id) {
  S.detailId = id;
  const wrap = document.getElementById('screen-wrap');
  wrap.innerHTML = renderDetailPage();
  wrap.scrollTop = 0;
}

function backFromDetail() {
  S.detailId = null;
  renderScreen();
}

function toggleFav(id) {
  if (S.favorites.includes(id)) {
    S.favorites = S.favorites.filter(x=>x!==id);
  } else {
    S.favorites.push(id);
  }
  localStorage.setItem('fav', JSON.stringify(S.favorites));
  const btn = document.getElementById('fav-btn');
  if (btn) btn.textContent = S.favorites.includes(id)?'❤️':'🤍';
}

function removeFav(id) {
  S.favorites = S.favorites.filter(x=>x!==id);
  localStorage.setItem('fav', JSON.stringify(S.favorites));
  renderScreen();
}

function refreshListings() {
  if (S.tab==='listings' && !S.detailId)
    document.getElementById('screen-wrap').innerHTML = renderListings();
}

/* ══════════════════════════════════════════════
   상담 탭
══════════════════════════════════════════════ */
function renderConsult() {
  return `
  <div style="padding:0 16px 20px;background:var(--bg);min-height:100%;padding-bottom:70px">
    <div class="page-header">
      <div class="page-header-title">상담</div>
      <div class="page-header-sub">언제나 당신 편, 하우재</div>
    </div>

    <!-- 카카오 오픈카톡 메인 CTA -->
    <a href="https://open.kakao.com/o/hawujae" target="_blank" class="consult-kakao-btn">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <ellipse cx="11" cy="10.5" rx="9.5" ry="8.5" fill="#3A1D1D" opacity=".1"/>
        <path d="M11 2C6.029 2 2 5.358 2 9.5c0 2.58 1.638 4.858 4.123 6.233l-1.05 3.893c-.092.34.263.608.562.418L10.178 17c.268.034.542.05.822.05 4.971 0 9-3.358 9-7.5S15.971 2 11 2z" fill="#391B1B"/>
      </svg>
      💬 카카오 오픈카톡 상담
    </a>

    <!-- 연락 수단 -->
    <div class="consult-info-card">
      <div class="section-title" style="margin-bottom:14px">연락하기</div>
      <a href="tel:02-333-1234" class="consult-contact-row">
        <span style="font-size:20px">📞</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:14px">전화 상담</div>
          <div style="font-size:12px;color:var(--on-muted);margin-top:2px">02-333-1234 · 평일 09:00~18:00</div>
        </div>
        <span style="color:var(--gold);font-size:18px">›</span>
      </a>
      <a href="https://open.kakao.com/o/hawujae" target="_blank" class="consult-contact-row">
        <span style="font-size:20px">💬</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:14px">카카오 오픈카톡</div>
          <div style="font-size:12px;color:var(--on-muted);margin-top:2px">24시간 문자 상담 가능</div>
        </div>
        <span style="color:var(--gold);font-size:18px">›</span>
      </a>
    </div>

    <!-- 이사날짜 안내 -->
    <div class="consult-info-card" onclick="App.goTab('moving')" style="cursor:pointer">
      <div class="section-title" style="margin-bottom:10px">📅 이사 좋은 날 확인하기</div>
      <p class="info-text" style="font-size:13px;line-height:1.8">
        손없는날(음력 9·10·19·20일)을 달력으로 확인하세요.<br>
        이사에 길한 날짜를 고르고<br>
        <span style="color:var(--gold);font-weight:600">카카오 상담</span>으로 계약 날짜를 잡아보세요.
      </p>
      <div style="font-size:12px;color:var(--gold);margin-top:10px">→ 손없는날 달력 보기</div>
    </div>

    <!-- 사무소 정보 -->
    <div class="consult-info-card">
      <div class="section-title" style="margin-bottom:12px">사무소 정보</div>
      <div style="font-size:13px;color:var(--on-muted);line-height:2.4">
        <div><span style="color:var(--gold);font-weight:600;margin-right:8px">상호</span>하우재 공인중개사사무소</div>
        <div><span style="color:var(--gold);font-weight:600;margin-right:8px">소재지</span>서울시 마포구 홍대입구 인근</div>
        <div><span style="color:var(--gold);font-weight:600;margin-right:8px">등록관청</span>마포구청</div>
        <div><span style="color:var(--gold);font-weight:600;margin-right:8px">대표</span>심지연 공인중개사</div>
        <div><span style="color:var(--gold);font-weight:600;margin-right:8px">건축사</span>한상범 건축사</div>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════
   공통 유틸
══════════════════════════════════════════════ */
function scoreColor(s) {
  return s>=80?'#C4A45A':s>=65?'#2E7D32':s>=50?'#1565C0':'#C62828';
}
function scoreColorDark(s) {
  return s>=80?'#DFC07A':s>=65?'#66BB6A':s>=50?'#64B5F6':'#EF5350';
}

function recEmoji(t) {
  return {oneroom:'🏠',office:'🏢',building:'🏗️',land:'🌱',construction:'⚒️'}[t]||'🏠';
}

/* ── 앱 시작 ── */
window.onload = async function() {
  renderShell();
  renderScreen(); // 기본 데이터로 즉시 렌더

  // Firebase 초기화 & 실시간 매물 로딩
  try {
    const ok = await DB.init();
    if (ok || !DB.isConfigured()) {
      const fireListings = await DB.getAll();
      if (fireListings && fireListings.length) {
        AppData.properties = fireListings;
        renderScreen(); // Firestore 데이터로 재렌더
      }
    }
  } catch (e) {
    console.warn('[App] DB 로딩 실패, 기본 데이터 유지:', e.message);
  }
};

window.App = { goTab, openListingDetail, backFromDetail, refreshListings, removeFav };
window.DIAMOND_SVG = DIAMOND_SVG;
window.DIAMOND_SVG_LG = DIAMOND_SVG_LG;
