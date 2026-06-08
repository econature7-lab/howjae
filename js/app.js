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
  saju: null,
  detailId: null,
  isLunar: false, isLeap: false,
  sajuScreen: 'welcome',
  sajuTab: '개요',
  favorites: JSON.parse(localStorage.getItem('fav') || '[]'),
  regionName: ''
};

const NAV_ITEMS = [
  { key:'home',     icon:'⌂',  label:'홈'   },
  { key:'listings', icon:'⊞',  label:'매물'  },
  { key:'map',      icon:'◎',  label:'지도'  },
  { key:'saju',     icon:'✦',  label:'사주'  },
  { key:'my',       icon:'○',  label:'마이'  }
];

/* ── 앱 껍데기 ── */
function renderShell() {
  document.getElementById('app').innerHTML = `
    <div id="screen-wrap" style="flex:1;overflow-y:auto;min-height:0;-webkit-overflow-scrolling:touch"></div>
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
    case 'home':     wrap.innerHTML = renderHome();            break;
    case 'listings': wrap.innerHTML = renderListings();        break;
    case 'map':      wrap.innerHTML = MapView.renderScreen();  break;
    case 'saju':     wrap.innerHTML = renderSajuSection();     break;
    case 'my':       wrap.innerHTML = renderMy();              break;
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

  let sajuBlock = '';
  if (S.saju) {
    const rf = Saju.realEstateFortune(S.saju, today.getFullYear());
    const pers = Saju.PERSONALITY[S.saju.dmEl] || {};
    sajuBlock = `
    <div class="home-saju-card" onclick="goTab('saju')" style="cursor:pointer;
      background:rgba(196,164,90,.08);border:1px solid rgba(196,164,90,.25);
      border-radius:4px;padding:16px 18px;margin-bottom:12px">
      <div class="section-title" style="color:var(--gold);margin-bottom:8px">나의 부동산 사주</div>
      <div style="font-weight:600;margin-bottom:12px;color:white;font-size:14px">${pers.title}</div>
      <div class="home-score-row">
        ${[['매수',rf.buyScore],['매도',rf.sellScore],['임대',rf.rentOutScore],['임차',rf.rentInScore]].map(([l,s])=>`
          <div class="home-mini-score">
            <div class="hmsc-label">${l}</div>
            <div class="hmsc-val" style="color:${scoreColorDark(s)}">${s}</div>
          </div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--gold);margin-top:10px;letter-spacing:.5px">→ 상세 분석 보기</div>
    </div>`;
  } else {
    sajuBlock = `
    <div onclick="goTab('saju')" style="cursor:pointer;
      background:rgba(196,164,90,.06);border:1px solid rgba(196,164,90,.22);
      border-radius:4px;padding:16px 18px;margin-bottom:12px;
      display:flex;align-items:center;gap:14px">
      <div style="width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
        ${DIAMOND_SVG.replace('44 44','36 36').replace('width: 44px; height: 44px;','')}
      </div>
      <div>
        <div style="font-weight:700;color:white;font-size:14px;margin-bottom:4px">사주 입력하고 맞춤 분석 받기</div>
        <div style="font-size:12px;color:rgba(255,255,255,.5)">매수·매도·이사 최적 시기 · 매물 궁합 분석</div>
      </div>
    </div>`;
  }

  const recs = S.saju
    ? [...AppData.properties].sort((a,b)=>
        ListingView.propCompat(b,S.saju)-ListingView.propCompat(a,S.saju)).slice(0,3)
    : AppData.properties.slice(0,3);

  const recCards = recs.map(p => {
    const cs = ListingView.propCompat(p, S.saju);
    const cc = cs ? scoreColorDark(cs) : null;
    return `
    <div class="rec-card" onclick="openListingDetail(${p.id})">
      <div class="rec-thumb" data-type="${p.type}" style="background:linear-gradient(135deg,var(--navy2),var(--navy3))"></div>
      <div class="rec-info">
        <div class="rec-type">${p.typeLabel} · ${p.shortAddr}</div>
        <div class="rec-title">${p.title}</div>
        <div class="rec-price">${AppData.dealLabel(p.deal)}</div>
        ${cc ? `<div style="font-size:11px;color:${cc};margin-top:2px">궁합 ${cs}점</div>` : ''}
      </div>
      <div style="font-size:18px;color:rgba(255,255,255,.25);align-self:center">›</div>
    </div>`;
  }).join('');

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
      <div class="home-title">사주팔자로 찾는<span class="home-title-gold"><br>나만의 부동산</span></div>
      <div class="home-sub">홍대 · 연남 · 합정 · 상수 일대</div>
      ${S.saju ? `` : ``}
    </div>

    <div style="padding:18px 16px 0">

      <!-- 사주 배너 -->
      ${sajuBlock}

      <!-- 추천 매물 -->
      <div class="section-title" style="margin-bottom:12px">
        ${S.saju ? '⭐ 사주 궁합 추천 매물' : '추천 매물'}
      </div>
      <div style="background:var(--surface);border-radius:4px;overflow:hidden;border:1px solid var(--border);margin-bottom:16px">
        ${recCards}
      </div>

      <!-- 빠른 메뉴 -->
      <div class="section-title" style="margin-bottom:10px">바로가기</div>
      <div class="quick-menu" style="margin-bottom:16px">
        <button class="quick-btn" onclick="goTab('listings')">
          <span class="quick-icon">⊞</span><span>매물</span>
        </button>
        <button class="quick-btn" onclick="goTab('map')">
          <span class="quick-icon">◎</span><span>지도</span>
        </button>
        <button class="quick-btn" onclick="goTab('saju')">
          <span class="quick-icon">✦</span><span>사주</span>
        </button>
        <button class="quick-btn" onclick="goTab('my')">
          <span class="quick-icon">♡</span><span>관심</span>
        </button>
      </div>

      <!-- 소개 -->
      <div style="background:var(--surface);border-radius:4px;border:1px solid var(--border);
        padding:18px;border-left:3px solid var(--gold);margin-bottom:4px">
        <div class="section-title" style="margin-bottom:10px">하우재 공인중개사사무소</div>
        <p class="info-text" style="line-height:1.85;font-size:13px">
          마포구 홍대·연남·합정·상수동 일대.<br>
          원룸·오피스텔부터 건물·토지까지 전 유형 취급.<br>
          <span style="color:var(--gold);font-weight:600">사주팔자 오행</span> 기반으로
          방위와 시기에 맞는 매물을 추천합니다.
        </p>
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
    ${ListingView.renderList(S.saju)}
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
    ${ListingView.renderDetail(S.detailId, S.saju)}
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
   마이 페이지
══════════════════════════════════════════════ */
function renderMy() {
  const favProps = AppData.properties.filter(p => S.favorites.includes(p.id));
  return `
  <div style="padding:0 16px 20px;background:var(--bg);min-height:100%;padding-bottom:70px">
    <div class="page-header">
      <div class="page-header-title">마이</div>
    </div>
    ${S.saju ? `
    <div class="card" onclick="S.sajuScreen='result';goTab('saju')" style="cursor:pointer">
      <div class="section-title" style="margin-bottom:8px">나의 사주</div>
      <div style="display:flex;align-items:center;gap:14px">
        <div style="width:36px;height:36px;flex-shrink:0">${DIAMOND_SVG.replace('44 44','36 36')}</div>
        <div>
          <div style="font-weight:700;font-size:14px">${Saju.PERSONALITY[S.saju.dmEl]?.title}</div>
          <div class="info-text" style="margin-top:2px;font-size:12px">일간: ${S.saju.dayMaster} (${Saju.EL_NAME[S.saju.dmEl]}) · ${S.saju.birthYear}년생</div>
        </div>
      </div>
    </div>` : `
    <div class="card" onclick="goTab('saju')" style="cursor:pointer;border:1px dashed rgba(196,164,90,.4);background:rgba(196,164,90,.04)">
      <div style="text-align:center;color:var(--gold);padding:10px 0;font-size:13px;font-weight:600;letter-spacing:.3px">✦ 사주 입력하고 맞춤 서비스 받기 →</div>
    </div>`}
    <div class="section-title" style="margin-top:14px">관심 매물 (${favProps.length})</div>
    ${favProps.length ? favProps.map(p=>`
      <div class="fav-item" onclick="openListingDetail(${p.id})">
        <span style="font-size:22px">${recEmoji(p.type)}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
          <div style="font-size:12px;color:var(--on-muted)">${AppData.dealLabel(p.deal)}</div>
        </div>
        <button class="fav-del" onclick="event.stopPropagation();removeFav(${p.id})">✕</button>
      </div>`).join('')
    : `<div class="card" style="text-align:center;color:var(--on-muted);padding:28px;opacity:.7">
        관심 매물이 없습니다<br>
        <span style="font-size:12px;margin-top:4px;display:block">매물 상세에서 🤍 누르세요</span>
      </div>`}
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

function pillarCard(label, p, highlight=false) {
  const ec = Saju.EL_CLASS[p.sEl];
  const hl = highlight ? 'class="pillar-card pillar-highlight"' : 'class="pillar-card"';
  return `<div ${hl}>
    <div class="pillar-label">${label}</div>
    <div class="pillar-stem chip-${ec}">${p.stem}(${p.sH})</div>
    <div class="pillar-branch">${p.branch}(${p.bH})</div>
  </div>`;
}

function scoreRowEl(label, score) {
  const stars = '⭐'.repeat(score>=85?5:score>=70?4:score>=55?3:2);
  const col = scoreColor(score);
  return `<div class="score-row">
    <span class="score-row-label">${label}</span>
    <div class="score-row-right">
      <span class="score-stars">${stars}</span>
      <span class="score-num" style="color:${col}">${score}</span>
    </div>
  </div>`;
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
