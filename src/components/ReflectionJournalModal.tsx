import React, { useState, useEffect } from 'react';
import { GameStage, ReflectionJournal, StudentProfile } from '../types';
import { sound } from '../utils/sound';
import { BookOpen, X, Check, Sparkles, MessageSquare, Wind, Swords, Award, Lightbulb, Save } from 'lucide-react';

interface ReflectionJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  journal: ReflectionJournal;
  onSave: (updated: ReflectionJournal) => void;
  currentStage?: GameStage;
  student?: StudentProfile | null;
}

interface StageInfo {
  key: keyof ReflectionJournal;
  stageNum: string;
  title: string;
  icon: React.ReactNode;
  question: string;
  placeholder: string;
  suggestions: string[];
}

const STAGE_QUESTIONS: StageInfo[] = [
  {
    key: 'intro',
    stageNum: '1단계',
    title: '도입 & 감정진단',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    question: '수업 시작 전 나의 기분과 감정 배터리 상태는 어땠나요? 오늘 45분 어울림 수업에 어떤 마음가짐으로 임하고 싶나요?',
    placeholder: '예: 오늘 몸이 좀 피곤했는데, 친구들과 다투지 않고 퀘스트를 깨며 즐겁게 에너지를 채우고 싶다.',
    suggestions: [
      '오늘 내 기분이 어떤지 솔직하게 돌아보고 시작해서 마음이 편해졌어요.',
      '피곤한 상태였지만 퀘스트를 깨며 에너지를 100% 충전하고 싶어요.',
      '친구들과 사소한 일로 다투지 않고 서로 배려하며 수업에 집중할래요.'
    ]
  },
  {
    key: 'cooldown',
    stageNum: '2단계',
    title: '6초 쿨다운 & 감정조절',
    icon: <Wind className="w-4 h-4 text-sky-400" />,
    question: '화가 날 때 6초 호흡을 해보거나, "빡침" 뒤의 진짜 감정(속상함, 무안함, 서운함)을 찾아보니 어떤 생각이 들었나요?',
    placeholder: '예: 욱해서 바로 욕하거나 화내지 말고, 6초 동안 숨을 크게 쉬어야겠다고 느꼈다.',
    suggestions: [
      '화날 때 바로 소리 지르지 않고 6초 심호흡을 먼저 해야겠어요.',
      '친구가 짜증 낼 때 그 뒤에 속상한 마음이 있다는 걸 알게 됐어요.',
      '내 진짜 감정이 무엇인지 한 번 더 돌아보는 습관을 기를 거예요.'
    ]
  },
  {
    key: 'scenarios',
    stageNum: '3단계',
    title: '실전 갈등해결 RPG',
    icon: <Swords className="w-4 h-4 text-rose-400" />,
    question: '축구 실수, 게임/단톡방 패드립, 조별과제 무임승차 등 갈등 상황에서 비난 대신 현명한 선택을 해보며 무엇을 깨달았나요?',
    placeholder: '예: 맞받아쳐서 싸우면 둘 다 손해고, 차분하게 원인을 짚고 선을 긋는 대화가 최고라는 걸 배웠다.',
    suggestions: [
      '맞받아쳐서 욕하기보다 차분하고 단호하게 선을 긋는 게 더 멋있어요.',
      '단톡방에서 친구를 몰아세우는 건 심각한 사이버폭력이 될 수 있어요.',
      '친구의 실수를 비난하기보다 "다음 기회에 잘하자"고 격려할래요.'
    ]
  },
  {
    key: 'imessage',
    stageNum: '4단계',
    title: '나-전달법(I-Message)',
    icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
    question: '"너 때문에 망했잖아!" 같은 비난 대신, [사실]+[내 솔직한 감정]+[구체적 바람]으로 표현해보니 어떤 느낌이 들었나요?',
    placeholder: '예: 상대를 공격하지 않고 내 기분을 사실대로 말하니까 싸움이 안 나고 대화가 통할 것 같다.',
    suggestions: [
      '"너 때문에"라고 탓하지 않고 내 솔직한 기분을 전하는 법을 배웠어요.',
      '화난 채로 말하면 싸움이 되지만, 나-전달법으로 말하면 설득이 돼요.',
      '앞으로 친구가 선을 넘거나 서운하게 할 때 나-전달법 3단계를 쓸 거예요.'
    ]
  },
  {
    key: 'cert',
    stageNum: '5단계',
    title: '종합 성찰 & 나의 다짐',
    icon: <Award className="w-4 h-4 text-amber-400" />,
    question: '오늘 45분 어울림 수업 전체를 마치며, 우리 반 친구들과 나 자신에게 전하고 싶은 솔직한 한마디는?',
    placeholder: '예: 우리 반 24명이 서로 장난으로 상처 주지 않고 편안하게 지내는 교실을 만들고 싶다.',
    suggestions: [
      '우리 반 친구들이 서로 장난으로 상처 주지 않고 존중했으면 좋겠어요.',
      '사소한 오해로 친구와 주먹다짐하지 않고 먼저 대화로 풀겠습니다.',
      '나 자신을 존중하고 친구의 마음도 배려하는 멋진 학생이 되겠습니다.'
    ]
  }
];

