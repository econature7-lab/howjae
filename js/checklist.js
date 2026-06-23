/**
 * checklist.js — 체크리스트 탭
 * 계약 / 풍수지리
 */
window.ChecklistView = (function() {
  let activeTab = 'contract';

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
      { key:'contract', icon:'📄', label:'계약' },
      { key:'pungsu',   icon:'🧭', label:'풍수지리' },
    ];
    return `
    <div style="padding:0;min-height:100%;background:var(--bg);padding-bottom:70px">
      <div style="padding:0 16px">
        <div class="page-header">
          <div class="page-header-title">체크리스트</div>
          <div class="page-header-sub">계약·풍수지리 확인사항</div>
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
    return sections.map(s => `
      <div class="card" style="margin-bottom:12px">
        <div class="section-title" style="margin-bottom:8px">📌 ${s.title}</div>
        ${s.note ? `<div style="background:rgba(198,40,40,.07);border-left:2px solid #C62828;
          padding:8px 10px;border-radius:0 3px 3px 0;font-size:11px;color:#C62828;
          margin-bottom:10px;line-height:1.6">${s.note}</div>` : ''}
        ${s.items.map(item => {
          const text = typeof item === 'string' ? item : item.text;
          return `
            <div class="checklist-row"
              onclick="var ck=this.querySelector('.ck');ck.textContent=ck.textContent==='☐'?'☑':'☐';this.classList.toggle('checked')">
              <span class="ck">☐</span>
              <span style="flex:1">${text}</span>
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
        <a href="https://open.kakao.com/o/hawujae" target="_blank" class="kakao-btn">
          카카오 상담 신청
        </a>
      </div>`;
  }

  return { render, setTab };
})();
