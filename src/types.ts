export type CompetencyType = 'empathy' | 'communication' | 'self_regulation' | 'self_esteem' | 'conflict_resolution';

export interface CompetencyScore {
  empathy: number; // 공감
  communication: number; // 의사소통
  self_regulation: number; // 감정조절
  self_esteem: number; // 자기존중감
  conflict_resolution: number; // 갈등해결
}

export interface StudentProfile {
  grade: number; // 학년 (1~3학년)
  classNum: number; // 반 (1~12반)
  studentNumber: number; // 번호 (1~35번)
  name: string;
  initialEmotion: string;
  initialEnergy: number; // 1~5
  pledge: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  scoreBonus: Partial<CompetencyScore>;
  reaction: string;
  isBest: boolean;
  explanation: string;
  opponentState: string;
}

export interface MindReadOption {
  text: string;
  isCorrect: boolean;
}

// 대처법을 고르기 전에 상대(또는 당하는 친구)의 숨은 마음을 먼저 읽어 보는 공감 활동
export interface MindRead {
  question: string;
  options: MindReadOption[];
  insight: string;
}

export interface ScenarioQuest {
  id: string;
  category: string;
  subjectTag: string; // 교과 연계 태그 (예: 체육, 국어, 정보/창체, 도덕)
  title: string;
  situation: string;
  contextDesc: string;
  opponentName: string;
  opponentAvatar: string;
  opponentInitialSpeech: string;
  mindRead: MindRead;
  choices: ScenarioChoice[];
}

export interface IMessageCard {
  id: string;
  type: 'fact' | 'feeling' | 'request';
  text: string;
  isCorrect: boolean;
}

export interface IMessageProblem {
  id: string;
  situation: string;
  subjectCategory: string;
  factOptions: IMessageCard[];
  feelingOptions: IMessageCard[];
  requestOptions: IMessageCard[];
  tip: string;
}

export interface ConflictRecord {
  questId: string;
  questTitle: string;
  category: string;
  selectedChoiceText: string;
  isBest: boolean;
  explanation: string;
}

export type ReflectionJournal = {
  intro?: string;
  cooldown?: string;
  scenarios?: string;
  imessage?: string;
  cert?: string;
};

export type GameStage = 'character' | 'cooldown' | 'scenarios' | 'imessage' | 'cert' | 'map' | 'teacher_mode';
