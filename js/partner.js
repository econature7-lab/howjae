/**
 * partner.js — 파트너사 탭 (인테리어·리모델링 회원사)
 * 승인된 register_pool 항목(interior/reno)을 실시간으로 표시
 */
window.PartnerView = (function() {

  function render() {
    const wrap = document.getElementById('screen-wrap');
    if (!wrap) return;
    wrap.innerHTML = renderShell();
    wrap.scrollTop = 0;
    setTimeout(_loadPartners, 0); // 비동기 로딩
  }

  function renderShell() {
    return `
    <div style="padding:0 16px;min-height:100%;background:var(--bg);padding-bottom:70px">
      <div class="page-header">
        <div class="page-header-title">파트너사</div>
        <div class="page-header-sub">인테리어 · 리모델링 회원사</div>
      </div>

      <!-- 파트너사 목록 (비동기 채움) -->
      <div id="partner-list">
        <div style="text-align:center;padding:40px;color:var(--on-muted)">
          <div style="font-size:24px;margin-bottom:8px">⏳</div>불러오는 중...
        </div>
      </div>

      <!-- 견적 요청 안내 -->
      <div class="card" style="margin-top:8px;margin-bottom:12px">
        <div class="section-title" style="margin-bottom:12px">견적 요청 방법</div>
        <div style="font-size:13px;color:var(--on-muted);line-height:2.4">
          <div><span style="color:var(--gold);font-weight:700;margin-right:8px">1.</span>파트너사 카드에서 견적 문의 클릭</div>
          <div><span style="color:var(--gold);font-weight:700;margin-right:8px">2.</span>카카오 상담으로 공간 사진·조건 전달</div>
          <div><span style="color:var(--gold);font-weight:700;margin-right:8px">3.</span>하우재 중개로 복수 업체 견적 비교</div>
        </div>
      </div>

      <!-- 파트너사 등록 모집 -->
      <div style="background:linear-gradient(135deg,var(--navy),var(--navy2));
        border:1px solid rgba(196,164,90,.35);border-left:3px solid var(--gold);
        border-radius:4px;padding:18px;margin-bottom:16px">
        <div style="font-weight:800;color:var(--gold);font-size:14px;margin-bottom:8px">
          🔨 파트너사 모집 중
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,.75);line-height:1.8;margin-bottom:12px">
          홍대·마포 지역 <b style="color:white">인테리어·리모델링 업체</b>를 모집합니다.<br>
          하우재를 통해 고객 견적 요청을 받아보세요.
        </div>
        <button onclick="App.goTab('register')"
          style="background:var(--gold);color:#1A2340;border:none;border-radius:3px;
          padding:11px;font-size:13px;font-weight:700;cursor:pointer;width:100%;font-family:inherit">
          파트너사 등록 신청 →
        </button>
      </div>
    </div>`;
  }

  async function _loadPartners() {
    const listEl = document.getElementById('partner-list');
    if (!listEl) return;
    try {
      const all = await DB.getRegisterPool(null, 'approved');
      const partners = (all || []).filter(p => p.role === 'interior' || p.role === 'reno');
      if (!partners.length) {
        listEl.innerHTML = _renderEmpty();
        return;
      }
      listEl.innerHTML = `
        <div class="section-title" style="margin-bottom:12px">등록 파트너사 (${partners.length})</div>
        ${partners.map(_renderCard).join('')}`;
    } catch(e) {
      listEl.innerHTML = _renderEmpty();
    }
  }

  function _renderCard(p) {
    const roleLabel = p.role === 'interior' ? '인테리어' : '리모델링';
    return `
    <div class="card" style="margin-bottom:12px;border-left:3px solid var(--gold)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-weight:700;font-size:15px;color:white;margin-bottom:4px">${p.name}</div>
          <span style="font-size:11px;background:rgba(196,164,90,.15);color:var(--gold);
            padding:3px 8px;border-radius:2px;font-weight:600">${roleLabel}</span>
        </div>
        <span style="font-size:18px">${p.role === 'interior' ? '🎨' : '🔨'}</span>
      </div>
      ${p.spec ? `<div style="font-size:12px;color:var(--on-muted);margin-bottom:8px;line-height:1.7">🔧 ${p.spec}</div>` : ''}
      ${p.desc ? `<div style="font-size:12px;color:rgba(255,255,255,.7);margin-bottom:12px;line-height:1.7">${p.desc}</div>` : ''}
      <a href="https://open.kakao.com/o/hawujae" target="_blank"
        style="display:block;text-align:center;padding:10px;
        background:rgba(196,164,90,.1);border:1px solid rgba(196,164,90,.3);
        border-radius:3px;font-size:12px;color:var(--gold);text-decoration:none;font-weight:600">
        💬 견적 문의하기
      </a>
    </div>`;
  }

  function _renderEmpty() {
    return `
    <div class="section-title" style="margin-bottom:12px">등록 파트너사</div>
    <div style="text-align:center;padding:40px 20px;color:var(--on-muted);
      background:var(--navy2);border-radius:4px;border:1px solid var(--border);margin-bottom:16px">
      <div style="font-size:40px;margin-bottom:12px">🔨</div>
      <div style="font-size:14px;font-weight:700;color:white;margin-bottom:8px">파트너사 준비 중</div>
      <div style="font-size:12px;line-height:1.8">
        인테리어·리모델링 파트너십을 준비 중입니다.<br>
        아래 버튼으로 등록을 신청해보세요.
      </div>
    </div>`;
  }

  return { render };
})();
