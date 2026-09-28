import React from 'react';
import { sound } from '../utils/sound';
import { X, Play, CheckCircle2, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface StudentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentGuideModal: React.FC<StudentGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1단계',
      time: '도입 5분',
      title: '내 학년·반·번호 & 감정 선택',
      desc: '태블릿 화면에서 내 학년과 반(1~10반), 출석번호(1~30번)를 누르고, 이름과 오늘 내 기분을 골라 [퀘스트 시작하기]를 누릅니다.',
      badge: '👤 학생 설정'
    },
    {
      step: '2단계',
      time: '전개 10분',
      title: '6초 쿨다운 & 감정 퀴즈',
      desc: '화가 날 때 뇌의 6초 법칙! 파란색 풍선에 맞춰 코로 3초 들이쉬고 입으로 내쉬는 호흡을 하고, "아 빡쳐!" 속 진짜 감정을 찾는 퀴즈 3개를 풉니다.',
      badge: '🌬️ 감정조절'
    },
    {
      step: '3단계',
      time: '전개 15분',
      title: '실전 갈등 퀘스트 4개 깨기',
      desc: '축구 똥볼 실수, 단톡방/게임 패드립, 조별과제 무임승차, 장난치는 친구 상황! 주먹이나 비난 대신 상대를 제압하는 최고의 답변을 고릅니다.',
      badge: '⚔️ 갈등해결 RPG'
    },
    {
      step: '4단계',
      time: '전개 8분',
      title: '나-전달법 3단 콤보 발동',
      desc: '"너 때문에!" 비난 대신 [객관적 사실] + [솔직한 내 감정] + [구체적 바람] 카드 3장을 골라 멋진 대화 스킬 콤보를 완성합니다.',
      badge: '⚡ 나-전달법'
    },
    {
      step: '5단계',
      time: '정리 7분',
      title: '인증서 확인 & 나의 약속 적기',
      desc: '내 5대 역량 점수와 오각형 차트를 확인하고, "우리 반을 위한 나의 약속"을 1줄 적은 뒤 선생님께 태블릿 화면을 보여드립니다.',
      badge: '🏆 마스터 인증'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40  overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-md flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  오늘 45분 수업, 어떻게 하나요?
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 border border-amber-500/20">
                  학생용 초간단 가이드
                </span>
              </div>
              <p className="text-xs text-slate-500">
                선생님 설명이나 화면을 따라 순서대로 터치하면 누구나 쉽게 마스터할 수 있어요!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
            aria-label="가이드 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Quick 3 Rule Alert */}
          <div className="bg-emerald-50 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-black text-emerald-700 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4" />
              💡 이것만 알면 끝나는 3가지 꿀팁!
            </span>
            <ul className="text-xs text-slate-700 space-y-1 pl-1 font-medium">
              <li>1. <strong>화면 맨 위 시간표 순서대로</strong> 진행되며, 문제를 풀고 아래 <strong>초록색 [다음 버튼]</strong>을 누르면 넘어갑니다.</li>
              <li>2. 실수로 다른 답을 골라도 <strong>다시 생각하고 풀 수 있으니</strong> 걱정하지 마세요.</li>
              <li>3. 마지막 <strong>어울림 인증서 화면</strong>이 나오면 <strong>나의 약속을 적고 선생님께 보여드리면 미션 성공!</strong></li>
            </ul>
          </div>

          {/* 5 Steps Roadmap Cards */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              수업 5단계 진행 순서 (시간표)
            </span>

            {steps.map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-3 hover:border-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-700 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{st.title}</span>
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.2 rounded">
                        {st.time}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {st.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            언제든 상단 <strong className="text-amber-700">'수업 방법'</strong> 버튼을 누르면 다시 볼 수 있어요.
          </span>
          <button
            onClick={() => {
              sound.playSuccess();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>이해했어요! 수업 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
