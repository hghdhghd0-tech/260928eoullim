import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { sound } from '../utils/sound';
import { Sparkles, Shield, ArrowRight, BatteryCharging, UserCheck, Heart, School, Hash } from 'lucide-react';

interface Stage1CharacterProps {
  onComplete: (profile: StudentProfile) => void;
}

const EMOTIONS = [
  { emoji: '🔥', label: '열정 만수르', desc: '의욕 충만! 오늘 수업 기대됨', energy: 5, color: 'border-orange-500/50 bg-orange-500/10 text-orange-700' },
  { emoji: '😊', label: '편안함 & 좋음', desc: '기분 좋고 여유로운 상태', energy: 4, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700' },
  { emoji: '😐', label: '무덤덤 / 보통', desc: '평소와 다름없는 학교 생활', energy: 3, color: 'border-slate-300/50 bg-slate-400/10 text-slate-600' },
  { emoji: '🥱', label: '피곤함 / 졸림', desc: '에너지가 조금 부족한 상태', energy: 2, color: 'border-amber-500/50 bg-amber-500/10 text-amber-700' },
  { emoji: '💢', label: '약간 욱함 / 답답', desc: '사소한 일에도 예민해질 수 있음', energy: 1, color: 'border-rose-500/50 bg-rose-500/10 text-rose-700' }
];

export const Stage1Character: React.FC<Stage1CharacterProps> = ({ onComplete }) => {
  const [grade, setGrade] = useState<number>(1);
  const [classNum, setClassNum] = useState<number>(1);
  const [selectedNum, setSelectedNum] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('편안함 & 좋음');
  const [selectedEnergy, setSelectedEnergy] = useState<number>(4);

  const handleStart = () => {
    sound.playSuccess();
    const finalName = name.trim() || `${grade}학년 ${classNum}반 ${selectedNum}번`;
    onComplete({
      grade,
      classNum,
      studentNumber: selectedNum,
      name: finalName,
      initialEmotion: selectedEmotion,
      initialEnergy: selectedEnergy,
      pledge: ''
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>도입 5분 : 학년·반·번호 확인 & 감정 배터리 측정</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          상호존중 어울림 퀘스트, <span className="text-emerald-600">참여 학생 설정</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          우리 반 동료들과 함께하는 1차시 어울림 실천 수업입니다.
          <br />
          본인의 <strong className="text-slate-900">학년, 반, 번호, 이름</strong>을 터치하고 시작하세요!
        </p>

        {/* Clear Action Steps Banner for Students */}
        <div className="bg-white shadow-sm ring-1 ring-slate-900/[0.04] rounded-2xl px-4 py-3 max-w-2xl mx-auto text-sm text-slate-600 flex items-center justify-center gap-2.5">
          <span className="shrink-0 font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">지금 할 일</span>
          <span>① 학년·반 터치 → ② 번호 터치 → ③ 이름 입력 → ④ 감정 선택 → [시작하기]</span>
        </div>
      </div>

      <div className="bg-white/80 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-md  space-y-6">
        {/* Step 1: Grade & Class Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Grade Selection (1~3학년) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <School className="w-4 h-4 text-sky-600" />
              <span>1. 학년 선택</span>
            </label>
            <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50/80 rounded-2xl border border-slate-100">
              {[1, 2, 3].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setGrade(g);
                  }}
                  className={`h-12 rounded-xl font-bold text-base transition-all flex items-center justify-center ${
                    grade === g
                      ? 'bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-500/30'
                      : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          {/* Class Selection (1~10반) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-amber-600" />
              <span>2. 학반 선택</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50/80 rounded-2xl border border-slate-100">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setClassNum(c);
                  }}
                  className={`h-12 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center ${
                    classNum === c
                      ? 'bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-500/30'
                      : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {c}반
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Student Number (1~30) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>3. 출석 번호 선택</span>
            </label>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              선택: {grade}학년 {classNum}반 {selectedNum}번
            </span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedNum(num);
                }}
                className={`h-12 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center ${
                  selectedNum === num
                    ? 'bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-500/30'
                    : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Name Input */}
        <div>
          <label htmlFor="student-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            4. 내 이름 또는 닉네임 입력
          </label>
          <div className="relative">
            <input
              id="student-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`예: ${grade}학년 ${classNum}반 ${selectedNum}번 (또는 본인 이름 입력)`}
              maxLength={12}
              className="w-full px-4 py-3.5 bg-slate-50/90 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium text-sm transition"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-1">
            ※ 이름을 따로 적지 않아도 <strong className="text-slate-600">'{grade}학년 {classNum}반 {selectedNum}번'</strong>으로 자동 저장됩니다.
          </p>
        </div>

        {/* Step 4: Emotion / Energy Battery */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-amber-600" />
              <span>5. 오늘 수업 시작 전 나의 감정 배터리</span>
            </label>
            <span className="text-xs font-semibold text-amber-700">
              에너지 {selectedEnergy} / 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {EMOTIONS.map((item) => {
              const isSelected = selectedEmotion === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedEmotion(item.label);
                    setSelectedEnergy(item.energy);
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                    isSelected
                      ? `${item.color} ring-2 ring-emerald-500 shadow-md`
                      : 'bg-slate-50/60 border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-600'
                  }`}
                >
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {item.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base md:text-lg shadow-sm shadow-slate-900/5 flex items-center justify-center gap-2 transform active:scale-98 transition"
          >
            <Shield className="w-5 h-5" />
            <span>[{grade}학년 {classNum}반] 어울림 퀘스트 시작하기 (45분)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-3">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              1인 1태블릿 기반
            </span>
            <span>•</span>
            <span>별도 회원가입 / DB 없음</span>
            <span>•</span>
            <span>기기 내 자동 저장</span>
          </div>
        </div>
      </div>
    </div>
  );
};
