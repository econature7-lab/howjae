/**
 * checklist.js — 체크리스트 통합 탭
 * 창업 / 계약 체크리스트
 */
window.ChecklistView = (function() {
  let activeTab = 'startup';

  function render() {
    const wrap = document.getElementById('screen-wrap');
    if (!wrap) return;
    wrap.innerHTML = renderScreen();
    wrap.scrollTop = 0;
  }

  function setTab(t) {
    activeTab = t;
    render();
  }

  function renderScreen() {
    const tabs = [
      { key:'startup',  icon:'🏪', label:'창업' },
      { key:'contract', icon:'📄', label:'계약' },
      { key:'pungsu',   icon:'🧭', label:'풍수지리' },
    ];
    return `
    <div style="padding:0;min-height:100%;background:var(--bg);padding-bottom:70px">
      <div style="padding:0 16px">
        <div class="page-header">
          <div class="page-header-title">체크리스트</div>
          <div class="page-header-sub">창업·계약·풍수지리 확인사항</div>
        </div>
      </div>

      <!-- 서브 탭 -->
      <div class="list-filter-bar" style="padding:0 16px;margin-bottom:0">
        ${tabs.map(t=>`
          <button class="list-filter-btn ${activeTab===t.key?'active':''}"
            onclick="ChecklistView.setTab('${t.key}')">
            ${t.icon} ${t.label}
          </button>`).join('')}
      </div>

      <div style="padding:16px 16px 0">
        ${activeTab==='startup'  ? renderStartup()  : ''}
        ${activeTab==='contract' ? renderContract() : ''}
        ${activeTab==='pungsu'   ? renderPungsu()   : ''}
      </div>

      <!-- 하단 바로가기 버튼 -->
      <div style="padding:8px 16px 0;display:flex;gap:10px">
        <button onclick="App.goTab('moving')"
          style="flex:1;background:var(--navy2);border:1px solid rgba(196,164,90,.3);
          border-radius:4px;padding:13px 8px;font-size:12px;color:var(--gold);
          cursor:pointer;font-family:inherit;font-weight:600">
          📅 이사날짜
        </button>
        <button onclick="App.goTab('calc')"
          style="flex:1;background:var(--navy2);border:1px solid rgba(196,164,90,.3);
          border-radius:4px;padding:13px 8px;font-size:12px;color:var(--gold);
          cursor:pointer;font-family:inherit;font-weight:600">
          🧮 수익률 계산기
        </button>
        <button onclick="App.goTab('market')"
          style="flex:1;background:var(--navy2);border:1px solid rgba(196,164,90,.3);
          border-radius:4px;padding:13px 8px;font-size:12px;color:var(--gold);
          cursor:pointer;font-family:inherit;font-weight:600">
          📊 동별 시세
        </button>
      </div>
    </div>`;
  }

  /* ── 창업 체크리스트 ── */
  function renderStartup() {
    const topBanner = `
      <div style="background:rgba(196,164,90,.08);border:1px solid rgba(196,164,90,.25);
        border-left:3px solid var(--gold);border-radius:4px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:var(--gold);margin-bottom:6px;letter-spacing:.5px">
          🏗️ 하우재만의 차별점
        </div>
        <div style="font-size:12px;color:var(--on-muted);line-height:1.8">
          전기용량·가스·구조·덕트 판단은 <b style="color:white">건축사만이 정확히 진단</b>할 수 있습니다.<br>
          하우재는 <b style="color:var(--gold)">건축사가 중개사와 함께 현장 동행</b>합니다.
        </div>
        <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
          <span style="font-size:10px;padding:3px 7px;border-radius:2px;background:var(--navy2);color:var(--gold)">🏠 중개사 지원</span>
          <span style="font-size:10px;padding:3px 7px;border-radius:2px;background:rgba(196,164,90,.2);color:#7A5500">🏗️ 건축사 지원</span>
          <span style="font-size:10px;padding:3px 7px;border-radius:2px;background:rgba(0,0,0,.1);color:var(--on-muted)">📋 직접확인</span>
        </div>
      </div>`;

    const sections = [
      { title:'상권 분석', items:[
        { text:'유동인구 시간대별 파악 (평일·주말·저녁)', who:'self' },
        { text:'주변 동종 업종 수·포화도 확인', who:'agent' },
        { text:'배후 주거 세대수 및 주요 고객층 파악', who:'agent' },
        { text:'인근 대형 브랜드 입점 예정 여부 (구청 문의)', who:'self' },
      ]},
      { title:'건물·공간 확인', items:[
        { text:'전용면적 vs 계약면적 (공용면적 비율)', who:'agent' },
        { text:'전기 용량 확인 (단상/3상, kW) — 주방·설비 핵심', who:'arch' },
        { text:'가스 인입 여부 확인', who:'arch' },
        { text:'환기·배기 덕트 설치 가능 여부', who:'arch' },
        { text:'누수·결로·균열 이력 확인', who:'arch' },
        { text:'내부 구조 변경 가능 여부 (내력벽 여부)', who:'arch' },
        { text:'간판 설치 허용 여부 및 크기 제한', who:'agent' },
        { text:'야간 영업 가능 여부 (주거지 소음 민원)', who:'self' },
      ]},
      { title:'권리금·계약 조건',
        note:'⚠️ 권리금은 법적 분쟁이 잦습니다. 모든 조건을 반드시 서면으로 확인하세요.',
        items:[
        { text:'권리금 적정성 (영업/시설/바닥 권리금 구분)', who:'agent' },
        { text:'임대인의 권리금 회수 방해 금지 의무 확인', who:'agent' },
        { text:'보증금·월세 대비 수익 시뮬레이션', who:'agent' },
        { text:'계약기간 및 갱신요구권(10년) 확인', who:'agent' },
        { text:'원상복구 범위 특약 확인', who:'agent' },
      ]},
      { title:'인허가·법적 확인', items:[
        { text:'업종별 영업신고·허가 대상 여부 (관할 구청 확인)', who:'self' },
        { text:'건축물 용도 (근린생활시설 여부) 확인', who:'arch' },
        { text:'소방 시설 기준 충족 여부', who:'arch' },
        { text:'위반건축물 표기 여부 (건축물대장 확인)', who:'arch' },
      ]},
    ];
    return topBanner + renderSections(sections) + consultCTA('창업 전 건축사 현장 상담이 필요하신가요?');
  }

  /* ── 계약 체크리스트 ── */
  function renderContract() {
    const sections = [
      { title:'등기부등본 확인', items:[
        '계약 당일 최신본 재발급 확인 (인터넷 등기소)',
        '갑구: 소유자 본인 여부·가압류·가처분·경매 여부',
        '을구: 근저당권 합계 (보증금 안전선 확인)',
        '신탁등기 여부 (수탁자 동의 필수)',
      ]},
      { title:'건축물대장 확인', items:[
        '건축물 용도와 실사용 용도 일치 여부',
        '위반건축물(불법증축) 표기 여부',
        '건축물 면적과 실제 면적 일치 여부',
      ]},
      { title:'계약서 특약 확인', items:[
        '계약금·중도금·잔금 일정 명시 여부',
        '수리·하자 범위 및 비용 부담 주체 명시',
        '중도해지 조건 명시',
        '관리비 항목 및 금액 확인',
        '원상복구 범위 구체적으로 기재',
      ]},
      { title:'임대인 신원 확인', items:[
        '임대인 신분증 확인 (법인은 법인등기부)',
        '임대인이 등기부상 소유자 본인인지 확인',
        '대리인 계약 시 위임장·인감증명서 확인',
      ]},
    ];
    return renderSections(sections) + consultCTA('계약서 검토 도움이 필요하신가요?');
  }

  /* ── 풍수지리 팁 ── */
  function renderPungsu() {
    const sections = [
      { title:'방향 (向)', items:[
        '남향·동남향 건물 — 채광 풍부, 기운 안정 (상업·주거 모두 선호)',
        '북향 건물 — 겨울 한기, 상업시설 불리 (가격 협상 여지)',
        '정동향·정서향 — 오전·오후만 햇빛. 입점 업종에 따라 유·불리 달라짐',
      ]},
      { title:'도로와의 관계 (路)', items:[
        '건물 정면이 대로·교차로를 향할수록 유동인구 유입 유리',
        'T자형 막힌 도로 끝 건물(막힌 기운) — 권리금 낮지만 유동인구 적음',
        '큰 도로 옆 이면도로 1~2번째 건물 — 임대료 대비 유동인구 효율 좋음',
        '일방통행 도로 방향 확인 — 주 고객 이동 방향과 일치 여부 체크',
      ]},
      { title:'지형과 배치 (形)', items:[
        '배산임수(背山臨水) — 뒤에 높은 건물·산, 앞에 열린 공간이 이상적',
        '건물 앞 공터·광장 있으면 유동인구 집객 유리',
        '경사지 건물 — 지하층 습기·침수 이력 반드시 확인',
        '정방형·직사각형 부지가 기운 안정 (불규칙한 부지는 데드스페이스 발생)',
      ]},
      { title:'주변 환경 (煞)', items:[
        '장례식장·병원 정문 인근 — 상업 흐름 저해, 가격 하락 요인',
        '경찰서·소방서 옆 — 소음·진동, 유동인구 성격 달라짐',
        '큰 나무·전신주 정면 — 시인성 가리는 요소, 간판 설치 제약 확인',
        '철로·고가도로 인접 — 소음·진동 반드시 현장에서 시간대별 확인',
      ]},
      { title:'건물 내부 (氣)', items:[
        '입구(정문)가 넓고 밝으면 기(氣) 유입 원활 — 좁고 어두운 입구 주의',
        '지하층 단독 임차 — 자연광 없음, 환기·습도 관리 필수',
        '천장 높이 — 고천장(3m 이상)은 카페·쇼룸에 유리, 낮으면 압박감',
        '기둥 위치 — 실내 정중앙 기둥은 공간 활용성 저하, 확인 필수',
      ]},
    ];
    return renderSections(sections) + `
      <div class="card" style="border-left:3px solid var(--gold);margin-bottom:12px;background:rgba(196,164,90,.06)">
        <div style="font-size:11px;color:var(--on-muted);line-height:1.9;margin-bottom:10px">
          🏡 <b style="color:var(--gold)">건축사 + 공인중개사 동시 검토</b><br>
          방향·채광·지형·도로 등을 건축 전문가 시각으로 함께 분석해드립니다.
        </div>
        <a href="https://open.kakao.com/o/hawujae" target="_blank" class="kakao-btn">
          현장 동행 상담 신청
        </a>
      </div>`;
  }

  function renderSections(sections) {
    const BADGE = {
      agent: `<span style="font-size:9px;padding:2px 6px;border-radius:2px;font-weight:700;
        background:var(--navy2);color:var(--gold);white-space:nowrap;flex-shrink:0">🏠 중개사</span>`,
      arch:  `<span style="font-size:9px;padding:2px 6px;border-radius:2px;font-weight:700;
        background:rgba(196,164,90,.2);color:#7A5500;white-space:nowrap;flex-shrink:0">🏗️ 건축사</span>`,
      self:  `<span style="font-size:9px;padding:2px 6px;border-radius:2px;font-weight:700;
        background:rgba(0,0,0,.07);color:var(--on-muted);white-space:nowrap;flex-shrink:0">📋 직접</span>`,
    };
    return sections.map(s => `
      <div class="card" style="margin-bottom:12px">
        <div class="section-title" style="margin-bottom:8px">📌 ${s.title}</div>
        ${s.note ? `<div style="background:rgba(198,40,40,.07);border-left:2px solid #C62828;
          padding:8px 10px;border-radius:0 3px 3px 0;font-size:11px;color:#C62828;
          margin-bottom:10px;line-height:1.6">${s.note}</div>` : ''}
        ${s.items.map(item => {
          const text  = typeof item === 'string' ? item : item.text;
          const badge = typeof item === 'object' && item.who ? (BADGE[item.who] || '') : '';
          return `
            <div class="checklist-row"
              onclick="var ck=this.querySelector('.ck');ck.textContent=ck.textContent==='☐'?'☑':'☐';this.classList.toggle('checked')">
              <span class="ck">☐</span>
              <span style="flex:1">${text}</span>
              ${badge}
            </div>`;
        }).join('')}
      </div>`).join('');
  }

  function consultCTA(msg) {
    return `
      <div class="card" style="border-left:3px solid var(--gold);margin-bottom:12px">
        <div style="font-size:13px;color:var(--on-muted);line-height:1.8;margin-bottom:8px">
          💡 ${msg}
        </div>
        <div style="font-size:12px;color:var(--on-muted);line-height:1.9;margin-bottom:12px">
          <span style="color:var(--gold)">🏗️ 건축사 동행</span> — 건물·공간·인허가 항목 현장 진단<br>
          <span style="color:var(--gold)">🏠 공인중개사</span> — 상권·권리금·계약 조건 협상 지원<br>
          <span style="color:rgba(255,255,255,.4)">📋 직접확인 항목</span> — 관할 구청·기관에 직접 문의
        </div>
        <a href="https://open.kakao.com/o/hawujae" target="_blank" class="kakao-btn">
          카카오 상담 신청
        </a>
      </div>`;
  }

  return { render, setTab };
})();
