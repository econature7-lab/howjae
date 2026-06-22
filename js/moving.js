/**
 * moving.js — 이사날짜(손없는날) 뷰
 * 손없는날: 음력 9, 10, 19, 20일 (귀신이 없는 날, 이사에 좋음)
 * lunar.js의 solarToLunar() 함수 활용
 */

window.MovingView = (() => {
  let selYear  = new Date().getFullYear();
  let selMonth = new Date().getMonth() + 1;

  // 손없는날: 음력 날짜의 일(日) 끝자리가 9 또는 0
  function isSonObsDay(lunarDay) {
    return lunarDay % 10 === 9 || lunarDay % 10 === 0;
  }

  // 음력 날짜 조회 (lunar.js 의존) — 반환: { year, month, day }
  function getLunarDay(y, m, d) {
    try {
      const fn = (typeof solarToLunar === 'function')
        ? solarToLunar
        : (window.LunarCalendar && window.LunarCalendar.solarToLunar);
      if (fn) {
        const lun = fn(y, m, d);
        if (lun) return lun.day || 0;
      }
    } catch (e) {}
    return 0;
  }

  // 달력 렌더링
  function renderCalendar() {
    const wrap = document.getElementById('moving-calendar');
    if (!wrap) return;

    const firstDay    = new Date(selYear, selMonth - 1, 1).getDay();
    const daysInMonth = new Date(selYear, selMonth, 0).getDate();
    const dows = ['일', '월', '화', '수', '목', '금', '토'];

    let html = `<div class="mc-header">`;
    dows.forEach(d => { html += `<div class="mc-dow">${d}</div>`; });
    html += `</div><div class="mc-grid">`;

    // 앞 빈칸
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="mc-cell mc-empty"></div>`;
    }

    // 날짜 셀
    for (let d = 1; d <= daysInMonth; d++) {
      const lunarDay = getLunarDay(selYear, selMonth, d);
      const son      = lunarDay > 0 && isSonObsDay(lunarDay);
      const dateStr  = `${selYear}-${String(selMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

      html += `<div class="mc-cell${son ? ' mc-son' : ''}"${son ? ` onclick="MovingView.pickDay('${dateStr}')" role="button" tabindex="0"` : ''}>`;
      html += `<div class="mc-solar">${d}</div>`;
      if (lunarDay > 0) {
        html += `<div class="mc-lunar">${son ? '✨' : ''}${lunarDay}</div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    wrap.innerHTML = html;
  }

  // 날짜 선택 → 카카오 상담
  function pickDay(dateStr) {
    const msg = encodeURIComponent(`${dateStr} 날짜로 이사 계약 상담 요청드립니다.`);
    window.open(`https://open.kakao.com/o/hawujae?msg=${msg}`, '_blank');
  }

  // 연도 변경
  function setYear(y) {
    selYear = parseInt(y, 10);
    render();
  }

  // 월 변경
  function setMonth(m) {
    selMonth = parseInt(m, 10);
    render();
  }

  // 메인 렌더
  function render() {
    const wrap = document.getElementById('screen-wrap');
    if (!wrap) return;

    const curY = new Date().getFullYear();
    const years = [curY, curY + 1, curY + 2];

    const yearOpts  = years.map(y =>
      `<option value="${y}" ${y === selYear ? 'selected' : ''}>${y}년</option>`
    ).join('');

    const monthOpts = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      return `<option value="${m}" ${m === selMonth ? 'selected' : ''}>${m}월</option>`;
    }).join('');

    wrap.innerHTML = `
      <div class="moving-wrap">
        <div class="moving-hero">
          <div class="moving-title">📅 이사 좋은 날</div>
          <p class="moving-desc">손없는날(음력 9·10·19·20일)을 골드로 표시합니다<br>날짜를 탭하면 카카오 상담으로 연결됩니다</p>
        </div>

        <div class="moving-selector">
          <select id="sel-year"  onchange="MovingView.setYear(this.value)"  class="moving-select">${yearOpts}</select>
          <select id="sel-month" onchange="MovingView.setMonth(this.value)" class="moving-select">${monthOpts}</select>
        </div>

        <div class="moving-legend">
          <span class="legend-son">✨ 골드 = 손없는날 (탭하여 상담)</span>
        </div>

        <div id="moving-calendar" class="moving-calendar"></div>

        <div class="moving-cta">
          <a href="https://open.kakao.com/o/hawujae" target="_blank" class="moving-cta-btn">
            💬 이사 날짜 계약 상담하기
          </a>
        </div>

        <div class="moving-note">
          <p>* 손없는날: 음력 9·10·19·20일. 이사 전통에서 귀신이 없어 피해가 없다고 알려진 길일입니다.</p>
          <p>* 실제 계약은 중개사와 충분히 상의 후 진행하세요.</p>
        </div>
      </div>
    `;

    renderCalendar();
  }

  return { render, setYear, setMonth, pickDay };
})();
