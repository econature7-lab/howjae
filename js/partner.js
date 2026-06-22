/**
 * partner.js — 파트너사 탭 (인테리어·리모델링 회원사)
 */
window.PartnerView = (function() {

  function render() {
    const wrap = document.getElementById('screen-wrap');
    if (!wrap) return;
    wrap.innerHTML = renderScreen();
    wrap.scrollTop = 0;
  }

  function renderScreen() {
    return `
    <div style="padding:0 16px;min-height:100%;background:var(--bg);padding-bottom:70px">
      <div class="page-header">
        <div class="page-header-title">파트너사</div>
        <div class="page-header-sub">인테리어 · 리모델링 회원사</div>
      </div>

      <!-- 파트너사 모집 배너 -->
      <div style="background:linear-gradient(135deg,var(--navy),var(--navy2));
        border:1px solid rgba(196,164,90,.35);border-left:3px solid var(--gold);
        border-radius:4px;padding:18px;margin-bottom:20px">
        <div style="font-weight:800;color:var(--gold);font-size:15px;margin-bottom:8px">
          🔨 파트너사 모집 중
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,.75);line-height:1.8">
          홍대·마포 지역 <b style="color:white">인테리어·리모델링 업체</b>를 모집합니다.<br>
          하우재를 통해 고객 견적 요청을 받아보세요.
        </div>
        <button onclick="App.goTab('register')"
          style="margin-top:14px;background:var(--gold);color:#1A2340;
          border:none;border-radius:3px;padding:11px;font-size:13px;
          font-weight:700;cursor:pointer;width:100%;font-family:inherit">
          파트너사 등록 신청 →
        </button>
      </div>

      <!-- 견적 요청 안내 -->
      <div class="card" style="margin-bottom:20px">
        <div class="section-title" style="margin-bottom:12px">견적 요청 방법</div>
        <div style="font-size:13px;color:var(--on-muted);line-height:2.4">
          <div><span style="color:var(--gold);font-weight:700;margin-right:8px">1.</span>파트너사 카드에서 견적 요청 클릭</div>
          <div><span style="color:var(--gold);font-weight:700;margin-right:8px">2.</span>카카오 상담으로 공간 사진·조건 전달</div>
          <div><span style="color:var(--gold);font-weight:700;margin-right:8px">3.</span>하우재 중개로 복수 업체 견적 비교</div>
        </div>
      </div>

      <!-- 파트너사 목록 -->
      <div class="section-title" style="margin-bottom:12px">등록 파트너사</div>
      <div style="text-align:center;padding:48px 0;color:var(--on-muted);
        background:var(--navy2);border-radius:4px;border:1px solid var(--border)">
        <div style="font-size:48px;margin-bottom:14px">🔨</div>
        <div style="font-size:14px;font-weight:700;color:white;margin-bottom:8px">파트너사 준비 중</div>
        <div style="font-size:12px;line-height:1.8">
          인테리어·리모델링 파트너십을 준비 중입니다.<br>
          파트너사 등록 신청을 받고 있어요.
        </div>
        <button onclick="App.goTab('register')"
          style="margin-top:16px;background:transparent;border:1px solid rgba(196,164,90,.5);
          border-radius:3px;padding:9px 20px;font-size:12px;color:var(--gold);
          cursor:pointer;font-family:inherit">
          등록 신청하기
        </button>
      </div>
    </div>`;
  }

  return { render };
})();