export const ReflectionJournalModal: React.FC<ReflectionJournalModalProps> = ({
  isOpen,
  onClose,
  journal,
  onSave,
  currentStage,
  student
}) => {
  const [formData, setFormData] = useState<ReflectionJournal>(journal);
  const [activeTab, setActiveTab] = useState<keyof ReflectionJournal>('intro');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setFormData(journal);
  }, [journal]);

  useEffect(() => {
    if (currentStage) {
      if (currentStage === 'character') {
        setActiveTab('intro');
      } else if (currentStage === 'cooldown' || currentStage === 'scenarios' || currentStage === 'imessage' || currentStage === 'cert') {
        setActiveTab(currentStage);
      }
    }
  }, [currentStage, isOpen]);

  if (!isOpen) return null;

  const handleTextChange = (key: keyof ReflectionJournal, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplySuggestion = (key: keyof ReflectionJournal, suggestion: string) => {
    sound.playClick();
    const current = formData[key] || '';
    if (current.trim().length === 0) {
      handleTextChange(key, suggestion);
    } else {
      handleTextChange(key, `${current} ${suggestion}`);
    }
  };

  const handleSaveAndClose = () => {
    sound.playSuccess();
    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  // Count completed entries
  const filledCount = Object.values(formData).filter((v) => (v || '').trim().length > 0).length;
  const currentStageInfo = STAGE_QUESTIONS.find((q) => q.key === activeTab) || STAGE_QUESTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  나의 어울림 성찰 일지 (Reflection Journal)
                </h2>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {filledCount} / 5 완료
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {student ? `${student.grade || 1}학년 ${student.classNum || 1}반 ${student.studentNumber}번 ${student.name}의 기록` : '단계별로 내가 깨닫고 느낀 점을 1~2문장으로 솔직하게 기록해요.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Selection Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1.5 overflow-x-auto shrink-0">
          {STAGE_QUESTIONS.map((st) => {
            const isFilled = (formData[st.key] || '').trim().length > 0;
            const isActive = activeTab === st.key;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab(st.key);
                }}
                className={`flex-1 min-w-[130px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1.5 border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-black/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {st.icon}
                  <span className="truncate">{st.stageNum}</span>
                </div>
                {isFilled ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    ✓
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Question Banner */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              {currentStageInfo.icon}
              <span>{currentStageInfo.stageNum} {currentStageInfo.title} 성찰 질문</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{currentStageInfo.question}"
            </p>
          </div>

          {/* Quick Suggestions Chips (For Easy Typing on Tablet) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>작성이 어렵다면? 아래 추천 문장을 터치하여 바로 입력해보세요:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {currentStageInfo.suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplySuggestion(currentStageInfo.key, sug)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="journal-textarea" className="text-xs font-bold text-slate-300">
                나의 솔직한 생각 (1~2문장)
              </label>
              <span className="text-[11px] text-slate-500">
                {(formData[currentStageInfo.key] || '').length}자
              </span>
            </div>
            <textarea
              id="journal-textarea"
              rows={4}
              value={formData[currentStageInfo.key] || ''}
              onChange={(e) => handleTextChange(currentStageInfo.key, e.target.value)}
              placeholder={currentStageInfo.placeholder}
              className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition resize-none leading-relaxed"
            />
          </div>

          {/* All Stages Preview Summary at Bottom */}
          <div className="pt-2">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>※ 작성한 성찰 일지는 마지막 5단계 결과서와 텍스트 파일에 자동으로 포함됩니다.</span>
              <span className="text-emerald-400 font-bold shrink-0">
                브라우저 자동 보관 중
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>총 {filledCount}개 단계 기록됨</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-black/40 flex items-center gap-1.5 transition active:scale-95"
            >
              {showSavedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{showSavedToast ? '저장 완료!' : '성찰 일지 저장'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
