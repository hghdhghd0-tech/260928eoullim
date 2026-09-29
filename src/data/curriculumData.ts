import { IMessageProblem, ScenarioQuest } from '../types';

export const COMPETENCY_INFO = {
  empathy: {
    name: '공감',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: 'HeartHandshake',
    desc: '상대의 입장에서 생각하고 마음을 헤아리는 힘'
  },
  communication: {
    name: '의사소통',
    color: 'text-sky-600',
    bg: 'bg-sky-500/10 border-sky-500/30',
    icon: 'MessageSquareShare',
    desc: '비난 없이 내 생각과 부탁을 또박또박 전하는 나-전달법'
  },
  self_regulation: {
    name: '감정조절',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: 'ShieldAlert',
    desc: '화가 솟구칠 때 6초 멈추고 마음을 가라앉히는 힘'
  },
  self_esteem: {
    name: '자기존중감',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10 border-purple-500/30',
    icon: 'Sparkles',
    desc: '남의 말에 흔들리지 않고 나를 귀하게 여기는 마음'
  },
  conflict_resolution: {
    name: '갈등해결',
    color: 'text-rose-600',
    bg: 'bg-rose-500/10 border-rose-500/30',
    icon: 'FlameKindling',
    desc: '다툼이 생겼을 때 주먹이나 욕 대신 둘 다 사는 길을 찾는 지혜'
  }
};

