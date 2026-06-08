/**
 * app.js — 부동산사주 SPA 컨트롤러
 */

/* ── 상태 ── */
let S = { saju:null, isLunar:false, isLeap:false, tab:'overview' };

/* ── 라우터 ── */
function go(screen, opts={}) {
  document.getElementById('app').innerHTML = '';
  const el = {
    welcome: renderWelcome,
    input:   renderInput,
    result:  renderResult,
    region:  renderRegion,
  }[screen]?.();
  if (el) document.getElementById('app').appendChild(el);
  window.scrollTo(0,0);
}

/* ═══════════════════════════════
   WELCOME
═══════════════════════════════ */
function renderWelcome() {
  const d = div('');
  d.innerHTML = `
<div class="welcome-wrap fade-in">
  <div class="welcome-logo">🏠</div>
  <h1 class="welcome-title">부동산사주</h1>
  <p class="welcome-sub">사주팔자로 알아보는<br>나만의 부동산 운세 &amp; 타이밍</p>
  <ul class="feature-list">
    <li class="feature-item"><div class="feature-icon">📅</div>매수·매도 최적 시기 분석</li>
    <li class="feature-item"><div class="feature-icon">🏘️</div>지역·단지 오행 궁합</li>
    <li class="feature-item"><div class="feature-icon">📦</div>임대·임차·이사 날짜 추천</li>
    <li class="feature-item"><div class="feature-icon">⭐</div>오행으로 보는 나의 투자 성향</li>
  </ul>
  <button class="btn-primary" onclick="go('input')">사주 분석 시작하기 →</button>
  <p class="disclaimer">본 서비스는 오락·참고용이며 투자 결정의 근거로 삼지 마세요.</p>
</div>`;
  return d;
}

