/**
 * saju.js — 사주팔자 계산 & 부동산 운세 엔진
 */

/* ── 기본 데이터 ── */
const STEMS   = ['갑','을','병','정','무','기','경','신','임','계'];
const BRANCHES= ['자','축','인','묘','진','사','오','미','신','유','술','해'];
const S_HANJA = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const B_HANJA = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ANIMALS = ['쥐','소','범','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];

// 천간 오행 (갑을=목, 병정=화, 무기=토, 경신=금, 임계=수)
const S_ELEM  = ['목','목','화','화','토','토','금','금','수','수'];
// 지지 오행
const B_ELEM  = ['수','토','목','목','토','화','화','토','금','금','토','수'];

const EL_NAME = { 목:'木(목)', 화:'火(화)', 토:'土(토)', 금:'金(금)', 수:'水(수)' };
const EL_CLASS= { 목:'wood', 화:'fire', 토:'earth', 금:'metal', 수:'water' };
const EL_DIR  = { 목:'동쪽(東)', 화:'남쪽(南)', 토:'중앙(中)', 금:'서쪽(西)', 수:'북쪽(北)' };
const EL_COLOR= { 목:'청색·녹색', 화:'적색·주황색', 토:'황색·갈색', 금:'백색·은색', 수:'흑색·청색' };
const EL_NUM  = { 목:'3, 8', 화:'2, 7', 토:'5, 0', 금:'4, 9', 수:'1, 6' };

/* ── 년주 ── */
function yearPillar(year) {
  let i = ((year - 4) % 60 + 60) % 60;
  const si = i % 10, bi = i % 12;
  return { stem:STEMS[si], branch:BRANCHES[bi], sH:S_HANJA[si], bH:B_HANJA[bi],
           animal:ANIMALS[bi], sEl:S_ELEM[si], bEl:B_ELEM[bi] };
}

/* ── 월주 ── */
// 인월(寅月)=음력 1월≈양력 2월 기준
// 갑/기년=병인, 을/경년=무인, 병/신년=경인, 정/임년=임인, 무/계년=갑인
const MONTH_BASE_STEM = [2,4,6,8,0]; // 갑기=병(2), 을경=무(4), 병신=경(6), 정임=임(8), 무계=갑(0)
// 양력 월 → 월지 인덱스 (소한/대한 기준 간략화: 1월=축, 2월=인, ...)
const MONTH_BRANCH_IDX = [1,2,3,4,5,6,7,8,9,10,11,0]; // Jan-Dec

function monthPillar(year, month) {
  const ysi   = STEMS.indexOf(yearPillar(year).stem);
  const base  = MONTH_BASE_STEM[ysi % 5];
  // 인월(2월)부터 한 달씩 증가
  const mOff  = (month - 2 + 12) % 12;
  const si    = (base + mOff) % 10;
  const bi    = MONTH_BRANCH_IDX[month - 1];
  return { stem:STEMS[si], branch:BRANCHES[bi], sH:S_HANJA[si], bH:B_HANJA[bi],
           sEl:S_ELEM[si], bEl:B_ELEM[bi] };
}

/* ── 일주 ── */
function dayPillar(year, month, day) {
  // Julian Day Number
  const a = Math.floor((14-month)/12);
  const y = year + 4800 - a, m = month + 12*a - 3;
  const jdn = day + Math.floor((153*m+2)/5) + 365*y
              + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  // 갑자일 기준 JDN=2299160 → 실제 기준: 1900-01-01 = JDN 2415021 (甲戌일 → 기준보정)
  const REF = 2415021; // 1900-01-01 JDN → 실제: 간지 cycle anchor
  const diff= ((jdn - REF) % 60 + 60) % 60;
  const si  = diff % 10, bi = diff % 12;
  return { stem:STEMS[si], branch:BRANCHES[bi], sH:S_HANJA[si], bH:B_HANJA[bi],
           sEl:S_ELEM[si], bEl:B_ELEM[bi] };
}

/* ── 시주 ── */
// 甲/己일=갑자시, 乙/庚일=병자시, 丙/辛일=무자시, 丁/壬일=경자시, 戊/癸일=임자시
const HOUR_BASE_STEM = [0,2,4,6,8];
function hourPillar(dp, hour) {
  if (hour === null || hour === undefined) return null;
  let bi;
  if (hour >= 23 || hour < 1) bi = 0;          // 자시
  else                          bi = Math.ceil((hour - 1) / 2) % 12;
  const dsi = STEMS.indexOf(dp.stem);
  const base = HOUR_BASE_STEM[dsi % 5];
  const si   = (base + bi) % 10;
  return { stem:STEMS[si], branch:BRANCHES[bi], sH:S_HANJA[si], bH:B_HANJA[bi],
           sEl:S_ELEM[si], bEl:B_ELEM[bi] };
}

/* ── 사주 통합 계산 ── */
function calculateSaju(year, month, day, hour) {
  const yp = yearPillar(year);
  const mp = monthPillar(year, month);
  const dp = dayPillar(year, month, day);
  const hp = hour !== null ? hourPillar(dp, hour) : null;

  // 오행 분포 (일간 가중치 ×2)
  const els = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  const pillars = [yp, mp, dp];
  if (hp) pillars.push(hp);
  pillars.forEach(p => { els[p.sEl]++; els[p.bEl] += .5; });
  els[dp.sEl]++; // 일간 추가 가중

  const sorted    = Object.entries(els).sort((a,b)=>b[1]-a[1]);
  const dominant  = sorted[0][0];
  const weakest   = sorted[sorted.length-1][0];

  return { yp, mp, dp, hp, els, dominant, weakest,
           dayMaster: dp.stem, dmEl: dp.sEl,
           birthYear: year, birthMonth: month, birthDay: day };
}

/* ── 오행 상생/상극 ── */
const GENERATES = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };
const CONTROLS  = { 목:'토', 화:'금', 토:'수', 금:'목', 수:'화' };