// Stage 3: 중학교 1학년 맞춤 실전 갈등 시나리오 4종
export const SCENARIO_QUESTS: ScenarioQuest[] = [
  {
    id: 'quest_soccer',
    category: '체육 & 점심시간',
    subjectTag: '체육 / 창체',
    title: '퀘스트 1: 경기 종료 직전, 놓쳐 버린 결정적 슛',
    situation: '점심시간 1학년 반 대항 축구 결승전. 동점 상황에서 완벽한 기회를 잡았지만 공이 골대 위로 넘어갔다. 종료 휘슬이 울리자 같은 반 주전 찬우가 씩씩거리며 다가온다.',
    contextDesc: '찬우가 잔뜩 화가 난 상태입니다. 어떻게 대응할까요?',
    opponentName: '박찬우 (주장)',
    opponentAvatar: '😤',
    opponentInitialSpeech: '"야! 그걸 왜 놓쳐? 다 이긴 경기를 너 때문에 졌잖아!"',
    choices: [
      {
        id: 'c1',
        text: '"너는 잘했냐? 네 패스가 엉망이었으면서 왜 나한테 뒤집어씌워?" 하고 맞받아친다.',
        scoreBonus: { conflict_resolution: -10, self_regulation: -10 },
        reaction: '찬우의 얼굴이 붉어지며 서로 멱살을 잡으려 합니다. 구경하던 친구들도 편이 갈려 분위기가 험악해졌습니다.',
        isBest: false,
        explanation: '비난에 비난으로 맞서면 문제는 그대로 둔 채 싸움만 커집니다. 화가 난 사람에게 지금 필요한 것은 반박이 아니라 잠깐의 시간입니다.',
        opponentState: '💥 화가 더 커짐 (갈등 심화)'
      },
      {
        id: 'c2',
        text: '6초간 깊게 숨을 고른 뒤: "나도 결정적인 기회를 놓쳐서 진짜 속상하고 팀에 미안해. 그런데 소리 지르며 몰아붙이니까 나도 당황스러워. 다음엔 패스 타이밍 같이 맞춰 보자."',
        scoreBonus: { self_regulation: 25, communication: 25, conflict_resolution: 20 },
        reaction: '찬우가 멈칫하더니 한숨을 쉬며 말합니다. "...나도 너무 흥분해서 소리 질렀다. 아쉬워서 그랬어."',
        isBest: true,
        explanation: '내 아쉬움과 미안함을 솔직히 인정하고, 상대의 태도에 대해서는 비난 대신 내 감정으로 말했습니다. 사과와 부탁을 함께 담으면 상대의 화도 가라앉습니다.',
        opponentState: '🤝 진정 및 화해'
      },
      {
        id: 'c3',
        text: '아무 말 없이 고개 숙인 채 교실로 들어가 버리고, 단톡방에 찬우 험담을 올린다.',
        scoreBonus: { communication: -15, empathy: -10 },
        reaction: '찬우는 무시당했다고 생각해 더 화가 났고, 단톡방 대화가 캡처되어 돌면서 일이 훨씬 커졌습니다.',
        isBest: false,
        explanation: '뒤에서 하는 험담은 결국 전해집니다. 온라인에 남긴 말은 지워도 캡처로 남아, 처음의 다툼보다 더 큰 상처와 책임으로 돌아옵니다.',
        opponentState: '📱 온라인으로 번진 갈등'
      }
    ]
  },
  {
    id: 'quest_gaming',
    category: '방과후 & 온라인 공간',
    subjectTag: '정보 / 도덕',
    title: '퀘스트 2: 게임에서 지고, 선을 넘는 말이 쏟아졌다',
    situation: '방과 후 친구들과 다섯 명이 팀을 이뤄 게임을 하다 연달아 졌다. 음성 채팅에서 민석이가 내 실력을 조롱하더니, 부모님까지 들먹이며 선을 넘는 말을 쏟아내기 시작했다.',
    contextDesc: '온라인 음성 채팅과 단톡방에서 벌어진 상황입니다.',
    opponentName: '김민석 (게임 친구)',
    opponentAvatar: '😡',
    opponentInitialSpeech: '"아 진짜 너 때문에 또 졌네. 게임 접어라 좀."',
    choices: [
      {
        id: 'g1',
        text: '"너 지금 선 넘었어. 나도 져서 기분 안 좋지만, 부모님 얘기랑 사람 깎아내리는 말은 못 넘어가. 사과해. 계속하면 나는 나갈 거고, 필요하면 선생님께 말할 거야."',
        scoreBonus: { self_esteem: 25, communication: 25, self_regulation: 20 },
        reaction: '음성 채팅이 조용해집니다. 옆에 있던 지훈이가 "솔직히 부모님 얘기는 네가 심했다. 사과해라"라고 거듭니다. 민석이가 머쓱해하며 사과합니다.',
        isBest: true,
        explanation: '욕으로 맞받아치지 않고 넘지 말아야 할 선을 분명히 그었습니다. 멈추지 않을 때 어떻게 할지까지 미리 말하는 것이 나를 지키는 방법입니다.',
        opponentState: '🛡️ 선을 인정하고 사과'
      },
      {
        id: 'g2',
        text: '똑같이 상대 가족을 걸고 더 심한 말을 마이크에 쏟아붓는다.',
        scoreBonus: { self_regulation: -20, communication: -20 },
        reaction: '음성 채팅이 엉망이 되고, 녹음된 내용이 반 단톡방에 퍼져 두 사람 모두 책임을 묻는 상황이 되었습니다.',
        isBest: false,
        explanation: '먼저 당했더라도 똑같이 갚으면 나도 상처를 준 사람이 됩니다. 온라인에 남은 기록은 누가 먼저였는지 가려 주지 않습니다.',
        opponentState: '⚠️ 둘 다 책임지는 상황'
      },
      {
        id: 'g3',
        text: '"장난이지?"라며 억지로 웃어넘기지만, 밤새 분해서 잠을 못 잔다.',
        scoreBonus: { self_esteem: -15 },
        reaction: '민석이는 "이 정도는 괜찮구나"라고 여겨 다음에도 같은 말을 반복하게 됩니다.',
        isBest: false,
        explanation: '불쾌한데 웃어넘기면 상대는 그것을 허락으로 받아들입니다. 참는 것은 배려가 아닙니다. 직접 말하기 어렵다면 어른에게 먼저 도움을 청해도 됩니다.',
        opponentState: '📉 마음의 상처가 쌓임'
      }
    ]
  },
  {
    id: 'quest_groupwork',
    category: '수업 & 모둠과제',
    subjectTag: '국어 / 과학 / 사회',
    title: '퀘스트 3: 발표 전날, 자기 몫을 하지 않는 모둠원',
    situation: '내일이 과학 탐구 발표날인데, 모둠원 진호가 자료 조사를 전혀 안 해 왔다. 수업 시간에 재촉하자 "네가 발표 자료 잘 만드니까 네가 다 해라, 난 학원 때문에 바빠"라며 폰만 본다.',
    contextDesc: '무책임한 태도에 속이 부글부글 끓습니다. 어떻게 해결할까요?',
    opponentName: '이진호 (모둠원)',
    opponentAvatar: '😒',
    opponentInitialSpeech: '"왜 그렇게 예민해~ 대충 인터넷에서 찾아 붙여. 너 금방 하잖아."',
    choices: [
      {
        id: 'w1',
        text: '"진호야, 네 명이 같이 받는 점수인데 네 몫까지 내가 다 하면 나도 억울하고 힘들어(감정). 3페이지에 들어갈 사진 2장만 지금 10분 동안 같이 찾자(구체적 부탁)."',
        scoreBonus: { communication: 25, conflict_resolution: 25, empathy: 15 },
        reaction: '진호가 폰을 주머니에 넣으며 머리를 긁적입니다. "...알았어, 10분이면 금방이니까 지금 할게."',
        isBest: true,
        explanation: '원망 대신 솔직한 부담을 털어놓고, 상대가 지금 당장 할 수 있는 작은 일을 제안해 협력을 이끌어 냈습니다.',
        opponentState: '🤝 협력으로 전환'
      },
      {
        id: 'w2',
        text: '"야, 네 이름 발표 자료에서 빼 버린다? 선생님한테 다 이를 거야!" 하고 소리친다.',
        scoreBonus: { conflict_resolution: -10, self_regulation: -10 },
        reaction: '진호가 "빼든지 말든지" 하며 자리를 박차고 나갑니다. 발표 준비는 더 어려워졌습니다.',
        isBest: false,
        explanation: '도움이 필요할 때 선생님께 말하는 것은 옳습니다. 다만 그것을 겁주는 수단으로 쓰면 상대는 방어부터 하게 되어 협력이 아예 끊깁니다. 먼저 부탁하고, 그래도 안 되면 선생님께 조정을 요청하세요.',
        opponentState: '💢 관계가 끊김'
      },
      {
        id: 'w3',
        text: '짜증나지만 그냥 밤새 혼자 다 해 버리고, 속으로 진호를 무시하기로 한다.',
        scoreBonus: { communication: -10, self_esteem: -10 },
        reaction: '혼자 밤새우느라 지쳐 발표를 망쳤고, 마음에는 억울함만 남았습니다.',
        isBest: false,
        explanation: '혼자 떠안으면 당장은 넘어가지만 억울함이 쌓여 관계를 갉아먹습니다. 참는 대신 말하거나, 선생님께 역할 조정을 요청하는 편이 낫습니다.',
        opponentState: '😶 혼자 떠안음'
      }
    ]
  },
  {
    id: 'quest_corridor',
    category: '쉬는시간 & 복도',
    subjectTag: '도덕 / 생활지도',
    title: '퀘스트 4: "장난인데?" 하며 자꾸 툭툭 치는 친구',
    situation: '쉬는 시간마다 동수가 와서 기분 나쁜 별명을 부르며 목덜미를 툭툭 치고 지나간다. 몹시 불쾌한데, 다른 애들이 보기엔 장난처럼 보여서 말하기가 애매하다.',
    contextDesc: '장난처럼 보이지만 반복되는 괴롭힘 상황입니다.',
    opponentName: '최동수 (같은 반)',
    opponentAvatar: '😏',
    opponentInitialSpeech: '"왜 그래~ 반가워서 한 대 친 거지. 장난인데 정색하기는."',
    choices: [
      {
        id: 'r1',
        text: '동수의 눈을 똑바로 보고 차분하지만 단호하게: "동수야, 너는 장난이어도 나는 몸을 치고 그 별명 부르는 게 불쾌해. 그만해 줘." 그래도 계속되면 선생님이나 부모님께 알린다.',
        scoreBonus: { self_esteem: 30, communication: 25, self_regulation: 20 },
        reaction: '동수가 당황하며 손을 내립니다. "어... 기분 나빴어? 미안하다, 안 그럴게."',
        isBest: true,
        explanation: '장난인지 아닌지는 당하는 사람이 정합니다. 멈춰 달라고 분명히 말하고, 그래도 멈추지 않으면 어른에게 알리세요. 도움을 청하는 것은 고자질이 아니라 나를 지키는 일입니다.',
        opponentState: '🛑 멈춤과 사과'
      },
      {
        id: 'r2',
        text: '기분 나쁜 티를 내며 뒤에서 발로 걷어찬다.',
        scoreBonus: { self_regulation: -25, conflict_resolution: -25 },
        reaction: '복도에서 몸싸움이 벌어져 두 사람 모두 다치고, 둘 다 책임을 지게 되었습니다.',
        isBest: false,
        explanation: '폭력으로 갚으면 상대의 장난이 정당해 보이게 되고, 나도 상처를 준 사람이 됩니다.',
        opponentState: '🚨 몸싸움으로 번짐'
      },
      {
        id: 'r3',
        text: '동수가 지나갈 때마다 복도나 화장실로 피해 다닌다.',
        scoreBonus: { self_esteem: -10 },
        reaction: '당장은 마주치지 않지만, 학교에 오는 일이 점점 무겁게 느껴집니다.',
        isBest: false,
        explanation: '피하고 싶은 마음은 잘못이 아닙니다. 다만 혼자 견디면 괴롭힘은 멈추지 않아요. 말하기 어렵다면 친구 한 명이나 선생님, 부모님께 알리는 것부터 시작하면 됩니다. 혼자 견디지 않는 것이 가장 중요합니다.',
        opponentState: '🌧️ 혼자 견디는 중'
      }
    ]
  }
];

