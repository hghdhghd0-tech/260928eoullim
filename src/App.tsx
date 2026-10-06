import { useState, useEffect } from 'react';
import { CompetencyScore, GameStage, StudentProfile, ConflictRecord, ReflectionJournal } from './types';
import { Navbar, displayName } from './components/Navbar';
import { Stage1Character } from './components/Stage1Character';
import { Stage2EmotionCooldown } from './components/Stage2EmotionCooldown';
import { Stage3ScenarioRPG } from './components/Stage3ScenarioRPG';
import { Stage4IMessageCombo } from './components/Stage4IMessageCombo';
import { Stage5Certification } from './components/Stage5Certification';
import { TeacherToolkitModal } from './components/TeacherToolkitModal';
import { StudentGuideModal } from './components/StudentGuideModal';
import { ReflectionJournalModal } from './components/ReflectionJournalModal';
import { StageMap } from './components/StageMap';
import { sound } from './utils/sound';
import { User, ShieldAlert, Swords, MessageSquareShare, Award, BookOpen, Check, Map as MapIcon } from 'lucide-react';

const STAGE_ORDER: GameStage[] = ['character', 'cooldown', 'scenarios', 'imessage', 'cert'];

const STAGE_STEPS: { id: GameStage; name: string; time: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'character', name: '도입 & 감정진단', time: '도입 5분', icon: User },
  { id: 'cooldown', name: '6초 쿨다운', time: '전개 10분', icon: ShieldAlert },
  { id: 'scenarios', name: '갈등 RPG', time: '전개 15분', icon: Swords },
  { id: 'imessage', name: '나-전달법', time: '전개 8분', icon: MessageSquareShare },
  { id: 'cert', name: '인증 & 서약', time: '정리 7분', icon: Award }
];