/* ═══════════════════════════════
   INPUT
═══════════════════════════════ */
function renderInput() {
  const d = div('');
  d.innerHTML = `
<div class="app-bar">
  <button class="back-btn" onclick="go('welcome')">←</button>
  <span class="app-bar-title">생년월일 입력</span>
</div>
<div class="content fade-in">
  <div class="card">
    <div class="section-title">📆 생년월일</div>
    <div class="form-group">
      <label class="form-label">양력 / 음력</label>
      <div class="toggle-group">
        <button class="toggle-btn active" id="tbSolar" onclick="toggleCal('solar')">양력</button>
        <button class="toggle-btn"        id="tbLunar" onclick="toggleCal('lunar')">음력</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">태어난 해</label>
      <input class="form-input" type="number" id="bYear" placeholder="예: 1990" min="1930" max="2005">
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-group" style="flex:1">
        <label class="form-label">월</label>
        <select class="form-input" id="bMonth">
          <option value="">월</option>
          ${range(1,12).map(i=>`<option value="${i}">${i}월</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">일</label>
        <select class="form-input" id="bDay">
          <option value="">일</option>
          ${range(1,31).map(i=>`<option value="${i}">${i}일</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="leapWrap" style="display:none">
      <div class="form-group">
        <label class="form-label">윤달 여부</label>
        <div class="toggle-group">
          <button class="toggle-btn active" id="tbNorm" onclick="toggleLeap(false)">평달</button>
          <button class="toggle-btn"        id="tbLeap" onclick="toggleLeap(true)">윤달</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">🕐 태어난 시간 <span style="font-weight:400;font-size:12px;">(선택)</span></div>
    <div class="form-group">
      <select class="form-input" id="bHour">
        <option value="">모름 (사주 3기둥으로 계산)</option>
        <option value="23">자시(子時) 23:00–01:00</option>
        <option value="1"> 축시(丑時) 01:00–03:00</option>
        <option value="3"> 인시(寅時) 03:00–05:00</option>
        <option value="5"> 묘시(卯時) 05:00–07:00</option>
        <option value="7"> 진시(辰時) 07:00–09:00</option>
        <option value="9"> 사시(巳時) 09:00–11:00</option>
        <option value="11">오시(午時) 11:00–13:00</option>
        <option value="13">미시(未時) 13:00–15:00</option>
        <option value="15">신시(申時) 15:00–17:00</option>
        <option value="17">유시(酉時) 17:00–19:00</option>
        <option value="19">술시(戌時) 19:00–21:00</option>
        <option value="21">해시(亥時) 21:00–23:00</option>
      </select>
    </div>
    <p class="info-text">⚡ 시간 정보가 있으면 더 정확한 분석이 가능합니다.</p>
  </div>

  <button class="btn-primary" onclick="doCalc()">🔮 사주 분석하기</button>
  <div class="error-msg" id="errMsg"></div>
</div>`;
  return d;
}

function toggleCal(type) {
  S.isLunar = type==='lunar';
  cls('tbSolar','active', !S.isLunar);
  cls('tbLunar','active',  S.isLunar);
  document.getElementById('leapWrap').style.display = S.isLunar?'block':'none';
}
function toggleLeap(v) {
  S.isLeap = v;
  cls('tbNorm','active',!v); cls('tbLeap','active',v);
}

function doCalc() {
  const year  = parseInt(g('bYear').value);
  const month = parseInt(g('bMonth').value);
  const day   = parseInt(g('bDay').value);
  const hv    = g('bHour').value;
  const hour  = hv!=='' ? parseInt(hv) : null;
  const err   = g('errMsg');

  if (!year||!month||!day)         { err.textContent='생년월일을 모두 입력해주세요.'; return; }
  if (year<1930||year>2005)        { err.textContent='1930~2005년 사이를 입력해주세요.'; return; }
  err.textContent='';

  let cy=year, cm=month, cd=day;
  if (S.isLunar) {
    const sol = LunarCalendar.lunarToSolar(year,month,day,S.isLeap);
    if (!sol) { err.textContent='음력 변환 실패. 양력으로 다시 시도해주세요.'; return; }
    cy=sol.year; cm=sol.month; cd=sol.day;
  }

  S.saju = Saju.calculateSaju(cy,cm,cd,hour);
  S.saju.inputLabel = `${year}년 ${month}월 ${day}일 (${S.isLunar?'음력':'양력'})`;
  S.tab = 'overview';
  go('result');
}

/* ═══════════════════════════════
   RESULT
═══════════════════════════════ */
function renderResult() {
  if (!S.saju) { go('input'); return div(''); }
  const saju    = S.saju;
  const fortune = Saju.realEstateFortune(saju, new Date().getFullYear());
  const moving  = Saju.movingInfo(saju);
  const pers    = Saju.PERSONALITY[saju.dmEl];
  const eClass  = Saju.EL_CLASS[saju.dmEl];

  const d = div('');
  d.innerHTML = `
<div class="app-bar">
  <button class="back-btn" onclick="go('input')">←</button>
  <span class="app-bar-title">부동산 운세 결과</span>
</div>
<div class="content">
  <!-- 성향 배너 -->
  <div class="personality-banner fade-in">
    <div class="personality-icon">${pers.icon}</div>
    <div>
      <div class="personality-title">${pers.title}</div>
      <div class="personality-desc">${pers.desc}</div>
    </div>
  </div>

  <!-- 사주팔자 -->
  <div class="card fade-in">
    <div class="section-title">⛩️ 사주팔자 — ${saju.inputLabel}</div>
    <div class="pillars-row">
      ${pillarCard('년주', saju.yp)}
      ${pillarCard('월주', saju.mp)}
      ${pillarCard('일주', saju.dp, true)}
      ${saju.hp ? pillarCard('시주', saju.hp) : '<div class="pillar-card pillar-no">시주<br>미입력</div>'}
    </div>
    <div class="divider"></div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px">
      <span style="font-size:13px;color:var(--on-muted)">일간:</span>
      <span class="chip chip-${eClass}" style="font-size:13px">
        ${saju.dayMaster}(${hanja(saju.dayMaster,'stem')}) · ${Saju.EL_NAME[saju.dmEl]}
      </span>
      <span class="chip" style="background:rgba(212,175,55,.12);color:var(--gold);border:1px solid rgba(212,175,55,.25);font-size:12px">
        ${saju.yp.animal}띠
      </span>
    </div>
    <p class="info-text">
      길방 ${Saju.EL_DIR[saju.dmEl]} &nbsp;·&nbsp;
      행운 숫자 ${Saju.EL_NUM[saju.dmEl]} &nbsp;·&nbsp;
      행운 색상 ${Saju.EL_COLOR[saju.dmEl]}
    </p>
  </div>

  <!-- 탭 -->
  <div class="tabs">
    <button class="tab ${S.tab==='overview'?'active':''}" onclick="switchTab('overview')">개요</button>
    <button class="tab ${S.tab==='buysell'?'active':''}" onclick="switchTab('buysell')">매수·매도</button>
    <button class="tab ${S.tab==='rent'?'active':''}"    onclick="switchTab('rent')">임대·임차</button>
    <button class="tab ${S.tab==='moving'?'active':''}"  onclick="switchTab('moving')">이사날짜</button>
  </div>

  <div id="tabBody">${tabContent(saju, fortune, moving)}</div>

  <button class="btn-outline" onclick="go('region')">📍 지역 궁합 분석하기</button>
</div>`;
  return d;
}

function switchTab(t) {
  S.tab = t;
  if (!S.saju) return;
  const fortune = Saju.realEstateFortune(S.saju, new Date().getFullYear());
  const moving  = Saju.movingInfo(S.saju);
  document.getElementById('tabBody').innerHTML = tabContent(S.saju, fortune, moving);
  // 탭 버튼 상태 갱신
  document.querySelectorAll('.tab').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === {
      overview:'개요', buysell:'매수·매도', rent:'임대·임차', moving:'이사날짜'
    }[t]);
  });
}