// Stage 4: 나-전달법 카드 조합 (사실 + 감정 + 바람)
export const I_MESSAGE_PROBLEMS: IMessageProblem[] = [
  {
    id: 'imsg_1',
    situation: '체육 시간에 빌려 간 내 체육복을 땀에 젖은 채로 말도 없이 내 사물함에 그냥 넣어 놓았을 때',
    subjectCategory: '체육 / 생활습관',
    factOptions: [
      { id: 'f1', type: 'fact', text: '체육복을 땀에 젖은 채로 말없이 사물함에 넣어 둔 것을 보았을 때', isCorrect: true },
      { id: 'f2', type: 'fact', text: '네가 늘 남의 물건을 함부로 다루는 사람이라는 걸 또 확인했을 때', isCorrect: false },
      { id: 'f3', type: 'fact', text: '네가 아무 생각 없이 민폐를 끼쳤을 때', isCorrect: false }
    ],
    feelingOptions: [
      { id: 'e1', type: 'feeling', text: '당황스럽고 배려받지 못한 것 같아서 속상했어', isCorrect: true },
      { id: 'e2', type: 'feeling', text: '너 정말 예의 없다는 생각이 들었어', isCorrect: false },
      { id: 'e3', type: 'feeling', text: '그냥 네가 한심해 보였어', isCorrect: false }
    ],
    requestOptions: [
      { id: 'r1', type: 'request', text: '다음부터는 옷을 빌려가면 세탁해서 돌려주거나 미리 말해 줬으면 좋겠어', isCorrect: true },
      { id: 'r2', type: 'request', text: '앞으로 나한테 말도 걸지 마', isCorrect: false },
      { id: 'r3', type: 'request', text: '당장 새것으로 사 놔', isCorrect: false }
    ],
    tip: '💡 팁: 사실은 CCTV에 찍히듯 눈에 보이는 행동만 담고, 감정은 상대를 깎아내리는 말이 아닌 내 속마음을 담고, 바람은 상대가 할 수 있는 구체적인 행동으로 말합니다.'
  },
  {
    id: 'imsg_2',
    situation: '내가 좋아하는 캐릭터를 연습장에 그리고 있는데, 친구가 보더니 "그런 걸 왜 그려? 오글거린다"라며 비웃을 때',
    subjectCategory: '미술 / 자유시간',
    factOptions: [
      { id: 'f1', type: 'fact', text: '내가 열심히 그린 그림을 보고 비웃으며 오글거린다고 말했을 때', isCorrect: true },
      { id: 'f2', type: 'fact', text: '네가 남의 취미에 괜히 시비를 걸었을 때', isCorrect: false },
      { id: 'f3', type: 'fact', text: '볼 줄도 모르면서 아는 척하며 참견할 때', isCorrect: false }
    ],
    feelingOptions: [
      { id: 'e1', type: 'feeling', text: '내가 좋아하는 취미를 무시당한 것 같아 무안하고 자존심이 상했어', isCorrect: true },
      { id: 'e2', type: 'feeling', text: '순간 욱해서 너한테 소리치고 싶었어', isCorrect: false },
      { id: 'e3', type: 'feeling', text: '너랑 같은 반인 게 창피했어', isCorrect: false }
    ],
    requestOptions: [
      { id: 'r1', type: 'request', text: '네 취향이 아니더라도 내 취미를 깎아내리지 말고 존중해 줬으면 좋겠어', isCorrect: true },
      { id: 'r2', type: 'request', text: '앞으로 내 책상 근처에 오지 마', isCorrect: false },
      { id: 'r3', type: 'request', text: '너도 똑같이 당해 봐야 알겠지?', isCorrect: false }
    ],
    tip: '💡 팁: 친구 사이에서 서로의 취미(게임, 그림, 운동 등)를 깎아내리는 말이 갈등의 시작이 되곤 합니다. 취향이 달라도 존중해 달라고 말해 보세요.'
  },
  {
    id: 'imsg_3',
    situation: '수학 시험 점수가 떨어져 우울해하고 있는데, 친구가 100점 시험지를 흔들며 "이것도 틀렸어? 이걸 왜 못 맞혀?"라며 놀릴 때',
    subjectCategory: '수학 / 교과시간',
    factOptions: [
      { id: 'f1', type: 'fact', text: '내가 성적 때문에 속상해하는데 내 시험지를 보며 놀렸을 때', isCorrect: true },
      { id: 'f2', type: 'fact', text: '점수 좀 잘 나왔다고 잘난 척할 때', isCorrect: false },
      { id: 'f3', type: 'fact', text: '공부 좀 한다고 거만하게 굴 때', isCorrect: false }
    ],
    feelingOptions: [
      { id: 'e1', type: 'feeling', text: '노력했는데 결과가 안 나와서 가뜩이나 힘든데 더 위축되고 마음이 아팠어', isCorrect: true },
      { id: 'e2', type: 'feeling', text: '시험지를 찢어 던지고 싶었어', isCorrect: false },
      { id: 'e3', type: 'feeling', text: '네 점수도 떨어졌으면 좋겠다고 생각했어', isCorrect: false }
    ],
    requestOptions: [
      { id: 'r1', type: 'request', text: '친구가 힘들어할 땐 놀리기보다 조용히 있어 주거나 응원해 줬으면 좋겠어', isCorrect: true },
      { id: 'r2', type: 'request', text: '다음 시험엔 너도 망했으면 좋겠어', isCorrect: false },
      { id: 'r3', type: 'request', text: '내 시험지 근처에도 오지 마', isCorrect: false }
    ],
    tip: '💡 팁: 친구의 아쉬운 결과를 웃음거리로 만드는 것은 장난이 아니라 상처입니다. 놀리고 싶을 때 한 번 멈추고, 아픈 마음은 솔직하게 전해 보세요.'
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
      activity: '태블릿 접속 후 학년·반·번호와 이름 입력. 오늘 수업 시작 전 나의 기분 상태(에너지 1~5) 자가진단.',
      teacherTip: '기분을 고르는 데 정답이 없다는 점을 알려 주고, 낮은 에너지를 고른 학생은 활동 중에 따로 살피기'
    },
    {
      step: '전개 1 (10분)',
      name: '감정조절 6초 쿨다운',
      activity: '화가 치밀 때 뇌가 흥분했다 가라앉는 데 걸리는 6초의 원리 이해. 6초 호흡 애니메이션을 따라 하며 마음을 가라앉히고, 화 밑에 숨은 진짜 감정을 찾는 퀴즈 풀기.',
      teacherTip: '"욱할 때 바로 나간 주먹이나 댓글은 되돌릴 수 없다"는 점을 짚고, 교실 전체가 함께 6초 호흡을 실습해 보도록 안내'
    },
    {
      step: '전개 2 (15분)',
      name: '실전 갈등해결 퀘스트 (4대 상황)',
      activity: '중1이 가장 자주 겪는 4대 상황(경기 중 실수, 온라인에서의 선 넘는 말, 모둠과제 무임승차, 장난을 가장한 괴롭힘)을 체험하고 가장 나은 해결책 선택.',
      teacherTip: '"맞받아치기"와 "단톡방 뒷담화"의 실제 결과를 게임 피드백으로 체감하게 하고, 퀘스트 4에서는 "멈추지 않는 괴롭힘을 어른에게 알리는 것은 고자질이 아니라 나를 지키는 일"임을 반드시 짚어 주기'
    },
    {
      step: '전개 3 (8분)',
      name: '나-전달법 카드 조합',
      activity: '"너 때문에"라는 비난 대신 [사실]+[감정]+[바람] 카드 세 장을 조합해 건강하게 표현하는 언어 습관 익히기.',
      teacherTip: '"나-전달법은 참고 넘어가는 것이 아니라, 나도 지키고 관계도 지키는 말하기"임을 강조. 상대를 이기는 기술이 아니라는 점을 분명히 하기'
    },
    {
      step: '정리 (7분)',
      name: '어울림 인증서 & 1인 1실천 서약',
      activity: '5대 역량 점수와 오각형 차트 확인, "우리 반을 위한 나의 존중 서약" 1문장 작성, [결과 텍스트 전체 복사] 후 교사가 안내한 패들렛·구글 클래스룸에 붙여넣어 제출(복사가 안 되는 기기는 [결과 파일(.txt) 저장]으로 제출).',
      teacherTip: '결과는 학생 태블릿에만 저장되므로 수업 전에 제출할 패들렛·클래스룸 주소를 칠판이나 QR로 안내하고, 정리 시간에 제출까지 마치게 하기. 모은 서약은 교실 게시판에 붙여 학기 내내 실천 문화 형성'
    }
  ],
  subjectLinks: [
    { subject: '체육', linkTip: '경기 중 실수한 팀원에게 비난 대신 "괜찮아 다음 찬스 있어!" 격려 구호 만들기 실습' },
    { subject: '국어', linkTip: '비폭력 대화 단원 및 갈등을 다룬 소설 속 인물의 대화를 나-전달법으로 바꿔 쓰기' },
    { subject: '도덕', linkTip: '인간 존중과 평화적 갈등 해결 단원에서 장난과 괴롭힘의 경계선 토의하기' },
    { subject: '정보/기술', linkTip: '단톡방·온라인 게임 예절과 사이버 폭력의 책임, 캡처와 기록이 남는다는 점 교육' },
    { subject: '사회', linkTip: '민주적 의사결정으로 모둠 안의 역할 분담 규칙 함께 정하기' },
    { subject: '과학/수학', linkTip: '실험 모둠 활동의 역할 분담, 시험 결과 비교로 생기는 말의 상처 예방' },
    { subject: '창체/자율', linkTip: '학기 초 학급 규칙 세우기, 친구 사랑 주간 및 학교폭력 예방 어울림 주간 집중 프로그램' }
  ]
};
