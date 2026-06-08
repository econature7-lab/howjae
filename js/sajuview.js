/**
 * sajuview.js — 사주 화면 렌더링 (app.js에서 분리)
 * S, renderScreen, scoreColor, pillarCard, scoreRowEl 는 app.js에서 전역으로 제공
 */

/* ── 사주 섹션 라우터 ── */
function renderSajuSection() {
  switch(S.sajuScreen) {
    case 'welcome': return renderSajuWelcome();
    case 'input':   return renderSajuInput();
    case 'result':  return renderSajuResult();
    case 'region':  return renderSajuRegion();
    default:        return renderSajuWelcome();
  }
}

/* ── 웰컴 화면 ── */
function renderSajuWelcome() {
  return `
  <div class="welcome-wrap fade-in" style="min-height:calc(100vh - 56px)">
    <div class="welcome-logo"><img src="assets/logo.png" style="width:90px;height:90px;object-fit:contain" alt="하우재"></div>
    <div class="welcome-brand">하우재 · HAWUJAE</div>
    <h1 class="welcome-title">부동산 사주</h1>
    <p class="welcome-sub">사주팔자로 분석하는<br>매수 · 매도 · 이사 최적 시기</p>
    <ul class="feature-list">
      <li class="feature-item"><div class="feature-icon">🏡</div>매수·매도·임대 운세 점수 분석</li>
      <li class="feature-item"><div class="feature-icon">📍</div>지역·매물 오행 궁합 분석</li>
      <li class="feature-item"><div class="feature-icon">📅</div>이사 길일 &amp; 길월 추천</li>
      <li class="feature-item"><div class="feature-icon">💎</div>나의 부동산 투자 성향 분석</li>
    </ul>
    <button class="btn-saju-start" onclick="S.sajuScreen='input';renderScreen()">
      🔮 사주 분석 시작하기
    </button>
    ${S.saju ? `
    <button class="btn-saju-prev" onclick="S.sajuScreen='result';renderScreen()">
      이전 결과 보기
    </button>` : ''}
    <p class="disclaimer">본 서비스는 동양 사주 이론 기반 참고용 분석입니다.<br>실제 부동산 거래는 전문가와 상담하세요.</p>
  </div>`;
}

