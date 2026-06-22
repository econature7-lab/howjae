/**
 * listings.js — 매물 리스트 & 상세 화면
 */
window.ListingView = (function() {

  let currentFilter = 'all';

  /* ── 배지 ── */
  function getBadgeHTML(badge) {
    if (badge === 2) return `<span class="arch-badge badge-architect">🏗️ 건축검토완료</span>`;
    if (badge === 1) return `<span class="arch-badge badge-confirmed">📍 위치확인</span>`;
    return '';
  }

  function propEmoji(type) {
    const map = { oneroom:'🏠', office:'🏢', building:'🏗️', land:'🌱', construction:'⚒️' };
    return `<span style="font-size:44px">${map[type]||'🏠'}</span>`;
  }

  /* ── 매물 카드 ── */
  function propCard(p) {
    const badge   = AppData.dealBadge(p.deal);
    const dealTxt = AppData.dealLabel(p.deal);
    const elCls   = p.element ? `chip-${p.element}` : 'chip-earth';
    const floorTxt = p.floor ? `${p.floor}/${p.totalFloor}층` : '';
    const sizePy  = (p.size / 3.305).toFixed(1);
    const distTxt = p.distance ? `역까지 ${p.distance}m` : '';

    return `
    <div class="prop-card fade-in" onclick="ListingView.openDetail(${p.id})">
      <!-- 썸네일 영역 -->
      <div class="prop-thumb" data-type="${p.type}"${p.img ? ` style="background:url('${p.img}') center/cover no-repeat"` : ''}>
        ${!p.img ? `<div class="prop-thumb-inner">${propEmoji(p.type)}</div>` : ''}
        <div class="prop-thumb-overlay"></div>
        ${getBadgeHTML(p.badge)}
        <span class="deal-badge deal-${p.deal.type}">${badge}</span>
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
        <div class="prop-tags">${p.tags.map(t=>`<span class="prop-tag">#${t}</span>`).join('')}</div>
      </div>
    </div>`;
  }

  /* ── 리스트 화면 ── */
  function renderList() {
    const filtered = currentFilter === 'all'
      ? AppData.properties
      : AppData.properties.filter(p => p.type === currentFilter);

    const movingBanner = `<div class="saju-prompt-banner" onclick="App.goTab('moving')" style="cursor:pointer">
        📅 이사 좋은 날 확인하기
        <span style="color:var(--gold)">→ 손없는날</span>
      </div>`;

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

      ${movingBanner}

      <!-- 결과 수 -->
      <div class="list-count">${filtered.length}건의 매물</div>

      <!-- 카드 목록 -->
      <div class="prop-list">
        ${filtered.map(p => propCard(p)).join('')}
      </div>
    </div>`;
  }

  /* ── 상세 화면 ── */
  function renderDetail(id) {
    const p = AppData.properties.find(x => x.id === id);
    if (!p) return `<div class="content"><p>매물을 찾을 수 없습니다.</p></div>`;

    const dealTxt = AppData.dealLabel(p.deal);
    const sizePy  = (p.size / 3.305).toFixed(1);
    const floorTxt = p.floor ? `${p.floor}/${p.totalFloor}층` : '-';
    const elCls   = `chip-${p.element||'earth'}`;
    const DIR_LABEL = {N:'북향',S:'남향',E:'동향',W:'서향',SE:'남동향',SW:'남서향',NE:'북동향',NW:'북서향'};

    return `
    <div class="detail-screen fade-in">
      <!-- 매물 헤더 이미지 영역 -->
      <div class="detail-hero" data-type="${p.type}"${p.img ? ` style="background:url('${p.img}') center/cover no-repeat"` : ''}>
        ${!p.img ? `<span style="font-size:80px;position:relative;z-index:1">${propEmoji(p.type)}</span>` : ''}
        <div class="detail-hero-dim"></div>
        <div class="detail-hero-overlay">
          <span class="chip ${elCls}" style="margin-bottom:8px">${p.typeLabel}</span>
          <div style="font-size:18px;font-weight:700;line-height:1.3">${p.title}</div>
          <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">${p.fullAddr}</div>
        </div>
      </div>

      <div class="content" style="padding-top:16px">
        <!-- 가격 카드 -->
        <div class="card" style="border-left:3px solid var(--gold)">
          <div class="section-title">거래 조건</div>
          <div style="font-size:22px;font-weight:700;color:var(--navy);font-family:'Playfair Display',serif">${dealTxt}</div>
          <div style="font-size:12px;color:var(--on-muted);margin-top:6px;letter-spacing:.3px">
            ${AppData.dealBadge(p.deal)} · ${p.distance?`홍대입구역 ${p.distance}m`:''}
          </div>
        </div>

        <!-- 건축검토완료 배지 안내 -->
        ${p.badge === 2 ? `
        <div class="card" style="border-left:3px solid var(--gold);background:rgba(196,164,90,.06)">
          <div class="section-title">🏗️ 건축사 검토 완료</div>
          <p class="info-text">건축사사무소 하우재에서 직접 현장 방문 후 건물 상태를 확인한 매물입니다. 불법증축·노후도·리모델링 가능 여부를 사전 점검했습니다.</p>
        </div>` : p.badge === 1 ? `
        <div class="card" style="border-left:3px solid #f0b429;background:rgba(240,180,41,.04)">
          <div class="section-title">📍 위치 확인 완료</div>
          <p class="info-text">공인중개사가 직접 현장을 방문하여 위치와 주변 환경을 확인한 매물입니다.</p>
        </div>` : ''}

        <!-- 기본 정보 -->
        <div class="card">
          <div class="section-title">기본 정보</div>
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
          <div class="section-title">매물 소개</div>
          <p class="info-text">${p.desc}</p>
          <div class="prop-tags" style="margin-top:12px">
            ${p.tags.map(t=>`<span class="prop-tag">#${t}</span>`).join('')}
          </div>
        </div>

        <!-- 이사날짜 배너 -->
        <div class="card" onclick="App.goTab('moving')" style="cursor:pointer;border:1px dashed rgba(196,164,90,.4);background:rgba(196,164,90,.04)">
          <div style="text-align:center;padding:8px 0;color:var(--gold)">
            📅 이사 좋은 날 알아보기
            <div style="font-size:12px;margin-top:6px;color:var(--on-muted)">→ 손없는날 달력 보기</div>
          </div>
        </div>

        <!-- 지도에서 보기 -->
        <button class="btn-outline" style="margin-top:4px;margin-bottom:4px"
          onclick="App.goTab('map');setTimeout(()=>MapView.flyTo(${p.lat},${p.lng}),300)">
          🗺️ 지도에서 위치 보기
        </button>

        <!-- 중개사 연락 -->
        <div class="card" style="margin-top:0">
          <div class="section-title">중개사 문의</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div>
              <div style="font-weight:700;font-size:14px">${p.agent}</div>
              <div style="font-size:12px;color:var(--on-muted);margin-top:3px">${p.agentPhone}</div>
            </div>
            <a href="tel:${p.agentPhone}" class="call-btn">📞 전화</a>
          </div>
          <a href="https://open.kakao.com/o/hawujae" target="_blank" class="kakao-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><ellipse cx="9" cy="8.5" rx="8" ry="7" fill="#3A1D1D" opacity=".12"/><path d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.38c0 2.074 1.344 3.895 3.376 4.954l-.862 3.192c-.075.278.215.497.46.343l3.726-2.47c.263.027.529.041.8.041 4.142 0 7.5-2.634 7.5-5.88S13.142 1.5 9 1.5z" fill="#371D1D"/></svg>
            카카오톡 상담
          </a>
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

  return { renderList, renderDetail, setFilter, openDetail };
})();
