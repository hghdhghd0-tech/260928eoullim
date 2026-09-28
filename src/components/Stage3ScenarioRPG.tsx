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
    if (choice.isBest) {
      sound.playSuccess();
      confetti({ particleCount: 45, spread: 50 });
    } else {
      sound.playError();
    }

    // Merge score
    setAccumulatedScores((prev) => {
      const next = { ...prev };
      Object.entries(choice.scoreBonus).forEach(([key, val]) => {
        if (val !== undefined) {
          next[key as keyof CompetencyScore] = Math.max(0, (next[key as keyof CompetencyScore] || 0) + val);
        }
      });
      return next;
    });
  };

  const handleNextQuest = () => {
    if (!selectedChoice) return;
    sound.playClick();

    const currentRecord: ConflictRecord = {
      questId: currentQuest.id,
      questTitle: currentQuest.title,
      category: currentQuest.category,
      selectedChoiceText: selectedChoice.text,
      isBest: selectedChoice.isBest,
      explanation: selectedChoice.explanation
    };

    const updatedRecords = [...conflictRecords, currentRecord];
    setConflictRecords(updatedRecords);
    setSelectedChoice(null);

    if (!isLastQuest) {
      setQuestIndex((prev) => prev + 1);
    } else {
      sound.playLevelUp();
      confetti({ particleCount: 90, spread: 80 });
      onComplete(accumulatedScores, updatedRecords);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold tracking-wide">
          <Swords className="w-3.5 h-3.5" />
          <span>전개 2 (15분) : 실전 갈등해결 시나리오 RPG (4대 퀘스트)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">
          일상의 갈등 상황, <span className="text-rose-400">당신의 선택</span>은?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          중학교 1학년 일상에서 가장 흔히 일어나는 리얼한 갈등 상황입니다.
          <br />
          비난이나 주먹 대신, 상대를 설득하고 나를 지키는 <strong className="text-rose-300">최선의 대화법</strong>을 찾아보세요!
        </p>

        {/* Clear Action Steps Banner */}
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 max-w-xl mx-auto text-xs text-rose-200 flex items-center justify-center gap-2">
          <span className="font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">지금 할 일</span>
          <span>① 상황과 친구 말 읽기 → ② 가장 지혜로운 대처법 1개 터치 → ③ [다음 퀘스트] 터치 (총 4개)</span>
        </div>
      </div>

      {/* Quest Progress Tracker */}
      <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">퀘스트 진행도:</span>
          <span className="text-amber-400 font-extrabold">{questIndex + 1} / {SCENARIO_QUESTS.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {SCENARIO_QUESTS.map((q, idx) => (
            <div
              key={q.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition ${
                idx < questIndex
                  ? 'bg-emerald-500 text-white shadow'
                  : idx === questIndex
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-900'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-1 text-indigo-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>교과 연계: {currentQuest.subjectTag}</span>
        </div>
      </div>

      {/* Main RPG Scenario Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Banner with Subject & Title */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 mr-2">
              {currentQuest.category}
            </span>
            <h3 className="text-lg md:text-xl font-black text-white mt-1">
              {currentQuest.title}
            </h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
            {currentQuest.contextDesc}
          </span>
        </div>

        {/* Story description & Opponent NPC Dialogue */}
        <div className="p-6 space-y-5">
          {/* Situation Box */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
            <p className="font-medium">{currentQuest.situation}</p>
          </div>

          {/* NPC Encounter Dialogue */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-950 border border-rose-500/20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {currentQuest.opponentAvatar}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">
                  {currentQuest.opponentName}
                </span>
                <span className="text-[10px] text-rose-400/80 font-mono">
                  상대방 상태: 분노/흥분 상태
                </span>
              </div>
              <p className="text-sm font-semibold text-white tracking-wide">
                {currentQuest.opponentInitialSpeech}
              </p>
            </div>
          </div>

          {/* Player Choice Options */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              나의 대응 스킬 선택 (가장 현명한 존중의 대처법은?)
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
                          ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10'
                          : 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {choice.text}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="shrink-0">
                          {choice.isBest ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
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
          {selectedChoice && (
            <div
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                selectedChoice.isBest
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-100'
              }`}
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  {selectedChoice.isBest ? '✨ 퀘스트 대성공! (상대방 반응)' : '⚠️ 아쉬운 결과 (상대방 반응)'}
                </span>
                <span className="text-xs font-bold bg-slate-900/60 px-2 py-0.5 rounded">
                  {selectedChoice.opponentState}
                </span>
              </div>

              <p className="text-sm font-medium text-white italic">
                "{selectedChoice.reaction}"
              </p>

              <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">
                  🎓 어울림 솔루션 해설:
                </span>
                <p>{selectedChoice.explanation}</p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleNextQuest}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-extrabold text-xs shadow flex items-center gap-1.5 transition active:scale-95"
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
