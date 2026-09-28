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
    <div className="min-h-screen text-slate-100 flex flex-col">
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
      <div className="border-b border-white/[0.06] bg-slate-950/40 py-3 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-5 gap-1.5">
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
                className={`group relative flex flex-col items-start gap-1 pt-2.5 pb-1 px-1 text-left transition min-w-0 ${
                  !student && step.id !== 'character' ? 'cursor-not-allowed' : ''
                }`}
              >
                <span
                  className={`absolute top-0 left-0 right-0 h-1 rounded-full transition-colors ${
                    isCurrent ? 'bg-amber-400' : isPassed ? 'bg-emerald-400/70' : 'bg-white/[0.08]'
                  }`}
                />
                <span className="flex items-center gap-1.5 min-w-0 w-full">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950'
                        : isPassed
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-white/[0.05] text-slate-500'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </span>
                  <span
                    className={`text-xs truncate ${
                      isCurrent ? 'text-white font-extrabold' : isPassed ? 'text-slate-300 font-semibold' : 'text-slate-500 font-medium'
                    }`}
                  >
                    {step.name}
                  </span>
                </span>
                <span className={`text-[10px] pl-[26px] hidden md:block ${isCurrent ? 'text-amber-300' : 'text-slate-600'}`}>
                  {step.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:px-6 md:py-10 flex flex-col">
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
          className="fixed bottom-5 right-5 z-30 h-12 px-5 rounded-full bg-slate-800/90 hover:bg-slate-700 backdrop-blur-xl text-white font-bold text-sm shadow-2xl shadow-black/60 border border-white/10 flex items-center gap-2 transform active:scale-95 transition print:hidden"
          title="이번 단계 느낀 점 성찰 일지 쓰기"
        >
          <BookOpen className="w-4 h-4 text-sky-300" />
          <span>성찰 일지 ({journalCount}/5)</span>
        </button>
      )}

      {/* Bottom Footer Info */}
      <footer className="border-t border-white/[0.06] py-4 text-center text-[11px] text-slate-600 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
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
