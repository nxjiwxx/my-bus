'use client';

import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
  MdDirectionsBus,
  MdStorefront,
  MdPark,
  MdRestaurant,
  MdLocalCafe,
  MdMenuBook,
  MdShoppingBag,
  MdWeekend,
  MdVolumeOff,
  MdSelfImprovement,
  MdWhatshot,
  MdPerson,
  MdFavorite,
  MdGroup,
  MdFamilyRestroom,
  MdSavings,
  MdPaid,
  MdAccountBalanceWallet,
  MdPayments,
  MdEdit,
} from 'react-icons/md';
import { useApp, timeStrToMinutes } from '@/context/AppContext';
import { MovementBoundary, TimelineFilterState } from '@/types';
import { BusTypeBadge } from '../common/Badge';
import { Sparkles, Check, Clock } from 'lucide-react';

export const TimelineConfigStep: React.FC = () => {
  const { activeTicket, customTimeline, generateTimeline } = useApp();

  // 최종 목적지의 고속/시외 여부에 따라 타임라인 컬러 토큰 체계 결정
  const busType = activeTicket?.busSchedule.busType || 'express';
  const isExpress = busType === 'express';

  // 필수 입력 1: 버스 출발시간 · 승차장
  const [busDepartureTime, setBusDepartureTime] = useState<string>(
    activeTicket?.busSchedule.departureTime || customTimeline?.busDepartureTime || '18:00'
  );
  const [boardingPlatform] = useState<string>(
    activeTicket?.busSchedule.platform || customTimeline?.boardingPlatform || '7번 홈'
  );
  const [currentTime] = useState<string>('16:35');
  const [currentLocation] = useState<string>('터미널 1층 대합실');
  const [isEditingBusInfo, setIsEditingBusInfo] = useState<boolean>(false);

  // 필수 입력 2: 이동 범위
  const [movementBoundary, setMovementBoundary] = useState<MovementBoundary>(
    customTimeline?.filter.movementBoundary || 'complex_space'
  );

  // 선택 입력: 관심 활동 (복수 선택)
  const [activities, setActivities] = useState<string[]>(
    customTimeline?.filter.activities || ['문화/서점', '카페']
  );

  // 선택 입력: 동행 유형
  const [companion, setCompanion] = useState<string>('혼자');
  const [customCompanion, setCustomCompanion] = useState<string>('');
  const [isCustomCompanion, setIsCustomCompanion] = useState<boolean>(false);

  // 선택 입력: 원하는 경험/분위기
  const [experience, setExperience] = useState<string>('조용하게');
  const [customExperience, setCustomExperience] = useState<string>('');
  const [isCustomExperience, setIsCustomExperience] = useState<boolean>(false);

  // 선택 입력: 소비 예산
  const [useBudgetFilter, setUseBudgetFilter] = useState<boolean>(true);
  const [budget, setBudget] = useState<string>('1만원');
  const [customBudget, setCustomBudget] = useState<string>('');
  const [isCustomBudget, setIsCustomBudget] = useState<boolean>(false);

  // 추가 요청사항
  const [useDetailedNote, setUseDetailedNote] = useState<boolean>(true);
  const [detailedNote, setDetailedNote] = useState<string>(
    '버스 탑승 전까지 교보문고에서 가볍게 책을 둘러보고, 조용한 카페에서 커피 한 잔 마시며 여유롭게 쉬고 싶어요. 승차장까지 늦지 않게 이동하는 코스로 추천해 주세요!'
  );

  // AI 이용 가능 여유시간 계산
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

  const toggleActivity = (act: string) => {
    if (activities.includes(act)) {
      if (activities.length > 1) setActivities(activities.filter((a) => a !== act));
    } else if (activities.length < 3) {
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

  // 필터 옵션 정의 (구글 마테리얼 디자인 기본 아이콘 적용)
  const boundaryOptions: { id: MovementBoundary; icon: IconType; label: string; sub: string }[] = [
    { id: 'terminal_inside', icon: MdDirectionsBus, label: '터미널 내부만', sub: '도보 1~2분' },
    { id: 'complex_space', icon: MdStorefront, label: '신세계·교보 복합공간', sub: '도보 3분' },
    { id: 'surrounding_area', icon: MdPark, label: '신부동 주변상권', sub: '도보 6분' },
  ];

  const activityOptions: { id: string; icon: IconType; label: string }[] = [
    { id: '식사', icon: MdRestaurant, label: '든든한 식사' },
    { id: '카페', icon: MdLocalCafe, label: '여유로운 카페' },
    { id: '문화/서점', icon: MdMenuBook, label: '서점·문화생활' },
    { id: '쇼핑', icon: MdShoppingBag, label: '백화점 쇼핑' },
    { id: '휴식', icon: MdWeekend, label: '편안한 휴식존' },
  ];

  const companionOptions: { id: string; icon: IconType; label: string }[] = [
    { id: '혼자', icon: MdPerson, label: '혼자 여유롭게' },
    { id: '연인', icon: MdFavorite, label: '연인과 데이트' },
    { id: '친구', icon: MdGroup, label: '친구와 함께' },
    { id: '가족', icon: MdFamilyRestroom, label: '가족과 함께' },
  ];

  const experienceOptions: { id: string; icon: IconType; label: string }[] = [
    { id: '조용하게', icon: MdVolumeOff, label: '조용하고 집중되는' },
    { id: '여유롭게', icon: MdSelfImprovement, label: '차분하고 여유로운' },
    { id: '활동적이게', icon: MdWhatshot, label: '활기차고 볼거리 많은' },
  ];

  const budgetOptions: { id: string; icon: IconType; label: string }[] = [
    { id: '무료', icon: MdSavings, label: '무료 구경·산책' },
    { id: '1만원', icon: MdPaid, label: '1만원 이내' },
    { id: '2만원', icon: MdAccountBalanceWallet, label: '2만원 이내' },
    { id: '3만원', icon: MdPayments, label: '3만원 이내' },
  ];

  // 목적지 버스 유형(express / intercity)에 따른 토큰 스타일 정의
  const accentText = isExpress ? 'text-express' : 'text-intercity';
  const accentBg = isExpress ? 'bg-express' : 'bg-intercity';
  const accentFocusBorder = isExpress ? 'focus:border-express' : 'focus:border-intercity';

  const pillBase =
    'rounded-full px-4 py-3 text-body-sm font-semibold tracking-tight inline-flex items-center gap-2 transition-all border-[1.5px] select-none';
  const pillUnselected =
    'bg-surface-container border-transparent text-surface-on-surface hover:bg-surface-container-high active:scale-98';
  const pillSelected = isExpress
    ? 'bg-express-container border-express text-express-on-container shadow-2xs active:scale-98'
    : 'bg-intercity-container border-intercity text-intercity-on-container shadow-2xs active:scale-98';

  const renderIcon = (Icon: IconType, selected: boolean) => (
    <Icon
      aria-hidden="true"
      className={`w-[18px] h-[18px] shrink-0 ${
        selected ? accentText : 'text-surface-subtle'
      }`}
    />
  );

  return (
    <div className="bg-white px-5 py-6 pb-10 space-y-8">
      {/* 상단: 예매 버스 연동 및 AI 순수 활동 가능 시간 배너 */}
      <section className="rounded-3xl bg-surface-bright p-4 border border-surface-container space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BusTypeBadge busType={busType} />
            <span className="text-caption font-extrabold bg-primary text-white px-2.5 py-1 rounded-full whitespace-nowrap">
              {boardingPlatform}
            </span>
            <span className="text-body font-extrabold text-surface-on-surface truncate">
              {activeTicket
                ? `${activeTicket.busSchedule.departureStation} → ${activeTicket.busSchedule.arrivalStation}`
                : '천안 → 서울경부'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingBusInfo(!isEditingBusInfo)}
            className="text-label-sm font-bold text-surface-subtle bg-white px-3 py-1 rounded-full border border-surface-container-high hover:text-surface-on-surface whitespace-nowrap"
          >
            {isEditingBusInfo ? '닫기' : `${busDepartureTime} 출발 · 변경`}
          </button>
        </div>

        {isEditingBusInfo && (
          <div className="pt-2 border-t border-surface-container-high flex items-center justify-between gap-2">
            <span className="text-label-sm font-bold text-surface-outline flex items-center gap-1 whitespace-nowrap">
              <Clock className={`w-4 h-4 ${accentText}`} /> 출발시각 선택
            </span>
            <div className="flex gap-1.5">
              {['17:30', '18:00', '18:30', '19:00'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setBusDepartureTime(t);
                    setIsEditingBusInfo(false);
                  }}
                  className={`px-3 py-1.5 rounded-full font-bold text-label-sm whitespace-nowrap transition-all ${
                    busDepartureTime === t
                      ? `${accentBg} text-white`
                      : 'bg-white text-surface-subtle border border-surface-container-high'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2.5 border-t border-surface-container-high flex items-baseline justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-label font-bold text-surface-subtle">AI 활동 가능 시간</span>
            <span className={`text-display-sm font-black ${accentText} leading-none tracking-tight tabular-nums`}>
              {netLeisureMinutes}분
            </span>
          </div>
          <span className="text-caption font-medium text-surface-outline">
            총 {totalRemainingMinutes}분 (이동 {totalTransitMinutes}분 · 여유 {boardingBufferMinutes}분 제외)
          </span>
        </div>
      </section>

      {/* 필터 1: 이동 범위 (Title 20px + Label 14px) */}
      <section className="space-y-3.5">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-title font-extrabold text-surface-on-surface tracking-tight">
            어디까지 이동할까요?
          </h2>
          <span className="text-label font-semibold text-surface-outline">
            필수 <span className={`${accentText} font-bold`}>1</span>개 선택
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {boundaryOptions.map((item) => {
            const isSelected = movementBoundary === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMovementBoundary(item.id)}
                className={`${pillBase} ${isSelected ? pillSelected : pillUnselected}`}
              >
                {renderIcon(item.icon, isSelected)}
                <span>{item.label}</span>
                <span className="text-label-sm font-medium text-surface-outline">({item.sub})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 필터 2: 관심 활동 */}
      <section className="space-y-3.5">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-title font-extrabold text-surface-on-surface tracking-tight">
            어떤 활동을 하고 싶으신가요?
          </h2>
          <span className="text-label font-semibold text-surface-outline">
            최대 <span className={`${accentText} font-bold`}>3</span>개 선택
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {activityOptions.map((act) => {
            const isSelected = activities.includes(act.id);
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => toggleActivity(act.id)}
                className={`${pillBase} ${isSelected ? pillSelected : pillUnselected}`}
              >
                {renderIcon(act.icon, isSelected)}
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 필터 3: 원하는 분위기 */}
      <section className="space-y-3.5">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-title font-extrabold text-surface-on-surface tracking-tight">
            어떤 분위기를 선호하시나요?
          </h2>
          <span className="text-label font-semibold text-surface-outline">
            최대 <span className={`${accentText} font-bold`}>1</span>개 선택
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {experienceOptions.map((exp) => {
            const isSelected = !isCustomExperience && experience === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => {
                  setExperience(exp.id);
                  setIsCustomExperience(false);
                }}
                className={`${pillBase} ${isSelected ? pillSelected : pillUnselected}`}
              >
                {renderIcon(exp.icon, isSelected)}
                <span>{exp.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsCustomExperience(true)}
            className={`${pillBase} ${isCustomExperience ? pillSelected : pillUnselected}`}
          >
            {renderIcon(MdEdit, isCustomExperience)}
            <span>직접 입력</span>
          </button>
        </div>

        {isCustomExperience && (
          <input
            type="text"
            placeholder="원하는 분위기를 입력해 주세요 (예: 노트북 작업하기 좋은 곳)"
            value={customExperience}
            onChange={(e) => setCustomExperience(e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl bg-surface-bright border border-surface-container-high text-body-sm font-medium text-surface-on-surface focus:outline-none ${accentFocusBorder}`}
          />
        )}
      </section>

      {/* 필터 4: 동행 유형 */}
      <section className="space-y-3.5">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-title font-extrabold text-surface-on-surface tracking-tight">
            누구와 함께 이동하시나요?
          </h2>
          <span className="text-label font-semibold text-surface-outline">
            최대 <span className={`${accentText} font-bold`}>1</span>개 선택
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {companionOptions.map((comp) => {
            const isSelected = !isCustomCompanion && companion === comp.id;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => {
                  setCompanion(comp.id);
                  setIsCustomCompanion(false);
                }}
                className={`${pillBase} ${isSelected ? pillSelected : pillUnselected}`}
              >
                {renderIcon(comp.icon, isSelected)}
                <span>{comp.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsCustomCompanion(true)}
            className={`${pillBase} ${isCustomCompanion ? pillSelected : pillUnselected}`}
          >
            {renderIcon(MdEdit, isCustomCompanion)}
            <span>직접 입력</span>
          </button>
        </div>

        {isCustomCompanion && (
          <input
            type="text"
            placeholder="동행 유형을 입력해 주세요 (예: 학과 동기 3명)"
            value={customCompanion}
            onChange={(e) => setCustomCompanion(e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl bg-surface-bright border border-surface-container-high text-body-sm font-medium text-surface-on-surface focus:outline-none ${accentFocusBorder}`}
          />
        )}
      </section>

      {/* 필터 5: 소비 예산 */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-title font-extrabold text-surface-on-surface tracking-tight">
              예상 소비 예산은요?
            </h2>
            <span className="text-label font-semibold text-surface-outline">
              선택사항
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseBudgetFilter(!useBudgetFilter)}
            className="inline-flex items-center gap-1.5 text-label-sm font-bold text-surface-subtle"
          >
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                useBudgetFilter ? `${accentBg} text-white` : 'bg-surface-container-high text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span>예산 반영</span>
          </button>
        </div>

        {useBudgetFilter && (
          <>
            <div className="flex flex-wrap gap-2.5">
              {budgetOptions.map((b) => {
                const isSelected = !isCustomBudget && budget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBudget(b.id);
                      setIsCustomBudget(false);
                    }}
                    className={`${pillBase} ${isSelected ? pillSelected : pillUnselected}`}
                  >
                    {renderIcon(b.icon, isSelected)}
                    <span>{b.label}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomBudget(true)}
                className={`${pillBase} ${isCustomBudget ? pillSelected : pillUnselected}`}
              >
                {renderIcon(MdEdit, isCustomBudget)}
                <span>직접 입력</span>
              </button>
            </div>

            {isCustomBudget && (
              <input
                type="text"
                placeholder="예산 금액을 입력해 주세요 (예: 15,000원)"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl bg-surface-bright border border-surface-container-high text-body-sm font-medium text-surface-on-surface focus:outline-none ${accentFocusBorder}`}
              />
            )}
          </>
        )}
      </section>

      {/* 필터 6: 더 자세한 타임라인 요청사항 */}
      <section className="space-y-3.5 pt-1">
        <button
          type="button"
          onClick={() => setUseDetailedNote(!useDetailedNote)}
          className="flex items-center gap-2.5 text-left"
        >
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
              useDetailedNote ? `${accentBg} text-white` : 'bg-surface-container-high text-transparent'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </span>
          <span className="text-title-sm font-extrabold text-surface-on-surface tracking-tight">
            더 자세한 희망 일정을 남길래요!
          </span>
        </button>

        {useDetailedNote && (
          <div className="bg-surface-container rounded-2xl p-4 space-y-2">
            <textarea
              rows={4}
              maxLength={200}
              value={detailedNote}
              onChange={(e) => setDetailedNote(e.target.value)}
              placeholder="버스 탑승 전 보내고 싶은 구체적인 일정이나 선호하는 매장을 자유롭게 적어주세요."
              className="w-full bg-transparent text-body-sm leading-relaxed text-surface-on-surface placeholder:text-surface-muted resize-none focus:outline-none"
            />
            <div className="text-right text-label-sm font-medium text-surface-outline">
              {detailedNote.length}/200
            </div>
          </div>
        )}
      </section>

      {/* 하단 CTA 버튼 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          className={`w-full py-3.5 ${accentBg} text-white rounded-2xl text-body font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2`}
        >
          <Sparkles className="w-4 h-4 text-white/90" />
          <span>AI 맞춤 타임라인 추천받기 ({netLeisureMinutes}분 코스)</span>
        </button>
      </div>
    </div>
  );
};
