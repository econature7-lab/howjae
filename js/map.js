/**
 * map.js — 지도 화면 (Leaflet + OpenStreetMap)
 * ※ 네이버 지도 전환: ncpClientId 발급 후 하단 주석 참고
 */

window.MapView = (function() {
  let map = null;
  let markers = [];
  let activeFilter = 'all';

  /* ── 타입별 마커 색상 ── */
  const TYPE_COLOR = {
    oneroom:'#7C5CBF', office:'#2196F3',
    building:'#D4AF37', land:'#4CAF50', construction:'#FF5722'
  };

  function markerSvg(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".35"/></filter>
      <ellipse cx="18" cy="44" rx="7" ry="3" fill="rgba(0,0,0,.25)"/>
      <path d="M18 2 C9 2 2 9 2 18 C2 30 18 44 18 44 C18 44 34 30 34 18 C34 9 27 2 18 2Z"
            fill="${color}" filter="url(#sh)"/>
      <circle cx="18" cy="18" r="7" fill="white" opacity=".92"/>
    </svg>`;
  }

  function makeIcon(type) {
    const c = TYPE_COLOR[type] || '#7C5CBF';
    return L.divIcon({
      className: '',
      html: markerSvg(c),
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      popupAnchor: [0, -46]
    });
  }

  /* ── 지도 초기화 ── */
  function init(containerId) {
    if (map) { map.remove(); map = null; }

    map = L.map(containerId, {
      center: [AppData.CENTER.lat, AppData.CENTER.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // CartoDB Positron Dark — 지도 느낌 네이버와 유사
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 20, subdomains:'abcd' }
    ).addTo(map);

    // 줌 버튼 (우하단)
    L.control.zoom({ position:'bottomright' }).addTo(map);

    addAllMarkers();
    return map;
  }

  /* ── 마커 전체 추가 ── */
  function addAllMarkers() {
    clearMarkers();
    const list = activeFilter === 'all'
      ? AppData.properties
      : AppData.properties.filter(p => p.type === activeFilter);

    list.forEach(p => {
      const m = L.marker([p.lat, p.lng], { icon: makeIcon(p.type) })
        .addTo(map)
        .on('click', () => window.App.openListingDetail(p.id));

      // 툴팁
      m.bindTooltip(
        `<div style="font-size:13px;font-weight:600;color:#fff;padding:4px 8px;background:rgba(26,26,46,.95);border-radius:8px;border:1px solid rgba(255,255,255,.12)">`+
        `${p.typeLabel} · ${AppData.dealLabel(p.deal)}</div>`,
        { permanent:false, direction:'top', offset:[0,-44], className:'map-tip' }
      );

      markers.push(m);
    });
  }

  function clearMarkers() {
    markers.forEach(m => m.remove());
    markers = [];
  }

  /* ── 필터 변경 ── */
  function setFilter(f) {
    activeFilter = f;
    if (map) addAllMarkers();
  }

  /* ── 중심 이동 ── */
  function flyTo(lat, lng, zoom=17) {
    if (map) map.flyTo([lat, lng], zoom, { duration:.8 });
  }

  /* ── 지도 화면 렌더 ── */
  function renderScreen() {
    return `
    <div class="map-screen">
      <!-- 상단 필터 스크롤 -->
      <div class="map-filter-bar">
        ${AppData.FILTERS.map(f=>`
          <button class="map-filter-btn ${activeFilter===f.key?'active':''}"
            onclick="MapView.filterClick('${f.key}')">
            ${f.label}
          </button>`).join('')}
      </div>

      <!-- 지도 컨테이너 -->
      <div id="map-container" style="width:100%;height:calc(100vh - 112px - 56px);"></div>

      <!-- 매물 수 표시 -->
      <div class="map-count-badge" id="map-count-badge"></div>
    </div>`;
  }

  /* ── 필터 클릭 ── */
  function filterClick(f) {
    activeFilter = f;
    // 버튼 active 업데이트
    document.querySelectorAll('.map-filter-btn').forEach(b=>{
      b.classList.toggle('active', b.textContent.trim() === AppData.FILTERS.find(x=>x.key===f)?.label);
    });
    addAllMarkers();
    updateCount();
  }

  function updateCount() {
    const el = document.getElementById('map-count-badge');
    if (!el) return;
    const cnt = activeFilter==='all' ? AppData.properties.length
      : AppData.properties.filter(p=>p.type===activeFilter).length;
    el.textContent = `${cnt}건`;
  }

  /* ── 지도 마운트 후 호출 ── */
  function mount() {
    setTimeout(() => {
      init('map-container');
      updateCount();
      // 지도 크기 갱신 (DOM 렌더 후)
      if (map) map.invalidateSize();
    }, 60);
  }

  return { renderScreen, mount, flyTo, filterClick, setFilter };
})();

/*
 * ─────────────────────────────────────────────────────────────
 * 네이버 지도 전환 방법 (NCP 키 발급 후)
 * ─────────────────────────────────────────────────────────────
 * 1. https://www.ncloud.com/ → Application → Maps → Client ID 발급
 * 2. index.html <head>에 추가:
 *    <script src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_ID"></script>
 * 3. init() 함수를 아래로 교체:
 *
 *   map = new naver.maps.Map(containerId, {
 *     center: new naver.maps.LatLng(AppData.CENTER.lat, AppData.CENTER.lng),
 *     zoom: 15,
 *     mapTypeId: naver.maps.MapTypeId.NORMAL
 *   });
 *
 *   // 마커 추가 시:
 *   new naver.maps.Marker({
 *     position: new naver.maps.LatLng(p.lat, p.lng),
 *     map,
 *     icon: { url: 'data:image/svg+xml,...', size: new naver.maps.Size(36,46) }
 *   });
 * ─────────────────────────────────────────────────────────────
 */
