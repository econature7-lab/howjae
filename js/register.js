/**
 * register.js — 사람 풀 등록 탭
 */
window.RegisterView = (function() {
  let selectedRole = null;
  let activeSubTab = 'register'; // 'register' | 'board'

  const ROLES = [
    { key:'seller',   icon:'🏠', label:'매도자',      desc:'건물·부동산 팔고 싶어요' },
    { key:'buyer',    icon:'🔍', label:'매수자',      desc:'건물·부동산 사고 싶어요' },
    { key:'landlord', icon:'🔑', label:'임대인',      desc:'공간을 임대하고 싶어요' },
    { key:'tenant',   icon:'📋', label:'임차인',      desc:'공간을 임차하고 싶어요' },
    { key:'outgoing', icon:'🚪', label:'나가는 임차인', desc:'권리금·자리 인수자 구해요' },
    { key:'interior', icon:'🎨', label:'인테리어 업체', desc:'파트너사로 등록할게요' },
    { key:'reno',     icon:'🔨', label:'리모델링 업체', desc:'파트너사로 등록할게요' },
  ];

  function render() {
    const wrap = document.getElementById('screen-wrap');
    if (!wrap) return;
    wrap.innerHTML = renderScreen();
    wrap.scrollTop = 0;
  }

  function selectRole(key) {
    selectedRole = key;
    render();
    setTimeout(() => {
      const form = document.getElementById('reg-form');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }

  function renderScreen() {
    return `
    <div style="padding:0 16px;min-height:100%;background:var(--bg);padding-bottom:70px">
      <div class="page-header">
        <div class="page-header-title">등록하기</div>
        <div class="page-header-sub">하우재 사람 풀 · 나가는 임차인</div>
      </div>

      <!-- 서브 탭 -->
      <div class="list-filter-bar" style="margin-bottom:16px">
        <button class="list-filter-btn ${activeSubTab==='register'?'active':''}"
          onclick="RegisterView.setSubTab('register')">📝 등록하기</button>
        <button class="list-filter-btn ${activeSubTab==='board'?'active':''}"
          onclick="RegisterView.setSubTab('board')">🚪 나가는 임차인</button>
      </div>

      ${activeSubTab === 'board' ? renderBoard() : renderRegisterForm()}
    </div>`;
  }

  function renderRegisterForm() {
    return `
      <div style="font-size:13px;color:var(--on-muted);margin-bottom:18px;line-height:1.8;
        background:var(--navy2);border-radius:4px;padding:14px;border-left:3px solid var(--gold)">
        역할을 선택하고 간단한 정보를 남겨주세요.<br>
        <b style="color:white">심지연 대표가 직접 검토</b> 후 1영업일 이내 연락드립니다.
      </div>

      <!-- 역할 선택 -->
      <div class="section-title" style="margin-bottom:12px">역할 선택</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px">
        ${ROLES.map(r => `
          <div onclick="RegisterView.selectRole('${r.key}')"
            style="background:${selectedRole===r.key ? 'rgba(196,164,90,.12)' : 'var(--navy2)'};
            border:1px solid ${selectedRole===r.key ? 'var(--gold)' : 'rgba(255,255,255,.1)'};
            border-radius:4px;padding:12px;cursor:pointer">
            <div style="font-size:24px;margin-bottom:5px">${r.icon}</div>
            <div style="font-weight:700;font-size:13px;
              color:${selectedRole===r.key ? 'var(--gold)' : 'white'};margin-bottom:3px">
              ${r.label}
            </div>
            <div style="font-size:11px;color:var(--on-muted);line-height:1.4">${r.desc}</div>
          </div>`).join('')}
      </div>

      ${selectedRole ? renderForm() : `
        <div style="text-align:center;padding:20px 0;color:var(--on-muted);font-size:13px">
          ↑ 위에서 역할을 선택해주세요
        </div>`}`;
  }

  function renderForm() {
    const role = ROLES.find(r => r.key === selectedRole);
    const isBiz = selectedRole === 'interior' || selectedRole === 'reno';
    return `
    <div id="reg-form" class="card" style="border-left:3px solid var(--gold)">
      <div class="section-title" style="margin-bottom:16px">
        ${role.icon} ${role.label} 등록 정보
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">

        <div>
          <label style="font-size:12px;color:var(--on-muted);margin-bottom:5px;display:block">
            ${isBiz ? '업체명' : '이름'} <span style="color:var(--gold)">*</span>
          </label>
          <input id="reg-name" class="form-input" type="text"
            placeholder="${isBiz ? '업체명을 입력하세요' : '이름을 입력하세요'}">
        </div>

        <div>
          <label style="font-size:12px;color:var(--on-muted);margin-bottom:5px;display:block">
            연락처 <span style="color:var(--gold)">*</span>
          </label>
          <input id="reg-phone" class="form-input" type="tel" placeholder="010-0000-0000">
        </div>

        ${isBiz ? `
        <div>
          <label style="font-size:12px;color:var(--on-muted);margin-bottom:5px;display:block">전문 분야</label>
          <input id="reg-spec" class="form-input" type="text"
            placeholder="예: 카페·상업공간 인테리어, 소규모 리모델링">
        </div>` : ''}

        <div>
          <label style="font-size:12px;color:var(--on-muted);margin-bottom:5px;display:block">
            ${getDescLabel()}
          </label>
          <textarea id="reg-desc" class="form-input"
            style="resize:none;height:90px;line-height:1.7"
            placeholder="${getPlaceholder()}"></textarea>
        </div>

        <button onclick="RegisterView.submit()"
          style="background:var(--gold);color:#1A2340;border:none;border-radius:3px;
          padding:14px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit">
          등록 신청하기
        </button>

        <div style="font-size:11px;color:var(--on-muted);text-align:center;line-height:1.7">
          개인정보는 상담 연락 목적으로만 사용됩니다<br>
          <a href="privacy.html" target="_blank" style="color:var(--gold);text-decoration:none">
            개인정보처리방침 →
          </a>
        </div>
      </div>
    </div>`;
  }

  function getDescLabel() {
    const map = {
      seller:'매도 물건 내용', buyer:'구하는 조건',
      landlord:'임대 물건 내용', tenant:'구하는 조건',
      outgoing:'인수 조건 및 일정', interior:'소개 및 주요 시공 분야', reno:'소개 및 주요 공사 분야',
    };
    return map[selectedRole] || '내용';
  }

  function getPlaceholder() {
    const map = {
      seller:'예: 홍대 근처 4층 건물, 20억대, 즉시 매도 가능',
      buyer:'예: 홍대·연남 상가 건물, 예산 15억 내외',
      landlord:'예: 합정동 1층 30평 상가, 월세 300/200',
      tenant:'예: 연남동 카페 자리 15~25평, 권리금 2천 이하',
      outgoing:'예: 홍대 카페 자리 인수자 구함, 권리금 3천, 6개월 후 퇴거 예정',
      interior:'예: 상업공간 인테리어 전문, 카페·사무실 시공 다수, 마포구 30개 이상 시공',
      reno:'예: 노후 건물 리모델링, 외벽·내부 전체 공사, 4층 이하 소규모 전문',
    };
    return map[selectedRole] || '내용을 입력하세요';
  }

  async function submit() {
    const nameEl  = document.getElementById('reg-name');
    const phoneEl = document.getElementById('reg-phone');
    const descEl  = document.getElementById('reg-desc');
    const specEl  = document.getElementById('reg-spec');

    const name  = nameEl?.value?.trim();
    const phone = phoneEl?.value?.trim();
    const desc  = descEl?.value?.trim();
    const spec  = specEl?.value?.trim() || '';

    if (!name || !phone) {
      alert('이름(업체명)과 연락처는 필수입니다.');
      return;
    }

    const data = {
      role: selectedRole, name, phone, desc, spec,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Firebase Firestore 저장 (또는 localStorage 폴백)
      if (window.DB && typeof DB.saveRegister === 'function') {
        await DB.saveRegister(data);
      } else {
        const list = JSON.parse(localStorage.getItem('reg_pool') || '[]');
        list.push(data);
        localStorage.setItem('reg_pool', JSON.stringify(list));
      }
      selectedRole = null;
      const wrap = document.getElementById('screen-wrap');
      if (wrap) wrap.innerHTML = renderSuccess();
    } catch(e) {
      console.error('[Register] 저장 오류:', e);
      alert('등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  function renderSuccess() {
    return `
    <div style="min-height:100%;background:var(--bg);display:flex;align-items:center;
      justify-content:center;padding:40px 24px;padding-bottom:100px">
      <div style="text-align:center;max-width:280px">
        <div style="font-size:72px;margin-bottom:20px">✅</div>
        <div style="font-size:20px;font-weight:800;color:var(--navy);margin-bottom:10px">
          등록 신청 완료!
        </div>
        <div style="font-size:14px;color:var(--on-muted);line-height:1.9;margin-bottom:28px">
          심지연 대표가 검토 후<br>
          <b style="color:var(--navy)">1영업일 이내</b> 연락드립니다.
        </div>
        <button onclick="App.goTab('home')"
          style="background:var(--gold);color:#1A2340;border:none;border-radius:3px;
          padding:13px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">
          홈으로 돌아가기
        </button>
      </div>
    </div>`;
  }

  /* ── 서브탭 전환 ── */
  function setSubTab(t) {
    activeSubTab = t;
    selectedRole = null;
    render();
  }

  /* ── 나가는 임차인 게시판 ── */
  function renderBoard() {
    setTimeout(_loadBoard, 0);
    return `
      <div id="board-container" style="min-height:120px">
        <div style="text-align:center;padding:40px;color:var(--on-muted)">
          <div style="font-size:24px;margin-bottom:8px">⏳</div>불러오는 중...
        </div>
      </div>`;
  }

  async function _loadBoard() {
    const container = document.getElementById('board-container');
    if (!container) return;
    const disclaimer = `
      <div style="background:rgba(255,150,50,.06);border:1px solid rgba(255,150,50,.2);
        border-radius:4px;padding:12px 14px;margin-bottom:14px;font-size:11px;
        color:rgba(255,200,100,.85);line-height:1.8">
        ⚠️ 이 게시판은 정보 공유 목적입니다. 하우재는 게시 내용에 법적 책임을 지지 않으며,
        실제 계약은 공인중개사를 통해 진행하세요.
      </div>`;
    try {
      const items = await DB.getRegisterPool('outgoing', 'approved');
      if (!items || !items.length) {
        container.innerHTML = disclaimer + `
          <div style="text-align:center;padding:40px 20px;background:var(--navy2);
            border-radius:4px;border:1px solid var(--border)">
            <div style="font-size:48px;margin-bottom:14px">🚪</div>
            <div style="font-size:14px;font-weight:700;color:white;margin-bottom:8px">등록된 자리가 없습니다</div>
            <div style="font-size:12px;color:var(--on-muted);line-height:1.8;margin-bottom:14px">
              나가는 임차인으로 등록하시면<br>인수자를 찾아드립니다.
            </div>
            <button onclick="RegisterView.setSubTab('register');
              setTimeout(()=>RegisterView.selectRole('outgoing'),100)"
              style="background:var(--gold);color:#1A2340;border:none;border-radius:3px;
              padding:10px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">
              나가는 임차인으로 등록
            </button>
          </div>`;
        return;
      }
      container.innerHTML = disclaimer + items.map(_renderBoardCard).join('');
    } catch(e) {
      container.innerHTML = disclaimer +
        '<div style="text-align:center;padding:20px;color:var(--on-muted)">불러오기 실패</div>';
    }
  }

  function _renderBoardCard(item) {
    const d = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('ko-KR', {month:'short', day:'numeric'})
      : '';
    return `
    <div class="card" style="margin-bottom:12px;border-left:3px solid rgba(255,160,50,.5)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:11px;background:rgba(255,150,50,.12);color:rgba(255,185,80,.9);
          padding:3px 8px;border-radius:2px;font-weight:600">🚪 나가는 임차인</span>
        <span style="font-size:10px;color:var(--on-muted)">${d}</span>
      </div>
      ${item.desc ? `<div style="font-size:13px;color:rgba(255,255,255,.85);line-height:1.8;
        margin-bottom:10px">${item.desc}</div>` : ''}
      <a href="https://open.kakao.com/o/hawujae" target="_blank"
        style="display:block;text-align:center;padding:9px;
        background:rgba(196,164,90,.1);border:1px solid rgba(196,164,90,.3);
        border-radius:3px;font-size:12px;color:var(--gold);text-decoration:none;font-weight:600">
        💬 인수 문의 (카카오 상담)
      </a>
    </div>`;
  }

  return { render, selectRole, submit, setSubTab };
})();
