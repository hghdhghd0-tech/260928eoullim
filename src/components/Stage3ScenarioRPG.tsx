import React, { useState } from 'react';
import { SCENARIO_QUESTS } from '../data/curriculumData';
import { CompetencyScore, ScenarioChoice, ConflictRecord } from '../types';
import { sound } from '../utils/sound';
import { Swords, CheckCircle2, XCircle, ArrowRight, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage3ScenarioRPGProps {
  onComplete: (scoreBonus: Partial<CompetencyScore>, records: ConflictRecord[]) => void;
}

export const Stage3ScenarioRPG: React.FC<Stage3ScenarioRPGProps> = ({ onComplete }) => {
  const [questIndex, setQuestIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  // 점수와 기록은 처음 고른 답으로 정함. 다른 답은 눌러서 해설만 비교해 볼 수 있음
  const [firstChoice, setFirstChoice] = useState<ScenarioChoice | null>(null);
  const [conflictRecords, setConflictRecords] = useState<ConflictRecord[]>([]);
  const [accumulatedScores, setAccumulatedScores] = useState<CompetencyScore>({
    empathy: 0,
    communication: 0,
    self_regulation: 0,
    self_esteem: 0,
    conflict_resolution: 0
  });

  const currentQuest = SCENARIO_QUESTS[questIndex];
  const isLastQuest = questIndex === SCENARIO_QUESTS.length - 1;

  const handleSelectChoice = (choice: ScenarioChoice) => {
    setSelectedChoice(choice);
    if (!firstChoice) setFirstChoice(choice);
    if (choice.isBest) {
      sound.playSuccess();
      confetti({ particleCount: 45, spread: 50 });
    } else {
      sound.playError();
    }
  };

  const handleNextQuest = () => {
    if (!selectedChoice || !firstChoice) return;
    sound.playClick();

    const currentRecord: ConflictRecord = {
      questId: currentQuest.id,
      questTitle: currentQuest.title,
      category: currentQuest.category,
      selectedChoiceText: firstChoice.text,
      isBest: firstChoice.isBest,
      explanation: firstChoice.explanation
    };

    // 점수는 퀘스트마다 처음 고른 선택지 1개만 반영 (여러 번 눌러 점수가 불어나지 않도록)
    const nextScores = { ...accumulatedScores };
    Object.entries(firstChoice.scoreBonus).forEach(([key, val]) => {
      if (val !== undefined) {
        nextScores[key as keyof CompetencyScore] = Math.max(0, (nextScores[key as keyof CompetencyScore] || 0) + val);
      }
    });
    setAccumulatedScores(nextScores);

    const updatedRecords = [...conflictRecords, currentRecord];
    setConflictRecords(updatedRecords);
    setSelectedChoice(null);
    setFirstChoice(null);

    if (!isLastQuest) {
      setQuestIndex((prev) => prev + 1);
    } else {
      sound.playLevelUp();
      confetti({ particleCount: 90, spread: 80 });
      onComplete(nextScores, updatedRecords);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Swords className="w-3.5 h-3.5" />
          <span>전개 2 (15분) : 실전 갈등해결 시나리오 RPG (4대 퀘스트)</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
          이런 상황, <span className="text-emerald-600">나는 어떻게</span> 말할까?
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          중학교 1학년 교실에서 실제로 자주 일어나는 갈등 상황입니다.
          <br />
          비난이나 주먹 대신, <strong className="text-slate-900">나도 지키고 관계도 지키는 말</strong>을 찾아보세요.
        </p>

        {/* Clear Action Steps Banner */}
        <div className="bg-white shadow-sm ring-1 ring-slate-900/[0.04] rounded-2xl px-4 py-3 max-w-2xl mx-auto text-sm text-slate-600 flex items-center justify-center gap-2.5">
          <span className="shrink-0 font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">지금 할 일</span>
          <span>① 상황과 친구 말 읽기 → ② 가장 지혜로운 대처법 1개 터치 → ③ [다음 퀘스트] 터치 (총 4개)</span>
        </div>
      </div>

      {/* Quest Progress Tracker */}
      <div className="flex items-center justify-between bg-white/80 px-4 py-2.5 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">퀘스트 진행도:</span>
          <span className="text-amber-600 font-extrabold">{questIndex + 1} / {SCENARIO_QUESTS.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {SCENARIO_QUESTS.map((q, idx) => (
            <div
              key={q.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition ${
                idx < questIndex
                  ? 'bg-emerald-100 text-emerald-700'
                  : idx === questIndex
                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/15'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-1 text-indigo-700 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>교과 연계: {currentQuest.subjectTag}</span>
        </div>
      </div>

      {/* Main RPG Scenario Card */}
      <div className="bg-white/90 border border-slate-100 rounded-2xl overflow-hidden shadow-md ">
        {/* Banner with Subject & Title */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 mr-2">
              {currentQuest.category}
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1">
              {currentQuest.title}
            </h3>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg">
            {currentQuest.contextDesc}
          </span>
        </div>

        {/* Story description & Opponent NPC Dialogue */}
        <div className="p-6 space-y-5">
          {/* Situation Box */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
            <p className="font-medium">{currentQuest.situation}</p>
          </div>

          {/* NPC Encounter Dialogue */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-50 border border-rose-500/20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {currentQuest.opponentAvatar}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700">
                  {currentQuest.opponentName}
                </span>
                <span className="text-xs text-rose-600/80 font-mono">
                  상대방 상태: 분노/흥분 상태
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 tracking-wide">
                {currentQuest.opponentInitialSpeech}
              </p>
            </div>
          </div>

          {/* Player Choice Options */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              나의 대응 선택 (가장 현명한 존중의 대처법은?)
            </p>

            <div className="space-y-2.5">
              {currentQuest.choices.map((choice, idx) => {
                const isSelected = selectedChoice?.id === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelectChoice(choice)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition flex flex-col gap-2 ${
                      isSelected
                        ? choice.isBest
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-slate-900/5'
                          : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-slate-900/5'
                        : 'bg-slate-50/60 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className={`font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                          {choice.text}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="shrink-0">
                          {choice.isBest ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Immediate RPG Reaction & Educational Feedback */}
          {firstChoice && !firstChoice.isBest && (
            <p className="text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3">
              점수는 <strong className="text-slate-900">처음 고른 답</strong>으로 정해져요. 다른 답도 눌러서 해설을 비교해 보세요.
            </p>
          )}

          {selectedChoice && (
            <div
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                selectedChoice.isBest
                  ? 'bg-emerald-50 border-emerald-500/50 text-emerald-900'
                  : 'bg-amber-50 border-amber-500/50 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  {selectedChoice.isBest ? '✨ 좋은 선택이었어요 (상대 반응)' : '⚠️ 아쉬운 결과 (상대 반응)'}
                </span>
                <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded">
                  {selectedChoice.opponentState}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-900 italic">
                "{selectedChoice.reaction}"
              </p>

              <div className="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                <span className="font-bold text-amber-700 block mb-1">
                  🎓 왜 그럴까요?
                </span>
                <p>{selectedChoice.explanation}</p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleNextQuest}
                  className="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-sm shadow flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>{isLastQuest ? '모든 퀘스트 완료! 다음 스테이지로' : '다음 갈등 퀘스트로'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
