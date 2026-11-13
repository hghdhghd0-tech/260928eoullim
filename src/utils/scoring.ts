import { CompetencyScore, CompetencyType } from '../types';
import { SCENARIO_QUESTS, I_MESSAGE_PROBLEMS } from '../data/curriculumData';

// 모든 역량은 20점에서 시작
export const BASE_SCORE = 20;
// 도입 감정 체크인 (자기존중감)
export const CHECK_IN_BONUS = 16;
// 2단계: 6초 호흡 +30, 감정 퀴즈 3문제 × 10 (감정조절)
export const COOLDOWN_MAX = 30 + 3 * 10;
// 3단계: 퀘스트마다 '친구 마음 읽기'를 한 번에 맞히면 공감 +10
export const MIND_READ_BONUS = 10;
// 4단계: 나-전달법 카드 조합 한 문제당 의사소통 +35
export const IMESSAGE_BONUS = 35;

const KEYS: CompetencyType[] = ['empathy', 'communication', 'self_regulation', 'self_esteem', 'conflict_resolution'];

// 모든 활동을 가장 잘했을 때 받을 수 있는 역량별 최고 점수.
// 역량마다 점수를 주는 활동 수가 달라서(의사소통은 많고 공감은 적음) 원점수를 그대로 비교하면
// 공감이 늘 바닥처럼 보임. 그래서 인증서에는 최고 점수 대비 달성도(%)로 보여 줌
export const MAX_SCORES: CompetencyScore = (() => {
  const max: CompetencyScore = {
    empathy: BASE_SCORE,
    communication: BASE_SCORE,
    self_regulation: BASE_SCORE + COOLDOWN_MAX,
    self_esteem: BASE_SCORE + CHECK_IN_BONUS,
    conflict_resolution: BASE_SCORE
  };
  max.empathy += SCENARIO_QUESTS.length * MIND_READ_BONUS;
  max.communication += I_MESSAGE_PROBLEMS.length * IMESSAGE_BONUS;
  SCENARIO_QUESTS.forEach((q) => {
    const best = q.choices.find((c) => c.isBest);
    KEYS.forEach((k) => {
      max[k] += Math.max(0, best?.scoreBonus[k] ?? 0);
    });
  });
  return max;
})();

// 원점수 → 달성도(0~100)
export const toPercent = (key: CompetencyType, raw: number) =>
  Math.max(0, Math.min(100, Math.round((raw / MAX_SCORES[key]) * 100)));
