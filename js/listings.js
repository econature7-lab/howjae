/**
 * listings.js — 매물 리스트 & 상세 화면
 */
window.ListingView = (function() {

  let currentFilter = 'all';

  // 매물 element 필드 (영어) → 사주 오행 (한국어) 변환
  const EN2KO = { fire:'화', wood:'목', earth:'토', metal:'금', water:'수' };
  // 한국어 오행 → 영문 CSS 클래스
  const KO2EN = { 화:'fire', 목:'wood', 토:'earth', 금:'metal', 수:'water' };

  /* ── 오행 사주 궁합 ── */
  function propCompat(prop, saju) {
    if (!saju) return null;
    const GENERATES = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
    const CONTROLS  = { 목:'토', 화:'금', 토:'수', 금:'목', 수:'화' };
    // 매물 element(영어)를 한국어로 변환
    const pEl = EN2KO[prop.element] || prop.element;
    const dEl = saju.dmEl;
    let score = 65;
    if (GENERATES[pEl] === dEl) score = 90;
    else if (pEl === dEl)       score = 83;
    else if (GENERATES[dEl] === pEl) score = 73;
    else if (CONTROLS[pEl] === dEl)  score = 42;
    else if (CONTROLS[dEl] === pEl)  score = 55;
    // 방향 보너스 (방향→한국어오행, 일간과 비교)
    if (prop.direction) {
      const DIR_EL = { N:'수', S:'화', E:'목', W:'금', SE:'화', SW:'금', NE:'목', NW:'수' };
      const dirEl = DIR_EL[prop.direction];
      if (dirEl === dEl) score = Math.min(99, score + 5);
    }
    return Math.min(99, Math.max(30, score));
  }

  function compatBar(score) {
    if (!score) return '';
    const c = score>=80?'#D4AF37':score>=65?'#7C5CBF':score>=50?'#2196F3':'#FF6B6B';
    const label = score>=80?'최길':'길';
    return `<div class="prop-compat">
      <span style="font-size:11px;color:rgba(255,255,255,.5)">사주궁합</span>
      <div class="compat-bar-wrap">
        <div class="compat-bar-fill" style="width:${score}%;background:${c}"></div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${c}">${score} ${label}</span>
    </div>`;
  }

  function stars(score) {
    if (!score) return '';
    const s = Math.round(score / 20);
    return '★'.repeat(s) + '☆'.repeat(5-s);
  }

  /* ── 매물 카드 ── */
  function propCard(p, saju) {
    const cs = propCompat(p, saju);
    const badge = AppData.dealBadge(p.deal);
    const dealTxt = AppData.dealLabel(p.deal);
    const elCls = p.element ? `chip-${p.element}` : 'chip-earth';
    const floorTxt = p.floor ? `${p.floor}/${p.totalFloor}층` : '';
    const sizePy = (p.size / 3.305).toFixed(1);
    const distTxt = p.distance ? `역까지 ${p.distance}m` : '';

    return `
    <div class="prop-card fade-in" onclick="ListingView.openDetail(${p.id})">
      <!-- 썸네일 영역 -->
      <div class="prop-thumb">
        <div class="prop-thumb-inner" data-type="${p.type}">
          ${propEmoji(p.type)}
        </div>
        <span class="deal-badge deal-${p.deal.type}">${badge}</span>
        ${cs ? `<span class="compat-badge" style="background:${cs>=80?'rgba(212,175,55,.85)':'rgba(124,92,191,.75)'}">사주 ${cs}</span>` : ''}
      </div>
      <!-- 정보 -->
      <div class="prop-info">
        <div class="prop-type-row">
          <span class="chip ${elCls}" style="font-size:11px;padding:3px 8px">${p.typeLabel}</span>
          ${distTxt ? `<span class="prop-dist">🚶 ${distTxt}</span>` : ''}
        </div>
        <div class="prop-title">${p.title}</div>
        <div class="prop-addr">${p.shortAddr} · 전용 ${p.size}㎡ (${sizePy}평)${floorTxt?' · '+floorTxt:''}</div>
        <div class="prop-price">${dealTxt}</div>
        ${cs ? compatBar(cs) : '<div class="prop-no-saju">사주 입력 시 궁합 분석 가능</div>'}
        <div class="prop-tags">${p.tags.map(t=>`<span class="prop-tag">#${t}</span>`).join('')}</div>
      </div>
    </div>`;
  }

  function propEmoji(type) {
    const map = { oneroom:'🏠', office:'🏢', building:'🏗️', land:'🌱', construction:'⚒️' };
    return `<span style="font-size:44px">${map[type]||'🏠'}</span>`;
  }

  /* ── 리스트 화면 ── */
  function renderList(saju) {
    const filtered = currentFilter === 'all'
      ? AppData.properties
      : AppData.properties.filter(p => p.type === currentFilter);

    // 사주 있으면 궁합순 정렬
    const sorted = saju
      ? [...filtered].sort((a,b) => (propCompat(b,saju)||0) - (propCompat(a,saju)||0))
      : filtered;

    const sajuBanner = !saju
      ? `<div class="saju-prompt-banner" onclick="App.goTab('saju')">
          ⭐ 사주 입력 시 나에게 맞는 매물 순서로 정렬됩니다
          <span style="color:var(--gold)">→ 사주 입력</span>
        </div>` : '';

    return `
    <div class="listings-screen">
      <!-- 필터 탭 -->
      <div class="list-filter-bar">
        ${AppData.FILTERS.map(f=>`
          <button class="list-filter-btn ${currentFilter===f.key?'active':''}"
            onclick="ListingView.setFilter('${f.key}')">
            ${f.label}
          </button>`).join('')}
      </div>

      ${sajuBanner}

      <!-- 결과 수 -->
      <div class="list-count">${sorted.length}건의 매물</div>

      <!-- 카드 목록 -->
      <div class="prop-list">
        ${sorted.map(p => propCard(p, saju)).join('')}
      </div>
    </div>`;
  }

  /* ── 상세 화면 ── */
  function renderDetail(id, saju) {
    const p = AppData.properties.find(x => x.id === id);
    if (!p) return `<div class="content"><p>매물을 찾을 수 없습니다.</p></div>`;

    const cs = propCompat(p, saju);
    const dealTxt = AppData.dealLabel(p.deal);
    const sizePy = (p.size / 3.305).toFixed(1);
    const floorTxt = p.floor ? `${p.floor}/${p.totalFloor}층` : '-';
    const GENS = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
    const elCls = `chip-${p.element||'earth'}`;

    // 상세 궁합 설명
    let compatSection = '';
    if (saju && cs) {
      const pElNm = Saju.EL_NAME[EN2KO[p.element]] || '';
      const dElNm = Saju.EL_NAME[saju.dmEl] || '';
      const gradeTxt = cs>=80?'최길(最吉)':cs>=65?'길(吉)':cs>=50?'보통':'흉(凶)';
      const advice = cs>=80
        ? `이 매물은 ${pElNm} 기운으로, 귀하의 ${dElNm} 일간과 상생합니다. 적극 추천!`
        : cs>=65 ? `${pElNm}과 ${dElNm}의 궁합이 양호합니다. 안정적 투자를 기대할 수 있습니다.`
        : cs>=50 ? `보통 궁합입니다. 세부 조건을 꼼꼼히 검토하세요.`
        : `${pElNm}이 ${dElNm} 일간과 상극 관계입니다. 신중하게 결정하세요.`;

      const scoreColor = cs>=80?'#D4AF37':cs>=65?'#7C5CBF':cs>=50?'#2196F3':'#FF6B6B';
      compatSection = `
      <div class="card">
        <div class="section-title">⭐ 사주 궁합 분석</div>
        <div style="text-align:center;padding:16px 0">
          <div style="font-size:64px;font-weight:700;color:${scoreColor}">${cs}</div>
          <div style="font-size:18px;font-weight:600;margin-top:4px;color:${scoreColor}">${gradeTxt}</div>
          <div style="font-size:13px;color:rgba(255,255,255,.6);margin-top:6px">${stars(cs)}</div>
        </div>
        <div class="divider"></div>
        <p class="info-text" style="margin-top:8px">${advice}</p>
      </div>`;
    } else if (!saju) {
      compatSection = `
      <div class="card" onclick="App.goTab('saju')" style="cursor:pointer;border:1.5px dashed rgba(212,175,55,.4)">
        <div style="text-align:center;padding:10px 0;color:var(--gold)">
          ⭐ 사주를 입력하면 이 매물과의 궁합을 분석해드립니다
          <div style="font-size:13px;margin-top:6px;color:rgba(255,255,255,.5)">→ 사주 입력하기</div>
        </div>
      </div>`;
    }

    const DIR_LABEL = {N:'북향',S:'남향',E:'동향',W:'서향',SE:'남동향',SW:'남서향',NE:'북동향',NW:'북서향'};

    return `
    <div class="detail-screen fade-in">
      <!-- 매물 헤더 이미지 영역 -->
      <div class="detail-hero" data-type="${p.type}">
        <span style="font-size:80px">${propEmoji(p.type)}</span>
        <div class="detail-hero-overlay">
          <span class="chip ${elCls}" style="margin-bottom:8px">${p.typeLabel}</span>
          <div style="font-size:18px;font-weight:700;line-height:1.3">${p.title}</div>
          <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">${p.fullAddr}</div>
        </div>
      </div>

      <div class="content" style="padding-top:16px">
        <!-- 가격 카드 -->
        <div class="card" style="background:linear-gradient(135deg,rgba(124,92,191,.25),rgba(26,26,46,1))">
          <div class="section-title">💰 거래 조건</div>
          <div style="font-size:22px;font-weight:700;color:var(--gold)">${dealTxt}</div>
          <div style="font-size:13px;color:rgba(255,255,255,.5);margin-top:4px">
            ${AppData.dealBadge(p.deal)} · ${p.distance?`홍대입구역 ${p.distance}m`:''}
          </div>
        </div>

        <!-- 기본 정보 -->
        <div class="card">
          <div class="section-title">📋 기본 정보</div>
          <div class="detail-info-grid">
            ${infoRow('전용면적',`${p.size}㎡ (${sizePy}평)`)}
            ${infoRow('층수', floorTxt)}
            ${infoRow('향', p.direction?DIR_LABEL[p.direction]||p.direction:'-')}
            ${infoRow('준공', p.builtYear?`${p.builtYear}년`:'-')}
            ${infoRow('주차', p.parking?'가능':'불가')}
            ${infoRow('엘리베이터', p.elevator?'있음':'없음')}
            ${infoRow('반려동물', p.pet?'가능':'불가')}
          </div>
        </div>

        <!-- 매물 소개 -->
        <div class="card">
          <div class="section-title">📝 매물 소개</div>
          <p class="info-text">${p.desc}</p>
          <div class="prop-tags" style="margin-top:12px">
            ${p.tags.map(t=>`<span class="prop-tag">#${t}</span>`).join('')}
          </div>
        </div>

        <!-- 사주 궁합 -->
        ${compatSection}

        <!-- 지도에서 보기 버튼 -->
        <button class="btn-outline" style="margin-top:4px;margin-bottom:4px"
          onclick="App.goTab('map');setTimeout(()=>MapView.flyTo(${p.lat},${p.lng}),300)">
          🗺️ 지도에서 위치 보기
        </button>

        <!-- 중개사 연락 -->
        <div class="card" style="margin-top:0">
          <div class="section-title">📞 중개사 문의</div>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-weight:600">${p.agent}</div>
              <div style="font-size:13px;color:rgba(255,255,255,.5);margin-top:2px">${p.agentPhone}</div>
            </div>
            <a href="tel:${p.agentPhone}" class="call-btn">📞 전화</a>
          </div>
        </div>
      </div>
    </div>`;
  }

  function infoRow(label, val) {
    return `
    <div class="info-row">
      <span class="info-row-label">${label}</span>
      <span class="info-row-val">${val}</span>
    </div>`;
  }

  /* ── Public ── */
  function setFilter(f) {
    currentFilter = f;
    App.refreshListings();
  }

  function openDetail(id) {
    App.openListingDetail(id);
  }

  return { renderList, renderDetail, setFilter, openDetail, propCompat };
})();
