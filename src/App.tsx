import { useState, useEffect } from 'react';
import { CompetencyScore, GameStage, StudentProfile, ConflictRecord, ReflectionJournal } from './types';
import { Navbar } from './components/Navbar';
import { Stage1Character } from './components/Stage1Character';
import { Stage2EmotionCooldown } from './components/Stage2EmotionCooldown';
import { Stage3ScenarioRPG } from './components/Stage3ScenarioRPG';
import { Stage4IMessageCombo } from './components/Stage4IMessageCombo';
import { Stage5Certification } from './components/Stage5Certification';
import { TeacherToolkitModal } from './components/TeacherToolkitModal';
import { StudentGuideModal } from './components/StudentGuideModal';
import { ReflectionJournalModal } from './components/ReflectionJournalModal';
import { sound } from './utils/sound';
import { User, ShieldAlert, Swords, MessageSquareShare, Award, Sparkles, BookOpen } from 'lucide-react';

const STAGE_STEPS: { id: GameStage; name: string; time: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'character', name: '도입 & 감정진단', time: '도입 5분', icon: User },
  { id: 'cooldown', name: '6초 쿨다운', time: '전개 10분', icon: ShieldAlert },
  { id: 'scenarios', name: '갈등 RPG', time: '전개 15분', icon: Swords },
  { id: 'imessage', name: '나-전달법', time: '전개 8분', icon: MessageSquareShare },
  { id: 'cert', name: '인증 & 서약', time: '정리 7분', icon: Award }
];

