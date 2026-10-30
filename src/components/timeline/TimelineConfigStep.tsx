'use client';

import React, { useState } from 'react';
import { useApp, timeStrToMinutes } from '@/context/AppContext';
import { MovementBoundary, TimelineFilterState } from '@/types';
import { SectionCard, KeyValueRow } from './TimelineSection';
import {
  Sparkles,
  Compass,
  Coffee,
  ShoppingBag,
  BookOpen,
  Utensils,
  Smile,
  ShieldCheck,
  Check,
} from 'lucide-react';

const chipBase = 'px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all';

export const TimelineConfigStep: React.FC = () => {
  const { activeTicket, customTimeline, generateTimeline } = useApp();

  // STEP 01 필수 입력: 버스 출발시간 · 승차장 (예매 내역 자동 연동 + 변경 가능)
  const [busDepartureTime, setBusDepartureTime] = useState<string>(
    activeTicket?.busSchedule.departureTime || customTimeline?.busDepartureTime || '18:00'
  );
  const [boardingPlatform, setBoardingPlatform] = useState<string>(
    activeTicket?.busSchedule.platform || customTimeline?.boardingPlatform || '7번 홈'
  );
  const [currentTime] = useState<string>('16:35');
  const [currentLocation, setCurrentLocation] = useState<string>('천안터미널 1층 대합실');
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

  const boundaryOptions: { id: MovementBoundary; title: string; desc: string; badge: string }[] = [
    { id: 'terminal_inside', title: '터미널 내부', desc: '대합실 · 라운지 · 식당가 / 도보 1~2분', badge: '최단 동선' },
    { id: 'complex_space', title: '복합공간', desc: '신세계백화점 · 교보문고 / 도보 3~4분', badge: 'AI 추천' },
    { id: 'surrounding_area', title: '주변상권', desc: '조각광장 · 신부동 골목 / 도보 6분', badge: '여유 코스' },
  ];

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* STEP 01 · 예매 정보 */}
      <section className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-3xl shadow-sm border border-white/10 overflow-hidden">
        <header className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
          <div>
            <span className="block text-[10px] font-extrabold tracking-wide text-[#93C5FD] leading-none mb-1.5">
              STEP 01 · 필수 확인
            </span>
            <h4 className="text-sm font-extrabold tracking-tight">예매한 버스 정보</h4>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingBusInfo(!isEditingBusInfo)}
            className="text-[11px] bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors"
          >
            {isEditingBusInfo ? '완료' : '변경'}
          </button>
        </header>

        <div className="px-5 pb-1 divide-y divide-white/10 border-t border-white/10">
          <KeyValueRow
            dark
            label="노선"
            value={
              activeTicket
                ? `${activeTicket.busSchedule.departureStation} → ${activeTicket.busSchedule.arrivalStation}`
                : '천안 → 서울경부'
            }
          />
          <KeyValueRow dark label="버스 출발" value={<span className="text-base font-black">{busDepartureTime}</span>} />
          <KeyValueRow
            dark
            label="승차장"
            value={<span className="bg-[#2563EB] px-2.5 py-0.5 rounded-lg">{boardingPlatform}</span>}
          />
          <KeyValueRow dark label="현재 시각 · 위치" value={`${currentTime} · ${currentLocation}`} />
        </div>

        {isEditingBusInfo && (
          <div className="mx-5 mb-4 mt-2 p-4 rounded-2xl bg-white/10 border border-white/15 space-y-4 animate-in fade-in duration-150">
            <div className="space-y-2">
              <span className="text-[11px] text-[#93C5FD] font-bold block">버스 출발시간</span>
              <div className="flex flex-wrap gap-1.5">
                {['17:30', '18:00', '18:30', '19:00'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBusDepartureTime(t)}
                    className={`px-3.5 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                      busDepartureTime === t ? 'bg-white text-[#132B45]' : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] text-[#93C5FD] font-bold block">승차장</span>
              <select
                value={boardingPlatform}
                onChange={(e) => setBoardingPlatform(e.target.value)}
                className="w-full bg-[#0F172A] text-white border border-white/20 rounded-lg px-3 py-2 text-xs font-bold"
              >
                <option value="7번 홈">고속 7번 홈 (서울)</option>
                <option value="3번 홈">시외 3번 홈 (동서울)</option>
                <option value="12번 홈">시외 12번 홈 (수원)</option>
              </select>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] text-[#93C5FD] font-bold block">현재 내 위치</span>
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full bg-[#0F172A] text-white border border-white/20 rounded-lg px-3 py-2 text-xs font-bold"
              >
                <option value="천안터미널 1층 대합실">터미널 1층 대합실</option>
                <option value="신세계백화점 연결통로">신세계 연결통로</option>
                <option value="터미널 앞 조각광장">터미널 앞 광장</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* STEP 01 · 이동 범위 (필수) */}
      <SectionCard
        eyebrow="STEP 01 · 필수 입력"
        title="어디까지 이동할까요?"
        right={
          <span className="text-[10px] bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded font-extrabold whitespace-nowrap">
            필수
          </span>
        }
      >
        <ul className="space-y-2">
          {boundaryOptions.map((item) => {
            const isSelected = movementBoundary === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setMovementBoundary(item.id)}
                  className={`w-full px-4 py-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'border-[#132B45] bg-[#E1EDFB]/50 ring-1 ring-[#132B45]'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#132B45] border-[#132B45] text-white' : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-[#0F172A]">{item.title}</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                          isSelected ? 'bg-[#132B45] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#64748B] block mt-0.5 leading-snug">{item.desc}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      {/* STEP 02 · AI 여유시간 */}
      <SectionCard
        tone="ai"
        eyebrow="STEP 02 · AI 자동 산정"
        title="실제 활동 가능 시간"
        right={
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-[#2563EB] px-2 py-1 rounded-full whitespace-nowrap">
            <Sparkles className="w-3 h-3" /> AI
          </span>
        }
      >
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-[11px] text-[#64748B] block">순수 활동 가능</span>
            <span className="text-3xl font-black text-[#2563EB] tracking-tight leading-none">
              {netLeisureMinutes}
              <span className="text-base font-bold ml-0.5">분</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#64748B] whitespace-nowrap">버스까지 총 {totalRemainingMinutes}분</span>
        </div>

        <div className="flex h-3 rounded-full overflow-hidden bg-[#EEF2F6] gap-0.5 p-0.5 mb-3">
          <div className="bg-[#2563EB] h-full rounded-l-full transition-all duration-300" style={{ width: pct(netLeisureMinutes) }} />
          <div className="bg-[#F59E0B] h-full transition-all duration-300" style={{ width: pct(totalTransitMinutes) }} />
          <div className="bg-[#059669] h-full rounded-r-full transition-all duration-300" style={{ width: pct(boardingBufferMinutes) }} />
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          <KeyValueRow dot="#2563EB" label="활동 시간" value={`${netLeisureMinutes}분`} />
          <KeyValueRow dot="#F59E0B" label={`시설 이동 ${facilityTransitMinutes}분 + 승차장 이동 ${platformWalkMinutes}분`} value={`${totalTransitMinutes}분`} />
          <KeyValueRow dot="#059669" label="탑승 준비 여유시간" value={`${boardingBufferMinutes}분`} />
        </div>

        <div className="mt-3 p-3 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#065F46] flex items-start gap-2 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          <span>이동·탑승 준비 시간을 먼저 제외하고 활동 시간을 계산하므로 버스를 놓치지 않아요.</span>
        </div>
      </SectionCard>

      {/* STEP 01 · 선택 필터 */}
      <SectionCard
        eyebrow="STEP 01 · 선택 입력"
        title="취향 맞춤 필터"
        right={
          <span className="text-[10px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full whitespace-nowrap">
            선택
          </span>
        }
      >
        <div className="divide-y divide-[#F1F5F9] [&>div]:py-5 [&>div:first-child]:pt-0 [&>div:last-child]:pb-0">
          {/* 관심 활동 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0F172A]">관심 활동 <span className="font-medium text-[#94A3B8]">· 복수 선택</span></span>
              <span className="text-[11px] text-[#2563EB] font-bold whitespace-nowrap">{activities.length}개 선택</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((act) => {
                const Icon = act.icon;
                const isSelected = activities.includes(act.label);
                return (
                  <button
                    key={act.label}
                    type="button"
                    onClick={() => toggleActivity(act.label)}
                    className={`${chipBase} flex items-center gap-1.5 ${
                      isSelected ? 'bg-[#132B45] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 동행 유형 */}
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold text-[#0F172A] block">동행 유형</span>
            <div className="flex flex-wrap gap-2">
              {['혼자', '연인', '친구', '가족'].map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => {
                    setCompanion(comp);
                    setIsCustomCompanion(false);
                  }}
                  className={`${chipBase} ${
                    !isCustomCompanion && companion === comp ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {comp}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomCompanion(true)}
                className={`${chipBase} ${isCustomCompanion ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'}`}
              >
                직접입력
              </button>
            </div>
            {isCustomCompanion && (
              <input
                type="text"
                placeholder="예) 대학 동기 3명"
                value={customCompanion}
                onChange={(e) => setCustomCompanion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            )}
          </div>

          {/* 원하는 경험 */}
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold text-[#0F172A] block">원하는 경험</span>
            <div className="flex flex-wrap gap-2">
              {['여유롭게', '조용하게', '활동적이게'].map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => {
                    setExperience(exp);
                    setIsCustomExperience(false);
                  }}
                  className={`${chipBase} ${
                    !isCustomExperience && experience === exp ? 'bg-[#132B45] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {exp}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomExperience(true)}
                className={`${chipBase} ${isCustomExperience ? 'bg-[#132B45] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'}`}
              >
                직접입력
              </button>
            </div>
            {isCustomExperience && (
              <input
                type="text"
                placeholder="예) 노트북 작업하기 좋은 곳"
                value={customExperience}
                onChange={(e) => setCustomExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#132B45]"
              />
            )}
          </div>

          {/* 소비 예산 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#0F172A]">소비 예산</span>
              <button
                type="button"
                onClick={() => setUseBudgetFilter(!useBudgetFilter)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap transition-all ${
                  useBudgetFilter ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]' : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {useBudgetFilter && <Check className="w-3 h-3" />}
                {useBudgetFilter ? '예산 분석 사용' : '예산 분석 안 함'}
              </button>
            </div>

            {useBudgetFilter ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {['무료', '1만원', '2만원', '3만원'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setBudget(b);
                        setIsCustomBudget(false);
                      }}
                      className={`${chipBase} ${
                        !isCustomBudget && budget === b ? 'bg-[#059669] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomBudget(true)}
                    className={`${chipBase} ${isCustomBudget ? 'bg-[#059669] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'}`}
                  >
                    직접입력
                  </button>
                </div>
                {isCustomBudget && (
                  <input
                    type="text"
                    placeholder="예) 15,000원 이내"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#059669]"
                  />
                )}
              </>
            ) : (
              <p className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#EEF2F6] leading-relaxed">
                예산 조건 없이 관심 활동과 이동 범위를 중심으로 추천해요.
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* CTA */}
      <button
        type="button"
        onClick={handleGenerate}
        className="w-full py-4 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-sm font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[#93C5FD]" />
        <span>AI 맞춤 타임라인 추천받기</span>
      </button>
      <p className="text-[11px] text-center text-[#94A3B8] -mt-2">활동 가능 {netLeisureMinutes}분 기준으로 코스를 만들어 드려요.</p>
    </div>
  );
};
