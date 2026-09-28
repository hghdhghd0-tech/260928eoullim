import { IMessageProblem, ScenarioQuest } from '../types';

export const COMPETENCY_INFO = {
  empathy: {
    name: '공감 (Empathy)',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: 'HeartHandshake',
    desc: '상대방의 입장에서 생각하고 감정을 헤아리는 힘'
  },
  communication: {
    name: '의사소통 (Communication)',
    color: 'text-sky-600',
    bg: 'bg-sky-500/10 border-sky-500/30',
    icon: 'MessageSquareShare',
    desc: '비난 없이 나의 생각과 부탁을 또박또박 전하는 나-전달법'
  },
  self_regulation: {
    name: '감정조절 (Self-Regulation)',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: 'ShieldAlert',
    desc: '욱하거나 화가 날 때 6초 멈추고 쿨다운하는 능력'
  },
  self_esteem: {
    name: '자기존중감 (Self-Esteem)',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10 border-purple-500/30',
    icon: 'Sparkles',
    desc: '남의 시선이나 비난에 흔들리지 않고 나 자신을 귀하게 여기는 태도'
  },
  conflict_resolution: {
    name: '갈등해결 (Conflict Resolution)',
    color: 'text-rose-600',
    bg: 'bg-rose-500/10 border-rose-500/30',
    icon: 'FlameKindling',
    desc: '다툼이 생겼을 때 주먹이나 욕설 대신 윈-윈(Win-Win)으로 푸는 지혜'
  }
};