export default function App() {
  const [stage, setStage] = useState<GameStage>('character');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [conflictRecords, setConflictRecords] = useState<ConflictRecord[]>([]);
  const [journal, setJournal] = useState<ReflectionJournal>({});
  const [scores, setScores] = useState<CompetencyScore>({
    empathy: 20,
    communication: 20,
    self_regulation: 20,
    self_esteem: 20,
    conflict_resolution: 20
  });
  const [totalScore, setTotalScore] = useState<number>(100);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState<boolean>(false);
  const [activeJournalStage, setActiveJournalStage] = useState<GameStage>('cooldown');

  // Load from localStorage on mount (for tablet reliability)
  useEffect(() => {
    try {
      const savedStudent = localStorage.getItem('eoullim_student');
      const savedScores = localStorage.getItem('eoullim_scores');
      const savedStage = localStorage.getItem('eoullim_stage');
      const savedConflicts = localStorage.getItem('eoullim_conflicts');
      const savedJournal = localStorage.getItem('eoullim_journal');
      if (savedStudent) setStudent(JSON.parse(savedStudent));
      if (savedScores) {
        const parsed = JSON.parse(savedScores);
        setScores(parsed.scores);
        setTotalScore(parsed.totalScore);
      }
      if (savedConflicts) setConflictRecords(JSON.parse(savedConflicts));
      if (savedJournal) setJournal(JSON.parse(savedJournal));
      if (savedStage) setStage(savedStage as GameStage);
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (student) localStorage.setItem('eoullim_student', JSON.stringify(student));
      localStorage.setItem('eoullim_scores', JSON.stringify({ scores, totalScore }));
      localStorage.setItem('eoullim_conflicts', JSON.stringify(conflictRecords));
      localStorage.setItem('eoullim_journal', JSON.stringify(journal));
      localStorage.setItem('eoullim_stage', stage);
    } catch {
      // ignore
    }
  }, [student, scores, totalScore, conflictRecords, journal, stage]);

  const handleStage1Complete = (profile: StudentProfile) => {
    setStudent(profile);
    setScores((prev) => ({
      ...prev,
      self_esteem: prev.self_esteem + profile.initialEnergy * 4
    }));
    setTotalScore((prev) => prev + profile.initialEnergy * 4);
    setStage('cooldown');
  };

  const handleStage2Complete = (scoreGain: number) => {
    setScores((prev) => ({
      ...prev,
      self_regulation: prev.self_regulation + scoreGain
    }));
    setTotalScore((prev) => prev + scoreGain);
    setStage('scenarios');
  };

  const handleStage3Complete = (bonus: Partial<CompetencyScore>, records: ConflictRecord[]) => {
    setConflictRecords(records);
    setScores((prev) => {
      const next = { ...prev };
      let added = 0;
      Object.entries(bonus).forEach(([k, v]) => {
        if (v !== undefined) {
          next[k as keyof CompetencyScore] = (next[k as keyof CompetencyScore] || 0) + v;
          added += v;
        }
      });
      setTotalScore((t) => t + added);
      return next;
    });
    setStage('imessage');
  };

  const handleStage4Complete = (scoreGain: number) => {
    setScores((prev) => ({
      ...prev,
      communication: prev.communication + scoreGain
    }));
    setTotalScore((prev) => prev + scoreGain);
    setStage('cert');
  };

  const handleUpdatePledge = (pledge: string) => {
    if (student) {
      setStudent({ ...student, pledge });
    }
  };

  const handleReset = () => {
    if (window.confirm('처음 도입 화면으로 돌아가시겠습니까? (이전 진행 기록이 초기화됩니다)')) {
      localStorage.clear();
      setStage('character');
      setStudent(null);
      setConflictRecords([]);
      setJournal({});
      setScores({
        empathy: 20,
        communication: 20,
        self_regulation: 20,
        self_esteem: 20,
        conflict_resolution: 20
      });
      setTotalScore(100);
    }
  };

  const journalCount = Object.values(journal).filter((v) => (v || '').trim().length > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Noto_Sans_KR',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        currentStage={stage}
        student={student}
        totalScore={totalScore}
        journalCount={journalCount}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenJournalModal={() => {
          setActiveJournalStage(stage);
          setIsJournalModalOpen(true);
        }}
        onReset={handleReset}
      />

      {/* Lesson Step Indicator (1차시 45분 시간표 매핑) */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
          {STAGE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = stage === step.id;
            const stageOrder: GameStage[] = ['character', 'cooldown', 'scenarios', 'imessage', 'cert'];
            const currentIndex = stageOrder.indexOf(stage);
            const isPassed = currentIndex > idx;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (student) {
                    sound.playClick();
                    setStage(step.id);
                  }
                }}
                disabled={!student && step.id !== 'character'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 text-amber-300 font-extrabold shadow-sm'
                    : isPassed
                    ? 'bg-slate-900 border border-emerald-500/30 text-emerald-400 font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-400 animate-pulse' : isPassed ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>{step.name}</span>
                <span className="text-[10px] text-slate-400 hidden md:inline">({step.time})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {stage === 'character' && <Stage1Character onComplete={handleStage1Complete} />}

        {stage === 'cooldown' && (
          <Stage2EmotionCooldown
            onComplete={handleStage2Complete}
            onOpenJournal={() => {
              setActiveJournalStage('cooldown');
              setIsJournalModalOpen(true);
            }}
          />
        )}

        {stage === 'scenarios' && <Stage3ScenarioRPG onComplete={handleStage3Complete} />}

        {stage === 'imessage' && <Stage4IMessageCombo onComplete={handleStage4Complete} />}

        {stage === 'cert' && student && (
          <Stage5Certification
            student={student}
            scores={scores}
            totalScore={totalScore}
            conflictRecords={conflictRecords}
            journal={journal}
            onOpenJournalModal={() => {
              setActiveJournalStage('cert');
              setIsJournalModalOpen(true);
            }}
            onUpdatePledge={handleUpdatePledge}
            onRestart={handleReset}
          />
        )}
      </main>

      {/* Floating Reflection Journal Quick Button (Stages 1~5) */}
      {student && (
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveJournalStage(stage);
            setIsJournalModalOpen(true);
          }}
          className="fixed bottom-5 right-5 z-30 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-sky-600/30 border border-sky-400/50 flex items-center gap-2 transform active:scale-95 transition print:hidden"
          title="이번 단계 느낀 점 성찰 일지 쓰기"
        >
          <BookOpen className="w-4 h-4 text-sky-200" />
          <span>성찰 일지 ({journalCount}/5)</span>
        </button>
      )}

      {/* Bottom Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>(학예 1단) 수업개선 지원단 교과중심 교실수업 개선 어울림 프로그램</span>
          </div>
          <div>
            <span>1인 1태블릿 기반 | 깃허브 페이지스 정적 배포 지원 (No API/No DB)</span>
          </div>
        </div>
      </footer>

      {/* Teacher Toolkit Modal */}
      <TeacherToolkitModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      />

      {/* Student Guide Modal */}
      <StudentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Reflection Journal Modal */}
      <ReflectionJournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        journal={journal}
        onSave={(updated) => setJournal(updated)}
        currentStage={activeJournalStage}
        student={student}
      />
    </div>
  );
}