/* ── 부동산 운세 점수 ── */
function realEstateFortune(saju, targetYear) {
  const { dmEl, els } = saju;
  const yEl = S_ELEM[((targetYear - 4) % 10 + 10) % 10];

  let buy=68, sell=68, rentOut=68, rentIn=68;

  // 올해 세운과 일간 관계
  if (yEl === dmEl)                    buy  += 18;
  if (GENERATES[yEl] === dmEl)         buy  += 22;
  if (CONTROLS[yEl]  === dmEl)        { buy  -= 14; sell += 10; }
  if (GENERATES[dmEl] === yEl)        { sell += 16; buy  -= 8; }
  if (CONTROLS[dmEl]  === yEl)         sell += 18;

  // 오행 특성별 보정
  if (['목','수'].includes(dmEl)) { buy += 10; rentIn  += 10; }
  if (['금','토'].includes(dmEl)) { sell+= 10; rentOut += 14; }
  if (dmEl === '화')              { buy +=  5; sell    +=  5; }

  // 오행 편중 보정
  const maxV = Math.max(...Object.values(els));
  if (maxV > 3) { buy -= 5; sell += 8; }

  const clamp = v => Math.min(99, Math.max(38, v));
  return { buyScore: clamp(buy), sellScore: clamp(sell),
           rentOutScore: clamp(rentOut), rentInScore: clamp(rentIn),
           yearEl: yEl };
}

/* ── 길월 ── */
const GOOD_MONTHS = {
  목: { buy:[2,3,4],   sell:[8,9,10],   rent:[11,12,1] },
  화: { buy:[5,6,7],   sell:[10,11,12], rent:[2,3,4]   },
  토: { buy:[3,6,9,12],sell:[1,4,7,10], rent:[2,5,8,11]},
  금: { buy:[8,9,10],  sell:[2,3,4],    rent:[5,6,7]   },
  수: { buy:[11,12,1], sell:[5,6,7],    rent:[8,9,10]  }
};
const MONTH_LABEL=['','1월(寅)','2월(卯)','3월(辰)','4월(巳)','5월(午)','6월(未)',
                   '7월(申)','8월(酉)','9월(戌)','10월(亥)','11월(子)','12월(丑)'];
function bestMonths(dmEl, action) {
  return (GOOD_MONTHS[dmEl]?.[action] || [3,6,9,12]).map(m => MONTH_LABEL[m]);
}