function tabContent(saju, fortune, moving) {
  switch(S.tab) {
    case 'overview': return tabOverview(saju, fortune);
    case 'buysell':  return tabBuySell(saju, fortune);
    case 'rent':     return tabRent(saju, fortune);
    case 'moving':   return tabMoving(saju, moving);
    default: return '';
  }
}

/* ─── 개요 탭 ─── */
function tabOverview(saju, fortune) {
  const yr = new Date().getFullYear();
  return `
<div class="card fade-in">
  <div class="section-title">📊 ${yr}년 부동산 운세 (세운: ${Saju.EL_NAME[fortune.yearEl]} 해)</div>
  ${scoreRow('🏠 매수 운',  fortune.buyScore)}
  ${scoreRow('💰 매도 운',  fortune.sellScore)}
  ${scoreRow('📋 임대 운',  fortune.rentOutScore)}
  ${scoreRow('🔑 임차 운',  fortune.rentInScore)}
</div>

<div class="card fade-in">
  <div class="section-title">🔮 오행 분포</div>
  ${Object.entries(saju.els).map(([el,val])=>{
    const pct = Math.round(val/4.5*100);
    const color = {목:'#4CAF50',화:'#FF5722',토:'#FF9800',금:'#9E9E9E',수:'#2196F3'}[el];
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span class="chip chip-${Saju.EL_CLASS[el]}" style="font-size:11px;padding:3px 10px">${Saju.EL_NAME[el]}</span>
        <span style="font-size:12px;color:var(--on-muted)">${pct}%</span>
      </div>
      <div class="score-bar"><div class="score-fill" style="width:${pct}%;background:${color}"></div></div>
    </div>`;
  }).join('')}
