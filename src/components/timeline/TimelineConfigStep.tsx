'use client';

import React, { useState } from 'react';
import { useApp, timeStrToMinutes } from '@/context/AppContext';
import { MovementBoundary, TimelineFilterState } from '@/types';
import {
  Sparkles,
  Coffee,
  ShoppingBag,
  BookOpen,
  Utensils,
  Smile,
  Check,
} from 'lucide-react';

const chipBase = 'px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all';

export const TimelineConfigStep: React.FC = () => {
  const { activeTicket, customTimeline, generateTimeline } = useApp();

  // STEP 01 필수 입력: 버스 출발시간 · 승차장
  const [busDepartureTime, setBusDepartureTime] = useState<string>(
    activeTicket?.busSchedule.departureTime || customTimeline?.busDepartureTime || '18:00'
  );
  const [boardingPlatform] = useState<string>(
    activeTicket?.busSchedule.platform || customTimeline?.boardingPlatform || '7번 홈'
  );
  const [currentTime] = useState<string>('16:35');
  const [currentLocation] = useState<string>('터미널 1층 대합실');
  const [isEditingBusInfo, setIsEditingBusInfo] = useState<boolean>(false);

  // STEP 01 필수 입력: 이동 범위
  const [movementBoundary, setMovementBoundary] = useState<MovementBoundary>(
    customTimeline?.filter.movementBoundary || 'complex_space'
  );

  // STEP 01 선택 입력
  const [activities, setActivities] = useState<string[]>(
    customTimeline?.filter.activities || ['문화/서점', '카페']
  );
  const [companion, setCompanion] = useState<string>('혼자');
  const [customCompanion, setCustomCompanion] = useState<string>('');
  const [isCustomCompanion, setIsCustomCompanion] = useState<boolean>(false);

  const [experience, setExperience] = useState<string>('조용하게');
  const [customExperience, setCustomExperience] = useState<string>('');
  const [isCustomExperience, setIsCustomExperience] = useState<boolean>(false);

  const [useBudgetFilter, setUseBudgetFilter] = useState<boolean>(true);
  const [budget, setBudget] = useState<string>('1만원');
  const [customBudget, setCustomBudget] = useState<string>('');
  const [isCustomBudget, setIsCustomBudget] = useState<boolean>(false);

  // STEP 02: AI 이용 가능 여유시간 계산
  const startMinutes = timeStrToMinutes(currentTime);
  const depMinutes = timeStrToMinutes(busDepartureTime);
  const totalRemainingMinutes = Math.max(30, depMinutes - startMinutes);

  const facilityTransitMinutes =
    movementBoundary === 'surrounding_area' ? 12 : movementBoundary === 'complex_space' ? 6 : 3;
  const platformWalkMinutes =
    movementBoundary === 'surrounding_area' ? 6 : movementBoundary === 'complex_space' ? 4 : 2;
  const totalTransitMinutes = facilityTransitMinutes + platformWalkMinutes;
  const boardingBufferMinutes = 15;
  const netLeisureMinutes = Math.max(
    10,
    totalRemainingMinutes - totalTransitMinutes - boardingBufferMinutes
  );
  const pct = (v: number) => `${(v / totalRemainingMinutes) * 100}%`;

  const toggleActivity = (act: string) => {
    if (activities.includes(act)) {
      if (activities.length > 1) setActivities(activities.filter((a) => a !== act));
    } else {
      setActivities([...activities, act]);
    }
  };

  const handleGenerate = () => {
    const filterState: TimelineFilterState = {
      busDepartureTime,
      boardingPlatform,
      currentTime,
      currentLocation,
      movementBoundary,
      activities,
      companion: isCustomCompanion && customCompanion.trim() ? customCompanion.trim() : companion,
      experience: isCustomExperience && customExperience.trim() ? customExperience.trim() : experience,
      useBudgetFilter,
      budget: useBudgetFilter
        ? isCustomBudget && customBudget.trim()
          ? customBudget.trim()
          : budget
        : '제한 없음',
    };
    generateTimeline(filterState);
  };

  const activityOptions = [
    { label: '식사', icon: Utensils },
    { label: '카페', icon: Coffee },
    { label: '쇼핑', icon: ShoppingBag },
    { label: '휴식', icon: Smile },
    { label: '문화/서점', icon: BookOpen },
  ];

  const boundaryOptions: { id: MovementBoundary; title: string; sub: string; badge: string }[] = [
    { id: 'terminal_inside', title: '터미널 내부', sub: '도보 1~2분', badge: '최단' },
    { id: 'complex_space', title: '복합공간', sub: '신세계·교보 3분', badge: 'AI추천' },
    { id: 'surrounding_area', title: '주변상권', sub: '신부동 도보 6분', badge: '여유' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 overflow-hidden">
      {/* 1. 상단 통합 요약: 예매 버스 정보 + AI 활동 가능 여유시간 산정 */}
      <section className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-extrabold bg-[#2563EB] px-2 py-0.5 rounded-md whitespace-nowrap">
              {boardingPlatform}
            </span>
            <span className="text-xs font-extrabold truncate">
              {activeTicket
                ? `${activeTicket.busSchedule.departureStation} → ${activeTicket.busSchedule.arrivalStation}`
                : '천안 → 서울경부'}
            </span>
            <span className="text-xs font-black text-[#93C5FD] whitespace-nowrap">
              {busDepartureTime} 출발
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingBusInfo(!isEditingBusInfo)}
            className="text-[10px] bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full font-bold whitespace-nowrap"
          >
            {isEditingBusInfo ? '닫기' : '시간변경'}
          </button>
        </div>

        {isEditingBusInfo ? (
          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/15">
            <span className="text-[10px] font-bold text-[#93C5FD] whitespace-nowrap">출발시각</span>
            <div className="flex gap-1">
              {['17:30', '18:00', '18:30', '19:00'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setBusDepartureTime(t);
                    setIsEditingBusInfo(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap ${
                    busDepartureTime === t ? 'bg-white text-[#132B45]' : 'bg-white/10 text-white/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-white/15 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
                <span className="text-[11px] font-bold text-[#BFDBFE]">AI 순수 활동 가능</span>
                <span className="text-lg font-black text-white leading-none">{netLeisureMinutes}분</span>
              </div>
              <span className="text-[10px] text-white/75 font-semibold">
                총 {totalRemainingMinutes}분 (이동 {totalTransitMinutes}분 · 탑승여유 {boardingBufferMinutes}분 제외)
              </span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-white/15 gap-0.5">
              <div className="bg-[#60A5FA] h-full rounded-l-full" style={{ width: pct(netLeisureMinutes) }} />
              <div className="bg-[#FBBF24] h-full" style={{ width: pct(totalTransitMinutes) }} />
              <div className="bg-[#34D399] h-full rounded-r-full" style={{ width: pct(boardingBufferMinutes) }} />
            </div>
          </div>
        )}
      </section>

      {/* 2. 이동 범위 (필수 · 3열 그리드로 한눈에 선택) */}
      <section className="bg-white rounded-2xl p-3 border border-[#EEF2F6] shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#0F172A]">어디까지 이동할까요?</span>
          <span className="text-[10px] bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-extrabold">
            필수
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {boundaryOptions.map((item) => {
            const isSelected = movementBoundary === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMovementBoundary(item.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#132B45] bg-[#E1EDFB]/60 ring-1 ring-[#132B45]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#132B45] text-white' : 'bg-white text-[#64748B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-[#132B45]" />}
                </div>
                <span className="text-xs font-extrabold text-[#0F172A] block leading-tight">
                  {item.title}
                </span>
                <span className="text-[10px] text-[#64748B] block mt-0.5 truncate">{item.sub}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. 취향 맞춤 필터 (관심 활동 · 동행 · 경험 · 예산을 한 카드에 컴팩트하게 배치) */}
      <section className="bg-white rounded-2xl p-3.5 border border-[#EEF2F6] shadow-2xs space-y-2.5">
        {/* 관심 활동 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#0F172A]">
              관심 활동 <span className="font-medium text-[#94A3B8]">· 복수선택</span>
            </span>
            <span className="text-[10px] text-[#2563EB] font-bold">{activities.length}개 선택</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activityOptions.map((act) => {
              const Icon = act.icon;
              const isSelected = activities.includes(act.label);
              return (
                <button
                  key={act.label}
                  type="button"
                  onClick={() => toggleActivity(act.label)}
                  className={`${chipBase} flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#132B45] text-white'
                      : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {act.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 동행 유형 */}
        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-[#0F172A] shrink-0">동행 유형</span>
            {isCustomCompanion && (
              <input
                type="text"
                placeholder="직접 입력 (예: 동기 3명)"
                value={customCompanion}
                onChange={(e) => setCustomCompanion(e.target.value)}
                className="flex-1 max-w-[160px] px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[11px] font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['혼자', '연인', '친구', '가족'].map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => {
                  setCompanion(comp);
                  setIsCustomCompanion(false);
                }}
                className={`${chipBase} ${
                  !isCustomCompanion && companion === comp
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {comp}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomCompanion(true)}
              className={`${chipBase} ${
                isCustomCompanion ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              직접입력
            </button>
          </div>
        </div>

        {/* 원하는 경험 */}
        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-[#0F172A] shrink-0">원하는 경험</span>
            {isCustomExperience && (
              <input
                type="text"
                placeholder="직접 입력 (예: 노트북 작업)"
                value={customExperience}
                onChange={(e) => setCustomExperience(e.target.value)}
                className="flex-1 max-w-[160px] px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[11px] font-medium text-[#0F172A] focus:outline-none focus:border-[#132B45]"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['여유롭게', '조용하게', '활동적이게'].map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => {
                  setExperience(exp);
                  setIsCustomExperience(false);
                }}
                className={`${chipBase} ${
                  !isCustomExperience && experience === exp
                    ? 'bg-[#132B45] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {exp}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomExperience(true)}
              className={`${chipBase} ${
                isCustomExperience ? 'bg-[#132B45] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              직접입력
            </button>
          </div>
        </div>

        {/* 소비 예산 */}
        <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-[#0F172A]">소비 예산</span>
            <div className="flex items-center gap-1.5">
              {useBudgetFilter && isCustomBudget && (
                <input
                  type="text"
                  placeholder="예: 15,000원"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="w-24 px-2 py-0.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[11px] font-medium text-[#0F172A] focus:outline-none focus:border-[#059669]"
                />
              )}
              <button
                type="button"
                onClick={() => setUseBudgetFilter(!useBudgetFilter)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap ${
                  useBudgetFilter
                    ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {useBudgetFilter && <Check className="w-2.5 h-2.5" />}
                {useBudgetFilter ? '예산 반영' : '미반영'}
              </button>
            </div>
          </div>

          {useBudgetFilter && (
            <div className="flex flex-wrap gap-1.5">
              {['무료', '1만원', '2만원', '3만원'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBudget(b);
                    setIsCustomBudget(false);
                  }}
                  className={`${chipBase} ${
                    !isCustomBudget && budget === b
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {b}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomBudget(true)}
                className={`${chipBase} ${
                  isCustomBudget ? 'bg-[#059669] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                직접입력
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. 하단 CTA 버튼 */}
      <button
        type="button"
        onClick={handleGenerate}
        className="w-full py-3.5 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-xs font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[#93C5FD]" />
        <span>AI 맞춤 타임라인 추천받기 ({netLeisureMinutes}분 코스)</span>
      </button>
    </div>
  );
};
