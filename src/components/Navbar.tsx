import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock, Award, BookOpen, User, RotateCcw, HelpCircle, Shield, Lock } from 'lucide-react';
import { sound } from '../utils/sound';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentStage: string;
  student: StudentProfile | null;
  totalScore: number;
  journalCount: number;
  onOpenTeacherModal: () => void;
  onOpenGuideModal: () => void;
  onOpenJournalModal: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  totalScore,
  journalCount,
  onOpenTeacherModal,
  onOpenGuideModal,
  onOpenJournalModal,
  onReset
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45분 수업
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
    if (sound.enabled) {
      sound.playClick();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/[0.06] text-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* App Title & Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 shrink-0">
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 hidden lg:block">
            <div className="flex items-center gap-2">
              <span className="font-black text-[17px] tracking-[-0.04em] text-white whitespace-nowrap">
                어울림 마스터
              </span>
              <span className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-400 rounded border border-white/10 whitespace-nowrap">
                중1 어울림 1차시
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden xl:block whitespace-nowrap">
              상호존중 교과 연계 역량 강화 게임
            </p>
          </div>
        </div>

        {/* Middle Stats: Student info & Lesson Timer */}
        <div className="flex items-center gap-2 min-w-0">
          {/* 45 min lesson timer for middle school tablet class */}
          <div className="flex items-center h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs overflow-hidden shrink-0">
            <span className="flex items-center gap-1.5 pl-2.5 pr-2">
              <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="font-mono font-bold text-[13px] text-white">{formatTime(timeLeft)}</span>
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setIsTimerRunning(!isTimerRunning);
              }}
              title={isTimerRunning ? '수업 타이머 일시정지' : '수업 타이머 시작'}
              className={`h-full px-2.5 text-[11px] font-bold border-l border-white/[0.08] transition ${
                isTimerRunning ? 'text-slate-300 hover:bg-white/5' : 'text-amber-300 hover:bg-amber-400/10'
              }`}
            >
              {isTimerRunning ? '정지' : '시작'}
            </button>
          </div>

          {/* Student Status Badge */}
          {student && (
            <div className="hidden lg:flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs min-w-0">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-200 truncate max-w-[16rem]">
                {student.grade || 1}-{student.classNum || 1}반 {student.studentNumber}번 {student.name}
              </span>
            </div>
          )}

          {/* Respect EXP Score */}
          <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-amber-400/10 border border-amber-400/25 text-xs font-bold text-amber-300 whitespace-nowrap shrink-0">
            <Award className="w-3.5 h-3.5" />
            <span className="font-mono text-[13px]">{totalScore}</span>
            <span className="text-[10px] text-amber-400/70">EXP</span>
          </div>
        </div>

        {/* Right Tools: Reflection Journal, Student Guide, Mute, Teacher Toolkit, Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournalModal();
            }}
            className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-bold text-xs transition active:scale-95 border border-white/[0.08] whitespace-nowrap"
            title="수업 단계별 성찰 일지 쓰기 및 확인"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden lg:inline">성찰 일지</span>
            <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-400/15 text-sky-200">
              {journalCount}/5
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGuideModal();
            }}
            className="flex items-center gap-1 h-9 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition active:scale-95 whitespace-nowrap"
            title="오늘 45분 수업 방법 보기"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>수업 방법?</span>
          </button>

          <button
            onClick={toggleSound}
            aria-label={isMuted ? '음소거 해제' : '음소거'}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition border border-white/[0.08]"
            title={isMuted ? '음소거 해제' : '효과음 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherModal();
            }}
            className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-xs transition active:scale-95 border border-white/[0.08] whitespace-nowrap"
            title="교사용 지도안 및 전교과 팁 (비밀번호 보호)"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">교사용 자료실</span>
            <span className="lg:hidden">교사용</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReset();
            }}
            title="처음으로 다시하기"
            aria-label="처음으로 다시하기"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition border border-white/[0.08]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