// Stage 3: 중학교 1학년 남학생 맞춤 실전 갈등 시나리오 4종
export const SCENARIO_QUESTS: ScenarioQuest[] = [
  {
    id: 'quest_soccer',
    category: '체육 & 점심시간',
    subjectTag: '체육 / 창체',
    title: '퀘스트 1: 후반전 1분 전, 허공으로 날린 슛!',
    situation: '점심시간 1학년 반 대항 축구 결승전. 동점 상황에서 네가 완벽한 찬스를 잡았으나 공이 골대 위로 날아갔다. 경기 종료 휘슬이 울리자 같은 반 주전 찬우가 씩씩거리며 다가온다.',
    contextDesc: '찬우의 분노 게이지가 폭발 직전입니다! 어떻게 대응하시겠습니까?',
    opponentName: '박찬우 (주장)',
    opponentAvatar: '😤',
    opponentInitialSpeech: '"야! 그걸 왜 허공에 날리냐? 네 똥볼 때문에 다 이긴 경기 졌잖아! 발로 찼냐 눈감고 찼냐?"',
    choices: [
      {
        id: 'c1',
        text: '"너는 뭐 경기 내내 잘했냐? 네가 패스를 그지같이 줘놓고 왜 나한테 뒤집어씌워?" 맞받아친다.',
        scoreBonus: { conflict_resolution: -10, self_regulation: -10 },
        reaction: '찬우의 얼굴이 붉어지며 멱살을 잡으려 합니다! 주변 친구들도 편이 갈려 험악한 분위기가 되었습니다.',
        isBest: false,
        explanation: '너-전달법(You-Message) 비난에 똑같이 공격으로 맞서면 순식간에 물리적 폭력이나 집단 갈등으로 번집니다.',
        opponentState: '💥 폭발 상태 (갈등 심화)'
      },
      {
        id: 'c2',
        text: '6초간 깊게 숨을 들이쉰 뒤: "나도 결정적인 찬스 놓쳐서 진짜 속상하고 팀원들한테 미안해. 근데 소리 지르며 비난하니까 당황스러워. 다음엔 패스 타이밍 더 맞춰보자."',
        scoreBonus: { self_regulation: 25, communication: 25, conflict_resolution: 20 },
        reaction: '찬우가 멈칫하더니 한숨을 푹 쉬며 말합니다. "...하, 나도 너무 흥분해서 소리 질렀다. 아쉬워서 그랬어."',
        isBest: true,
        explanation: '자신의 아쉬움(감정)과 미안함을 솔직히 인정하고, 비난하는 태도에 대해 나-전달법으로 표현하여 상대의 흥분을 가라앉혔습니다!',
        opponentState: '🤝 진정 및 화해 상태'
      },
      {
        id: 'c3',
        text: '아무 말도 안 하고 고개 숙인 채 교실로 들어가 버리고, 단톡방에 찬우 욕을 올린다.',
        scoreBonus: { communication: -15, empathy: -10 },
        reaction: '찬우는 무시당했다고 생각해 더 화가 났고, 단톡방 뒷담화가 캡처되어 2차 사이버 폭력으로 비화되었습니다.',
        isBest: false,
        explanation: '회피 후 사이버 공간 뒷담화는 학교폭력(사이버 명예훼손/따돌림)으로 직결되는 가장 위험한 행동입니다.',
        opponentState: '📱 사이버 갈등 위험'
      }
    ]
  },
  {
    id: 'quest_gaming',
    category: '방과후 & 사이버 공간',
    subjectTag: '정보 / 도덕',
    title: '퀘스트 2: 랭크전 5연패와 단톡방의 선넘은 패드립',
    situation: '방과 후 친구들과 5인 랭크전을 하다가 5연패를 했다. 팀보이스에서 민석이가 "야 ○○아 너 손가락 장애냐? 부모님이 롤 대신 가르쳐줬냐?"라며 선을 넘는 패드립과 조롱을 쏟아붓기 시작했다.',
    contextDesc: '온라인 게임 음성 채팅 및 단톡방 조롱 상황입니다.',
    opponentName: '김민석 (게임 친구)',
    opponentAvatar: '🤬',
    opponentInitialSpeech: '"아 진짜 트롤 한 놈 때문에 승급전 날렸네ㅋㅋ 접어라 걍, 뇌 빼고 게임하냐?"',
    choices: [
      {
        id: 'g1',
        text: '"너 선 넘었다. 게임 져서 나도 기분 안 좋은데, 부모님 얘기랑 비하 발언은 절대 용납 못 해. 사과해라. 계속하면 캡처하고 방 나간다."',
        scoreBonus: { self_esteem: 25, communication: 25, self_regulation: 20 },
        reaction: '디스코드 분위기가 조용해집니다. 옆에 있던 지훈이가 "야 민석아 솔직히 부모님 드립은 네가 심했다. 사과해라"라고 편을 듭니다. 민석이가 머쓱해하며 사과합니다.',
        isBest: true,
        explanation: '자기존중감과 명확한 경계(Boundary) 설정! 욕으로 맞받아치지 않고 넘지 말아야 할 선을 단호하게 짚었습니다.',
        opponentState: '🛡️ 경계 인정 및 자정'
      },
      {
        id: 'g2',
        text: '눈이 뒤집혀서 상대방 가족 욕과 패드립을 두 배로 마이크에 쏟아붓는다.',
        scoreBonus: { self_regulation: -20, communication: -20 },
        reaction: '음성채팅이 아수라장이 되고 녹음본이 학급 단톡방에 퍼져 학폭위 사안으로 접수될 위기에 처합니다.',
        isBest: false,
        explanation: '온라인상에서의 쌍방 욕설은 정당방위가 인정되지 않으며, 기록으로 남아 더 큰 불이익을 받게 됩니다.',
        opponentState: '⚠️ 사이버 폭력 쌍방 사안'
      },
      {
        id: 'g3',
        text: '"ㅋㅋ 에이 장난이지?"라며 억지웃음 짓고 넘어가지만, 밤새 분해서 잠을 못 잔다.',
        scoreBonus: { self_esteem: -15 },
        reaction: '민석이는 "아 쟤는 이렇게 막말해도 괜찮구나"라고 착각해 이후에도 계속해서 타깃으로 삼게 됩니다.',
        isBest: false,
        explanation: '불쾌한 조롱을 장난으로 포장해 삼키면 만성적인 언어폭력과 괴롭힘의 타깃이 될 수 있습니다.',
        opponentState: '📉 자존감 상처 지속'
      }
    ]
  },
  {
    id: 'quest_groupwork',
    category: '수업 & 조별과제',
    subjectTag: '국어 / 과학 / 사회',
    title: '퀘스트 3: 모둠 발표 전날, 잠수탄 조원과 무임승차',
    situation: '내일 과학 탐구 발표날인데, 모둠원 진호가 자료 조사를 전혀 안 해왔다. 수업 시간에 재촉하자 "야 어차피 네가 PPT 잘 만드니까 네가 좀 다 해줘라, 난 오늘 학원 땜에 바쁨ㅋ"이라며 폰만 본다.',
    contextDesc: '무책임한 태도에 속에서 열불이 치솟습니다! 어떻게 해결할까요?',
    opponentName: '이진호 (모둠원)',
    opponentAvatar: '😒',
    opponentInitialSpeech: '"야 피곤하게 왜 그래~ 대충 인터넷 긁어 붙여. 넌 똑똑하니까 금방 하잖아~"',
    choices: [
      {
        id: 'w1',
        text: '"진호야, 4명이 같이 받는 점수인데 네 몫까지 내가 다 하면 나도 억울하고 힘들어(감정). 네가 3페이지 사진 2장 찾는 것만 지금 10분 동안 같이 하자(구체적 요청)."',
        scoreBonus: { communication: 25, conflict_resolution: 25, empathy: 15 },
        reaction: '진호가 폰을 주머니에 넣으며 긁적입니다. "...알았어, 10분만 사진 찾는 건 금방 하니까 지금 할게."',
        isBest: true,
        explanation: '원망 대신 솔직한 부담감을 털어놓고, 상대방이 지금 당장 실행할 수 있는 작은 단위의 과업을 제안해 협력을 이끌어냈습니다.',
        opponentState: '🤝 협력 모드 전환'
      },
      {
        id: 'w2',
        text: '"야 이 버스충아! 네 이름 발표 PPT에서 확 빼버린다? 선생님한테 다 이를 거야!" 소리친다.',
        scoreBonus: { conflict_resolution: -10, self_regulation: -10 },
        reaction: '진호가 "빼라 빼! 찌질하게 선생님한테 고자질이나 하냐?"라며 자리를 박차고 나갑니다.',
        isBest: false,
        explanation: '낙인찍기와 협박성 발언은 상대방의 방어기제를 자극해 협동을 완전히 파탄 냅니다.',
        opponentState: '💢 관계 파탄'
      },
      {
        id: 'w3',
        text: '짜증나지만 그냥 밤새 혼자 다 해버리고 속으로 진호를 평생 무시하기로 결심한다.',
        scoreBonus: { communication: -10, self_esteem: -10 },
        reaction: '혼자 밤새느라 피곤해 발표를 망쳤고, 가슴속에는 미움과 피해의식만 남았습니다.',
        isBest: false,
        explanation: '참기만 하는 희생은 결국 관계를 갉아먹고 본인의 에너지를 고갈시킵니다.',
        opponentState: '😶 독박과 소외'
      }
    ]
  },
  {
    id: 'quest_corridor',
    category: '쉬는시간 & 복도',
    subjectTag: '도덕 / 생활지도',
    title: '퀘스트 4: "야 빡대가리야!" 장난이라며 툭툭 치는 친구',
    situation: '쉬는 시간마다 덩치 큰 동수가 와서 "야 우리 빡대가리 오랜만이다?"라며 목덜미를 툭툭 치고 지나간다. 기분이 몹시 나쁜데, 다른 애들이 보면 장난치는 것처럼 보여서 애매하다.',
    contextDesc: '장난을 가장한 신체·언어적 괴롭힘 상황입니다.',
    opponentName: '최동수 (같은 반)',
    opponentAvatar: '😈',
    opponentInitialSpeech: '"헤이 브로~ 반가워서 한 대 쳤지 왜 쫄았냐? 장난인데 정색하기는ㅋㅋ"',
    choices: [
      {
        id: 'r1',
        text: '동수의 눈을 똑바로 쳐다보고 차분하고 단호한 목소리로: "동수야, 네가 장난으로 쳐도 난 몸 툭툭 치고 기분 나쁜 별명 부르면 존중받지 못하는 것 같아서 불쾌해. 그 장난 멈춰줘."',
        scoreBonus: { self_esteem: 30, communication: 25, self_regulation: 20 },
        reaction: '동수가 당황하며 손을 내립니다. "어... 장난이었는데 기분 나빴냐? 미안하다, 안 그럴게."',
        isBest: true,
        explanation: '눈을 마주치며 단호하고 명확하게 "장난이라도 나는 불쾌하다"는 나의 감정과 중단 요청을 표현하는 것이 장난 빙자 폭력을 멈추는 가장 효과적인 방법입니다.',
        opponentState: '🛑 경계 인식 및 멈춤'
      },
      {
        id: 'r2',
        text: '기분 나쁜 티를 팍 내며 뒤에서 발로 걷어찬다.',
        scoreBonus: { self_regulation: -25, conflict_resolution: -25 },
        reaction: '복도에서 주먹다짐이 벌어져 두 사람 모두 다치고 선도위원회에 회부됩니다.',
        isBest: false,
        explanation: '폭력으로 되갚는 것은 장난을 정당화해주고 본인도 가해자가 되는 최악의 결말을 낳습니다.',
        opponentState: '🚨 물리적 폭력 사태'
      },
      {
        id: 'r3',
        text: '동수가 지나갈 때마다 복도나 화장실로 슬슬 피해 다닌다.',
        scoreBonus: { self_esteem: -20 },
        reaction: '자신감이 위축되고 학교 가는 것이 점점 두려워지기 시작합니다.',
        isBest: false,
        explanation: '피하기만 하면 가해 행동이 멈추지 않고 위축감이 깊어집니다.',
        opponentState: '🌧️ 무력감 축적'
      }
    ]
  }
];