</div>`;
}

/* ─── 매수·매도 탭 ─── */
const BUY_ADVICE = {
  목:'동향·북향 단지, 신도시·택지지구, 재개발 구역에 강합니다.',
  화:'남향 역세권, 상업시설 인접, 거래 활발한 단지에 유리합니다.',
  토:'학군 우수, 직주근접, 중심가 안정 단지가 최적입니다.',
  금:'서향, 상업용 부동산, 경매 낙찰 물건이 유리합니다.',
  수:'강변·수변 지역, 대학가·역세권 소형 임대 물건에 강합니다.'
};
function tabBuySell(saju, fortune) {
  const buyM  = Saju.bestMonths(saju.dmEl,'buy');
  const sellM = Saju.bestMonths(saju.dmEl,'sell');
  const days  = Saju.GOOD_DAYS[saju.dmEl];
  return `
<div class="card fade-in">
  <div class="section-title">🏠 매수 최적 시기</div>
  <div class="big-score" style="color:${scoreColor(fortune.buyScore)}">${fortune.buyScore}</div>
  <div class="score-label">올해 매수 지수 / 100</div>
  <div class="score-bar" style="height:10px;margin:12px 0">
    <div class="score-fill" style="width:${fortune.buyScore}%;background:${scoreColor(fortune.buyScore)}"></div>
  </div>
  <div class="section-title" style="margin-top:4px">📅 매수에 좋은 달</div>
  <div>${buyM.map(m=>`<span class="date-chip">✨ ${m}</span>`).join('')}</div>
  <div class="divider"></div>
  <p style="font-size:13px;color:rgba(255,255,255,.75);line-height:1.65">${BUY_ADVICE[saju.dmEl]}</p>
</div>

<div class="card fade-in">
  <div class="section-title">💰 매도 최적 시기</div>
  <div class="big-score" style="color:${scoreColor(fortune.sellScore)}">${fortune.sellScore}</div>
  <div class="score-label">올해 매도 지수 / 100</div>
  <div class="score-bar" style="height:10px;margin:12px 0">
    <div class="score-fill" style="width:${fortune.sellScore}%;background:${scoreColor(fortune.sellScore)}"></div>
  </div>
  <div class="section-title" style="margin-top:4px">📅 매도에 좋은 달</div>
  <div>${sellM.map(m=>`<span class="date-chip">✨ ${m}</span>`).join('')}</div>
</div>

<div class="card fade-in">
  <div class="section-title">📅 계약·잔금에 좋은 요일</div>
  <div>${days.map(d=>`<span class="date-chip">📌 ${d}</span>`).join('')}</div>
  <p class="info-text" style="margin-top:10px">계약서 작성일, 잔금일, 등기 접수일을 이 요일에 맞추면 길합니다.</p>
</div>`;
}

/* ─── 임대·임차 탭 ─── */
const RENT_OUT_ADVICE = {
  목:'전세보다 보증부 월세가 유리합니다. 임대료 상승 시기를 놓치지 마세요.',
  화:'전세 계약이 좋습니다. 임대료 상승 타이밍을 잘 포착하세요.',
  토:'장기 안정 임대가 최적. 믿을 수 있는 세입자를 들이는 것이 중요합니다.',
  금:'상업용·오피스텔 임대가 주거용보다 유리합니다.',
  수:'원룸·소형 다가구 임대로 현금흐름을 극대화하세요.'
};
const RENT_IN_ADVICE = {
  목:'동향, 채광 좋고 베란다 있는 집이 길합니다.',
  화:'남향, 밝고 에너지 넘치는 커뮤니티 시설 좋은 단지가 좋습니다.',
  토:'중간 층, 안정적 구조, 학교 인근이 좋습니다.',
  금:'서향·서남향, 깔끔하고 수납 넉넉한 집이 좋습니다.',
  수:'북향도 무방, 교통 편리한 역세권 또는 수변 근처가 길합니다.'
};
function tabRent(saju, fortune) {
  const rentM = Saju.bestMonths(saju.dmEl,'rent');
  return `