const GOOD_DAYS = {
  목:['목요일','월요일'], 화:['화요일','일요일'],
  토:['토요일','수요일'], 금:['금요일','수요일'], 수:['수요일','목요일']
};

/* ── 이사 날짜 ── */
const BAD_MOVE_MONTHS = {
  목:['7월','8월'], 화:['10월','11월'], 토:['1월','7월'],
  금:['4월','5월'], 수:['6월','7월']
};
function movingInfo(saju) {
  const el = saju.dmEl;
  return {
    goodMonths: bestMonths(el,'buy'),
    badMonths:  BAD_MOVE_MONTHS[el] || ['7월','8월'],
    goodDays:   ['9일','10일','19일','20일','29일','30일(손없는날)'],
  };
}

/* ── 지역 궁합 ── */
function regionCompat(saju, name) {
  const { dmEl } = saju;

  // 지역명으로 오행 추정
  let rEl;
  if (/강남|강동|동대문|성동|중랑/.test(name))  rEl='목';
  else if (/마포|서대문|은평|강서|구로/.test(name)) rEl='금';
  else if (/노원|도봉|강북|성북|동작/.test(name)) rEl='수';
  else if (/중구|종로|동|성/.test(name))           rEl='토';
  else if (/용산|송파|관악|금천/.test(name))        rEl='화';
  else { const c=['목','화','토','금','수']; rEl=c[name.charCodeAt(0)%5]; }

  let score=62;
  if (GENERATES[rEl] === dmEl) score+=26;      // 지역→나 상생
  else if (rEl === dmEl)       score+=20;      // 동질
  else if (GENERATES[dmEl]===rEl) score+=12;   // 나→지역 상생
  else if (CONTROLS[rEl]===dmEl)  score-=20;  // 지역이 나 극
  else if (CONTROLS[dmEl]===rEl)  score-=10;  // 내가 지역 극

  score += Math.floor((saju.els[rEl]||0) * 4);
  score  = Math.min(99, Math.max(22, score));

  const grade = score>=80?'대길(大吉)':score>=65?'길(吉)':score>=50?'보통':'흉(凶)';
  return { score, rEl, grade, advice: buildAdvice(score,rEl,dmEl) };
}

function buildAdvice(score, rEl, dmEl) {
  const rN=EL_NAME[rEl], dN=EL_NAME[dmEl];
  if (score>=80) return `이 지역은 ${rN}의 기운이 강하여 ${dN} 일간인 귀하와 상생합니다. 장기 투자 시 높은 발전을 기대할 수 있습니다.`;
  if (score>=65) return `${rN}과 ${dN}의 오행 궁합이 좋습니다. 안정적인 자산 가치 상승을 기대해볼 만합니다.`;
  if (score>=50) return `평범한 궁합입니다. 지역 세부 특성을 꼼꼼히 살피고 신중히 결정하세요.`;
  return `${rN}의 기운이 ${dN} 일간과 상극 관계입니다. 단기 거래 위주로 접근하고 장기 보유는 신중히 하세요.`;
}

/* ── 성향 ── */
const PERSONALITY = {
  목:{ icon:'🌱', title:'성장형 투자자', desc:'장기적 시각으로 자산을 키우는 스타일. 재개발·택지지구·성장 가능 지역에 강합니다.' },
  화:{ icon:'🔥', title:'거래형 투자자', desc:'빠른 의사결정과 거래 감각이 뛰어남. 단기 시세차익·경매 물건에 유리합니다.' },
  토:{ icon:'🏔️', title:'안정형 투자자', desc:'실용적·안전지향. 학군 우수·직주근접 실거주 겸 임대 물건이 최적입니다.' },
  금:{ icon:'💎', title:'수익형 투자자', desc:'수익 분석에 강하고 꼼꼼함. 상업용·오피스텔 임대수익에 탁월합니다.' },
  수:{ icon:'💧', title:'현금흐름형 투자자', desc:'월세·임대 수익을 중시. 대학가·역세권 원룸·다가구 물건에 강합니다.' }
};

window.Saju = {
  calculateSaju, realEstateFortune, movingInfo, regionCompat, bestMonths,
  GOOD_DAYS, EL_NAME, EL_CLASS, EL_DIR, EL_COLOR, EL_NUM, PERSONALITY
};