// Stage 4: 나-전달법 콤보 제조기 (Fact + Feeling + Request)
export const I_MESSAGE_PROBLEMS: IMessageProblem[] = [
  {
    id: 'imsg_1',
    situation: '체육 시간 빌려 간 내 체육복을 땀 범벅인 채로 말도 없이 내 사물함에 그냥 쑤셔 넣어 놓았을 때',
    subjectCategory: '체육 / 생활습관',
    factOptions: [
      { id: 'f1', type: 'fact', text: '체육복을 땀에 젖은 채로 말없이 사물함에 넣어둔 것을 보았을 때', isCorrect: true },
      { id: 'f2', type: 'fact', text: '네가 매번 남의 물건을 거지 취급하고 양심 없이 굴었을 때', isCorrect: false },
      { id: 'f3', type: 'fact', text: '네가 개념 없이 냄새나는 짓을 저질렀을 때', isCorrect: false }
    ],
    feelingOptions: [
      { id: 'e1', type: 'feeling', text: '당황스럽고 배려받지 못한 것 같아서 속상했어', isCorrect: true },
      { id: 'e2', type: 'feeling', text: '너 진짜 인성 터졌다는 생각이 들었어', isCorrect: false },
      { id: 'e3', type: 'feeling', text: '그냥 네가 한심하고 꼴 보기 싫었어', isCorrect: false }
    ],
    requestOptions: [
      { id: 'r1', type: 'request', text: '다음부터는 옷을 빌려가면 세탁해서 돌려주거나 미리 말해줬으면 좋겠어', isCorrect: true },
      { id: 'r2', type: 'request', text: '너 평생 나한테 말도 걸지 말고 꺼져줬으면 좋겠어', isCorrect: false },
      { id: 'r3', type: 'request', text: '당장 무릎 꿇고 빌어라', isCorrect: false }
    ],
    tip: '💡 팁: 사실(Fact)은 CCTV처럼 눈에 보이는 행동만 담고, 감정(Feeling)은 상대방 욕이 아닌 나의 속마음, 바람(Request)은 구체적으로 바라는 행동입니다.'
  },
  {
    id: 'imsg_2',
    situation: '내가 좋아하는 애니메이션/게임 캐릭터 그림을 연습장에 그리고 있는데, 친구가 보더니 "우웩 씹덕이냐? 개오글거리네"라며 비웃을 때',
    subjectCategory: '미술 / 자유시간',
    factOptions: [
      { id: 'f1', type: 'fact', text: '내가 열심히 그린 그림을 보고 비웃으며 오글거린다고 말했을 때', isCorrect: true },
      { id: 'f2', type: 'fact', text: '네가 인성 바닥인 꼰대처럼 시비 털었을 때', isCorrect: false },
      { id: 'f3', type: 'fact', text: '그림 볼 줄도 모르는 눈 삐뚤어진 녀석이 깝죽댈 때', isCorrect: false }
    ],
    feelingOptions: [
      { id: 'e1', type: 'feeling', text: '내가 좋아하는 취미를 무시당한 것 같아 무안하고 자존심이 상했어', isCorrect: true },
      { id: 'e2', type: 'feeling', text: '네 턱주가리를 날리고 싶었어', isCorrect: false },
      { id: 'e3', type: 'feeling', text: '너랑 같은 반인 게 쪽팔렸어', isCorrect: false }
    ],
    requestOptions: [
      { id: 'r1', type: 'request', text: '네 취향이 아니더라도 내 취미를 비하하지 말고 존중해 줬으면 좋겠어', isCorrect: true },
      { id: 'r2', type: 'request', text: '앞으로 내 책상 반경 5미터 이내로 오지 마라', isCorrect: false },
      { id: 'r3', type: 'request', text: '너도 똑같이 당해봐야 정신 차릴래?', isCorrect: false }
    ],
    tip: '💡 팁: 남학생들 사이에서 서로의 취미(게임, 덕질, 운동 등)를 비하하는 말이 흔히 갈등의 불씨가 됩니다. 내 취향에 대한 존중을 요구하세요!'
  },
  {
    id: 'imsg_3',
    situation: '수학 시험 끝나고 점수가 떨어져 우울해하고 있는데, 친구가 옆에서 자기 100점 시험지 흔들며 "야 넌 이것도 틀렸냐? 능지 실화냐?"라며 놀릴 때',
    subjectCategory: '수학 / 교과시간',
    factOptions: [
      { id: 'f1', type: 'fact', text: '내가 성적 때문에 속상해하는데 내 시험지를 보며 능지 드립으로 놀렸을 때', isCorrect: true },
      { id: 'f2', type: 'fact', text: '재수 없게 100점 맞았다고 나대는 꼬라지를 봤을 때', isCorrect: false },
      { id: 'f3', type: 'fact', text: '공부 좀 한다고 우쭐대며 거만 떨 때', isCorrect: false }
    ],
    feelingOptions: [
      { id: 'e1', type: 'feeling', text: '노력했는데 결과가 안 나와서 가뜩이나 힘든데 더 위축되고 마음이 아팠어', isCorrect: true },
      { id: 'e2', type: 'feeling', text: '너한테 시험지 찢어 던지고 싶었어', isCorrect: false },
      { id: 'e3', type: 'feeling', text: '네 점수가 다 빵점 처리됐으면 좋겠다고 생각했어', isCorrect: false }
    ],
    requestOptions: [
      { id: 'r1', type: 'request', text: '친구가 힘들어할 땐 놀리기보다 조용히 있어 주거나 응원해 줬으면 좋겠어', isCorrect: true },
      { id: 'r2', type: 'request', text: '다음 시험에 너 무조건 망해라 저주할 거야', isCorrect: false },
      { id: 'r3', type: 'request', text: '내 시험지 근처에도 오지 마', isCorrect: false }
    ],
    tip: '💡 팁: 친구의 실패나 아쉬운 결과를 유머나 밈(Meme)으로 조롱하는 것은 공감 능력 부족입니다. 솔직한 아픔을 전하세요.'
  }
];