/* ── 입력 화면 ── */
function renderSajuInput() {
  return `
  <div>
    <div class="app-bar">
      <button class="back-btn" onclick="S.sajuScreen='welcome';renderScreen()">←</button>
      <span class="app-bar-title">생년월일 입력</span>
    </div>
    <div class="content fade-in">
      <div class="card">
        <div class="form-group">
          <label class="form-label">양력 / 음력</label>
          <div class="toggle-group">
            <button class="toggle-btn ${!S.isLunar?'active':''}" onclick="S.isLunar=false;renderScreen()">양력</button>
            <button class="toggle-btn ${S.isLunar?'active':''}"  onclick="S.isLunar=true;renderScreen()">음력</button>
          </div>
        </div>
        ${S.isLunar ? `<div class="form-group">
          <label class="form-label">윤달 여부</label>
          <div class="toggle-group">
            <button class="toggle-btn ${!S.isLeap?'active':''}" onclick="S.isLeap=false;renderScreen()">평달</button>
            <button class="toggle-btn ${S.isLeap?'active':''}"  onclick="S.isLeap=true;renderScreen()">윤달</button>
          </div>
        </div>` : ''}
        <div class="form-group">
          <label class="form-label">태어난 해</label>
          <input class="form-input" type="number" id="bYear"
            placeholder="예: 1990" min="1930" max="2010"
            value="${S.saju?.birthYear||''}">
        </div>
        <div style="display:flex;gap:12px">
          <div class="form-group" style="flex:1">
            <label class="form-label">월</label>
            <select class="form-input" id="bMonth">
              <option value="">월</option>
              ${Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}월</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">일</label>
            <select class="form-input" id="bDay">
              <option value="">일</option>
              ${Array.from({length:31},(_,i)=>`<option value="${i+1}">${i+1}일</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">태어난 시 (선택)</label>
          <select class="form-input" id="bHour">
            <option value="">모름 (사주 3기둥)</option>
            <option value="23">자시(子時) 23–01시</option>
            <option value="1">축시(丑時) 01–03시</option>
            <option value="3">인시(寅時) 03–05시</option>
            <option value="5">묘시(卯時) 05–07시</option>
            <option value="7">진시(辰時) 07–09시</option>
            <option value="9">사시(巳時) 09–11시</option>
            <option value="11">오시(午時) 11–13시</option>
            <option value="13">미시(未時) 13–15시</option>
            <option value="15">신시(申時) 15–17시</option>
            <option value="17">유시(酉時) 17–19시</option>
            <option value="19">술시(戌時) 19–21시</option>
            <option value="21">해시(亥時) 21–23시</option>
          </select>
        </div>
      </div>
      <button class="btn-primary" onclick="doCalc()">🔮 사주 분석하기</button>
      <div class="error-msg" id="errMsg"></div>
    </div>
  </div>`;
}

/* ── 사주 계산 실행 ── */
function doCalc() {
  const year  = parseInt(document.getElementById('bYear')?.value);
  const month = parseInt(document.getElementById('bMonth')?.value);
  const day   = parseInt(document.getElementById('bDay')?.value);
  const hv    = document.getElementById('bHour')?.value;
  const hour  = (hv && hv !== '') ? parseInt(hv) : null;
  const err   = document.getElementById('errMsg');

  if (!year||!month||!day) { if(err) err.textContent='생년월일을 모두 입력해주세요.'; return; }
  if (year<1930||year>2010) { if(err) err.textContent='1930~2010년 사이를 입력해주세요.'; return; }
  if(err) err.textContent='';

  let cy=year, cm=month, cd=day;
  if (S.isLunar) {
    const sol = LunarCalendar.lunarToSolar(year, month, day, S.isLeap);
    if (!sol) { if(err) err.textContent='음력 변환 실패. 양력으로 입력해주세요.'; return; }
    cy=sol.year; cm=sol.month; cd=sol.day;
  }
  S.saju = Saju.calculateSaju(cy, cm, cd, hour);
  S.saju.birthYear=year; S.saju.birthMonth=month; S.saju.birthDay=day;
  S.saju.inputLabel = `${year}년 ${month}월 ${day}일 (${S.isLunar?'음력':'양력'})`;
  S.sajuScreen = 'result'; S.sajuTab = '개요';
  renderScreen();
}

/* ── 결과 화면 ── */
function renderSajuResult() {
  if (!S.saju) { S.sajuScreen='input'; renderScreen(); return ''; }
  const saju   = S.saju;
  const fortune= Saju.realEstateFortune(saju, new Date().getFullYear());
  const moving = Saju.movingInfo(saju);
  const pers   = Saju.PERSONALITY[saju.dmEl];
  const eClass = Saju.EL_CLASS[saju.dmEl];
  const tabs   = ['개요','매수·매도','임대·임차','이사날짜'];

  return `
  <div>
    <div class="app-bar">
      <button class="back-btn" onclick="S.sajuScreen='welcome';renderScreen()">←</button>
      <span class="app-bar-title">하우재 · 부동산 운세</span>
    </div>
    <div class="content">
      <div class="personality-banner fade-in">
        <div class="personality-icon" style="background:rgba(168,137,90,.18);width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:2px">${pers.icon}</div>
        <div><div class="personality-title">${pers.title}</div>
        <div class="personality-desc">${pers.desc}</div></div>
      </div>
      <div class="card fade-in">
        <div class="section-title">사주팔자 — ${saju.inputLabel}</div>
        <div class="pillars-row">
          ${pillarCard('년주',saju.yp)} ${pillarCard('월주',saju.mp)}
          ${pillarCard('일주',saju.dp,true)}
          ${saju.hp?pillarCard('시주',saju.hp):'<div class="pillar-card pillar-no">시주<br>미입력</div>'}
        </div>
        <div class="divider"></div>
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px">
          <span style="font-size:11px;color:var(--on-muted);letter-spacing:.5px;text-transform:uppercase">일간</span>
          <span class="chip chip-${eClass}">${saju.dayMaster} · ${Saju.EL_NAME[saju.dmEl]}</span>
          <span class="chip" style="background:rgba(168,137,90,.1);color:var(--gold);border:1px solid rgba(168,137,90,.28);font-size:10px">${saju.yp.animal}띠</span>
        </div>
        <p class="info-text">길방 ${Saju.EL_DIR[saju.dmEl]} · 행운 숫자 ${Saju.EL_NUM[saju.dmEl]} · 행운 색상 ${Saju.EL_COLOR[saju.dmEl]}</p>
      </div>
      <div class="tabs">
        ${tabs.map(t=>`<button class="tab ${S.sajuTab===t?'active':''}" onclick="S.sajuTab='${t}';refreshSajuTab()">${t}</button>`).join('')}
      </div>
      <div id="tabBody">${sajuTabContent(saju,fortune,moving)}</div>
      <button class="btn-outline" onclick="S.sajuScreen='region';S.regionName='홍대';renderScreen()">
        📍 지역 궁합 분석하기
      </button>

      <!-- 사주 맞춤 매물 추천 -->
      ${renderSajuPropertyRecs(saju)}
    </div>
  </div>`;
}

function refreshSajuTab() {
  if (!S.saju) return;
  const fortune = Saju.realEstateFortune(S.saju, new Date().getFullYear());
  const moving  = Saju.movingInfo(S.saju);
  document.getElementById('tabBody').innerHTML = sajuTabContent(S.saju,fortune,moving);
  document.querySelectorAll('.tab').forEach(b =>
    b.classList.toggle('active', b.textContent.trim() === S.sajuTab));
}

function sajuTabContent(saju, fortune, moving) {
  const yr = new Date().getFullYear();
  const EL_CSS = {목:'var(--wood)',화:'var(--fire)',토:'var(--earth)',금:'var(--metal)',수:'var(--water)'};
  switch(S.sajuTab) {
    case '개요': return `
      <div class="card fade-in">
        <div class="section-title">${yr}년 부동산 운세 · 세운: ${Saju.EL_NAME[fortune.yearEl]} 해</div>
        ${scoreRowEl('🏠 매수 운',fortune.buyScore)}${scoreRowEl('💰 매도 운',fortune.sellScore)}
        ${scoreRowEl('📋 임대 운',fortune.rentOutScore)}${scoreRowEl('🔑 임차 운',fortune.rentInScore)}
      </div>
      <div class="card fade-in">
        <div class="section-title">오행 분포</div>
        ${Object.entries(saju.els).map(([el,v])=>{
          const pct=Math.round(v/4.5*100);
          return `<div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span class="chip chip-${Saju.EL_CLASS[el]}" style="font-size:11px;padding:3px 10px">${Saju.EL_NAME[el]}</span>
              <span style="font-size:12px;color:var(--on-muted)">${pct}%</span>
            </div>
            <div class="score-bar"><div class="score-fill" style="width:${pct}%;background:${EL_CSS[el]}"></div></div>
          </div>`;}).join('')}
      </div>`;

    case '매수·매도': return `
      <div class="card fade-in">
        <div class="section-title">🏠 매수 운 (올해)</div>
        <div class="big-score" style="color:${scoreColor(fortune.buyScore)}">${fortune.buyScore}</div>
        <div class="score-label">매수 지수 / 100</div>
        <div class="score-bar" style="height:10px;margin:12px 0"><div class="score-fill" style="width:${fortune.buyScore}%;background:${scoreColor(fortune.buyScore)}"></div></div>
        <div class="section-title" style="margin-top:4px">📅 매수 길월</div>
        <div>${Saju.bestMonths(saju.dmEl,'buy').map(m=>`<span class="date-chip">✨ ${m}</span>`).join('')}</div>
      </div>
      <div class="card fade-in">
        <div class="section-title">💰 매도 운 (올해)</div>
        <div class="big-score" style="color:${scoreColor(fortune.sellScore)}">${fortune.sellScore}</div>
        <div class="score-label">매도 지수 / 100</div>
        <div class="score-bar" style="height:10px;margin:12px 0"><div class="score-fill" style="width:${fortune.sellScore}%;background:${scoreColor(fortune.sellScore)}"></div></div>
        <div class="section-title" style="margin-top:4px">📅 매도 길월</div>
        <div>${Saju.bestMonths(saju.dmEl,'sell').map(m=>`<span class="date-chip">✨ ${m}</span>`).join('')}</div>
      </div>`;

    case '임대·임차': return `
      <div class="card fade-in">
        <div class="section-title">📋 임대(내놓기) 운</div>
        <div class="big-score" style="color:${scoreColor(fortune.rentOutScore)}">${fortune.rentOutScore}</div>
        <div class="score-label">임대 지수 / 100</div>
        <div class="score-bar" style="height:10px;margin:12px 0"><div class="score-fill" style="width:${fortune.rentOutScore}%;background:${scoreColor(fortune.rentOutScore)}"></div></div>
        <div class="section-title" style="margin-top:4px">📅 임대 길월</div>
        <div>${Saju.bestMonths(saju.dmEl,'rent').map(m=>`<span class="date-chip">🔑 ${m}</span>`).join('')}</div>
      </div>
      <div class="card fade-in">
        <div class="section-title">🔑 임차(들어가기) 운</div>
        <div class="big-score" style="color:${scoreColor(fortune.rentInScore)}">${fortune.rentInScore}</div>
        <div class="score-label">임차 지수 / 100</div>
        <div class="score-bar" style="height:10px;margin:12px 0"><div class="score-fill" style="width:${fortune.rentInScore}%;background:${scoreColor(fortune.rentInScore)}"></div></div>
      </div>`;

    case '이사날짜': return `
      <div class="card fade-in">
        <div class="section-title">📦 손없는날 (음력 기준)</div>
        <div>${moving.goodDays.map(d=>`<span class="date-chip">✅ ${d}</span>`).join('')}</div>
        <p class="info-text" style="margin-top:10px">음력 9·10·19·20·29·30일은 이사 최적일입니다.</p>
      </div>
      <div class="card fade-in">
        <div class="section-title">🌟 이사 길월</div>
        <div>${moving.goodMonths.map(m=>`<span class="date-chip">${m}</span>`).join('')}</div>
        <div class="divider"></div>
        <div class="section-title">⚠️ 피해야 할 달</div>
        <div>${moving.badMonths.map(m=>`<span class="bad-chip">❌ ${m}</span>`).join('')}</div>
      </div>`;

    default: return '';
  }
}

/* ── 지역 궁합 화면 ── */
function renderSajuRegion() {
  if (!S.saju) { S.sajuScreen='input'; renderScreen(); return ''; }
  const name = S.regionName || '홍대';
  const r = Saju.regionCompat(S.saju, name);
  const col = scoreColor(r.score);
  return `
  <div>
    <div class="app-bar">
      <button class="back-btn" onclick="S.sajuScreen='result';S.sajuTab='매수·매도';renderScreen()">←</button>
      <span class="app-bar-title">지역 궁합 분석</span>
    </div>
    <div class="content fade-in">
      <div class="card">
        <div class="section-title">📍 지역·단지명 입력</div>
        <input class="form-input" type="text" id="regionInput"
          placeholder="예: 강남구, 마포구, 홍대..." maxlength="20" value="${name}">
        <button class="btn-primary" style="margin-top:10px" onclick="doRegion()">🔮 궁합 분석</button>
      </div>
      <div class="card">
        <div style="text-align:center;padding:10px 0">
          <div style="font-size:20px;font-weight:700;margin-bottom:12px">${name}</div>
          <div style="font-size:64px;font-weight:700;color:${col}">${r.score}</div>
          <div style="font-size:18px;font-weight:600;color:${col};margin-top:4px">${r.grade}</div>
          <div class="compat-sub">지역 오행: <span class="chip chip-${Saju.EL_CLASS[r.rEl]}">${Saju.EL_NAME[r.rEl]}</span></div>
          <div class="score-bar" style="height:10px;margin:12px auto;max-width:200px">
            <div class="score-fill" style="width:${r.score}%;background:${col}"></div>
          </div>
        </div>
        <div class="divider"></div>
        <p class="info-text" style="margin-top:8px">${r.advice}</p>
      </div>
    </div>
  </div>`;
}

/* ── 사주 맞춤 매물 추천 ── */
function renderSajuPropertyRecs(saju) {
  if (!saju || !window.AppData || !window.ListingView) return '';
  const top3 = [...AppData.properties]
    .map(p => ({ p, cs: ListingView.propCompat(p, saju) }))
    .sort((a, b) => (b.cs || 0) - (a.cs || 0))
    .slice(0, 3);

  const cards = top3.map(({ p, cs }) => {
    const cc = cs >= 80 ? '#C4A45A' : cs >= 65 ? '#2E7D32' : '#1565C0';
    const imgStyle = p.img
      ? `background:url('${p.img}') center/cover no-repeat;`
      : `background:linear-gradient(135deg,var(--navy2),var(--navy3));`;
    return `
    <div class="saju-rec-card" onclick="goTab('listings');setTimeout(()=>openListingDetail(${p.id}),100)">
      <div class="saju-rec-thumb" style="${imgStyle}">
        <div class="saju-rec-score" style="background:${cc}">${cs}</div>
      </div>
      <div class="saju-rec-info">
        <div class="saju-rec-type">${p.typeLabel} · ${p.shortAddr}</div>
        <div class="saju-rec-title">${p.title}</div>
        <div class="saju-rec-price">${AppData.dealLabel(p.deal)}</div>
      </div>
      <div style="font-size:18px;color:rgba(255,255,255,.25);align-self:center;flex-shrink:0">›</div>
    </div>`;
  }).join('');

  return `
  <div class="card" style="margin-top:12px;background:linear-gradient(135deg,var(--navy2),var(--navy));border:1px solid rgba(196,164,90,.2)">
    <div class="section-title" style="color:var(--gold)">⭐ 사주 맞춤 추천 매물 TOP 3</div>
    <p style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:14px;line-height:1.6">
      ${Saju.EL_NAME[saju.dmEl]} 일간과 궁합이 높은 매물 순서입니다
    </p>
    ${cards}
    <button class="btn-outline" style="margin-top:8px;border-color:rgba(196,164,90,.3);color:var(--gold)"
      onclick="goTab('listings')">전체 매물 보기 →</button>
  </div>`;
}

function doRegion() {
  const name = (document.getElementById('regionInput')?.value||'').trim();
  if (!name) return;
  S.regionName = name;
  renderScreen();
}
