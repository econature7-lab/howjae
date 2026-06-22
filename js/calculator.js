/**
 * calculator.js — 부동산 계산기
 * 전월세 전환 / 수익률 / 대출 이자 3종 + 외부 링크
 */
window.CalcView = (function () {
  let activeCalc = 'convert';

  /* ── 메인 렌더 ── */
  function render() {
    return `
    <div style="background:var(--bg);min-height:100%;padding-bottom:80px">
      <div style="padding:0 16px">
        <div class="page-header">
          <div class="page-header-title">계산기</div>
          <div class="page-header-sub">전월세 전환 · 수익률 · 대출</div>
        </div>
      </div>

      <!-- 계산기 탭 -->
      <div class="calc-tab-bar">
        <button class="calc-tab-btn ${activeCalc==='convert'?'active':''}" data-key="convert"
          onclick="CalcView.switchCalc('convert')">⇄ 전월세</button>
        <button class="calc-tab-btn ${activeCalc==='yield'?'active':''}" data-key="yield"
          onclick="CalcView.switchCalc('yield')">% 수익률</button>
        <button class="calc-tab-btn ${activeCalc==='loan'?'active':''}" data-key="loan"
          onclick="CalcView.switchCalc('loan')">₩ 대출</button>
      </div>

      <div id="calc-body" style="padding:16px">
        ${getCalcBody()}
      </div>

      <!-- 공공 데이터 바로가기 (공통) -->
      ${renderLinks()}
    </div>`;
  }

  function getCalcBody() {
    if (activeCalc === 'convert') return renderConvert();
    if (activeCalc === 'yield')   return renderYield();
    if (activeCalc === 'loan')    return renderLoan();
    return '';
  }

  /* ── 공공 데이터 링크 ── */
  function renderLinks() {
    const links = [
      { icon:'🏛️', label:'법원 경매정보',   sub:'낙찰가·입찰 일정 조회', url:'https://www.courtauction.go.kr' },
      { icon:'🏠', label:'국토부 실거래가', sub:'아파트·상가·토지 실거래',  url:'https://rt.molit.go.kr' },
      { icon:'📑', label:'인터넷 등기소',   sub:'등기부등본 열람·발급',     url:'https://www.iros.go.kr' },
      { icon:'🏢', label:'건축물대장',      sub:'위반건축물·용도 확인',     url:'https://www.gov.kr/portal/main' },
    ];
    return `
    <div style="padding:0 16px 16px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);
        letter-spacing:.5px;margin-bottom:10px;opacity:.8">🔗 공공 데이터 바로가기</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${links.map(l => `
          <a href="${l.url}" target="_blank"
            style="background:var(--navy2);border:1px solid rgba(196,164,90,.2);
            border-radius:4px;padding:12px;text-decoration:none;
            display:flex;flex-direction:column;gap:3px">
            <div style="font-size:18px">${l.icon}</div>
            <div style="font-size:12px;font-weight:700;color:var(--gold)">${l.label}</div>
            <div style="font-size:10px;color:var(--on-muted);line-height:1.4">${l.sub}</div>
          </a>`).join('')}
      </div>
    </div>`;
  }

  /* ── 전월세 전환 계산기 ── */
  function renderConvert() {
    return `
    <div class="calc-card fade-in">
      <!-- 설명 배너 -->
      <div style="background:rgba(196,164,90,.08);border-left:3px solid var(--gold);
        border-radius:0 4px 4px 0;padding:10px 12px;margin-bottom:16px;font-size:12px;
        color:var(--on-muted);line-height:1.7">
        <b style="color:var(--gold)">전세 ↔ 월세 환산 계산기</b><br>
        전세금을 월세로, 혹은 월세를 전세금으로 바꿀 때 사용해요.<br>
        임대인·임차인 조건 협상 시 활용합니다.
      </div>

      <div class="calc-mode-row">
        <button class="calc-mode-btn active" id="cm-ts" onclick="CalcView.setConvertMode('toMonthly')">전세 → 월세</button>
        <button class="calc-mode-btn" id="cm-tj" onclick="CalcView.setConvertMode('toJeonse')">월세 → 전세</button>
      </div>

      <div id="convert-inputs">
        ${renderConvertToMonthly()}
      </div>
    </div>

    <div class="calc-result-card" id="convert-result" style="display:none"></div>

    <div class="calc-card" style="margin-top:0">
      <div class="calc-card-title" style="font-size:10px;margin-bottom:8px">📌 전환율 기준</div>
      <div class="calc-info-row"><span>한국은행 기준금리</span><span>3.50%</span></div>
      <div class="calc-info-row"><span>일반 전환율 (법정)</span><span>연 10% 이내</span></div>
      <div class="calc-info-row"><span>서울 평균 전환율</span><span>약 5.0~6.0%</span></div>
    </div>`;
  }

  function renderConvertToMonthly() {
    return `
    <div class="form-group">
      <label class="form-label">전세 보증금 (만원)</label>
      <input class="form-input" type="number" id="cv-jeonse" placeholder="예: 20000" oninput="CalcView.calcConvert()">
    </div>
    <div class="form-group">
      <label class="form-label">월세 보증금 (만원)</label>
      <input class="form-input" type="number" id="cv-deposit" placeholder="예: 1000" oninput="CalcView.calcConvert()">
    </div>
    <div class="form-group">
      <label class="form-label">전환율 (%)</label>
      <input class="form-input" type="number" id="cv-rate" placeholder="예: 5.5" step="0.1" value="5.5" oninput="CalcView.calcConvert()">
    </div>`;
  }

  function renderConvertToJeonse() {
    return `
    <div class="form-group">
      <label class="form-label">월세 보증금 (만원)</label>
      <input class="form-input" type="number" id="cv-deposit2" placeholder="예: 1000" oninput="CalcView.calcConvert2()">
    </div>
    <div class="form-group">
      <label class="form-label">월세 (만원/월)</label>
      <input class="form-input" type="number" id="cv-monthly" placeholder="예: 60" oninput="CalcView.calcConvert2()">
    </div>
    <div class="form-group">
      <label class="form-label">전환율 (%)</label>
      <input class="form-input" type="number" id="cv-rate2" placeholder="예: 5.5" step="0.1" value="5.5" oninput="CalcView.calcConvert2()">
    </div>`;
  }

  /* ── 수익률 계산기 ── */
  function renderYield() {
    return `
    <div class="calc-card fade-in">
      <!-- 설명 배너 -->
      <div style="background:rgba(196,164,90,.08);border-left:3px solid var(--gold);
        border-radius:0 4px 4px 0;padding:10px 12px;margin-bottom:16px;font-size:12px;
        color:var(--on-muted);line-height:1.7">
        <b style="color:var(--gold)">건물·상가 투자 수익률 분석기</b><br>
        매매가 대비 연간 임대 수익이 몇 %인지 계산해요.<br>
        대출 이자·관리비 차감 후 <b style="color:rgba(255,255,255,.8)">순수익률</b>까지 보여줍니다.
      </div>

      <div class="form-group">
        <label class="form-label">매매가 (만원)</label>
        <input class="form-input" type="number" id="yd-price" placeholder="예: 300000" oninput="CalcView.calcYield()">
      </div>
      <div class="form-group">
        <label class="form-label">연 임대 수입 (만원/년)</label>
        <input class="form-input" type="number" id="yd-income" placeholder="예: 14400 (월 120 × 12)" oninput="CalcView.calcYield()">
      </div>
      <div class="form-group">
        <label class="form-label">연 유지비용 (만원/년)</label>
        <input class="form-input" type="number" id="yd-cost" placeholder="예: 1200 (재산세·보험 등)" oninput="CalcView.calcYield()">
      </div>
      <div class="form-group">
        <label class="form-label">대출금액 (만원, 없으면 0)</label>
        <input class="form-input" type="number" id="yd-loan" placeholder="예: 150000" value="0" oninput="CalcView.calcYield()">
      </div>
      <div class="form-group">
        <label class="form-label">대출 금리 (%)</label>
        <input class="form-input" type="number" id="yd-rate" placeholder="예: 4.5" step="0.1" value="4.5" oninput="CalcView.calcYield()">
      </div>
    </div>
    <div class="calc-result-card" id="yield-result" style="display:none"></div>`;
  }

  /* ── 대출 계산기 ── */
  function renderLoan() {
    return `
    <div class="calc-card fade-in">
      <!-- 설명 배너 -->
      <div style="background:rgba(196,164,90,.08);border-left:3px solid var(--gold);
        border-radius:0 4px 4px 0;padding:10px 12px;margin-bottom:16px;font-size:12px;
        color:var(--on-muted);line-height:1.7">
        <b style="color:var(--gold)">대출 원리금 균등상환 계산기</b><br>
        매달 동일 금액을 상환하는 일반 주담대 기준이에요.<br>
        금리·기간 바꿔가며 <b style="color:rgba(255,255,255,.8)">총 이자 차이</b>를 비교해보세요.
      </div>

      <div class="form-group">
        <label class="form-label">대출 금액 (만원)</label>
        <input class="form-input" type="number" id="ln-amount" placeholder="예: 30000" oninput="CalcView.calcLoan()">
      </div>

      <!-- 금리 + 실시간 월 납입금 나란히 -->
      <div class="form-group">
        <label class="form-label">연 이자율 (%)</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:stretch">
          <input class="form-input" type="number" id="ln-rate"
            placeholder="예: 4.5" step="0.1" value="4.5"
            style="margin:0" oninput="CalcView.calcLoan()">
          <div id="ln-live" style="background:var(--navy);border-radius:4px;
            padding:10px 12px;display:flex;flex-direction:column;justify-content:center;
            border:1px solid rgba(196,164,90,.25)">
            <div style="font-size:10px;color:var(--on-muted);margin-bottom:3px">월 납입금</div>
            <div id="ln-live-val" style="font-size:15px;font-weight:800;color:var(--gold)">—</div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">대출 기간 (년)</label>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${[10,15,20,30].map(y=>`<button class="calc-period-btn" data-year="${y}" onclick="CalcView.setPeriod(${y})">${y}년</button>`).join('')}
        </div>
        <input class="form-input" type="number" id="ln-years"
          placeholder="예: 30" value="30" style="margin-top:8px" oninput="CalcView.calcLoan()">
      </div>
    </div>
    <div class="calc-result-card" id="loan-result" style="display:none"></div>

    <div class="calc-card" style="margin-top:0">
      <div class="calc-card-title" style="font-size:10px;margin-bottom:8px">📌 DSR 한도 참고</div>
      <div class="calc-info-row"><span>총부채원리금상환비율</span><span>40% 이내</span></div>
      <div class="calc-info-row"><span>연소득 5천만 기준</span><span>월 167만 한도</span></div>
    </div>`;
  }

  /* ── 계산 로직 ── */

  // 전세→월세
  function calcConvert() {
    const jeonse  = parseFloat(document.getElementById('cv-jeonse')?.value) || 0;
    const deposit = parseFloat(document.getElementById('cv-deposit')?.value) || 0;
    const rate    = parseFloat(document.getElementById('cv-rate')?.value) || 5.5;
    if (!jeonse || !rate) return;
    const monthly = ((jeonse - deposit) * rate / 100) / 12;
    showResult('convert-result', [
      { label:'월세 (환산)', value: `${fmt(monthly)}만원 / 월`, big: true },
      { label:'보증금', value: `${fmt(deposit)}만원` },
      { label:'월세 환산 연 총액', value: `${fmt(monthly * 12)}만원` },
      { label:'적용 전환율', value: `${rate}%` }
    ]);
  }

  // 월세→전세
  function calcConvert2() {
    const deposit = parseFloat(document.getElementById('cv-deposit2')?.value) || 0;
    const monthly = parseFloat(document.getElementById('cv-monthly')?.value) || 0;
    const rate    = parseFloat(document.getElementById('cv-rate2')?.value) || 5.5;
    if (!monthly || !rate) return;
    const jeonse = deposit + (monthly * 12 / rate * 100);
    showResult('convert-result', [
      { label:'전세 환산가', value: `${fmt(jeonse)}만원`, big: true },
      { label:'현재 월세 보증금', value: `${fmt(deposit)}만원` },
      { label:'월세 연 총액', value: `${fmt(monthly * 12)}만원` },
      { label:'적용 전환율', value: `${rate}%` }
    ]);
  }

  // 수익률
  function calcYield() {
    const price   = parseFloat(document.getElementById('yd-price')?.value) || 0;
    const income  = parseFloat(document.getElementById('yd-income')?.value) || 0;
    const cost    = parseFloat(document.getElementById('yd-cost')?.value) || 0;
    const loan    = parseFloat(document.getElementById('yd-loan')?.value) || 0;
    const rate    = parseFloat(document.getElementById('yd-rate')?.value) || 4.5;
    if (!price || !income) return;

    const loanInterest  = loan * rate / 100;
    const netIncome     = income - cost - loanInterest;
    const investment    = price - loan;
    const grossYield    = (income / price * 100).toFixed(2);
    const netYield      = investment > 0 ? (netIncome / investment * 100).toFixed(2) : 0;

    const grade = netYield >= 6 ? '우수' : netYield >= 4 ? '양호' : netYield >= 2 ? '보통' : '주의';
    const gradeColor = netYield >= 6 ? '#C4A45A' : netYield >= 4 ? '#2E7D32' : netYield >= 2 ? '#1565C0' : '#C62828';

    showResult('yield-result', [
      { label:`순수익률 (${grade})`, value:`${netYield}%`, big:true, color:gradeColor },
      { label:'총수익률 (gross)', value:`${grossYield}%` },
      { label:'연 순수입', value:`${fmt(netIncome)}만원` },
      { label:'대출 이자 (연)', value:`${fmt(loanInterest)}만원` },
      { label:'실 투자금', value:`${fmt(investment)}만원` }
    ]);
  }

  // 대출 원리금 균등상환
  function calcLoan() {
    const amount = parseFloat(document.getElementById('ln-amount')?.value) || 0;
    const rate   = parseFloat(document.getElementById('ln-rate')?.value) || 4.5;
    const years  = parseFloat(document.getElementById('ln-years')?.value) || 30;

    // 실시간 월 납입금 (금리 옆 박스)
    const liveEl = document.getElementById('ln-live-val');
    if (liveEl) {
      if (amount && rate && years) {
        const r  = rate / 100 / 12;
        const n  = years * 12;
        const m  = amount * 10000 * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
        liveEl.textContent = `${Math.round(m / 10000 * 10) / 10}만원`;
      } else {
        liveEl.textContent = '—';
      }
    }

    if (!amount || !rate || !years) return;

    const r  = rate / 100 / 12;
    const n  = years * 12;
    const monthly = amount * 10000 * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - amount * 10000;

    showResult('loan-result', [
      { label:'월 납입금', value:`${Math.round(monthly / 10000 * 10) / 10}만원`, big:true },
      { label:'총 납입금', value:`${fmt(totalPayment / 10000)}만원` },
      { label:'총 이자', value:`${fmt(totalInterest / 10000)}만원`, color:'#C62828' },
      { label:'이자 비율', value:`${((totalInterest / totalPayment) * 100).toFixed(1)}%` },
      { label:'상환 기간', value:`${years}년 (${n}회)` }
    ]);
  }

  /* ── UI 헬퍼 ── */
  function showResult(id, rows) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'block';
    el.innerHTML = `
    <div class="calc-result-title">계산 결과</div>
    ${rows.map(r => `
      <div class="calc-result-row ${r.big ? 'calc-result-big' : ''}">
        <span class="calc-result-label">${r.label}</span>
        <span class="calc-result-val" ${r.color ? `style="color:${r.color}"` : ''}>${r.value}</span>
      </div>`).join('')}`;
  }

  function fmt(v) {
    if (v >= 10000) return `${(v / 10000).toFixed(2)}억`;
    return Math.round(v).toLocaleString();
  }

  /* ── Public Actions ── */
  function switchCalc(type) {
    activeCalc = type;
    document.querySelectorAll('.calc-tab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.key === type));
    const body = document.getElementById('calc-body');
    if (body) body.innerHTML = getCalcBody();
  }

  let convertMode = 'toMonthly';
  function setConvertMode(mode) {
    convertMode = mode;
    document.getElementById('cm-ts')?.classList.toggle('active', mode === 'toMonthly');
    document.getElementById('cm-tj')?.classList.toggle('active', mode === 'toJeonse');
    const inp = document.getElementById('convert-inputs');
    if (inp) inp.innerHTML = mode === 'toMonthly' ? renderConvertToMonthly() : renderConvertToJeonse();
    const res = document.getElementById('convert-result');
    if (res) res.style.display = 'none';
  }

  function setPeriod(y) {
    const inp = document.getElementById('ln-years');
    if (inp) { inp.value = y; calcLoan(); }
    document.querySelectorAll('.calc-period-btn').forEach(b =>
      b.classList.toggle('active', parseInt(b.dataset.year) === y));
  }

  return { render, switchCalc, setConvertMode, calcConvert, calcConvert2, calcYield, calcLoan, setPeriod };
})();