const CHECK_IN_BONUS = 16;

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
  // 가장 멀리 진행한 단계. 이미 끝낸 단계를 다시 해도 점수가 두 번 쌓이지 않도록 사용
  const [maxStageIndex, setMaxStageIndex] = useState<number>(0);
  // 공용 태블릿에서 이전 학생 기록이 남아 있을 때 이어하기/새로 시작을 묻는 창
  const [isResumePromptOpen, setIsResumePromptOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState<boolean>(false);
  const [activeJournalStage, setActiveJournalStage] = useState<GameStage>('cooldown');
  // 방금 깬 단계 번호. 지도에서 클리어 안내와 걷기 연출을 한 번만 보여 줌
  const [justCleared, setJustCleared] = useState<number | null>(null);

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
      }
      if (savedConflicts) setConflictRecords(JSON.parse(savedConflicts));
      if (savedJournal) setJournal(JSON.parse(savedJournal));
      if (savedStage) setStage(savedStage as GameStage);
      const savedMax = localStorage.getItem('eoullim_max_stage');
      const fallbackMax = savedStage ? Math.max(0, STAGE_ORDER.indexOf(savedStage as GameStage)) : 0;
      setMaxStageIndex(savedMax ? Number(savedMax) || fallbackMax : fallbackMax);
      if (savedStudent && savedStage && savedStage !== 'character') setIsResumePromptOpen(true);
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (student) localStorage.setItem('eoullim_student', JSON.stringify(student));
      localStorage.setItem('eoullim_scores', JSON.stringify({ scores }));
      localStorage.setItem('eoullim_conflicts', JSON.stringify(conflictRecords));
      localStorage.setItem('eoullim_journal', JSON.stringify(journal));
      localStorage.setItem('eoullim_stage', stage);
      localStorage.setItem('eoullim_max_stage', String(maxStageIndex));
    } catch {
      // ignore
    }
  }, [student, scores, conflictRecords, journal, stage, maxStageIndex]);

  // 단계를 처음 끝냈을 때만 true. 다음 단계까지 열고, 지도로 돌아가 클리어 연출을 보여 줌
  const completeStage = (next: GameStage) => {
    const nextIndex = STAGE_ORDER.indexOf(next);
    const isFirstTime = nextIndex > maxStageIndex;
    if (isFirstTime) {
      setMaxStageIndex(nextIndex);
      setJustCleared(nextIndex - 1);
    }
    setStage('map');
    window.scrollTo({ top: 0 });
    return isFirstTime;
  };

  // 성찰 일지는 지도에서 열면 가장 최근에 깬 단계 질문을 보여 줌
  const journalStageFor = (s: GameStage): GameStage =>
    s === 'map' ? STAGE_ORDER[Math.max(0, maxStageIndex - 1)] : s;

  const handleStage1Complete = (profile: StudentProfile) => {
    setStudent(profile);
    // 기분이 나쁘다고 솔직하게 답한 학생이 점수를 덜 받지 않도록, 감정 체크인은 모두 같은 점수
    if (completeStage('cooldown')) {
      setScores((prev) => ({
        ...prev,
        self_esteem: prev.self_esteem + CHECK_IN_BONUS
      }));
    }
  };

  const handleStage2Complete = (scoreGain: number) => {
    if (!completeStage('scenarios')) return;
    setScores((prev) => ({
      ...prev,
      self_regulation: prev.self_regulation + scoreGain
    }));
  };

  const handleStage3Complete = (bonus: Partial<CompetencyScore>, records: ConflictRecord[]) => {
    if (!completeStage('imessage')) return;
    setConflictRecords(records);
    setScores((prev) => {
      const next = { ...prev };
      Object.entries(bonus).forEach(([k, v]) => {
        if (v !== undefined) {
          next[k as keyof CompetencyScore] = (next[k as keyof CompetencyScore] || 0) + v;
        }
      });
      return next;
    });
  };

  const handleStage4Complete = (scoreGain: number) => {
    if (!completeStage('cert')) return;
    setScores((prev) => ({
      ...prev,
      communication: prev.communication + scoreGain
    }));
  };

  const handleUpdatePledge = (pledge: string) => {
    if (student) {
      setStudent({ ...student, pledge });
    }
  };

  const resetAll = () => {
    localStorage.clear();
    setMaxStageIndex(0);
    setJustCleared(null);
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
  };

  const handleReset = () => {
    if (window.confirm('처음 도입 화면으로 돌아가시겠습니까? (이전 진행 기록이 초기화됩니다)')) {
      resetAll();
    }
  };

  const journalCount = Object.values(journal).filter((v) => (v || '').trim().length > 0).length;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentStage={stage}
        student={student}
        journalCount={journalCount}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenJournalModal={() => {
          setActiveJournalStage(journalStageFor(stage));
          setIsJournalModalOpen(true);
        }}
        onReset={handleReset}
      />

      {/* Lesson Step Indicator (1차시 45분 시간표 매핑) */}
      <div className="px-4 pt-5">
        <div className="max-w-5xl mx-auto grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1 p-1.5 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/[0.04]">
          <button
            type="button"
            onClick={() => {
              if (student) {
                sound.playClick();
                setStage('map');
              }
            }}
            disabled={!student}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl ${stage === 'map' ? 'bg-emerald-50' : 'hover:bg-slate-50'} ${
              !student ? 'cursor-not-allowed' : ''
            }`}
            title="운동장 지도 보기"
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                stage === 'map' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' : student ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </span>
            <span className={`hidden md:block text-[13px] font-bold ${stage === 'map' ? 'text-slate-900' : student ? 'text-slate-600' : 'text-slate-400'}`}>
              지도
            </span>
          </button>
          {STAGE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = stage === step.id;
            const isPassed = maxStageIndex > idx && !isCurrent;
            const isLocked = !student ? step.id !== 'character' : idx > maxStageIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (student && !isLocked) {
                    sound.playClick();
                    setStage(step.id);
                  }
                }}
                disabled={isLocked}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left min-w-0 ${
                  isCurrent ? 'bg-emerald-50' : 'hover:bg-slate-50'
                } ${isLocked ? 'cursor-not-allowed' : ''}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                </span>
                <span className="min-w-0 hidden sm:block">
                  <span
                    className={`block text-[13px] leading-tight truncate ${
                      isCurrent ? 'text-slate-900 font-bold' : isPassed ? 'text-slate-600 font-semibold' : 'text-slate-400 font-medium'
                    }`}
                  >
                    {step.name}
                  </span>
                  <span className={`block text-xs mt-0.5 ${isCurrent ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    {step.time}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:px-6 md:py-10 flex flex-col">
        {stage === 'character' && <Stage1Character onComplete={handleStage1Complete} />}

        {stage === 'map' && student && (
          <StageMap
            student={student}
            maxStageIndex={maxStageIndex}
            justClearedIndex={justCleared}
            onEnterStage={(idx) => {
              setJustCleared(null);
              setStage(STAGE_ORDER[idx]);
              window.scrollTo({ top: 0 });
            }}
            onCelebrationDone={() => setJustCleared(null)}
          />
        )}

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
            setActiveJournalStage(journalStageFor(stage));
            setIsJournalModalOpen(true);
          }}
          className="fixed bottom-5 right-5 z-30 h-12 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center gap-2 transform active:scale-95 transition print:hidden"
          title="이번 단계 느낀 점 성찰 일지 쓰기"
        >
          <BookOpen className="w-4 h-4 text-emerald-300" />
          <span>성찰 일지 ({journalCount}/5)</span>
        </button>
      )}

      {/* Bottom Footer Info */}
      <footer className="py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto px-4">사용방법 영천중학교 김진균선생님께 문의</div>
      </footer>

      {/* 공용 태블릿: 이전 기록 이어하기 / 새 학생으로 시작 */}
      {isResumePromptOpen && student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-7 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center">
              <User className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">이 태블릿에 저장된 기록이 있어요</h3>
              <p className="text-base text-slate-600">
                <strong className="text-slate-900">
                  {student.grade || 1}학년 {student.classNum || 1}반 {student.studentNumber}번 {displayName(student)}
                </strong>
                <br />
                학생이 하던 활동이에요. 내 기록이 맞나요?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsResumePromptOpen(false);
                }}
                className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base"
              >
                네, 이어서 할게요
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  resetAll();
                  setIsResumePromptOpen(false);
                }}
                className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base"
              >
                아니요, 새 학생으로 시작할게요
              </button>
            </div>
          </div>
        </div>
      )}

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