<div class="card fade-in">
  <div class="section-title">📋 임대(내놓기) 운</div>
  <div class="big-score" style="color:${scoreColor(fortune.rentOutScore)}">${fortune.rentOutScore}</div>
  <div class="score-label">올해 임대 지수 / 100</div>
  <div class="score-bar" style="height:10px;margin:12px 0">
    <div class="score-fill" style="width:${fortune.rentOutScore}%;background:${scoreColor(fortune.rentOutScore)}"></div>
  </div>
  <p style="font-size:13px;color:rgba(255,255,255,.75);line-height:1.65;margin-bottom:12px">${RENT_OUT_ADVICE[saju.dmEl]}</p>
  <div class="section-title">📅 임대 계약에 좋은 달</div>
  <div>${rentM.map(m=>`<span class="date-chip">✨ ${m}</span>`).join('')}</div>
</div>

<div class="card fade-in">
  <div class="section-title">🔑 임차(들어가기) 운</div>
  <div class="big-score" style="color:${scoreColor(fortune.rentInScore)}">${fortune.rentInScore}</div>
  <div class="score-label">올해 임차 지수 / 100</div>
  <div class="score-bar" style="height:10px;margin:12px 0">
    <div class="score-fill" style="width:${fortune.rentInScore}%;background:${scoreColor(fortune.rentInScore)}"></div>
  </div>
  <p style="font-size:13px;color:rgba(255,255,255,.75);line-height:1.65">${RENT_IN_ADVICE[saju.dmEl]}</p>
</div>`;
}

/* ─── 이사날짜 탭 ─── */
const MOVE_TIME_ADVICE = {
  목:'이른 아침(인시·묘시) 이사가 좋습니다. 동쪽 방향으로 이사하면 길합니다.',
  화:'낮 시간대(사시·오시) 이사가 길합니다. 남쪽 이사에 유리합니다.',
  토:'오전~오후(진시·미시) 이사가 안정적입니다. 현 거주지 인근 이사가 좋습니다.',
  금:'오후(신시·유시) 이사가 좋습니다. 서쪽 방향이 길합니다.',
  수:'저녁(술시·해시) 또는 이른 아침 이사가 좋습니다. 북쪽 이사가 유리합니다.'
};
function tabMoving(saju, moving) {
  return `
<div class="card fade-in">
  <div class="section-title">📦 손없는날 (음력 기준)</div>
  <div>${moving.goodDays.map(d=>`<span class="date-chip">✅ ${d}</span>`).join('')}</div>
  <p class="info-text" style="margin-top:10px">음력 9·10·19·20·29·30일은 귀신(손)이 없는 날로 이사에 최적입니다.</p>
</div>

