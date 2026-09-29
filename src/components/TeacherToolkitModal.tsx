import React, { useState } from 'react';
import { LESSON_PLAN } from '../data/curriculumData';
import { sound } from '../utils/sound';
import { X, BookOpen, Printer, FileText, Sparkles, Layers, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface TeacherToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherToolkitModal: React.FC<TeacherToolkitModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'worksheet' | 'subjects'>('plan');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Session-based authentication status check
    return sessionStorage.getItem('eoullim_teacher_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default teacher PIN: 0540 (or stopbullying pass hint '054')
    if (pinInput.trim() === '054' || pinInput.trim() === '0540') {
      sound.playSuccess();
      setIsAuthenticated(true);
      sessionStorage.setItem('eoullim_teacher_auth', 'true');
      setPinError('');
    } else {
      sound.playError();
      setPinError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLockOut = () => {
    sound.playClick();
    setIsAuthenticated(false);
    sessionStorage.removeItem('eoullim_teacher_auth');
    setPinInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40  overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-3xl shadow-md flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  (학예 1단) 교사용 수업개선 지원단 툴킷
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 border border-indigo-500/20">
                  교사용 전용 (학생 접근 제한)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                중1 남학생 24명 대상 | 1인 1태블릿 기반 | 학교폭력예방 5대 역량
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-600" />
                  <span>자료 인쇄</span>
                </button>
                <button
                  onClick={handleLockOut}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-semibold flex items-center gap-1 transition border border-slate-200"
                  title="잠금 상태로 전환"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">잠금</span>
                </button>
              </>
            )}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PIN Security Check: if student clicks, they see password prompt */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h4 className="text-xl font-black text-slate-900">교사용 수업자료 비밀번호 입력</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                지도안 및 교사용 수업 가이드는 교사 전용 공간입니다.
                <br />
                학생들의 수업 집중과 스포일러 방지를 위해 비밀번호를 입력해주세요.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="교사용 PIN 입력"
                  maxLength={10}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-center tracking-widest text-lg font-mono placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              {pinError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow transition"
              >
                교사 인증 및 열람
              </button>

              <p className="text-xs text-slate-400">
                ※ 비밀번호는 담당 선생님께 문의하세요.
              </p>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Navigation (수행평가 탭 제거 완료) */}
            <div className="flex border-b border-slate-100 bg-slate-50/60 px-4 shrink-0 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('plan');
                }}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'plan'
                    ? 'border-indigo-400 text-indigo-700 bg-indigo-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1차시 교수학습과정안 (지도안)</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('subjects');
                }}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'subjects'
                    ? 'border-indigo-400 text-indigo-700 bg-indigo-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>전 교과 연계 수업 팁</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('worksheet');
                }}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'worksheet'
                    ? 'border-indigo-400 text-indigo-700 bg-indigo-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>인쇄용 학생 활동지 양식</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
              {/* Tab 1: Lesson Plan */}
              {activeTab === 'plan' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <h4 className="font-black text-slate-900 text-base">
                        단원/주제: {LESSON_PLAN.title}
                      </h4>
                      <span className="text-xs text-amber-600 font-bold">
                        {LESSON_PLAN.target} | {LESSON_PLAN.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      중점 역량: <strong className="text-indigo-700">{LESSON_PLAN.coreCompetencies}</strong>
                      <br />
                      수업 목표: 일상에서 발생하는 갈등 상황에서 6초 감정조절을 실천하고, 나-전달법(I-Message)을 통해 상호존중의 의사소통 태도를 형성할 수 있다.
                    </p>
                  </div>

                  {/* 5-step table */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>수업 단계별 교수·학습 활동 (도입-전개-정리 45분)</span>
                    </h5>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <th className="p-3 w-28">단계 (시간)</th>
                            <th className="p-3 w-40">활동명</th>
                            <th className="p-3">주요 학생 활동 (태블릿 기반)</th>
                            <th className="p-3 w-48">교사 지도 팁 및 유의점</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60 bg-white/40">
                          {LESSON_PLAN.steps.map((st, i) => (
                            <tr key={i} className="hover:bg-slate-100/30">
                              <td className="p-3 font-bold text-amber-600">{st.step}</td>
                              <td className="p-3 font-semibold text-slate-900">{st.name}</td>
                              <td className="p-3 text-slate-600 leading-relaxed">{st.activity}</td>
                              <td className="p-3 text-indigo-700 leading-relaxed bg-indigo-50">
                                {st.teacherTip}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs space-y-1 text-amber-800">
                    <span className="font-bold block">💡 중1 남학생 지도 핵심 포인트:</span>
                    <p>
                      중학교 1학년 남학생의 경우 "장난인데 왜 진지빠냐"라며 공격성을 장난으로 위장하는 경향이 큽니다.
                      본 웹앱은 이를 훈계로 전달하는 대신, 학생이 직접 선택하고 그 결과를 바로 확인하는 게임 형식으로 구성하여 스스로 판단해 보도록 설계되었습니다.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: All Subjects Links */}
              {activeTab === 'subjects' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-base">
                      전 교과(모든 과목) 융합 및 연계 활용 가이드
                    </h4>
                    <p className="text-xs text-slate-500">
                      어느 교과목에서든 1차시 특별 수업 또는 단원 시작/마무리 차시로 즉시 편성 가능합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {LESSON_PLAN.subjectLinks.map((sub, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-indigo-500/40 transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 font-bold text-xs border border-indigo-500/20">
                            {sub.subject}과 연계
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {sub.linkTip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Student Printable Worksheet */}
              {activeTab === 'worksheet' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 font-sans text-slate-700">
                    <div className="text-center border-b border-slate-200 pb-3">
                      <h4 className="text-lg font-black text-slate-900">
                        [학습지] 어울림 마스터: 나의 상호존중 탐구 활동지
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        1학년 ( )반 ( )번 이름: ( )
                      </p>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <strong className="text-amber-700 block mb-1">
                          1. [감정조절] 욱하는 순간 나의 신체 반응과 6초 숨고르기
                        </strong>
                        <div className="border border-slate-200 rounded-lg p-3 bg-white/60 min-h-[48px] text-slate-500 italic">
                          Q. 화가 날 때 내 몸에 나타나는 변화는? (예: 얼굴이 뜨거워짐, 주먹이 쥐어짐 등)
                        </div>
                      </div>

                      <div>
                        <strong className="text-sky-700 block mb-1">
                          2. [의사소통] 나-전달법(I-Message)으로 바꿔 쓰기
                        </strong>
                        <div className="border border-slate-200 rounded-lg p-3 bg-white/60 space-y-1.5 text-slate-600">
                          <p className="text-rose-600">
                            ※ 너-전달법: "야 넌 맨날 왜 그따위로 말하냐? 개념 밥 말아먹었냐?"
                          </p>
                          <p>
                            ▶ <strong>사실(Fact):</strong> 네가 내 실수를 보고 반 친구들 앞에서 크게 놀렸을 때
                          </p>
                          <p>
                            ▶ <strong>감정(Feeling):</strong> 내 노력이 무시당한 것 같아서 무안하고 속상했어
                          </p>
                          <p>
                            ▶ <strong>바람(Request):</strong> 다음에는 놀리기보다 조용히 알려주거나 응원해 줬으면 좋겠어
                          </p>
                        </div>
                      </div>

                      <div>
                        <strong className="text-emerald-700 block mb-1">
                          3. [자기존중감 & 실천] 우리 반을 위한 나의 1인 1실천 서약
                        </strong>
                        <div className="border border-slate-200 rounded-lg p-3 bg-white/60 min-h-[48px] text-slate-500 italic">
                          "나는 ( )한 상황에서 ( )하지 않고, ( )하겠습니다."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

