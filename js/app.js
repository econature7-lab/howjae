/**
 * app.js — 부동산사주 SPA 메인 (v2 — 하단 내비 + 매물 + 사주 통합)
 * 사주 화면 렌더링 → sajuview.js 위임
 */

/* ── 전역 상태 ── */
let S = {
  tab: 'home',           // home | listings | map | saju | my
  saju: null,
  detailId: null,
  isLunar: false, isLeap: false,
  sajuScreen: 'welcome', // welcome | input | result | region
  sajuTab: '개요',
  favorites: JSON.parse(localStorage.getItem('fav') || '[]'),
  regionName: ''
};

const NAV_ITEMS = [
  { key:'home',     icon:'🏠', label:'홈'   },
  { key:'listings', icon:'🏘️', label:'매물'  },
  { key:'map',      icon:'🗺️', label:'지도'  },
  { key:'saju',     icon:'⭐', label:'사주'  },
  { key:'my',       icon:'👤', label:'마이'  }
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
    case 'saju':     wrap.innerHTML = renderSajuSection();     break; // sajuview.js
    case 'my':       wrap.innerHTML = renderMy();              break;
  }
  wrap.scrollTop = 0;
}

/* ══════════════════════════════════════════════
   홈 화면
══════════════════════════════════════════════ */
function renderHome() {
  const today = new Date();
  const dayNames = ['일','월','화','수','목','금','토'];
  const dateStr = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}(${dayNames[today.getDay()]})`;

  let sajuBlock = '';
  if (S.saju) {
    const rf = Saju.realEstateFortune(S.saju, today.getFullYear());
    const pers = Saju.PERSONALITY[S.saju.dmEl] || {};
    sajuBlock = `
    <div class="home-saju-card card" onclick="goTab('saju')" style="cursor:pointer">
      <div class="section-title">${pers.icon} 나의 부동산 사주</div>
      <div style="font-weight:600;margin-bottom:10px">${pers.title}</div>
      <div class="home-score-row">
        ${[['매수',rf.buyScore],['매도',rf.sellScore],['임대',rf.rentOutScore],['임차',rf.rentInScore]].map(([l,s])=>`
          <div class="home-mini-score">
            <div class="hmsc-label">${l}운</div>
            <div class="hmsc-val" style="color:${scoreColor(s)}">${s}</div>
          </div>`).join('')}
      </div>
      <div class="info-text" style="color:var(--gold);margin-top:8px;font-size:12px">→ 상세 분석 보기</div>
    </div>`;
  } else {
    sajuBlock = `
    <div class="home-saju-prompt card" onclick="goTab('saju')" style="cursor:pointer">
      <div style="display:flex;align-items:center;gap:14px">
        <span style="font-size:36px">⭐</span>
        <div>
          <div style="font-weight:600;margin-bottom:4px">사주 입력하고 맞춤 분석 받기</div>
          <div class="info-text">매수·매도·이사 최적 시기 · 매물 궁합 분석</div>
        </div>
      </div>
    </div>`;
  }

  const recs = S.saju
    ? [...AppData.properties].sort((a,b)=>
        ListingView.propCompat(b,S.saju)-ListingView.propCompat(a,S.saju)).slice(0,3)
    : AppData.properties.slice(0,3);

  const recCards = recs.map(p => {
    const cs = ListingView.propCompat(p, S.saju);
    const cc = cs ? (cs>=80?'#D4AF37':cs>=65?'#7C5CBF':'#2196F3') : null;
    return `
    <div class="rec-card" onclick="openListingDetail(${p.id})">
      <div class="rec-thumb">${recEmoji(p.type)}</div>
      <div class="rec-info">
        <div class="rec-type">${p.typeLabel} · ${p.shortAddr}</div>
        <div class="rec-title">${p.title}</div>
        <div class="rec-price">${AppData.dealLabel(p.deal)}</div>
        ${cc ? `<div style="font-size:11px;color:${cc};margin-top:3px">사주궁합 ${cs}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  return `
  <div class="home-screen fade-in">
    <div class="home-header">
      <div>
        <div class="home-date">${dateStr}</div>
        <div class="home-title">부동산사주<span style="color:var(--gold)">.</span></div>
        <div class="home-sub">홍대 부동산 중개 &amp; AI 운세</div>
      </div>
      <div class="home-logo">🏯</div>
    </div>
    <div style="padding:0 16px 24px">
      ${sajuBlock}
      <div class="section-title" style="margin-top:8px">
        ${S.saju ? '⭐ 사주 궁합 추천 매물' : '🔥 홍대 인근 인기 매물'}
      </div>
      <div class="rec-list">${recCards}</div>
      <div class="section-title" style="margin-top:8px">빠른 메뉴</div>
      <div class="quick-menu">
        <button class="quick-btn" onclick="goTab('listings')"><span class="quick-icon">🏘️</span><span>매물 전체</span></button>
        <button class="quick-btn" onclick="goTab('map')"><span class="quick-icon">🗺️</span><span>지도 보기</span></button>
        <button class="quick-btn" onclick="goTab('saju')"><span class="quick-icon">⭐</span><span>사주 분석</span></button>
        <button class="quick-btn" onclick="goTab('my')"><span class="quick-icon">❤️</span><span>관심 매물</span></button>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="section-title">📍 홍대 인근 부동산</div>
        <p class="info-text" style="line-height:1.8">
          마포구 홍대·연남·합정·상수동 일대. 원룸·오피스텔부터 건물·토지까지 전 유형 취급.<br>
          <span style="color:var(--gold)">사주팔자 기반</span>으로 오행 방위와 시기에 맞는 매물을 추천합니다.
        </p>
      </div>
    </div>
  </div>`;
}

function recEmoji(t) {
  return {oneroom:'🏠',office:'🏢',building:'🏗️',land:'🌱',construction:'⚒️'}[t]||'🏠';
}

/* ══════════════════════════════════════════════
   매물 리스트
══════════════════════════════════════════════ */
function renderListings() {
  return `
  <div style="padding:0 16px 0">
    <div class="page-header">
      <div class="page-header-title">홍대 매물</div>
      <div class="page-header-sub">마포구 전 유형 ${AppData.properties.length}건</div>
    </div>
    ${ListingView.renderList(S.saju)}
  </div>`;
}

/* ── 매물 상세 ── */
function renderDetailPage() {
  return `
  <div>
    <div class="app-bar">
      <button class="back-btn" onclick="backFromDetail()">←</button>
      <span class="app-bar-title">매물 상세</span>
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
  <div style="padding:0 16px 20px">
    <div class="page-header">
      <div class="page-header-title">마이페이지</div>
    </div>
    ${S.saju ? `
    <div class="card" onclick="S.sajuScreen='result';goTab('saju')" style="cursor:pointer">
      <div class="section-title">⭐ 나의 사주</div>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:32px">${Saju.PERSONALITY[S.saju.dmEl]?.icon||'⭐'}</span>
        <div>
          <div style="font-weight:600">${Saju.PERSONALITY[S.saju.dmEl]?.title}</div>
          <div class="info-text">일간: ${S.saju.dayMaster} (${Saju.EL_NAME[S.saju.dmEl]}) · ${S.saju.birthYear}년생</div>
        </div>
      </div>
    </div>` : `
    <div class="card" onclick="goTab('saju')" style="cursor:pointer;border:1.5px dashed rgba(212,175,55,.4)">
      <div style="text-align:center;color:var(--gold);padding:12px 0">⭐ 사주 입력하고 맞춤 서비스 받기 →</div>
    </div>`}
    <div class="section-title" style="margin-top:8px">❤️ 관심 매물 (${favProps.length})</div>
    ${favProps.length ? favProps.map(p=>`
      <div class="fav-item" onclick="openListingDetail(${p.id})">
        <span style="font-size:24px">${recEmoji(p.type)}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
          <div style="font-size:12px;color:rgba(255,255,255,.5)">${AppData.dealLabel(p.deal)}</div>
        </div>
        <button class="fav-del" onclick="event.stopPropagation();removeFav(${p.id})">✕</button>
      </div>`).join('')
    : `<div class="card" style="text-align:center;color:rgba(255,255,255,.3);padding:28px">
        관심 매물이 없습니다<br>
        <span style="font-size:12px;margin-top:4px;display:block">매물 상세에서 🤍 누르세요</span>
      </div>`}
  </div>`;
}

/* ══════════════════════════════════════════════
   공통 유틸 (sajuview.js에서도 사용)
══════════════════════════════════════════════ */
function scoreColor(s) {
  return s>=80?'#D4AF37':s>=65?'#64B5F6':s>=50?'#81C784':'#FF8A65';
}

function pillarCard(label, p, highlight=false) {
  const ec = Saju.EL_CLASS[p.sEl];
  const hl = highlight ? 'border:1px solid rgba(124,92,191,.5);background:rgba(124,92,191,.12)' : '';
  return `<div class="pillar-card" style="${hl}">
    <div class="pillar-label">${label}</div>
    <div class="pillar-stem chip-${ec}" style="display:inline-block;padding:4px 8px;border-radius:8px;margin-bottom:4px">${p.stem}(${p.sH})</div>
    <div class="pillar-branch">${p.branch}(${p.bH})</div>
  </div>`;
}

function scoreRowEl(label, score) {
  const stars = '⭐'.repeat(score>=85?5:score>=70?4:score>=55?3:2);
  const col = scoreColor(score);
  return `<div class="score-row">
    <span class="score-row-label">${label}</span>
    <div class="score-row-right">
      <span class="score-stars" style="font-size:12px">${stars}</span>
      <span class="score-num" style="color:${col}">${score}</span>
    </div>
  </div>`;
}

/* ── 앱 시작 ── */
window.onload = function() {
  renderShell();
  renderScreen();
};

window.App = { goTab, openListingDetail, backFromDetail, refreshListings, removeFav };
