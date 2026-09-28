import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock, Award, BookOpen, User, RotateCcw, HelpCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* App Title & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-xl font-black">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent font-['Noto_Sans_KR']">
                어울림 마스터
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                중1 어울림 1차시
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              상호존중 교과 연계 역량 강화 게임
            </p>
          </div>
        </div>

        {/* Middle Stats: Student info & Lesson Timer */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* 45 min lesson timer for middle school tablet class */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-amber-300">{formatTime(timeLeft)}</span>
            <button
              onClick={() => {
                sound.playClick();
                setIsTimerRunning(!isTimerRunning);
              }}
              title={isTimerRunning ? '수업 타이머 일시정지' : '수업 타이머 시작'}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
            >
              {isTimerRunning ? '정지' : '시작'}
            </button>
          </div>

          {/* Student Status Badge */}
          {student && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-950 to-slate-800 px-2.5 py-1 rounded-lg border border-indigo-700/50 text-xs">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold text-sky-200">
                {student.grade || 1}-{student.classNum || 1}반 {student.studentNumber}번 {student.name}
              </span>
            </div>
          )}

          {/* Respect EXP Score */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span>{totalScore} EXP</span>
          </div>
        </div>

        {/* Right Tools: Reflection Journal, Student Guide, Mute, Teacher Toolkit, Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournalModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-700/80 hover:bg-sky-600 text-white font-bold text-xs shadow transition active:scale-95 border border-sky-400/40"
            title="수업 단계별 성찰 일지 쓰기 및 확인"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">성찰 일지</span>
            <span className="bg-sky-950 text-sky-200 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-sky-400/30">
              {journalCount}/5
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGuideModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow transition active:scale-95 border border-amber-300 ring-2 ring-amber-400/30 animate-pulse"
            title="오늘 45분 수업 방법 보기"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>수업 방법?</span>
          </button>

          <button
            onClick={toggleSound}
            aria-label={isMuted ? '음소거 해제' : '음소거'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
            title={isMuted ? '음소거 해제' : '효과음 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-medium text-xs shadow transition active:scale-95 border border-indigo-400/40"
            title="교사용 지도안 및 전교과 팁 (비밀번호 보호)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">교사용 자료실 (🔒)</span>
            <span className="sm:hidden">교사용(🔒)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReset();
            }}
            title="처음으로 다시하기"
            aria-label="처음으로 다시하기"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