// 교사용 1차시 교수학습과정안 요약
export const LESSON_PLAN = {
  title: '어울림 역량(공감·소통·조절·자존감·갈등해결) 강화를 위한 1차시 교과 연계 게임형 수업',
  target: '중학교 1학년 24명 (1인 1태블릿 환경)',
  duration: '1차시 (45분)',
  coreCompetencies: '공감, 의사소통, 감정조절, 자기존중감, 갈등해결 (어울림 5대 역량)',
  steps: [
    {
      step: '도입 (5분)',
      name: '출석 확인 & 감정 배터리 측정',
      activity: '태블릿 접속 후 1~24번 번호와 이름 입력. 오늘 수업 시작 전 나의 기분 상태(에너지 1~5) 자가진단.',
      teacherTip: '남학생들이 번호와 기분을 빠르게 선택하고 45분 집중 모드로 진입할 수 있도록 격려'
    },
    {
      step: '전개 1 (10분)',
      name: '감정조절 6초 쿨다운 아레나',
      activity: '화가 나는 순간 뇌의 편도체가 흥분하는 6초의 원리 이해. 인터랙티브 6초 호흡 원형 애니메이션으로 심신 안정 훈련 및 감정 단어 매칭.',
      teacherTip: '"욱할 때 바로 주먹이나 악플 나가면 퀘스트 실패!" 교실 전체가 함께 6초간 쉼호흡을 실습해보도록 안내'
    },
    {
      step: '전개 2 (15분)',
      name: '실전 갈등해결 RPG (4대 퀘스트)',
      activity: '중1 남학생들이 가장 빈번하게 겪는 4대 상황(축구 실수, 게임/단톡방 패드립, 조별과제 무임승차, 쉬는시간 장난)을 시나리오로 체험하고 최선의 해결책 선택.',
      teacherTip: '학생들이 흔히 저지르는 "맞받아치기"나 "단톡방 뒷담화"의 실제 위험성을 게임 속 피드백을 통해 체감하도록 지도'
    },
    {
      step: '전개 3 (8분)',
      name: '나-전달법(I-Message) 콤보 제조기',
      activity: '너-전달법의 비난 대신 [사실]+[감정]+[바람] 카드를 스킬 콤보처럼 조합하여 건강하게 표현하는 언어 습관 체득.',
      teacherTip: '남학생들에게 "나-전달법은 비겁하게 참는 게 아니라, 내 품격을 지키며 상대를 제압하는 최고급 언어 스킬"임을 강조'
    },
    {
      step: '정리 (7분)',
      name: '어울림 마스터 인증서 & 1인 1실천 서약',
      activity: '5대 역량 획득 점수 및 레이더 차트 확인, "우리 반을 위한 나의 존중 서약" 1문장 작성, 최종 인증서 화면 캡처 또는 인쇄로 교사에게 제출.',
      teacherTip: '작성된 서약서를 교실 게시판에 붙이거나 학급 밴드/클래스룸에 공유하여 학기 내내 실천 문화 형성'
    }
  ],
  subjectLinks: [
    { subject: '체육', linkTip: '경기 중 실수한 팀원에게 비난 대신 "괜찮아 다음 찬스 있어!" 격려 구호 만들기 실습' },
    { subject: '국어', linkTip: '비폭력 대화(NVC) 단원 및 갈등 소설 인물의 대화 방식을 나-전달법으로 재구성하기' },
    { subject: '도덕', linkTip: '인간 존중과 평화적 갈등 해결 단원에서 장난과 폭력의 경계선 토의하기' },
    { subject: '정보/기술', linkTip: '단톡방·디스코드·온라인 게임 매너 및 사이버 폭력(사이버 명예훼손, 박제) 법적 책임 교육' },
    { subject: '사회', linkTip: '민주적 의사결정과 모둠 내 무임승차 갈등을 해결하는 규칙(Rule) 제정하기' },
    { subject: '과학/수학', linkTip: '실험 조별 탐구 활동 시 역할 분담 및 시험 결과 비교로 인한 언어 상처 예방' },
    { subject: '창체/자율', linkTip: '학기 초 학급 규칙 세우기, 친구 사랑 주간 및 학교폭력 예방 어울림 주간 집중 프로그램' }
  ]
};