<div class="card fade-in">
  <div class="section-title">🌟 이사에 좋은 달 (오행 기준)</div>
  <div>${moving.goodMonths.map(m=>`<span class="date-chip">${m}</span>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title">⚠️ 피해야 할 달</div>
  <div>${moving.badMonths.map(m=>`<span class="bad-chip">❌ ${m}</span>`).join('')}</div>
</div>

<div class="card fade-in">
  <div class="section-title">⏰ 이사 시간 조언</div>
  <p style="font-size:14px;line-height:1.7;color:rgba(255,255,255,.8)">${MOVE_TIME_ADVICE[saju.dmEl]}</p>
  <div class="divider"></div>
  <p class="info-text">💡 새집 입실 시 현관에 서서 길방(${Saju.EL_DIR[saju.dmEl]})을 바라보며 새 시작을 다짐하면 좋습니다.</p>
</div>`;
}

/* ═══════════════════════════════
   REGION
═══════════════════════════════ */
function renderRegion() {
  if (!S.saju) { go('input'); return div(''); }
  const d = div('');
  d.innerHTML = `
<div class="app-bar">
  <button class="back-btn" onclick="go('result')">←</button>
  <span class="app-bar-title">지역 궁합 분석</span>
</div>
<div class="content fade-in">
  <div class="card">
    <div class="section-title">📍 지역·단지명 입력</div>
    <div class="form-group">
      <input class="form-input" type="text" id="regionInput"
        placeholder="예: 강남구, 마포구, 래미안퍼스티지..." maxlength="20">
    </div>
    <button class="btn-primary" onclick="doRegion()">🔮 궁합 분석</button>
  </div>

  <div id="regionResult"></div>

  <div class="card">
    <div class="section-title">💡 나의 길방 방향</div>
    <p style="font-size:14px;color:rgba(255,255,255,.8);line-height:1.65">
      일간 <strong style="color:var(--gold)">${S.saju.dayMaster}(${hanja(S.saju.dayMaster,'stem')})</strong>의
      길방은 <strong style="color:var(--gold)">${Saju.EL_DIR[S.saju.dmEl]}</strong>입니다.<br>
      현재 거주지 기준 ${Saju.EL_DIR[S.saju.dmEl].split('(')[0]} 방향 지역이 오행 상 유리합니다.
    </p>
  </div>
</div>`;
  // 엔터키 지원
  setTimeout(()=>{
    const inp = document.getElementById('regionInput');
    if (inp) inp.addEventListener('keydown', e=>{ if(e.key==='Enter') doRegion(); });
  },0);
  return d;
}

function doRegion() {
  const name = (document.getElementById('regionInput')?.value||'').trim();
  if (!name) { document.getElementById('regionInput')?.focus(); return; }
  const r   = Saju.regionCompat(S.saju, name);
  const col = scoreColor(r.score);
  document.getElementById('regionResult').innerHTML = `
<div class="card fade-in">
  <div class="section-title">📊 "${name}" 궁합 결과</div>
  <div class="compat-score" style="color:${col}">${r.score}</div>
  <div class="compat-label" style="color:${col}">${r.grade}</div>
  <div class="compat-sub">지역 오행: ${Saju.EL_NAME[r.rEl]}</div>
  <div class="score-bar" style="height:12px;margin-bottom:16px">
    <div class="score-fill" style="width:${r.score}%;background:linear-gradient(90deg,${col},${col}99)"></div>
  </div>
  <p style="font-size:14px;line-height:1.7;color:rgba(255,255,255,.82)">${r.advice}</p>
</div>`;
}

/* ═══════════════════════════════
   HELPERS
═══════════════════════════════ */
function div(cls_) { const d=document.createElement('div'); if(cls_) d.className=cls_; return d; }
function g(id)     { return document.getElementById(id); }
function range(a,b){ return Array.from({length:b-a+1},(_,i)=>a+i); }
function cls(id,c,on){ document.getElementById(id)?.classList.toggle(c,on); }

function pillarCard(label, p, highlight=false) {
  const ec = Saju.EL_CLASS[p.sEl];
  const hl = highlight ? 'border:1px solid rgba(124,92,191,.5);background:rgba(124,92,191,.12)' : '';
  return `<div class="pillar-card" style="${hl}">
    <div class="pillar-label">${label}</div>
    <div class="pillar-stem chip-${ec}" style="background:rgba(0,0,0,.2);padding:4px 8px;border-radius:8px;display:inline-block;margin-bottom:4px">${p.stem}(${p.sH})</div>
    <div class="pillar-branch">${p.branch}(${p.bH})</div>
  </div>`;
}

function scoreRow(label, score) {
  const stars = '⭐'.repeat(score>=85?5:score>=70?4:score>=55?3:2);
  const col   = scoreColor(score);
  return `<div class="score-row">
    <span class="score-row-label">${label}</span>
    <div class="score-row-right">
      <span class="score-stars" style="font-size:12px">${stars}</span>
      <span class="score-num" style="color:${col}">${score}</span>
    </div>
  </div>`;
}

function scoreColor(s) {
  return s>=80?'#D4AF37':s>=65?'#64B5F6':s>=50?'#81C784':'#FF8A65';
}

const HANJA_S = {갑:'甲',을:'乙',병:'丙',정:'丁',무:'戊',기:'己',경:'庚',신:'辛',임:'壬',계:'癸'};
function hanja(ch, type) { return HANJA_S[ch] || ch; }

/* ── 시작 ── */
go('welcome');
