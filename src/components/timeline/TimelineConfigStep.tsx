'use client';

import React, { useState } from 'react';
import { useApp, timeStrToMinutes } from '@/context/AppContext';
import { MovementBoundary, TimelineFilterState } from '@/types';
import {
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Coffee,
  ShoppingBag,
  BookOpen,
  Utensils,
  Smile,
  ShieldCheck,
  SlidersHorizontal,
  Check,
  Wallet,
} from 'lucide-react';

export const TimelineConfigStep: React.FC = () => {
  const { activeTicket, customTimeline, generateTimeline } = useApp();

  // STEP 01 필수 입력 1: 버스 출발시간 & 승차장 (예매 내역 자동 연동 + 직접 변경 가능)
  const [busDepartureTime, setBusDepartureTime] = useState<string>(
    activeTicket?.busSchedule.departureTime || customTimeline?.busDepartureTime || '18:00'
  );
  const [boardingPlatform, setBoardingPlatform] = useState<string>(
    activeTicket?.busSchedule.platform || customTimeline?.boardingPlatform || '7번 홈'
  );
  const [currentTime, setCurrentTime] = useState<string>('16:35');
  const [currentLocation, setCurrentLocation] = useState<string>('천안터미널 1층 대합실');
  const [isEditingBusInfo, setIsEditingBusInfo] = useState<boolean>(false);

  // STEP 01 필수 입력 2: 이동 범위 (터미널 내부 / 복합공간 / 주변상권)
  const [movementBoundary, setMovementBoundary] = useState<MovementBoundary>(
    customTimeline?.filter.movementBoundary || 'complex_space'
  );

  // STEP 01 선택 필터링 1: 관심 활동 (복수 선택)
  const [activities, setActivities] = useState<string[]>(
    customTimeline?.filter.activities || ['문화/서점', '카페']
  );

  // STEP 01 선택 필터링 2: 동행 유형 (혼자/연인/친구/가족/직접입력)
  const [companion, setCompanion] = useState<string>('혼자');
  const [customCompanion, setCustomCompanion] = useState<string>('');
  const [isCustomCompanion, setIsCustomCompanion] = useState<boolean>(false);

  // STEP 01 선택 필터링 3: 원하는 경험 (여유롭게/조용하게/활동적이게/직접입력)
  const [experience, setExperience] = useState<string>('조용하게');
  const [customExperience, setCustomExperience] = useState<string>('');
  const [isCustomExperience, setIsCustomExperience] = useState<boolean>(false);

  // STEP 01 선택 필터링 4: 소비 예산 (사용자 선택에 따른 분석 진행: 무료/1만원/2만원/3만원/직접입력)
  const [useBudgetFilter, setUseBudgetFilter] = useState<boolean>(true);
  const [budget, setBudget] = useState<string>('1만원');
  const [customBudget, setCustomBudget] = useState<string>('');
  const [isCustomBudget, setIsCustomBudget] = useState<boolean>(false);

  // STEP 02: AI 실제 이용 가능한 여유시간 실시간 계산
  const startMinutes = timeStrToMinutes(currentTime);
  const depMinutes = timeStrToMinutes(busDepartureTime);
  const totalRemainingMinutes = Math.max(30, depMinutes - startMinutes);

  // 시설 간 이동 + 승차장 이동 소요시간 산정
  const facilityTransitMinutes =
    movementBoundary === 'surrounding_area' ? 12 : movementBoundary === 'complex_space' ? 6 : 3;
  const platformWalkMinutes =
    movementBoundary === 'surrounding_area' ? 6 : movementBoundary === 'complex_space' ? 4 : 2;
  const totalTransitMinutes = facilityTransitMinutes + platformWalkMinutes;
  const boardingBufferMinutes = 15; // 탑승 준비 필수 여유시간
  const netLeisureMinutes = Math.max(
    10,
    totalRemainingMinutes - totalTransitMinutes - boardingBufferMinutes
  );

  const toggleActivity = (act: string) => {
    if (activities.includes(act)) {
      if (activities.length > 1) {
        setActivities(activities.filter((a) => a !== act));
      }
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

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* STEP 01. 예매 정보 확인 및 버스 출발시간 설정 (필수) */}
      <div className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white p-4 rounded-3xl shadow-sm border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-[#93C5FD]">
            <Clock className="w-3.5 h-3.5" /> STEP 01. 예매 버스 시간 및 승차장 확인
            <span className="text-[10px] bg-[#EF4444] text-white px-1.5 py-0.2 rounded font-extrabold">
              필수
            </span>
          </span>
          <button
            type="button"
            onClick={() => setIsEditingBusInfo(!isEditingBusInfo)}
            className="text-[11px] bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full font-semibold transition-colors"
          >
            {isEditingBusInfo ? '완료' : '시간·위치 변경'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div>
            <span className="text-[11px] text-white/70 block">
              {activeTicket
                ? `${activeTicket.busSchedule.departureStation} → ${activeTicket.busSchedule.arrivalStation} (${activeTicket.busSchedule.company})`
                : '천안종합버스터미널 출발 노선'}
            </span>
            <div className="text-lg font-black tracking-tight flex items-center gap-2 mt-0.5">
              <span>{busDepartureTime} 출발</span>
              <span className="text-xs font-bold text-[#93C5FD]">
                (현재 {currentTime} 기준)
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/70 block mb-0.5">탑승 승차장</span>
            <span className="text-xs font-black bg-[#2563EB] text-white px-2.5 py-1 rounded-xl shadow-xs inline-block">
              {boardingPlatform}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#93C5FD]" /> 현재 위치: <strong>{currentLocation}</strong>
          </span>
          <span className="text-[#6EE7B7] font-bold">승차장까지 도보 {platformWalkMinutes}분</span>
        </div>

        {/* 버스 시간 / 승차장 / 현재 위치 직접 변경 패널 */}
        {isEditingBusInfo && (
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 space-y-2.5 text-xs animate-in fade-in duration-150">
            <div>
              <label className="text-[11px] text-[#93C5FD] font-bold block mb-1">
                버스 출발시간 선택 (필수)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['17:30', '18:00', '18:30', '19:00'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBusDepartureTime(t)}
                    className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                      busDepartureTime === t
                        ? 'bg-white text-[#132B45] shadow-xs'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#93C5FD] font-bold block mb-1">
                  승차장 홈
                </label>
                <select
                  value={boardingPlatform}
                  onChange={(e) => setBoardingPlatform(e.target.value)}
                  className="w-full bg-[#0F172A] text-white border border-white/20 rounded-lg px-2 py-1.5 text-xs font-bold"
                >
                  <option value="7번 홈">고속 7번 홈 (서울)</option>
                  <option value="3번 홈">시외 3번 홈 (동서울)</option>
                  <option value="12번 홈">시외 12번 홈 (수원)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#93C5FD] font-bold block mb-1">
                  현재 내 위치
                </label>
                <select
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="w-full bg-[#0F172A] text-white border border-white/20 rounded-lg px-2 py-1.5 text-xs font-bold"
                >
                  <option value="천안터미널 1층 대합실">터미널 1층 대합실</option>
                  <option value="신세계백화점 연결통로">신세계 연결통로</option>
                  <option value="터미널 앞 조각광장">터미널 앞 광장</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STEP 01 필수 항목: 이동 범위 선택 */}
      <div className="bg-white rounded-3xl p-4 border border-[#EEF2F6] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#132B45]" />
            <h4 className="font-extrabold text-xs text-[#0F172A]">
              이동 범위 선택
            </h4>
            <span className="text-[10px] bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded font-extrabold">
              필수 입력
            </span>
          </div>
          <span className="text-[10px] text-[#64748B]">천안터미널 복합공간 연계</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: 'terminal_inside',
              title: '터미널 내부',
              desc: '대합실·라운지·식당 (도보 1~2분)',
              badge: '최단동선',
            },
            {
              id: 'complex_space',
              title: '복합공간',
              desc: '신세계백화점·교보 (도보 3~4분)',
              badge: 'AI 추천',
            },
            {
              id: 'surrounding_area',
              title: '주변상권',
              desc: '조각광장·신부동골목 (도보 6분)',
              badge: '여유코스',
            },
          ].map((item) => {
            const isSelected = movementBoundary === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMovementBoundary(item.id as MovementBoundary)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-[#132B45] bg-[#E1EDFB]/60 text-[#132B45] shadow-xs ring-1 ring-[#132B45]'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569]'
                }`}
              >
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full inline-block mb-1 ${
                    isSelected ? 'bg-[#132B45] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {item.badge}
                </span>
                <span className="text-xs font-extrabold block">{item.title}</span>
                <span className="text-[10px] text-[#64748B] block mt-0.5 leading-tight">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 02: 실제 이용 가능한 여유시간 계산 (AI 기능) */}
      <div className="bg-white rounded-3xl p-4 border border-[#DBEAFE] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-[#2563EB] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#2563EB] block leading-none">
                STEP 02. AI 여유시간 자동 산정
              </span>
              <h4 className="font-extrabold text-xs text-[#0F172A] mt-0.5">
                실제 활동 가용 시간: <span className="text-[#2563EB]">{netLeisureMinutes}분</span>
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-extrabold bg-[#EFF6FF] text-[#1D4ED8] px-2.5 py-1 rounded-xl border border-[#BFDBFE]">
            총 잔여 {totalRemainingMinutes}분
          </span>
        </div>

        {/* Time Allocation Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center h-3.5 rounded-full overflow-hidden bg-[#EEF2F6] gap-0.5 p-0.5">
            <div
              className="bg-[#2563EB] h-full rounded-l-full transition-all duration-300"
              style={{ width: `${(netLeisureMinutes / totalRemainingMinutes) * 100}%` }}
              title="활동 가능 시간"
            />
            <div
              className="bg-[#F59E0B] h-full transition-all duration-300"
              style={{ width: `${(totalTransitMinutes / totalRemainingMinutes) * 100}%` }}
              title="시설 및 승차장 이동시간"
            />
            <div
              className="bg-[#059669] h-full rounded-r-full transition-all duration-300"
              style={{ width: `${(boardingBufferMinutes / totalRemainingMinutes) * 100}%` }}
              title="탑승 준비 여유시간"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-0.5">
            <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE]">
              <span className="text-[#64748B] block">순수 활동 가능</span>
              <strong className="text-xs font-black text-[#2563EB]">{netLeisureMinutes}분</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
              <span className="text-[#64748B] block">시설·승차장 이동</span>
              <strong className="text-xs font-black text-[#D97706]">{totalTransitMinutes}분</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
              <span className="text-[#64748B] block">탑승 준비 버퍼</span>
              <strong className="text-xs font-black text-[#059669]">{boardingBufferMinutes}분</strong>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] text-[11px] text-[#334155] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
          <span>
            시설 간 이동({facilityTransitMinutes}분) + {boardingPlatform} 이동({platformWalkMinutes}분) + 탑승 준비({boardingBufferMinutes}분)를 제외해 <strong>탑승 지장 0%</strong>를 보장합니다.
          </span>
        </div>
      </div>

      {/* STEP 01 선택 필터링: 사용자 필요 유무에 따라 추가 제안 */}
      <div className="bg-white rounded-3xl p-4 border border-[#EEF2F6] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#6366F1]" />
            <h4 className="font-extrabold text-xs text-[#0F172A]">
              맞춤형 취향 필터링 설정
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
            선택 입력 (AI 정밀 분석)
          </span>
        </div>

        {/* 1. 관심 활동 (복수 선택) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-[#0F172A]">
              관심 활동 <span className="text-[10px] font-normal text-[#64748B]">(복수 선택)</span>
            </label>
            <span className="text-[10px] text-[#2563EB] font-bold">{activities.length}개 선택됨</span>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#132B45] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 동행 유형 (혼자/연인/친구/가족/직접입력) */}
        <div className="pt-2 border-t border-[#F8FAFC] space-y-1.5">
          <label className="text-xs font-extrabold text-[#0F172A] block">
            동행 유형
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {['혼자', '연인', '친구', '가족'].map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => {
                  setCompanion(comp);
                  setIsCustomCompanion(false);
                }}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !isCustomCompanion && companion === comp
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {comp}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomCompanion(true)}
              className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                isCustomCompanion
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              직접입력
            </button>
          </div>
          {isCustomCompanion && (
            <input
              type="text"
              placeholder="동행 유형을 직접 입력해 주세요 (예: 대학 동기 3명, 반려견 동반)"
              value={customCompanion}
              onChange={(e) => setCustomCompanion(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          )}
        </div>

        {/* 3. 원하는 경험 (여유롭게/조용하게/활동적이게/직접입력) */}
        <div className="pt-2 border-t border-[#F8FAFC] space-y-1.5">
          <label className="text-xs font-extrabold text-[#0F172A] block">
            원하는 경험
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {['여유롭게', '조용하게', '활동적이게'].map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => {
                  setExperience(exp);
                  setIsCustomExperience(false);
                }}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !isCustomExperience && experience === exp
                    ? 'bg-[#132B45] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {exp}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomExperience(true)}
              className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                isCustomExperience
                  ? 'bg-[#132B45] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              직접입력
            </button>
          </div>
          {isCustomExperience && (
            <input
              type="text"
              placeholder="원하는 경험을 입력해 주세요 (예: 노트북 작업하기 좋은 곳)"
              value={customExperience}
              onChange={(e) => setCustomExperience(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#132B45]"
            />
          )}
        </div>

        {/* 4. 소비 예산 (선택적 분석: 무료/1만원/2만원/3만원/직접입력) */}
        <div className="pt-2 border-t border-[#F8FAFC] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#059669]" />
              <label className="text-xs font-extrabold text-[#0F172A]">
                소비 예산 <span className="text-[10px] font-normal text-[#64748B]">(선택 분석)</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => setUseBudgetFilter(!useBudgetFilter)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                useBudgetFilter
                  ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{useBudgetFilter ? '예산 분석 포함 중' : '예산 제한 없음 (미포함)'}</span>
            </button>
          </div>

          {useBudgetFilter ? (
            <>
              <div className="grid grid-cols-5 gap-1.5">
                {['무료', '1만원', '2만원', '3만원'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBudget(b);
                      setIsCustomBudget(false);
                    }}
                    className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      !isCustomBudget && budget === b
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomBudget(true)}
                  className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    isCustomBudget
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  직접입력
                </button>
              </div>
              {isCustomBudget && (
                <input
                  type="text"
                  placeholder="소비 예산을 직접 입력해 주세요 (예: 15,000원 이내)"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#059669]"
                />
              )}
            </>
          ) : (
            <p className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#EEF2F6]">
              예산 조건 없이 사용자의 취향 활동과 이동 범위를 중심으로 최적 시설을 추천합니다.
            </p>
          )}
        </div>
      </div>

      {/* STEP 03 이동 CTA 버튼 */}
      <button
        type="button"
        onClick={handleGenerate}
        className="w-full py-3.5 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-xs font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[#93C5FD]" />
        <span>AI 맞춤형 타임라인 추천받기 (가용 {netLeisureMinutes}분)</span>
      </button>
    </div>
  );
};
