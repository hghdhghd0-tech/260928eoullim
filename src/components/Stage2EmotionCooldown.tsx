import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';
import { ShieldAlert, Wind, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage2EmotionCooldownProps {
  onComplete: (scoreGain: number) => void;
  onOpenJournal?: () => void;
}

const EMOTION_VOCAB_QUIZZES = [
  {
    id: 1,
    situation: '나만 빼고 반 친구들이 주말에 모여서 논 걸 월요일에 알았을 때 ("아, 진짜 너무하네")',
    options: [
      { text: '소외감과 서운함 (나도 같이 어울리고 싶었는데 외로움)', isCorrect: true },
      { text: '적개심 (친구들에게 앙갚음하고 싶은 마음)', isCorrect: false },
      { text: '무관심 (아무 감정도 없음)', isCorrect: false }
    ],
    hint: '치미는 화 밑에는 "나도 친구들과 함께하고 싶었는데 빠졌다"는 서운함이 숨어 있습니다. 화를 내기 전에 그 마음을 먼저 알아차려 보세요.'
  },
  {
    id: 2,
    situation: '수업 시간에 발표하다가 목소리가 갈라져서 교실이 웃음바다가 됐을 때 ("아, 진짜 창피해")',
    options: [
      { text: '부끄러움과 무안함 (실수해서 민망하고 당황스러움)', isCorrect: true },
      { text: '반 친구들을 향한 미움', isCorrect: false },
      { text: '희열과 쾌감', isCorrect: false }
    ],
    hint: '실수했을 때 욱하는 것은 부끄러운 마음을 들키고 싶지 않아서 나오는 반응입니다. 부끄러움은 누구나 느끼는 자연스러운 감정이에요.'
  },
  {
    id: 3,
    situation: '친구가 내가 갖고 싶던 축구화를 신고 와서 자랑할 때 ("아, 왜 저래")',
    options: [
      { text: '부러움과 질투 (나도 갖고 싶은데 못 가져서 생기는 샘)', isCorrect: true },
      { text: '정의감 (부정한 행위를 단죄하고 싶은 마음)', isCorrect: false },
      { text: '안도감 (친구 덕분에 행복함)', isCorrect: false }
    ],
    hint: '상대의 자랑이 거슬리는 이유는 내 안의 부러움 때문입니다. "나도 갖고 싶었어"라고 인정하면 마음이 훨씬 가벼워집니다.'
  }
];

export const Stage2EmotionCooldown: React.FC<Stage2EmotionCooldownProps> = ({ onComplete, onOpenJournal }) => {
  // Breathing simulation state
  const [breathePhase, setBreathePhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breatheCount, setBreatheCount] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(6);
  const [breathingDone, setBreathingDone] = useState<boolean>(false);

  // Vocabulary Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // 틀린 보기는 지워 두고 다시 고를 수 있게 함. 점수는 처음에 맞혔을 때만
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Timer loop for breathing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathePhase !== 'idle' && !breathingDone) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            // cycle transitions
            if (breathePhase === 'inhale') {
              setBreathePhase('hold');
              return 1;
            } else if (breathePhase === 'hold') {
              setBreathePhase('exhale');
              sound.playBreatheChime(false);
              return 2;
            } else if (breathePhase === 'exhale') {
              const nextCount = breatheCount + 1;
              setBreatheCount(nextCount);
              if (nextCount >= 2) {
                // Completed 2 full 6-sec cycles
                setBreathingDone(true);
                sound.playSuccess();
                confetti({ particleCount: 50, spread: 60 });
                return 0;
              } else {
                setBreathePhase('inhale');
                sound.playBreatheChime(true);
                return 3;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathePhase, breatheCount, breathingDone]);

  const startBreathing = () => {
    sound.playClick();
    sound.playBreatheChime(true);
    setBreathePhase('inhale');
    setSeconds(3);
    setBreatheCount(0);
    setBreathingDone(false);
  };

  const handleAnswerSelect = (optionIdx: number, isCorrect: boolean) => {
    if (isCorrect) {
      setSelectedAnswer(optionIdx);
      sound.playSuccess();
      if (wrongPicks.length === 0) {
        setQuizScore((prev) => prev + 10);
      }
    } else {
      setWrongPicks((prev) => [...prev, optionIdx]);
      sound.playError();
    }
  };

  const handleNextQuiz = () => {
    sound.playClick();
    setSelectedAnswer(null);
    setWrongPicks([]);
    if (quizIndex < EMOTION_VOCAB_QUIZZES.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      sound.playLevelUp();
      confetti({ particleCount: 70, spread: 70 });
    }
  };

  const handleFinishStage = () => {
    sound.playSuccess();
    onComplete(quizScore + 30);
  };

  const currentQuiz = EMOTION_VOCAB_QUIZZES[quizIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stage Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>전개 1 (10분) : 감정조절 6초 쿨다운</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
          화가 치밀 때, <span className="text-emerald-600">6초만 기다려 보세요</span>
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          화가 나면 감정을 맡은 뇌(편도체)가 생각보다 먼저 반응합니다.
          <br />
          딱 <strong className="text-slate-900">6초만 숨을 고르면</strong> 생각하는 뇌(전두엽)가 다시 작동합니다!
        </p>

        {/* Clear Action Steps Banner */}
        <div className="bg-white shadow-sm ring-1 ring-slate-900/[0.04] rounded-2xl px-4 py-3 max-w-2xl mx-auto text-sm text-slate-600 flex items-center justify-center gap-2.5">
          <span className="shrink-0 font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">지금 할 일</span>
          <span>① 왼쪽 [6초 호흡] 2회 완료 → ② 오른쪽 [감정 퀴즈 3개] 풀기 → [다음 스테이지] 터치!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Part A: 6-Second Breathing Simulator */}
        <div className="bg-white/70 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-600 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-600" />
              미션 A: 6초 숨고르기 실습
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono">
              완료 횟수: {breatheCount}/2
            </span>
          </div>

          {/* Interactive Breathing Bubble */}
          <div className="my-8 relative flex items-center justify-center">
            {/* Outer animated halo */}
            <div
              className={`w-44 h-44 rounded-full flex items-center justify-center transition-all duration-1000 ${
                breathePhase === 'inhale'
                  ? 'scale-125 bg-sky-500/20 shadow-md shadow-slate-900/5 ring-4 ring-sky-400/50'
                  : breathePhase === 'hold'
                  ? 'scale-125 bg-amber-500/25 ring-4 ring-amber-400/60'
                  : breathePhase === 'exhale'
                  ? 'scale-90 bg-indigo-500/20 ring-2 ring-indigo-400/40'
                  : 'bg-slate-100/80 ring-2 ring-slate-200'
              }`}
            >
              {/* Inner core */}
              <div
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-700 ${
                  breathePhase === 'inhale'
                    ? 'bg-sky-600'
                    : breathePhase === 'hold'
                    ? 'bg-amber-600'
                    : breathePhase === 'exhale'
                    ? 'bg-indigo-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {breathePhase === 'idle' && !breathingDone && (
                  <span className="text-xs font-bold">호흡 시작 준비</span>
                )}
                {breathePhase === 'inhale' && (
                  <>
                    <span className="text-sm font-bold text-white/85">들이쉬기 (코)</span>
                    <span className="text-3xl font-black">{seconds}초</span>
                  </>
                )}
                {breathePhase === 'hold' && (
                  <>
                    <span className="text-sm font-bold text-white/85">잠깐 멈춤</span>
                    <span className="text-2xl font-black">Hold</span>
                  </>
                )}
                {breathePhase === 'exhale' && (
                  <>
                    <span className="text-sm font-bold text-white/85">내쉬기 (입)</span>
                    <span className="text-3xl font-black">{seconds}초</span>
                  </>
                )}
                {breathingDone && (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-white mb-1" />
                    <span className="text-sm font-bold text-white">쿨다운 성공!</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Button for Breathing */}
          <div className="w-full space-y-2">
            {!breathingDone ? (
              <button
                type="button"
                onClick={startBreathing}
                disabled={breathePhase !== 'idle'}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm shadow transition"
              >
                {breathePhase === 'idle' ? '▶ 6초 호흡 훈련 시작하기' : '호흡 진행 중... 호흡에 집중하세요'}
              </button>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>편도체 쿨다운 완료! 감정조절 역량이 올라갔어요</span>
              </div>
            )}
            <p className="text-xs text-slate-500">
              실제 화날 때: 속으로 1, 2, 3(들이쉼) 4(멈춤) 5, 6(내쉼)을 세어보세요.
            </p>
          </div>
        </div>

        {/* Part B: Emotion Word Detective (남학생 감정 어휘 확장) */}
        <div className="bg-white/70 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3 mb-4">
              <span className="font-bold text-slate-600 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                미션 B: "아 화나!" 속 진짜 감정 찾기
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-sky-700 font-mono">
                {quizIndex + 1} / {EMOTION_VOCAB_QUIZZES.length}
              </span>
            </div>

            {!quizFinished ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="text-xs text-amber-600 font-bold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    상황 제시
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {currentQuiz.situation}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Q. 이때 나의 내면에 숨은 '진짜 감정'은 무엇일까요?
                  </p>
                  {currentQuiz.options.map((opt, idx) => {
                    const isPicked = selectedAnswer === idx;
                    const isWrong = wrongPicks.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAnswerSelect(idx, opt.isCorrect)}
                        disabled={selectedAnswer !== null || isWrong}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between gap-3 ${
                          isPicked
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/50'
                            : isWrong
                            ? 'bg-rose-50 border-rose-200 text-rose-400'
                            : 'bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className={`font-medium ${isWrong ? 'line-through' : ''}`}>{opt.text}</span>
                        {isPicked && <span className="shrink-0">⭕ 정답!</span>}
                        {isWrong && <span className="shrink-0">❌</span>}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer === null && wrongPicks.length > 0 && (
                  <div className="p-3 bg-rose-50 rounded-xl text-sm text-rose-700 font-semibold">
                    아쉬워요! 그 감정 밑에 숨은 마음은 무엇일까요? 다른 보기를 다시 골라 보세요.
                  </div>
                )}

                {selectedAnswer !== null && (
                  <div className="p-3 bg-indigo-50 border border-indigo-500/20 rounded-xl text-xs text-indigo-800 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <span>💡 감정 해설:</span>
                    </p>
                    <p className="text-slate-600 leading-relaxed">{currentQuiz.hint}</p>
                    {wrongPicks.length > 0 && (
                      <p className="text-slate-500">다시 생각해서 찾았어요! 점수는 처음에 맞혔을 때만 올라가요.</p>
                    )}
                    <div className="pt-2 text-right">
                      <button
                        onClick={handleNextQuiz}
                        className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold inline-flex items-center gap-1 shadow"
                      >
                        <span>다음 문제</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="text-4xl">🎯</div>
                <h4 className="font-extrabold text-slate-900 text-lg">
                  감정 어휘 탐색 완료!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "짜증나 / 화나" 대신 내 진짜 마음(서운함, 당황스러움, 부끄러움, 부러움)을
                  알아차리는 것이 감정조절의 첫걸음입니다.
                </p>
                <div className="text-amber-600 font-bold text-sm">
                  감정조절 역량 +{quizScore + 30} (호흡 +30, 퀴즈 +{quizScore})
                </div>
              </div>
            )}
          </div>

          {/* Bottom Next Step Button */}
          {breathingDone && quizFinished && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              {onOpenJournal && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenJournal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-50 text-sky-800 border border-sky-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>💡 잠깐! 2단계에서 느낀 점을 성찰 일지에 1줄 기록해볼까요?</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleFinishStage}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-slate-900/5 flex items-center justify-center gap-2 transform active:scale-98 transition"
              >
                <span>스테이지 2 클리어! 실전 RPG 퀘스트로 이동</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
