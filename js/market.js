/**
 * market.js — 동별 시세 리포트
 * 홍대·마포구 주요 동별 평균 시세 정보
 */
window.MarketView = (function() {

  const DATA = [
    {
      dong: '서교동 (홍대입구)',
      emoji: '🏙️',
      desc: '홍대입구역 중심 상권',
      monthly: { avg: '보증 3천 / 월 180', range: '150~250만' },
      jeonse:  { avg: '1.8억', range: '1.2~2.5억' },
      sale:    { avg: '3.3억/평', range: '2.8~4억' },
      trend: 'up',
      tags: ['카페·F&B 강세', '권리금 높음', '유동인구 최상'],
    },
    {
      dong: '연남동',
      emoji: '☕',
      desc: '경의선숲길 인접 감성 상권',
      monthly: { avg: '보증 2천 / 월 140', range: '110~200만' },
      jeonse:  { avg: '1.5억', range: '1~2억' },
      sale:    { avg: '2.8억/평', range: '2.3~3.5억' },
      trend: 'up',
      tags: ['인스타 핫플', '소규모 매장 多', '주거+상업 혼재'],
    },
    {
      dong: '합정동',
      emoji: '🏢',
      desc: '합정역 사무실·카페 복합',
      monthly: { avg: '보증 2천 / 월 130', range: '100~180만' },
      jeonse:  { avg: '1.4억', range: '0.9~1.8억' },
      sale:    { avg: '2.5억/평', range: '2~3억' },
      trend: 'stable',
      tags: ['사무실 수요 안정', '주거 전환 활발', '역세권'],
    },
    {
      dong: '상수동',
      emoji: '🍻',
      desc: '상수역 소규모 로컬 상권',
      monthly: { avg: '보증 1.5천 / 월 110', range: '80~160만' },
      jeonse:  { avg: '1.2억', range: '0.8~1.5억' },
      sale:    { avg: '2.2억/평', range: '1.8~2.8억' },
      trend: 'stable',
      tags: ['소규모 창업 적합', '임대료 상대적 저렴', '골목상권'],
    },
    {
      dong: '망원동',
      emoji: '🌊',
      desc: '망원한강공원 인근 주거·상업',
      monthly: { avg: '보증 1.5천 / 월 100', range: '70~150만' },
      jeonse:  { avg: '1.1억', range: '0.7~1.4억' },
      sale:    { avg: '2.0억/평', range: '1.6~2.5억' },
      trend: 'up',
      tags: ['주거 수요 강세', '한강뷰 프리미엄', '카페 신흥 상권'],
    },
  ];

  let activeType = 'monthly'; // 'monthly' | 'jeonse' | 'sale'

  function render() {
    const wrap = document.getElementById('screen-wrap');
    if (!wrap) return;
    wrap.innerHTML = renderScreen();
    wrap.scrollTop = 0;
  }

  function setType(t) {
    activeType = t;
    render();
  }

  function renderScreen() {
    const typeLabels = { monthly:'월세', jeonse:'전세', sale:'매매' };
    return `
    <div style="background:var(--bg);min-height:100%;padding-bottom:70px">

      <!-- 앱바 -->
      <div class="app-bar app-bar-dark">
        <button class="back-btn" onclick="App.goTab('home')">←</button>
        <span class="app-bar-title">동별 시세 리포트</span>
        <span style="font-size:11px;color:var(--gold);padding-right:4px">마포구</span>
      </div>

      <div style="padding:16px 16px 0">
        <!-- 안내 배너 -->
        <div style="background:var(--navy2);border-left:3px solid var(--gold);
          border-radius:4px;padding:12px 14px;margin-bottom:16px;
          font-size:12px;color:var(--on-muted);line-height:1.8">
          📊 홍대·마포구 주요 동별 평균 시세입니다.<br>
          실제 매물은 입지·층수·상태에 따라 다를 수 있어요.<br>
          <span style="color:var(--gold);font-weight:600">정확한 시세는 카카오 상담으로 확인하세요.</span>
        </div>

        <!-- 거래 유형 탭 -->
        <div class="list-filter-bar" style="margin-bottom:16px">
          ${['monthly','jeonse','sale'].map(t => `
            <button class="list-filter-btn ${activeType===t?'active':''}"
              onclick="MarketView.setType('${t}')">
              ${typeLabels[t]}
            </button>`).join('')}
        </div>

        <!-- 동별 카드 -->
        ${DATA.map(d => renderDongCard(d)).join('')}

        <!-- 하단 상담 CTA -->
        <div class="card" style="border-left:3px solid var(--gold);margin-top:4px">
          <div style="font-size:13px;color:var(--on-muted);line-height:1.8;margin-bottom:12px">
            💡 원하는 동의 매물을 찾고 계신가요?<br>
            <b style="color:var(--navy)">건축사+공인중개사</b>가 직접 현장을 확인해드립니다.
          </div>
          <a href="https://open.kakao.com/o/hawujae" target="_blank" class="kakao-btn">
            카카오 상담 신청
          </a>
        </div>

        <!-- 업데이트 안내 -->
        <div style="text-align:center;font-size:11px;color:var(--on-muted);
          margin-top:14px;padding-bottom:4px;opacity:.6">
          ※ 시세 기준: 2026년 6월 기준 하우재 자체 조사
        </div>
      </div>
    </div>`;
  }

  function renderDongCard(d) {
    const info = d[activeType];
    const trendIcon = d.trend === 'up' ? '📈' : '➡️';
    const trendColor = d.trend === 'up' ? '#C4A45A' : 'rgba(255,255,255,.4)';
    return `
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:20px">${d.emoji}</span>
            <span style="font-weight:800;font-size:15px;color:var(--on-surface)">${d.dong}</span>
          </div>
          <div style="font-size:11px;color:var(--on-muted)">${d.desc}</div>
        </div>
        <span style="font-size:18px" title="${d.trend==='up'?'상승세':'안정'}">${trendIcon}</span>
      </div>

      <!-- 시세 박스 -->
      <div style="background:var(--navy);border-radius:4px;padding:12px;margin-bottom:10px">
        <div style="font-size:11px;color:var(--on-navy);margin-bottom:6px;letter-spacing:.5px">
          평균 ${activeType==='monthly'?'월세':activeType==='jeonse'?'전세':'매매가'}
        </div>
        <div style="font-size:17px;font-weight:800;color:var(--gold);margin-bottom:3px">
          ${info.avg}
        </div>
        <div style="font-size:11px;color:var(--on-navy)">
          범위: ${info.range}
        </div>
      </div>

      <!-- 태그 -->
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${d.tags.map(t => `
          <span style="font-size:11px;background:rgba(196,164,90,.08);
            border:1px solid rgba(196,164,90,.2);color:rgba(255,255,255,.7);
            padding:3px 8px;border-radius:2px">${t}</span>`).join('')}
      </div>
    </div>`;
  }

  return { render, setType };
})();
