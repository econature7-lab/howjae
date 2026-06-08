/**
 * data.js — 홍대 인근 샘플 매물 데이터
 * 실제 서비스 시 Firebase Firestore로 대체
 */
window.AppData = {

  // 홍대입구역 중심
  CENTER: { lat: 37.5577, lng: 126.9248 },

  properties: [
    /* ── 원룸 ─────────────────────────── */
    {
      id:1, type:'oneroom', typeLabel:'원룸',
      title:'홍대입구역 3분 신축 원룸',
      shortAddr:'서교동', fullAddr:'서울시 마포구 서교동 355-8',
      deal:{ type:'monthly', deposit:1000, monthly:65 },
      size:19.8, floor:4, totalFloor:5,
      direction:'S', element:'fire',
      lat:37.5562, lng:126.9236, distance:200,
      builtYear:2023, parking:false, elevator:true, pet:false,
      tags:['신축','풀옵션','보안강화'],
      desc:'홍대입구역 3번 출구 도보 3분. 2023년 신축. 에어컨·냉장고·세탁기 풀옵션. CCTV 완비.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-333-1234'
    },
    {
      id:2, type:'oneroom', typeLabel:'원룸',
      title:'연남동 카페거리 전세 원룸',
      shortAddr:'연남동', fullAddr:'서울시 마포구 연남동 228-4',
      deal:{ type:'jeonse', jeonse:14000 },
      size:23.1, floor:2, totalFloor:4,
      direction:'E', element:'wood',
      lat:37.5621, lng:126.9261, distance:650,
      builtYear:2019, parking:false, elevator:false, pet:true,
      tags:['반려동물','채광좋음','조용한골목'],
      desc:'연남동 핫한 카페거리 30m. 동향 채광 우수. 반려동물 가능. 조용한 주택가.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-334-5678'
    },
    {
      id:3, type:'oneroom', typeLabel:'오피스텔',
      title:'상수역 2분 풀옵션 오피스텔',
      shortAddr:'상수동', fullAddr:'서울시 마포구 상수동 87-2',
      deal:{ type:'monthly', deposit:2000, monthly:75 },
      size:26.4, floor:7, totalFloor:12,
      direction:'SW', element:'metal',
      lat:37.5482, lng:126.9214, distance:120,
      builtYear:2021, parking:true, elevator:true, pet:false,
      tags:['역세권','주차가능','한강뷰'],
      desc:'상수역 2번 출구 도보 2분. 한강 조망 가능. 지하주차장 1대 포함. 주방가구 풀옵션.',
      agent:'상수공인중개사', agentPhone:'02-335-9012'
    },

    /* ── 오피스 ───────────────────────── */
    {
      id:4, type:'office', typeLabel:'사무실',
      title:'서교동 메인 30평 사무실',
      shortAddr:'서교동', fullAddr:'서울시 마포구 서교동 400-1 3층',
      deal:{ type:'monthly', deposit:5000, monthly:220 },
      size:99.2, floor:3, totalFloor:6,
      direction:'N', element:'water',
      lat:37.5548, lng:126.9255, distance:380,
      builtYear:2018, parking:true, elevator:true, pet:false,
      tags:['30평','주차2대','리모델링'],
      desc:'홍대 메인상권 사무실. 30평 오픈플랜. 주차 2대 포함. 2022년 내부 리모델링.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-333-1234'
    },
    {
      id:5, type:'office', typeLabel:'공유오피스',
      title:'연남동 크리에이터 공유오피스',
      shortAddr:'연남동', fullAddr:'서울시 마포구 연남동 239-12 2층',
      deal:{ type:'monthly', deposit:300, monthly:85 },
      size:49.6, floor:2, totalFloor:3,
      direction:'S', element:'fire',
      lat:37.5615, lng:126.9248, distance:720,
      builtYear:2020, parking:false, elevator:false, pet:false,
      tags:['공유오피스','15평','카페형'],
      desc:'연남동 감성 공유오피스. 카페 인테리어. 고속인터넷·회의실 공용. 크리에이터·스타트업 최적.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-334-5678'
    },

    /* ── 건물 ─────────────────────────── */
    {
      id:6, type:'building', typeLabel:'건물',
      title:'합정역 꼬마빌딩 5층 (연 수익률 4.8%)',
      shortAddr:'합정동', fullAddr:'서울시 마포구 합정동 383-12',
      deal:{ type:'sale', price:320000 },
      size:495, floor:null, totalFloor:5,
      direction:'SE', element:'fire',
      lat:37.5498, lng:126.9141, distance:850,
      builtYear:2015, parking:true, elevator:true, pet:false,
      tags:['수익형','연4.8%','리모델링가능'],
      desc:'합정역 도보 5분. 대지 95평, 연면적 150평. 1층 상가 임대 중. 연 수익률 4.8%.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-336-7890'
    },
    {
      id:7, type:'building', typeLabel:'건물',
      title:'홍대 상가건물 7층 핵심입지',
      shortAddr:'서교동', fullAddr:'서울시 마포구 서교동 330-5',
      deal:{ type:'sale', price:580000 },
      size:1150, floor:null, totalFloor:7,
      direction:'N', element:'water',
      lat:37.5571, lng:126.9228, distance:180,
      builtYear:2011, parking:true, elevator:true, pet:false,
      tags:['핵심입지','만실','연5.2%'],
      desc:'홍대 메인거리 직접 위치. 대지 150평, 연면적 350평. 전층 만실 임대 중. 연 수익률 5.2%.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-333-1234'
    },

    /* ── 토지 ─────────────────────────── */
    {
      id:8, type:'land', typeLabel:'토지',
      title:'동교동 나대지 90평 (2종일반)',
      shortAddr:'동교동', fullAddr:'서울시 마포구 동교동 198-4',
      deal:{ type:'sale', price:280000 },
      size:297.5, floor:null, totalFloor:null,
      direction:null, element:'earth',
      lat:37.5543, lng:126.9265, distance:430,
      builtYear:null, parking:false, elevator:false, pet:false,
      tags:['나대지','2종일반','건폐60%'],
      desc:'동교동 나대지. 2종일반주거지역. 건폐율 60%, 용적률 200%. 즉시 건축 가능.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-333-1234'
    },
    {
      id:9, type:'land', typeLabel:'토지',
      title:'연남동 주차장 부지 150평',
      shortAddr:'연남동', fullAddr:'서울시 마포구 연남동 245-7',
      deal:{ type:'sale', price:450000 },
      size:495.9, floor:null, totalFloor:null,
      direction:null, element:'earth',
      lat:37.5632, lng:126.9270, distance:830,
      builtYear:null, parking:false, elevator:false, pet:false,
      tags:['주차장운영','개발가능','연남핵심'],
      desc:'연남동 핵심 주차장 부지. 현재 주차장 운영 중(수입 있음). 향후 개발 시 큰 시세 차익 기대.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-334-5678'
    },

    /* ── 건축부지 ─────────────────────── */
    {
      id:10, type:'construction', typeLabel:'건축부지',
      title:'서교동 신축 개발부지 200평',
      shortAddr:'서교동', fullAddr:'서울시 마포구 서교동 412-3',
      deal:{ type:'sale', price:670000 },
      size:661.2, floor:null, totalFloor:null,
      direction:null, element:'wood',
      lat:37.5558, lng:126.9280, distance:510,
      builtYear:null, parking:false, elevator:false, pet:false,
      tags:['신축부지','2종일반','허가가능'],
      desc:'홍대 최적 개발부지. 200평. 2종일반주거지역. 상가+주거 복합 건축 허가 가능. 건축사 협의 완료.',
      agent:'하우재 공인중개사사무소', agentPhone:'02-333-1234'
    }
  ],

  // 필터 탭 설정
  FILTERS: [
    { key:'all',          label:'전체' },
    { key:'oneroom',      label:'원룸·오피스텔' },
    { key:'office',       label:'오피스' },
    { key:'building',     label:'건물' },
    { key:'land',         label:'토지' },
    { key:'construction', label:'건축부지' }
  ],

  // 거래 유형 표시
  dealLabel(deal) {
    if (deal.type==='monthly') return `보증금 ${deal.deposit.toLocaleString()}만 / 월 ${deal.monthly}만`;
    if (deal.type==='jeonse')  return `전세 ${(deal.jeonse/10000).toFixed(1)}억`;
    if (deal.type==='sale')    return `매매 ${(deal.price/10000).toFixed(1)}억`;
    return '';
  },

  dealBadge(deal) {
    if (deal.type==='monthly') return '월세';
    if (deal.type==='jeonse')  return '전세';
    if (deal.type==='sale')    return '매매';
    return '';
  }
};
