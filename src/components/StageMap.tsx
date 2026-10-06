import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Check, Trophy, Play, Heart, Wind, Handshake, MessageCircle } from 'lucide-react';
import { StudentProfile } from '../types';
import { sound } from '../utils/sound';
import { displayName } from './Navbar';

/*
 * 운동장 지도: 스테이지 사이를 오가는 게임 화면
 * - 좌표는 모두 1000 x 600 지도 기준. 지도 위 버튼·표지판은 같은 비율(%)로 올리고,
 *   크기는 지도 너비(cqw)에 맞춰 함께 커지고 작아지도록 함
 */
const VIEW_W = 1000;
const VIEW_H = 600;

const NODES = [
  { x: 110, y: 500 },
  { x: 330, y: 438 },
  { x: 548, y: 500 },
  { x: 725, y: 352 },
  { x: 868, y: 188 }
];

// 노드 i → i+1 길
const SEGMENTS = [
  'M110,500 C200,540 250,432 330,438',
  'M330,438 C420,444 450,540 548,500',
  'M548,500 C640,462 622,362 725,352',
  'M725,352 C822,342 795,228 868,188'
];
const LEAD_IN = 'M-20,548 C40,530 70,512 110,500';

export const MAP_STAGES = [
  { title: '마음 체크인', time: '도입 5분', sign: { x: 140, y: 538, place: 'below' }, badge: '마음 체크 배지', skill: '자기존중감', icon: Heart },
  { title: '6초 쿨다운 존', time: '전개 10분', sign: { x: 330, y: 476, place: 'below' }, badge: '쿨다운 배지', skill: '감정조절', icon: Wind },
  { title: '갈등 해결 경기장', time: '전개 15분', sign: { x: 548, y: 538, place: 'below' }, badge: '갈등 해결 배지', skill: '갈등해결', icon: Handshake },
  { title: '존중 카드 공방', time: '전개 8분', sign: { x: 725, y: 390, place: 'below' }, badge: '존중 대화 배지', skill: '의사소통', icon: MessageCircle },
  { title: '어울림 시상대', time: '정리 7분', sign: { x: 826, y: 180, place: 'left' }, badge: '', skill: '', icon: Trophy }
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const CHAR_LIFT = 26; // 캐릭터 발이 길 위쪽에 오도록 올리는 높이
const WALK_MS = 1500;

interface StageMapProps {
  student: StudentProfile;
  maxStageIndex: number;
  justClearedIndex: number | null;
  onEnterStage: (index: number) => void;
  onCelebrationDone: () => void;
}

export const StageMap: React.FC<StageMapProps> = ({
  student,
  maxStageIndex,
  justClearedIndex,
  onEnterStage,
  onCelebrationDone
}) => {
  const current = Math.min(maxStageIndex, NODES.length - 1);
  const celebrating = justClearedIndex !== null && justClearedIndex < current;
  const start = celebrating ? (justClearedIndex as number) : current;

  const [pos, setPos] = useState({ x: NODES[start].x, y: NODES[start].y });
  const [walking, setWalking] = useState(false);
  const [showBanner, setShowBanner] = useState(celebrating);
  const [toast, setToast] = useState<string | null>(null);
  const segRefs = useRef<(SVGPathElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const timers = useRef<number[]>([]);
  const finished = useRef(false);

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    cancelAnimationFrame(rafRef.current);
    timers.current.forEach((t) => clearTimeout(t));
    setWalking(false);
    setShowBanner(false);
    setPos({ x: NODES[current].x, y: NODES[current].y });
    onCelebrationDone();
  };

  useEffect(() => {
    if (!celebrating) return;
    finished.current = false;
    sound.playLevelUp();
    if (!reduceMotion) {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.45 }, colors: ['#10b981', '#34d399', '#fbbf24', '#f472b6', '#818cf8'] });
    }
    if (reduceMotion) {
      timers.current.push(window.setTimeout(finish, 1800));
      return () => timers.current.forEach((t) => clearTimeout(t));
    }

    // 배지 안내를 잠깐 보여 준 뒤, 캐릭터가 길을 따라 다음 스테이지로 걸어감
    const walkSegment = (seg: number) => {
      const path = segRefs.current[seg];
      if (!path || seg >= current) {
        finish();
        return;
      }
      const len = path.getTotalLength();
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / WALK_MS);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const p = path.getPointAtLength(len * eased);
        setPos({ x: p.x, y: p.y });
        if (t < 1) rafRef.current = requestAnimationFrame(step);
        else walkSegment(seg + 1);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    timers.current.push(
      window.setTimeout(() => {
        setShowBanner(false);
        setWalking(true);
        walkSegment(start);
      }, 1900)
    );
    return () => {
      cancelAnimationFrame(rafRef.current);
      timers.current.forEach((t) => clearTimeout(t));
    };
    // 한 번 클리어할 때마다 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    timers.current.push(window.setTimeout(() => setToast(null), 1800));
  };

  const handleNode = (idx: number) => {
    if (idx > current) {
      sound.playError();
      showToast('앞 스테이지를 먼저 깨야 열려요');
      return;
    }
    sound.playClick();
    if (celebrating) finish();
    onEnterStage(idx);
  };

  const badgeCount = Math.min(current, 4);
  const cleared = celebrating ? (justClearedIndex as number) : -1;
  const isFinal = current === NODES.length - 1;
  const nextStage = MAP_STAGES[current];
  const name = displayName(student);

  return (
    <div className="max-w-[880px] w-full mx-auto space-y-4">
      <div
        className="@container relative w-full aspect-[5/3] rounded-[28px] overflow-hidden shadow-xl shadow-emerald-900/10 ring-1 ring-slate-900/[0.04] select-none"
      >
        {/* 배경 그림 */}
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D8F5EC" />
              <stop offset="1" stopColor="#F3FBF7" />
            </linearGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#A9DD92" />
              <stop offset="1" stopColor="#8CCF77" />
            </linearGradient>
            <pattern id="stripes" width="40" height="150" patternUnits="userSpaceOnUse">
              <rect width="20" height="150" fill="#9AD685" />
              <rect x="20" width="20" height="150" fill="#90D07B" />
            </pattern>
          </defs>

          <rect width={VIEW_W} height={VIEW_H} fill="url(#sky)" />
          {/* 구름 */}
          <g fill="#fff" opacity="0.9">
            <ellipse cx="300" cy="105" rx="46" ry="16" />
            <ellipse cx="330" cy="93" rx="30" ry="18" />
            <ellipse cx="505" cy="118" rx="38" ry="13" />
            <ellipse cx="528" cy="108" rx="24" ry="14" />
            <ellipse cx="925" cy="118" rx="40" ry="14" />
          </g>
          {/* 언덕 */}
          <path d="M0,205 C120,150 260,190 380,170 C520,146 640,190 760,160 C860,136 940,160 1000,150 L1000,260 L0,260 Z" fill="#C3E7B2" />
          <path d="M0,230 C160,195 300,225 460,205 C620,185 780,220 1000,195 L1000,600 L0,600 Z" fill="url(#grass)" />

          {/* 축구장 */}
          <rect x="40" y="240" width="360" height="145" rx="10" fill="url(#stripes)" />
          <g stroke="#fff" strokeWidth="3" fill="none" opacity="0.85">
            <rect x="48" y="248" width="344" height="129" rx="6" />
            <line x1="220" y1="248" x2="220" y2="377" />
            <circle cx="220" cy="312" r="28" />
            <rect x="48" y="282" width="40" height="60" />
            <rect x="352" y="282" width="40" height="60" />
          </g>
          {/* 골대 */}
          <g stroke="#fff" strokeWidth="4" fill="none">
            <path d="M48,290 L30,286 L30,338 L48,334" />
          </g>
          <g stroke="#fff" strokeWidth="1" opacity="0.6">
            <line x1="33" y1="294" x2="46" y2="296" />
            <line x1="33" y1="304" x2="46" y2="305" />
            <line x1="33" y1="314" x2="46" y2="314" />
            <line x1="33" y1="324" x2="46" y2="323" />
          </g>
          {/* 공 */}
          <g transform="translate(288,392)">
            <circle r="11" fill="#fff" stroke="#334155" strokeWidth="1.5" />
            <path d="M0,-4 L4,-1 L2.5,4 L-2.5,4 L-4,-1 Z" fill="#334155" />
          </g>

          {/* 학교 */}
          <g transform="translate(-60,18)">
            <rect x="600" y="88" width="180" height="92" rx="6" fill="#FFF7ED" />
            <rect x="660" y="62" width="60" height="40" rx="4" fill="#FFF7ED" />
            <path d="M594,92 L690,70 L786,92 Z" fill="#F59E0B" />
            <path d="M654,66 L690,50 L726,66 Z" fill="#EA580C" />
            <circle cx="690" cy="82" r="10" fill="#fff" stroke="#EA580C" strokeWidth="2.5" />
            <path d="M690,76 L690,82 L695,84" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {[612, 642, 672, 708, 738].map((x) =>
              [104, 136].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="20" height="18" rx="3" fill="#A7E3D0" />)
            )}
            <rect x="678" y="148" width="24" height="32" rx="3" fill="#B45309" opacity="0.8" />
            <line x1="782" y1="96" x2="782" y2="40" stroke="#94A3B8" strokeWidth="3" />
            <path d="M782,42 L812,50 L782,58 Z" fill="#10B981" />
          </g>

          {/* 농구 골대 */}
          <g transform="translate(600,262)">
            <rect x="-3" y="0" width="6" height="56" fill="#64748B" />
            <rect x="-22" y="-26" width="44" height="30" rx="3" fill="#fff" stroke="#64748B" strokeWidth="2" />
            <rect x="-9" y="-16" width="18" height="12" fill="none" stroke="#F97316" strokeWidth="2" />
            <ellipse cx="0" cy="6" rx="10" ry="3" fill="none" stroke="#F97316" strokeWidth="2.5" />
          </g>

          {/* 나무 */}
          {[
            [440, 262, 1],
            [500, 284, 0.85],
            [965, 286, 1],
            [925, 312, 0.8],
            [320, 584, 1],
            [660, 578, 0.9],
            [24, 432, 0.9],
            [560, 236, 0.75]
          ].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
              <rect x="-4" y="-6" width="8" height="22" rx="2" fill="#A16207" />
              <circle cx="0" cy="-22" r="22" fill="#4ADE80" />
              <circle cx="-12" cy="-12" r="14" fill="#22C55E" />
              <circle cx="12" cy="-14" r="13" fill="#34D399" />
            </g>
          ))}

          {/* 출발 깃발 */}
          <g transform="translate(58,470)">
            <line x1="0" y1="0" x2="0" y2="52" stroke="#64748B" strokeWidth="3" />
            <rect x="1" y="0" width="28" height="18" fill="#fff" />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) =>
                (r + c) % 2 === 0 ? <rect key={`${r}${c}`} x={1 + c * 7} y={r * 6} width="7" height="6" fill="#334155" /> : null
              )
            )}
          </g>

          {/* 길 */}
          <g fill="none" strokeLinecap="round">
            {[LEAD_IN, ...SEGMENTS].map((d, i) => (
              <path key={`o${i}`} d={d} stroke="#DDA56C" strokeWidth="42" />
            ))}
            {[LEAD_IN, ...SEGMENTS].map((d, i) => (
              <path key={`i${i}`} d={d} stroke="#F1C995" strokeWidth="34" />
            ))}
            {/* 지나온 길은 초록 점선, 남은 길은 흰 점선 */}
            {[LEAD_IN, ...SEGMENTS].map((d, i) => {
              const done = i === 0 || i - 1 < current - (celebrating ? 1 : 0);
              return (
                <path
                  key={`d${i}`}
                  d={d}
                  stroke={done ? '#10B981' : '#FFFFFF'}
                  strokeWidth={done ? 5 : 3}
                  strokeDasharray="10 12"
                  opacity={done ? 0.9 : 0.75}
                />
              );
            })}
            {SEGMENTS.map((d, i) => (
              <path key={`h${i}`} d={d} stroke="none" ref={(el) => {
                  segRefs.current[i] = el;
                }} />
            ))}
          </g>

          {/* 시상대 */}
          <g>
            <rect x="808" y="206" width="36" height="34" rx="3" fill="#CBD5E1" />
            <rect x="842" y="194" width="52" height="46" rx="3" fill="#FBBF24" />
            <rect x="892" y="214" width="36" height="26" rx="3" fill="#FDBA74" />
          </g>
          {/* 학교 깃대에서 이어지는 응원 깃발 줄 */}
          <path d="M722,60 Q830,80 940,70" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          {[0.12, 0.28, 0.44, 0.6, 0.76, 0.92].map((t, i) => {
            const x = (1 - t) * (1 - t) * 722 + 2 * (1 - t) * t * 830 + t * t * 940;
            const y = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 80 + t * t * 70;
            const colors = ['#F472B6', '#FBBF24', '#34D399', '#818CF8', '#FB923C', '#10B981'];
            return <path key={i} d={`M${x - 6},${y} L${x + 6},${y} L${x},${y + 13} Z`} fill={colors[i]} />;
          })}
        </svg>

        {/* 상단 띠 */}
        <div
          className="@max-2xl:hidden absolute left-1/2 -translate-x-1/2 text-white font-black whitespace-nowrap px-[5cqw] py-[1.1cqw] bg-emerald-600 shadow-lg shadow-emerald-900/20"
          style={{
            top: '3%',
            fontSize: 'clamp(12px, 2.1cqw, 21px)',
            clipPath: 'polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)'
          }}
        >
          나와 친구를 지키는 어울림 약속
        </div>

        {/* 왼쪽 위: 내 선수 카드 */}
        <div
          className="absolute flex items-center gap-[1cqw] bg-white/90 backdrop-blur rounded-full shadow-md pl-[0.6cqw] pr-[1.6cqw] py-[0.6cqw]"
          style={{ left: '2%', top: '3%', fontSize: 'clamp(10px, 1.35cqw, 14px)' }}
        >
          <span
            className="rounded-full bg-emerald-500 text-white font-black flex items-center justify-center shrink-0"
            style={{ width: 'clamp(26px, 3.6cqw, 38px)', height: 'clamp(26px, 3.6cqw, 38px)' }}
          >
            {student.studentNumber}
          </span>
          <span className="leading-tight min-w-0">
            <span className="block text-slate-400 font-semibold">
              {student.grade || 1}학년 {student.classNum || 1}반
            </span>
            <span className="block text-slate-900 font-bold truncate max-w-[16cqw]">
              {name || `${student.studentNumber}번 선수`}
            </span>
          </span>
        </div>

        {/* 오른쪽 위: 배지 */}
        <div
          className="absolute flex items-center gap-[0.8cqw] bg-white/90 backdrop-blur rounded-full shadow-md px-[1.4cqw] py-[0.7cqw]"
          style={{ right: '2%', top: '3%', fontSize: 'clamp(10px, 1.35cqw, 14px)' }}
          aria-label={`배지 ${badgeCount}개 획득`}
        >
          {MAP_STAGES.slice(0, 4).map((s, i) => {
            const Icon = s.icon;
            const got = i < badgeCount;
            return (
              <span
                key={i}
                title={s.badge}
                className={`rounded-full flex items-center justify-center ${
                  got ? 'bg-amber-400 text-white shadow-sm shadow-amber-500/40' : 'bg-slate-100 text-slate-300'
                }`}
                style={{ width: 'clamp(20px, 2.8cqw, 30px)', height: 'clamp(20px, 2.8cqw, 30px)' }}
              >
                <Icon className="w-[55%] h-[55%]" strokeWidth={2.5} />
              </span>
            );
          })}
          <span className="font-black text-slate-700 ml-[0.3cqw]">{badgeCount}/4</span>
        </div>

        {/* 스테이지 이름표: 버튼 바로 아래(마지막은 왼쪽)에 붙여 어느 스테이지인지 바로 보이게 */}
        {MAP_STAGES.map((s, i) => {
          const below = s.sign.place === 'below';
          const dim = i > current;
          return (
            <div
              key={`sign${i}`}
              className={`absolute flex items-center pointer-events-none ${below ? 'flex-col' : 'flex-row-reverse'}`}
              style={{
                left: pct(s.sign.x, VIEW_W),
                top: pct(s.sign.y, VIEW_H),
                transform: below ? 'translate(-50%, 0)' : 'translate(-100%, -50%)'
              }}
            >
              <span
                className={dim ? 'text-white/80' : 'text-[#FFF8EB]'}
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: below ? '0.8cqw solid transparent' : '0.8cqw solid currentColor',
                  borderRight: '0.8cqw solid transparent',
                  borderBottom: below ? '0.8cqw solid currentColor' : '0.8cqw solid transparent',
                  borderTop: below ? 'none' : '0.8cqw solid transparent',
                  marginRight: below ? 0 : '-0.8cqw'
                }}
              />
              <div
                className={`rounded-[1cqw] px-[1.2cqw] py-[0.6cqw] text-center shadow-md ${dim ? 'bg-white/80 text-slate-400' : 'bg-[#FFF8EB] text-slate-800'}`}
                style={{ fontSize: 'clamp(9px, 1.3cqw, 14px)' }}
              >
                <div className={`font-black leading-none ${dim ? 'text-slate-400' : 'text-amber-600'}`} style={{ fontSize: '0.78em' }}>
                  {i === 4 ? 'FINAL' : `STAGE ${i + 1}`} · {s.time}
                </div>
                <div className="font-extrabold leading-tight mt-[0.35cqw] whitespace-nowrap">{s.title}</div>
              </div>
            </div>
          );
        })}

        {/* 스테이지 버튼 */}
        {NODES.map((n, i) => {
          const locked = i > current;
          const isCurrent = i === current && !(celebrating && showBanner);
          const done = i < current;
          const Icon = i === 4 ? Trophy : null;
          return (
            <button
              key={`node${i}`}
              type="button"
              onClick={() => handleNode(i)}
              aria-label={`${i === 4 ? '최종' : `${i + 1}`} 스테이지 ${MAP_STAGES[i].title}${locked ? ' (잠김)' : done ? ' (클리어)' : ''}`}
              className={`absolute z-10 rounded-full flex items-center justify-center font-black text-white ring-[0.5cqw] ring-white shadow-lg active:scale-95 ${
                locked
                  ? 'bg-slate-300'
                  : i === 4
                  ? 'bg-amber-400 shadow-amber-600/30 hover:bg-amber-500'
                  : done
                  ? 'bg-emerald-600 shadow-emerald-800/30 hover:bg-emerald-700'
                  : 'bg-emerald-500 shadow-emerald-700/30 hover:bg-emerald-600'
              }`}
              style={{
                left: pct(n.x, VIEW_W),
                top: pct(n.y, VIEW_H),
                width: 'max(44px, 6.4cqw)',
                height: 'max(44px, 6.4cqw)',
                transform: 'translate(-50%, -50%)',
                fontSize: 'max(18px, 2.9cqw)'
              }}
            >
              {isCurrent && !locked && <span className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping" />}
              <span className="relative">
                {locked ? <Lock className="w-[1em] h-[1em]" style={{ fontSize: '0.8em' }} strokeWidth={2.8} /> : Icon ? <Icon className="w-[1em] h-[1em]" strokeWidth={2.6} /> : i + 1}
              </span>
              {done && i !== 4 && (
                <span
                  className={`absolute -top-[0.4cqw] -right-[0.4cqw] rounded-full bg-amber-400 ring-[0.3cqw] ring-white flex items-center justify-center ${
                    i === cleared ? 'map-pop' : ''
                  }`}
                  style={{ width: 'max(18px, 2.4cqw)', height: 'max(18px, 2.4cqw)' }}
                >
                  <Check className="w-[60%] h-[60%] text-white" strokeWidth={4} />
                </span>
              )}
            </button>
          );
        })}

        {/* 내 캐릭터 */}
        <div
          className="absolute z-20 pointer-events-none flex flex-col items-center"
          style={{
            left: pct(pos.x, VIEW_W),
            top: pct(pos.y - CHAR_LIFT, VIEW_H),
            width: '8cqw',
            transform: 'translate(-50%, -100%)'
          }}
        >
          <span
            className="mb-[0.4cqw] px-[0.9cqw] py-[0.25cqw] rounded-full bg-slate-900/85 text-white font-bold whitespace-nowrap"
            style={{ fontSize: 'clamp(9px, 1.15cqw, 13px)' }}
          >
            {name ? name : `${student.studentNumber}번`}
          </span>
          <div className={walking ? 'map-walk' : 'map-idle'} style={{ width: '6cqw' }}>
            <Player number={student.studentNumber} />
          </div>
        </div>

        {/* 클리어 안내 */}
        {celebrating && showBanner && (
          <button
            type="button"
            onClick={finish}
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/10"
            aria-label="건너뛰기"
          >
            <div className="map-pop bg-white rounded-[2.4cqw] shadow-2xl px-[4cqw] py-[2.6cqw] text-center" style={{ fontSize: 'clamp(12px, 1.6cqw, 17px)' }}>
              <div className="font-black text-emerald-600 tracking-tight" style={{ fontSize: '2.1em' }}>
                STAGE {(justClearedIndex as number) + 1} CLEAR!
              </div>
              <div className="mt-[1.2cqw] flex items-center justify-center gap-[1.2cqw]">
                {(() => {
                  const s = MAP_STAGES[justClearedIndex as number];
                  const Icon = s.icon;
                  return (
                    <>
                      <span
                        className="rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/40"
                        style={{ width: '3.4em', height: '3.4em' }}
                      >
                        <Icon className="w-1/2 h-1/2" strokeWidth={2.5} />
                      </span>
                      <span className="text-left">
                        <span className="block font-extrabold text-slate-900">{s.badge} 획득</span>
                        <span className="block text-slate-500 font-semibold">{s.skill} 역량이 자랐어요</span>
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          </button>
        )}

        {/* 잠긴 스테이지 안내 */}
        {toast && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[4%] z-30 px-[2cqw] py-[1cqw] rounded-full bg-slate-900/90 text-white font-bold flex items-center gap-[0.8cqw]"
            style={{ fontSize: 'clamp(11px, 1.4cqw, 15px)' }}
          >
            <Lock className="w-[1.1em] h-[1.1em]" /> {toast}
          </div>
        )}
      </div>

      {/* 다음 스테이지 입장 */}
      <div className="flex flex-col items-center gap-2 px-1">
        <button
          type="button"
          onClick={() => handleNode(current)}
          className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 hover:-translate-y-0.5"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{isFinal ? '최종 스테이지' : `스테이지 ${current + 1}`} 입장 · {nextStage.title}</span>
        </button>
        <p className="text-xs text-slate-500 text-center">
          {isFinal ? '배지 네 개를 모두 모았어요. 시상대에서 나의 약속을 남겨 보세요.' : '반짝이는 스테이지를 눌러도 들어갈 수 있어요. 깬 스테이지는 다시 해 볼 수 있어요.'}
        </p>
      </div>
    </div>
  );
};

// 등번호가 적힌 체육복 차림 캐릭터
const Player: React.FC<{ number: number }> = ({ number }) => (
  <svg viewBox="0 0 60 80" className="w-full h-auto overflow-visible" aria-hidden="true">
    <ellipse cx="30" cy="77" rx="16" ry="3.5" fill="#0f172a" opacity="0.18" />
    {/* 다리 */}
    <rect className="map-leg-l" x="21" y="56" width="7" height="18" rx="3.5" fill="#FFD7B5" />
    <rect className="map-leg-r" x="32" y="56" width="7" height="18" rx="3.5" fill="#FFD7B5" />
    <rect x="19.5" y="70" width="10" height="6" rx="3" fill="#334155" />
    <rect x="30.5" y="70" width="10" height="6" rx="3" fill="#334155" />
    {/* 반바지 */}
    <path d="M18,50 L42,50 L43,61 L31.5,61 L30,56 L28.5,61 L17,61 Z" fill="#1E293B" />
    {/* 팔 */}
    <rect x="9" y="33" width="7" height="18" rx="3.5" fill="#FFD7B5" transform="rotate(12 12 33)" />
    <rect x="44" y="33" width="7" height="18" rx="3.5" fill="#FFD7B5" transform="rotate(-12 48 33)" />
    {/* 상의 */}
    <path d="M17,31 Q30,26 43,31 L46,40 L41,42 L41,52 L19,52 L19,42 L14,40 Z" fill="#10B981" />
    <path d="M24,29.5 Q30,33 36,29.5" stroke="#047857" strokeWidth="2" fill="none" />
    <text x="30" y="47.5" textAnchor="middle" fontSize={number >= 10 ? 11 : 13} fontWeight="900" fill="#fff">
      {number}
    </text>
    {/* 머리 */}
    <circle cx="30" cy="17" r="13" fill="#FFD7B5" />
    <path d="M17,16 Q17,3 30,3 Q43,3 43,15 Q38,9 30,10 Q22,9 17,16 Z" fill="#1E293B" />
    <circle cx="25" cy="18" r="1.8" fill="#1E293B" />
    <circle cx="35" cy="18" r="1.8" fill="#1E293B" />
    <path d="M26,23 Q30,26 34,23" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <circle cx="21.5" cy="22" r="2.2" fill="#FCA5A5" opacity="0.6" />
    <circle cx="38.5" cy="22" r="2.2" fill="#FCA5A5" opacity="0.6" />
  </svg>
);
