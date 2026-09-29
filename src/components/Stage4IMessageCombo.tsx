import React, { useState } from 'react';
import { I_MESSAGE_PROBLEMS } from '../data/curriculumData';
import { IMessageCard } from '../types';
import { sound } from '../utils/sound';
import { MessageSquareShare, Zap, CheckCircle2, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage4IMessageComboProps {
  onComplete: (scoreGain: number) => void;
}

export const Stage4IMessageCombo: React.FC<Stage4IMessageComboProps> = ({ onComplete }) => {
  const [problemIndex, setProblemIndex] = useState<number>(0);
  const [selectedFact, setSelectedFact] = useState<IMessageCard | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<IMessageCard | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<IMessageCard | null>(null);
  const [comboResult, setComboResult] = useState<'idle' | 'success' | 'fail'>('idle');
  const [totalEarned, setTotalEarned] = useState<number>(0);

  const currentProblem = I_MESSAGE_PROBLEMS[problemIndex];
  const isLastProblem = problemIndex === I_MESSAGE_PROBLEMS.length - 1;

  const handleExecuteCombo = () => {
    if (!selectedFact || !selectedFeeling || !selectedRequest) return;

    const isAllCorrect = selectedFact.isCorrect && selectedFeeling.isCorrect && selectedRequest.isCorrect;

    if (isAllCorrect) {
      sound.playLevelUp();
      setComboResult('success');
      setTotalEarned((prev) => prev + 35);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      sound.playError();
      setComboResult('fail');
    }
  };

  const handleResetCombo = () => {
    sound.playClick();
    setSelectedFact(null);
    setSelectedFeeling(null);
    setSelectedRequest(null);
    setComboResult('idle');
  };

  const handleNextProblem = () => {
    sound.playClick();
    setSelectedFact(null);
    setSelectedFeeling(null);
    setSelectedRequest(null);
    setComboResult('idle');

    if (!isLastProblem) {
      setProblemIndex((prev) => prev + 1);
    } else {
      onComplete(totalEarned);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <MessageSquareShare className="w-3.5 h-3.5" />
          <span>전개 3 (8분) : 나-전달법(I-Message) 콤보 제조기</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
          "너 때문에!" 대신 <span className="text-emerald-600">3단 존중 스킬</span>을 장착하라!
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          너-전달법(You-Message)은 상대를 공격하여 싸움을 키웁니다.
          <br />
          <strong className="text-slate-900">[사실] + [감정] + [바람]</strong> 세 카드를 조합해 강력한 대화 스킬을 완성해보세요!
        </p>

        {/* Clear Action Steps Banner */}
        <div className="bg-white shadow-sm ring-1 ring-slate-900/[0.04] rounded-2xl px-4 py-3 max-w-2xl mx-auto text-sm text-slate-600 flex items-center justify-center gap-2.5">
          <span className="shrink-0 font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">지금 할 일</span>
          <span>① 사실 카드 + ② 감정 카드 + ③ 바람 카드 각 1장 터치 → [콤보 스킬 발동] 터치!</span>
        </div>
      </div>

      {/* Progress & Category */}
      <div className="flex items-center justify-between bg-white/80 px-4 py-2.5 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">콤보 훈련 진행:</span>
          <span className="text-sky-600 font-extrabold">{problemIndex + 1} / {I_MESSAGE_PROBLEMS.length}</span>
        </div>
        <span className="text-indigo-700 font-semibold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
          교과 영역: {currentProblem.subjectCategory}
        </span>
      </div>

      {/* Situation Board */}
      <div className="bg-white/90 border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-amber-600 block mb-1">
            🎯 대화가 필요한 갈등 상황:
          </span>
          <p className="text-sm md:text-base font-semibold text-slate-900">
            "{currentProblem.situation}"
          </p>
        </div>

        {/* 3 Step Combo Slots Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Slot 1: Fact */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-sky-500/20 flex flex-col justify-between">
            <span className="text-xs font-bold text-sky-600 flex items-center justify-between">
              <span>① 객관적 사실 (Fact)</span>
              <span>"~했을 때"</span>
            </span>
            <div className="my-2 min-h-[50px] flex items-center justify-center p-2 rounded-lg bg-white border border-slate-100 text-xs text-center text-slate-600">
              {selectedFact ? (
                <span className="font-semibold text-slate-900">{selectedFact.text}</span>
              ) : (
                <span className="text-slate-400 italic">아래에서 사실 카드를 고르세요</span>
              )}
            </div>
          </div>

          {/* Slot 2: Feeling */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-purple-500/20 flex flex-col justify-between">
            <span className="text-xs font-bold text-purple-600 flex items-center justify-between">
              <span>② 나의 솔직한 감정 (Feeling)</span>
              <span>"나는 ~했어"</span>
            </span>
            <div className="my-2 min-h-[50px] flex items-center justify-center p-2 rounded-lg bg-white border border-slate-100 text-xs text-center text-slate-600">
              {selectedFeeling ? (
                <span className="font-semibold text-slate-900">{selectedFeeling.text}</span>
              ) : (
                <span className="text-slate-400 italic">아래에서 감정 카드를 고르세요</span>
              )}
            </div>
          </div>

          {/* Slot 3: Request */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-between">
              <span>③ 구체적 바람 (Request)</span>
              <span>"앞으로 ~해줘"</span>
            </span>
            <div className="my-2 min-h-[50px] flex items-center justify-center p-2 rounded-lg bg-white border border-slate-100 text-xs text-center text-slate-600">
              {selectedRequest ? (
                <span className="font-semibold text-slate-900">{selectedRequest.text}</span>
              ) : (
                <span className="text-slate-400 italic">아래에서 바람 카드를 고르세요</span>
              )}
            </div>
          </div>
        </div>

        {/* Card Selections */}
        {comboResult === 'idle' && (
          <div className="space-y-4 pt-2">
            {/* Fact Options */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-sky-700">
                1단계: 상대방을 비난하지 않고 CCTV처럼 본 그대로(사실) 고르기:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentProblem.factOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedFact(f);
                    }}
                    className={`p-4 min-h-[56px] rounded-xl text-sm text-left border transition ${
                      selectedFact?.id === f.id
                        ? 'bg-sky-500/20 border-sky-400 text-sky-800 ring-2 ring-sky-400/40'
                        : 'bg-slate-50/60 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {f.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Feeling Options */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-purple-700">
                2단계: 분노나 욕설 대신 나의 진짜 속마음(감정) 고르기:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentProblem.feelingOptions.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedFeeling(e);
                    }}
                    className={`p-4 min-h-[56px] rounded-xl text-sm text-left border transition ${
                      selectedFeeling?.id === e.id
                        ? 'bg-purple-500/20 border-purple-400 text-purple-800 ring-2 ring-purple-400/40'
                        : 'bg-slate-50/60 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {e.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Request Options */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-700">
                3단계: 협박이 아닌 실행 가능한 정중한 부탁(바람) 고르기:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentProblem.requestOptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedRequest(r);
                    }}
                    className={`p-4 min-h-[56px] rounded-xl text-sm text-left border transition ${
                      selectedRequest?.id === r.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-800 ring-2 ring-emerald-400/40'
                        : 'bg-slate-50/60 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {r.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExecuteCombo}
                disabled={!selectedFact || !selectedFeeling || !selectedRequest}
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-sm shadow-lg shadow-slate-900/5 flex items-center justify-center gap-2 transform active:scale-98 transition"
              >
                <Zap className="w-4 h-4 text-amber-700" />
                <span>나-전달법 리스펙트 콤보 스킬 발동!</span>
              </button>
            </div>
          </div>
        )}

        {/* Result Outcome */}
        {comboResult !== 'idle' && (
          <div
            className={`p-5 rounded-xl border space-y-4 ${
              comboResult === 'success'
                ? 'bg-emerald-50 border-emerald-500/50 text-emerald-900'
                : 'bg-rose-50 border-rose-500/50 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {comboResult === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Award className="w-6 h-6 text-rose-600" />
                )}
                <span className="font-extrabold text-base">
                  {comboResult === 'success'
                    ? '✨ PERFECT COMBO! 존중 대화 스킬 발동 성공!'
                    : '💥 콤보 미완성! 상대방을 자극하는 말이 섞여 있습니다'}
                </span>
              </div>
              <span className="text-xs font-mono bg-white/70 px-2.5 py-1 rounded">
                {comboResult === 'success' ? '의사소통 역량 +35' : '카드 재조합 필요'}
              </span>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-600">
              <p className="font-bold text-amber-700 mb-1">{currentProblem.tip}</p>
              {comboResult === 'fail' && (
                <p className="text-rose-700">
                  ※ 비난조의 단어('인성', '개념', '거지', '저주')가 들어가면 나-전달법이 아니라 공격이 됩니다. 다시 조합해보세요!
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {comboResult === 'fail' ? (
                <button
                  type="button"
                  onClick={handleResetCombo}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>카드 다시 고르기</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextProblem}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>{isLastProblem ? '모든 콤보 마스터! 최종 인증서 받기' : '다음 문제 도전'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
