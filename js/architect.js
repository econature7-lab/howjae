/**
 * architect.js — 건축진단 탭 (건물 매입 전 20항목 체크리스트)
 */

const ARCH_CHECKLIST = [
  { id:1,  label:'용도지역 확인',      desc:'1종/2종/준주거/상업지역 여부 건축물대장 대조' },
  { id:2,  label:'건폐율·용적률',      desc:'법정 상한 대비 현행 비율 확인' },
  { id:3,  label:'불법증축 여부',      desc:'건축물대장 면적 ≠ 실측 면적 여부' },
  { id:4,  label:'석면조사 필요성',    desc:'1992년 이전 건물 석면 함유 여부' },
  { id:5,  label:'지하수위 확인',      desc:'지하층 침수 이력 및 지하수 레벨' },
  { id:6,  label:'외벽 균열',          desc:'구조 균열(헤어라인 vs 관통균열) 판별' },
  { id:7,  label:'전기 용량',          desc:'입주 업종 대비 전기 용량 충족 여부' },
  { id:8,  label:'배수설비 상태',      desc:'오수·우수 분리, 역류 방지 여부' },
  { id:9,  label:'누수 흔적',          desc:'천장·벽면 얼룩, 곰팡이 흔적' },
  { id:10, label:'지붕 방수',          desc:'옥상 방수층 교체 이력 및 현 상태' },
  { id:11, label:'승강기 유무',        desc:'법정 설치 기준 충족 여부(7층 이상)' },
  { id:12, label:'주차 법정 충족',     desc:'연면적 대비 법정 주차 대수 확인' },
  { id:13, label:'일조권 사선 제한',   desc:'북측 대지 경계선 사선 제한 저촉 여부' },
  { id:14, label:'도로폭 확인',        desc:'접도 조건(4m 이상), 맹지 여부' },
  { id:15, label:'건축물대장 일치',    desc:'실제 구조·용도와 대장 기재 내용 일치 여부' },
  { id:16, label:'소방시설 점검',      desc:'스프링클러·소화기·비상구 적정 여부' },
  { id:17, label:'내진설계 여부',      desc:'2005년 이후 3층+ 건물 내진 기준 충족' },
  { id:18, label:'에너지 효율 등급',   desc:'에너지 성능 인증 여부' },
  { id:19, label:'인허가 이력',        desc:'증·개축·용도변경 허가 이력 조회' },
  { id:20, label:'건축주 동일 여부',   desc:'등기부 소유자 = 현 임대인 여부 확인' }
];

const ARCH_STORAGE_KEY = 'arch_checklist';

function loadArchChecked() {
  try {
    return JSON.parse(localStorage.getItem(ARCH_STORAGE_KEY) || '[]');
  } catch(e) { return []; }
}

function toggleArchItem(id) {
  let checked = loadArchChecked();
  if (checked.includes(id)) {
    checked = checked.filter(x => x !== id);
  } else {
    checked.push(id);
  }
  localStorage.setItem(ARCH_STORAGE_KEY, JSON.stringify(checked));
  // 진행도 업데이트
  const count = checked.length;
  const progressEl = document.getElementById('arch-progress');
  if (progressEl) progressEl.textContent = `${count} / ${ARCH_CHECKLIST.length} 확인 완료`;
  const barEl = document.getElementById('arch-bar');
  if (barEl) barEl.style.width = `${Math.round(count / ARCH_CHECKLIST.length * 100)}%`;
  // 체크박스 시각 업데이트
  const cb = document.getElementById(`arch-cb-${id}`);
  const row = document.getElementById(`arch-row-${id}`);
  if (cb) cb.checked = checked.includes(id);
  if (row) row.classList.toggle('arch-item-done', checked.includes(id));
}

function renderArchitectSection() {
  const checked = loadArchChecked();
  const count = checked.length;
  const pct = Math.round(count / ARCH_CHECKLIST.length * 100);

  const items = ARCH_CHECKLIST.map(item => {
    const isDone = checked.includes(item.id);
    return `
    <div class="arch-item ${isDone ? 'arch-item-done' : ''}" id="arch-row-${item.id}"
      onclick="toggleArchItem(${item.id})">
      <input type="checkbox" class="arch-checkbox" id="arch-cb-${item.id}"
        ${isDone ? 'checked' : ''} onclick="event.stopPropagation();toggleArchItem(${item.id})">
      <div class="arch-item-text">
        <div class="arch-item-label">${item.id}. ${item.label}</div>
        <div class="arch-item-desc">${item.desc}</div>
      </div>
    </div>`;
  }).join('');

  return `
  <div style="background:var(--bg);min-height:100%;padding-bottom:80px">
    <div style="padding:0 16px">
      <div class="page-header">
        <div class="page-header-title">건축 진단</div>
        <div class="page-header-sub">건물 매입 전 필수 20항목 체크리스트</div>
      </div>

      <!-- 진행도 -->
      <div class="arch-progress-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--on-surface)">확인 진행도</span>
          <span id="arch-progress" style="font-size:13px;color:var(--gold);font-weight:700">
            ${count} / ${ARCH_CHECKLIST.length} 확인 완료
          </span>
        </div>
        <div class="arch-bar-bg">
          <div id="arch-bar" class="arch-bar-fill" style="width:${pct}%"></div>
        </div>
        <div style="font-size:11px;color:var(--on-muted);margin-top:6px">
          항목을 탭하여 확인 완료 처리하세요
        </div>
      </div>

      <!-- 체크리스트 -->
      <div class="arch-list">
        ${items}
      </div>

      <!-- 건축사 상담 CTA -->
      <a href="https://open.kakao.com/o/hawujae" target="_blank" class="arch-cta-btn">
        🏗️ 건축사 무료 상담 신청하기
      </a>
      <div style="text-align:center;font-size:12px;color:var(--on-muted);margin-top:10px;padding-bottom:8px">
        카카오 오픈카톡으로 연결됩니다
      </div>
    </div>
  </div>`;
}

window.renderArchitectSection = renderArchitectSection;
window.toggleArchItem = toggleArchItem;
