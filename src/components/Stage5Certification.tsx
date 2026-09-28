import React, { useState, useEffect } from 'react';
import { CompetencyScore, StudentProfile, ConflictRecord, ReflectionJournal } from '../types';
import { sound } from '../utils/sound';
import { Award, Printer, HeartHandshake, CheckCircle2, Copy, Download, Save, Check, FileText, BookOpen, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Stage5CertificationProps {
  student: StudentProfile;
  scores: CompetencyScore;
  totalScore: number;
  conflictRecords?: ConflictRecord[];
  journal?: ReflectionJournal;
  onOpenJournalModal?: () => void;
  onUpdatePledge: (pledge: string) => void;
  onRestart: () => void;
}

export const Stage5Certification: React.FC<Stage5CertificationProps> = ({
  student,
  scores,
  totalScore,
  conflictRecords = [],
  journal = {},
  onOpenJournalModal,
  onUpdatePledge,
  onRestart
}) => {
  const [pledgeText, setPledgeText] = useState(
    student.pledge || '친구의 사소한 실수에 욱하지 않고, "나-전달법"으로 먼저 정중하게 대화하겠습니다.'
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    sound.playLevelUp();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 }
    });
  }, []);

  const handleSavePledge = () => {
    sound.playSuccess();
    onUpdatePledge(pledgeText);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const generateFullSummary = () => {
    const grade = student.grade || 1;
    const classNum = student.classNum || 1;
    let text = `====================================
[어울림 마스터 1차시 활동 결과서]
====================================
학생: 중학교 ${grade}학년 ${classNum}반 ${student.studentNumber}번 ${student.name}
수업 전 감정: ${student.initialEmotion} (에너지: ${student.initialEnergy}/5)
총 획득 경험치: ${totalScore} EXP (어울림 등급: ${totalScore >= 180 ? 'GRADE S (어울림 마스터)' : 'GRADE A (어울림 수호자)'})

[어울림 5대 역량 점수]
- 공감 역량: ${scores.empathy}점
- 의사소통 역량: ${scores.communication}점
- 감정조절 역량: ${scores.self_regulation}점
- 자기존중감: ${scores.self_esteem}점
- 갈등해결 역량: ${scores.conflict_resolution}점

[실전 4대 갈등해결 선택 기록]
`;

    if (conflictRecords && conflictRecords.length > 0) {
      conflictRecords.forEach((rec, idx) => {
        text += `\n[퀘스트 ${idx + 1}] ${rec.questTitle} (${rec.category})\n`;
        text += ` - 나의 대처: "${rec.selectedChoiceText}"\n`;
        text += ` - 결과: ${rec.isBest ? '⭕ 현명한 존중 대처' : '⚠️ 보완 필요'}\n`;
        text += ` - 핵심 솔루션: ${rec.explanation}\n`;
      });
    } else {
      text += `(갈등 해결 4대 시나리오 이수 완료)\n`;
    }

    text += `\n[수업 단계별 성찰 일지 (Reflection Journal)]\n`;
    text += `- 1단계(도입 & 감정진단): ${journal.intro ? `"${journal.intro}"` : '(작성된 내용 없음)'}\n`;
    text += `- 2단계(6초 쿨다운 & 감정조절): ${journal.cooldown ? `"${journal.cooldown}"` : '(작성된 내용 없음)'}\n`;
    text += `- 3단계(실전 갈등해결 RPG): ${journal.scenarios ? `"${journal.scenarios}"` : '(작성된 내용 없음)'}\n`;
    text += `- 4단계(나-전달법 콤보): ${journal.imessage ? `"${journal.imessage}"` : '(작성된 내용 없음)'}\n`;
    text += `- 5단계(종합 성찰 & 다짐): ${journal.cert ? `"${journal.cert}"` : '(작성된 내용 없음)'}\n`;

    text += `\n[우리 반을 위한 나의 1인 1실천 서약]
"${pledgeText}"
====================================`;
    return text;
  };

  const handleCopySummary = () => {
    sound.playClick();
    const summary = generateFullSummary();
    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleDownloadTxt = () => {
    sound.playSuccess();
    const content = generateFullSummary();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `중${student.grade || 1}_${student.classNum || 1}반_${student.studentNumber}번_${student.name}_어울림활동결과.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  // Radar chart points calculation
  // Center: 120, 120. Radius: 85
  const competencies = [
    { key: 'empathy', name: '공감', score: scores.empathy, max: 80, angle: -90 },
    { key: 'communication', name: '의사소통', score: scores.communication, max: 80, angle: -18 },
    { key: 'self_regulation', name: '감정조절', score: scores.self_regulation, max: 80, angle: 54 },
    { key: 'self_esteem', name: '자기존중', score: scores.self_esteem, max: 80, angle: 126 },
    { key: 'conflict_resolution', name: '갈등해결', score: scores.conflict_resolution, max: 80, angle: 198 }
  ];

  const center = 120;
  const radius = 80;

  const getCoordinates = (angle: number, valueRatio: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = radius * Math.min(1, Math.max(0.2, valueRatio));
    const x = center + r * Math.cos(rad);
    const y = center + r * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const polygonPoints = competencies
    .map((c) => {
      const ratio = Math.max(0.2, c.score / c.max);
      return getCoordinates(c.angle, ratio);
    })
    .join(' ');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 print:hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>정리 7분 : 어울림 마스터 인증서 & 1인 1실천 서약</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900">
          축하합니다! <span className="text-emerald-600">어울림 마스터</span> 인증 완료!
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          오늘 45분 동안 배운 공감, 감정조절, 나-전달법, 갈등해결 역량을 바탕으로
          <br />
          우리 반 24명이 서로를 지켜주는 멋진 교실을 만들어가요!
        </p>

        {/* Clear Action Steps Banner */}
        <div className="bg-white shadow-sm ring-1 ring-slate-900/[0.04] rounded-2xl px-4 py-3 max-w-xl mx-auto text-xs text-slate-600 flex items-center justify-center gap-2.5">
          <span className="shrink-0 font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">지금 할 일</span>
          <span>① 오각형 차트 확인 → ② 아래 '나의 약속' 1문장 적기 → ③ 손들고 선생님께 화면 보여드리기!</span>
        </div>
      </div>

      {/* Official Certificate Card (Printable) */}
      <div
        id="certificate-print-area"
        className="bg-white ring-1 ring-slate-900/[0.04] rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-900/[0.06] relative overflow-hidden  print:bg-white print:text-black print:border-2 print:border-black print:shadow-none print:p-8"
      >
        {/* Background Crest Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-[220px]">
          🛡️
        </div>

        {/* Certificate Top Header */}
        <div className="text-center space-y-2 border-b border-slate-100 print:border-slate-300 pb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 print:text-amber-800 text-xs font-black tracking-widest uppercase">
            학교폭력예방 어울림 역량 인증
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 print:text-black tracking-tight">
            상호존중 어울림 마스터 인증서
          </h1>
          <p className="text-xs text-slate-500 print:text-slate-600">
            발급 번호: EOULLIM-2026-G{student.grade || 1}-C{String(student.classNum || 1).padStart(2, '0')}-N{String(student.studentNumber).padStart(2, '0')}
          </p>
        </div>

        {/* Certificate Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
          {/* Left: Student Profile & Badge */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-3.5 p-3.5 bg-slate-50/80 print:bg-slate-100 rounded-2xl border border-slate-100 print:border-slate-300 w-full">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl shrink-0">
                🏅
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-amber-600 print:text-amber-700 block">
                  중학교 {student.grade || 1}학년 {student.classNum || 1}반 {student.studentNumber}번
                </span>
                <h3 className="text-xl font-black text-slate-900 print:text-black">
                  {student.name}
                </h3>
                <span className="text-xs text-indigo-700 print:text-indigo-800 font-semibold flex items-center gap-1">
                  <span>🛡️ 상호존중 실천 지킴이</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-50/60 print:bg-slate-50 p-4 rounded-xl border border-slate-100 print:border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 print:text-slate-700">
                <span>총 획득 존중 경험치:</span>
                <span className="font-extrabold text-amber-600 print:text-amber-800">{totalScore} EXP</span>
              </div>
              <div className="flex justify-between text-slate-600 print:text-slate-700">
                <span>수업 전 감정 배터리:</span>
                <span className="font-semibold text-sky-600 print:text-sky-800">{student.initialEmotion}</span>
              </div>
              <div className="flex justify-between text-slate-600 print:text-slate-700">
                <span>어울림 등급:</span>
                <span className="font-extrabold text-emerald-600 print:text-emerald-800">
                  {totalScore >= 180 ? 'GRADE S (마스터)' : 'GRADE A (수호자)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: 5-Competency Radar Chart */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-50/60 print:bg-slate-50 p-4 rounded-2xl border border-slate-100 print:border-slate-200">
            <span className="text-xs font-bold text-slate-500 print:text-slate-600 mb-2">
              어울림 5대 핵심 역량 달성도
            </span>
            <div className="relative w-60 h-60">
              <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                {/* Background Concentric Circles */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius * level}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeDasharray={level === 1 ? 'none' : '2,2'}
                    strokeWidth="1"
                    className="print:stroke-slate-300"
                  />
                ))}

                {/* Axes */}
                {competencies.map((c) => {
                  const end = getCoordinates(c.angle, 1);
                  const [x2, y2] = end.split(',');
                  return (
                    <line
                      key={c.key}
                      x1={center}
                      y1={center}
                      x2={x2}
                      y2={y2}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      className="print:stroke-slate-300"
                    />
                  );
                })}

                {/* Score Polygon Area */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(16, 185, 129, 0.18)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="print:fill-indigo-100 print:stroke-indigo-600"
                />

                {/* Points & Labels */}
                {competencies.map((c) => {
                  const ratio = Math.max(0.2, c.score / c.max);
                  const pt = getCoordinates(c.angle, ratio);
                  const [px, py] = pt.split(',');
                  const labelPt = getCoordinates(c.angle, 1.25);
                  const [lx, ly] = labelPt.split(',');
                  return (
                    <g key={c.key}>
                      <circle cx={px} cy={py} r="4" fill="#059669" className="print:fill-indigo-700" />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-bold fill-slate-700 print:fill-slate-800"
                      >
                        {c.name} ({c.score})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* 1인 1실천 서약 (Pledge) */}
        <div className="p-5 rounded-2xl bg-indigo-50 print:bg-slate-100 border border-indigo-500/20 print:border-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 print:text-amber-800 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              나의 1인 1실천 서약 (우리 반 평화를 위한 나의 약속)
            </span>
            <span className="text-[11px] text-slate-500 print:text-slate-600">
              실천 다짐
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={pledgeText}
              onChange={(e) => setPledgeText(e.target.value)}
              onBlur={handleSavePledge}
              className="w-full px-4 py-3 bg-slate-50/80 print:bg-white border border-slate-200 print:border-slate-400 rounded-xl text-slate-900 print:text-black font-semibold text-sm focus:outline-none focus:border-indigo-400 transition"
              placeholder="친구를 존중하기 위한 나의 1가지 실천 약속을 적어보세요"
            />
          </div>

          <p className="text-xs text-slate-500 print:text-slate-600 italic">
            "위 학생은 중학교 1학년 어울림(공감, 의사소통, 감정조절, 자기존중감, 갈등해결) 수업을 성실히 이수하였으며,
            상호존중의 교실 문화를 선도할 것을 약속합니다."
          </p>
        </div>

        {/* 4대 갈등해결 실전 리포트 (Print & Screen) */}
        {conflictRecords && conflictRecords.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100 print:border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 print:text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600 print:text-indigo-700" />
                4대 갈등 시나리오 선택 리포트 (학생 활동 기록)
              </span>
              <span className="text-[10px] text-emerald-600 print:text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                4/4 퀘스트 완수
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {conflictRecords.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50/80 print:bg-slate-50 border border-slate-100 print:border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-700 print:text-amber-800 truncate text-[11px]">
                      {rec.questTitle}
                    </span>
                    <span className="text-[10px] shrink-0 font-bold">
                      {rec.isBest ? '⭕ 현명한 대처' : '⚠️ 보완 필요'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 print:text-slate-700 line-clamp-2">
                    선택: "{rec.selectedChoiceText}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 수업 단계별 성찰 일지 (Reflection Journal) */}
        <div className="mt-6 pt-5 border-t border-slate-100 print:border-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 print:text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-600 print:text-sky-700" />
              수업 단계별 성찰 일지 (Reflection Journal)
            </span>
            {onOpenJournalModal && (
              <button
                type="button"
                onClick={onOpenJournalModal}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-700 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/20 transition print:hidden flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>성찰 일지 수정/추가</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/80 print:bg-slate-50 border border-slate-100 print:border-slate-200 space-y-1">
              <span className="font-bold text-amber-600 print:text-amber-800 text-[11px] block">
                ✨ 1단계 (도입 & 감정진단)
              </span>
              <p className="text-[11px] text-slate-600 print:text-slate-800 italic">
                {journal.intro ? `"${journal.intro}"` : '(아직 작성되지 않았습니다. 상단 버튼으로 작성해보세요)'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 print:bg-slate-50 border border-slate-100 print:border-slate-200 space-y-1">
              <span className="font-bold text-sky-600 print:text-sky-800 text-[11px] block">
                🌬️ 2단계 (6초 쿨다운 & 감정조절)
              </span>
              <p className="text-[11px] text-slate-600 print:text-slate-800 italic">
                {journal.cooldown ? `"${journal.cooldown}"` : '(아직 작성되지 않았습니다. 상단 버튼으로 작성해보세요)'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 print:bg-slate-50 border border-slate-100 print:border-slate-200 space-y-1">
              <span className="font-bold text-rose-600 print:text-rose-800 text-[11px] block">
                ⚔️ 3단계 (실전 갈등해결 RPG)
              </span>
              <p className="text-[11px] text-slate-600 print:text-slate-800 italic">
                {journal.scenarios ? `"${journal.scenarios}"` : '(아직 작성되지 않았습니다. 상단 버튼으로 작성해보세요)'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 print:bg-slate-50 border border-slate-100 print:border-slate-200 space-y-1">
              <span className="font-bold text-indigo-600 print:text-indigo-800 text-[11px] block">
                💬 4단계 (나-전달법 콤보)
              </span>
              <p className="text-[11px] text-slate-600 print:text-slate-800 italic">
                {journal.imessage ? `"${journal.imessage}"` : '(아직 작성되지 않았습니다. 상단 버튼으로 작성해보세요)'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 print:bg-slate-50 border border-slate-100 print:border-slate-200 space-y-1 sm:col-span-2 lg:col-span-2">
              <span className="font-bold text-emerald-600 print:text-emerald-800 text-[11px] block">
                🌟 5단계 (종합 성찰 & 나의 다짐)
              </span>
              <p className="text-[11px] text-slate-600 print:text-slate-800 italic">
                {journal.cert ? `"${journal.cert}"` : '(아직 작성되지 않았습니다. 상단 버튼으로 작성해보세요)'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-6 pt-4 border-t border-slate-100 print:border-slate-300 flex items-center justify-between text-xs text-slate-500 print:text-slate-600">
          <span>지도 교사 확인: (인/서명)</span>
          <span className="font-bold text-slate-600 print:text-slate-800">
            (학예 1단) 수업개선 지원단 어울림 교육과정
          </span>
        </div>
      </div>

      {/* LocalStorage Auto-Save Notification Banner */}
      <div className="p-3.5 bg-white/90 border border-slate-100 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <Save className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            <strong className="text-slate-900">태블릿 브라우저 자동 실시간 저장 완료!</strong> (새로고침하거나 꺼져도 기록 유지)
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          ※ 외부 서버나 DB 없이 기기 자체(LocalStorage)에 안전하게 보관됩니다.
        </span>
      </div>

      {/* Bottom Action Buttons (Print, Download, Copy, Redo) */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          onClick={handleDownloadTxt}
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-slate-900/5 flex items-center gap-2 transition active:scale-95"
          title="태블릿에 텍스트 파일(.txt)로 활동 결과서 저장"
        >
          {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span>{isDownloaded ? '파일 다운로드 완료!' : '결과 파일(.txt) 저장'}</span>
        </button>

        <button
          onClick={handleCopySummary}
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm shadow flex items-center gap-2 border border-slate-200 transition"
          title="패들렛, 구글클래스룸, 위두랑 등에 제출할 수 있도록 복사"
        >
          {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
          <span>{isCopied ? '결과 전체 복사됨!' : '결과 텍스트 전체 복사'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm shadow flex items-center gap-2 border border-slate-200 transition"
        >
          <Printer className="w-4 h-4 text-sky-600" />
          <span>PDF 저장 및 인쇄</span>
        </button>

        <button
          onClick={onRestart}
          className="px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 font-bold text-xs shadow flex items-center gap-1.5 transition border border-slate-100"
        >
          <span>다시하기</span>
        </button>
      </div>
    </div>
  );
};
