import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock, Award, BookOpen, User, RotateCcw, HelpCircle, Shield, Lock } from 'lucide-react';
import { sound } from '../utils/sound';
import { StudentProfile } from '../types';

// 이름을 비워 두면 '1학년 1반 1번'이 이름으로 저장되므로, 번호와 겹치면 이름은 생략
export const displayName = (student: StudentProfile) =>
  student.name === `${student.grade || 1}학년 ${student.classNum || 1}반 ${student.studentNumber}번` ? '' : student.name;

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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.06)] text-slate-900">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* App Title & Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/30">
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 hidden lg:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] tracking-[-0.04em] text-slate-900 whitespace-nowrap">
                어울림 마스터
              </span>
              <span className="hidden xl:inline px-2 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full whitespace-nowrap">
                중1 어울림 1차시
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden xl:block whitespace-nowrap">
              상호존중 교과 연계 역량 강화 게임
            </p>
          </div>
        </div>

        {/* Middle Stats: Student info & Lesson Timer */}
        <div className="flex items-center gap-2 min-w-0">
          {/* 45 min lesson timer for middle school tablet class */}
          <div className="flex items-center h-11 pl-3 pr-1 gap-2 rounded-full bg-slate-100 text-xs shrink-0">
            <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="font-mono font-bold text-[13px] text-slate-900">{formatTime(timeLeft)}</span>
            <button
              onClick={() => {
                sound.playClick();
                setIsTimerRunning(!isTimerRunning);
              }}
              title={isTimerRunning ? '수업 타이머 일시정지' : '수업 타이머 시작'}
              className={`h-9 px-3 rounded-full text-xs font-bold ${
                isTimerRunning ? 'bg-white text-slate-600 shadow-sm' : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isTimerRunning ? '정지' : '시작'}
            </button>
          </div>

          {/* Student Status Badge */}
          {student && (
            <div className="hidden xl:flex items-center gap-1.5 h-11 px-3 rounded-full bg-slate-100 text-xs min-w-0">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 truncate max-w-[16rem]">
                {student.grade || 1}-{student.classNum || 1}반 {student.studentNumber}번 {displayName(student)}
              </span>
            </div>
          )}

          {/* Respect EXP Score */}
          <div className="flex items-center gap-1.5 h-11 px-3 rounded-full bg-amber-50 text-xs font-bold text-amber-700 whitespace-nowrap shrink-0">
            <Award className="w-3.5 h-3.5" />
            <span className="font-mono text-[13px]">{totalScore}</span>
            <span className="text-xs text-amber-600/70">EXP</span>
          </div>
        </div>

        {/* Right Tools: Reflection Journal, Student Guide, Mute, Teacher Toolkit, Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onOpenJournalModal();
            }}
            className="flex items-center gap-1.5 h-11 px-3 rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-bold text-xs active:scale-95 whitespace-nowrap"
            title="수업 단계별 성찰 일지 쓰기 및 확인"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden lg:inline">성찰 일지</span>
            <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded-full bg-white text-sky-700">
              {journalCount}/5
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGuideModal();
            }}
            className="flex items-center gap-1 h-11 px-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs active:scale-95 whitespace-nowrap"
            title="오늘 45분 수업 방법 보기"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>수업 방법?</span>
          </button>

          <button
            onClick={toggleSound}
            aria-label={isMuted ? '음소거 해제' : '음소거'}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-500 hover:text-slate-900"
            title={isMuted ? '음소거 해제' : '효과음 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherModal();
            }}
            className="flex items-center gap-1.5 h-11 px-3 rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs active:scale-95 whitespace-nowrap"
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
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
