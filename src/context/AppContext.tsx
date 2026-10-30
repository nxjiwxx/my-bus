'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  BusSchedule,
  CustomTimeline,
  SimulationState,
  TabType,
  Ticket,
  TimelineFilterState,
  TimelineItem,
  TravelRoutine,
  UserProfile,
} from '@/types';
import {
  initialCustomTimeline,
  initialRoutines,
  initialTicket,
  mockTimelinePlaces,
  mockUser,
  pastTickets as initialPastTickets,
} from '@/mock/data';

// "HH:MM" -> 분 변환 헬퍼
export function timeStrToMinutes(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return 18 * 60;
  return parts[0] * 60 + parts[1];
}

// 분 -> "HH:MM" 변환 헬퍼
export function minutesToTimeStr(totalMinutes: number): string {
  const normalized = Math.max(0, totalMinutes);
  const h = Math.floor(normalized / 60) % 24;
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 타임라인 아이템들의 시작/종료 시각 및 마지막 승차장 이동 구간을 자동 재계산
function recalculateTimelineSchedule(
  rawItems: TimelineItem[],
  currentTimeStr: string,
  busDepartureTimeStr: string,
  boardingPlatform: string,
  currentActivityIndex = 0
): { items: TimelineItem[]; actualBufferMinutes: number; totalAvailableMinutes: number } {
  const startBaseMinutes = timeStrToMinutes(currentTimeStr);
  const busDepMinutes = timeStrToMinutes(busDepartureTimeStr);
  const totalAvailableMinutes = Math.max(20, busDepMinutes - startBaseMinutes);

  const activityItems = rawItems.filter((it) => !it.isBoardingStep);
  const existingBoarding = rawItems.find((it) => it.isBoardingStep);

  // 첫 시설까지의 초기 이동시간 (3분)
  let cursorMinutes = startBaseMinutes + 3;

  const recalculatedActivities: TimelineItem[] = activityItems.map((item, idx) => {
    const startTime = minutesToTimeStr(cursorMinutes);
    const endMinutes = cursorMinutes + item.durationMinutes;
    const endTime = minutesToTimeStr(endMinutes);

    // 다음 장소와의 이동시간 산정 (같은 층/건물이면 2~3분, 주변상권이면 5~6분)
    const transit = item.transitTimeToNext || 4;
    cursorMinutes = endMinutes + transit;

    let status: TimelineItem['status'] = 'upcoming';
    if (idx < currentActivityIndex) status = 'completed';
    else if (idx === currentActivityIndex) status = 'current';

    return {
      ...item,
      startTime,
      endTime,
      transitTimeToNext: transit,
      status,
    };
  });

  // 승차장 도착 후 버스 출발까지 남은 시간 = 탑승 준비 여유시간
  const boardingStartMinutes = cursorMinutes;
  const actualBufferMinutes = busDepMinutes - boardingStartMinutes;

  const boardingStep: TimelineItem = {
    id: existingBoarding?.id || `item-boarding-${Date.now()}`,
    placeId: 'place-platform-boarding',
    title: `고속·시외 ${boardingPlatform} 이동 및 탑승 준비`,
    category: '승차장이동',
    location: `천안종합버스터미널 1층 ${boardingPlatform}`,
    startTime: minutesToTimeStr(boardingStartMinutes),
    endTime: busDepartureTimeStr,
    durationMinutes: Math.max(5, actualBufferMinutes),
    cost: '무료',
    costValue: 0,
    description: `모바일 승차권 QR코드 준비 및 ${busDepartureTimeStr} 출발 버스 탑승`,
    transitTimeToNext: 0,
    isBoardingStep: true,
    status: currentActivityIndex >= recalculatedActivities.length ? 'current' : 'upcoming',
    guideFloor: '터미널 본관 1층',
    routeInstruction:
      existingBoarding?.routeInstruction ||
      `현재 시설에서 에스컬레이터/엘리베이터를 이용해 1층 대합실 통과 후 ${boardingPlatform}으로 이동 (도보 4분)`,
    routeSteps: existingBoarding?.routeSteps || [
      '이용 중인 시설에서 중앙 엘리베이터/에스컬레이터로 1층 이동',
      '천안터미널 1층 대합실 연결 통로 진입',
      `${boardingPlatform} 게이트 확인 후 모바일 QR코드 스캔 및 탑승`,
    ],
  };

  return {
    items: [...recalculatedActivities, boardingStep],
    actualBufferMinutes,
    totalAvailableMinutes,
  };
}

interface AppContextType {
  // 탭 상태
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;

  // 사용자 정보
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // AI 시뮬레이터 상태
  simulationState: SimulationState;
  setSimulationState: (state: SimulationState) => void;

  // 티켓 상태
  activeTicket: Ticket | null;
  pastTickets: Ticket[];
  bookBusTicket: (
    schedule: BusSchedule,
    seats: number[],
    passengerCount: { adult: number; teen: number; child: number },
    totalFee: number
  ) => Ticket;
  cancelActiveTicket: () => void;
  updateTicketDepartureTime: (newDepartureTime: string, newRecommendedTime: string) => void;

  // 루틴 상태
  routines: TravelRoutine[];
  addRoutine: (routine: Omit<TravelRoutine, 'id'>) => void;
  toggleRoutine: (id: string) => void;
  deleteRoutine: (id: string) => void;

  // 예매 화면 연동을 위한 프리셋 (AI 제안 클릭 시 등)
  bookingPreset: {
    departure: string;
    arrival: string;
    busType: 'express' | 'intercity';
    time?: string;
  } | null;
  setBookingPreset: (
    preset: { departure: string; arrival: string; busType: 'express' | 'intercity'; time?: string } | null
  ) => void;

  // ==========================================
  // 맞춤형 터미널 여유시간 타임라인 상태 및 메서드
  // ==========================================
  customTimeline: CustomTimeline | null;
  timelineStep: 'config' | 'recommendation' | 'wayfinding';
  setTimelineStep: (step: 'config' | 'recommendation' | 'wayfinding') => void;
  generateTimeline: (filter: TimelineFilterState) => void;
  confirmTimeline: () => void;
  deleteTimelineItem: (itemId: string) => void;
  addTimelineItemFromPlace: (placeId: string) => void;
  moveTimelineItem: (itemId: string, direction: 'up' | 'down') => void;
  updateTimelineItemDuration: (itemId: string, deltaMinutes: number) => void;
  replaceTimelineItem: (itemId: string, newPlaceId: string) => void;
  autoAdjustOverflowTimeline: () => void;
  applyAlternativeShortCourse: () => void;
  setCurrentActivityIndex: (index: number) => void;
  advanceTimelineActivity: () => void;
  toggleVoiceGuide: () => void;
  speakRouteGuide: (text: string) => void;
  simulateActivityDelay: () => void;
  isBoardingAlertOpen: boolean;
  triggerBoardingAlert: () => void;
  dismissBoardingAlert: () => void;
  resetTimelineToInitial: () => void;

  // 토스트 메시지
  toast: string | null;
  showToast: (msg: string) => void;

  // 시뮬레이션 헬퍼
  applyTrafficDelay: () => void;
  applyBusDelay: () => void;
  resetToDefaultBooked: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [simulationState, setSimulationState] = useState<SimulationState>('booked');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(initialTicket);
  const [pastTickets, setPastTickets] = useState<Ticket[]>(initialPastTickets);
  const [routines, setRoutines] = useState<TravelRoutine[]>(initialRoutines);
  const [bookingPreset, setBookingPreset] = useState<{
    departure: string;
    arrival: string;
    busType: 'express' | 'intercity';
    time?: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 맞춤형 타임라인 상태 (초기에는 STEP 01부터 시작하거나 바로 확인할 수 있도록 구성)
  const [customTimeline, setCustomTimeline] = useState<CustomTimeline | null>(initialCustomTimeline);
  const [timelineStep, setTimelineStep] = useState<'config' | 'recommendation' | 'wayfinding'>('config');
  const [isBoardingAlertOpen, setIsBoardingAlertOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const speakRouteGuide = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // fallback if speechSynthesis fails
      }
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('설정이 성공적으로 저장되었습니다.');
  };

  const bookBusTicket = (
    schedule: BusSchedule,
    seats: number[],
    passengerCount: { adult: number; teen: number; child: number },
    totalFee: number
  ) => {
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      bookingNumber: `T${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      busSchedule: schedule,
      travelDate: '2026-10-30 (금)',
      seatNumbers: seats,
      passengerCount,
      totalFee,
      paymentMethod: '간편결제 (네이버페이)',
      bookedAt:
        new Date().toLocaleDateString('ko-KR') +
        ' ' +
        new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status: 'upcoming',
      originPlace: '상명대학교(천안)',
      transitMode: '시내버스 (400번)',
      targetArrivalTime: '17:40',
      recommendedDepartureTime: '17:10',
    };

    setActiveTicket(newTicket);
    setSimulationState('booked');
    showToast('승차권 예매가 완료되었습니다!');
    return newTicket;
  };

  const cancelActiveTicket = () => {
    if (!activeTicket) return;
    const cancelledTicket: Ticket = {
      ...activeTicket,
      status: 'cancelled',
    };
    setPastTickets((prev) => [cancelledTicket, ...prev]);
    setActiveTicket(null);
    setSimulationState('before_booking');
    showToast('예매가 정상적으로 취소되었습니다 (수수료 0원).');
  };

  const updateTicketDepartureTime = (newDepartureTime: string, newRecommendedTime: string) => {
    if (!activeTicket) return;
    setActiveTicket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        busSchedule: {
          ...prev.busSchedule,
          departureTime: newDepartureTime,
        },
        recommendedDepartureTime: newRecommendedTime,
      };
    });
  };

  const addRoutine = (routineData: Omit<TravelRoutine, 'id'>) => {
    const newRoutine: TravelRoutine = {
      ...routineData,
      id: `routine-${Date.now()}`,
    };
    setRoutines((prev) => [newRoutine, ...prev]);
    showToast('새로운 이동 루틴이 등록되었습니다.');
  };

  const toggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.isActive;
          showToast(`루틴이 ${nextState ? '활성화' : '일시 중지'}되었습니다.`);
          return { ...r, isActive: nextState };
        }
        return r;
      })
    );
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    showToast('루틴이 삭제되었습니다.');
  };

  // ==========================================
  // 맞춤형 타임라인 조작 함수들 (STEP 01 ~ STEP 06)
  // ==========================================

  const generateTimeline = (filter: TimelineFilterState) => {
    // 1. 이동 범위 필터링
    let candidates = mockTimelinePlaces.filter((p) => {
      if (filter.movementBoundary === 'terminal_inside') {
        return p.boundary === 'terminal_inside';
      }
      if (filter.movementBoundary === 'complex_space') {
        return p.boundary === 'terminal_inside' || p.boundary === 'complex_space';
      }
      return true; // surrounding_area는 전 구역 포함
    });

    // 2. 예산 필터링 (사용자 선택 시에만 예산 분석 반영)
    let budgetLimit = Infinity;
    if (filter.useBudgetFilter) {
      if (filter.budget === '무료') budgetLimit = 0;
      else if (filter.budget.includes('1만원')) budgetLimit = 10000;
      else if (filter.budget.includes('2만원')) budgetLimit = 20000;
      else if (filter.budget.includes('3만원')) budgetLimit = 35000;
      else {
        const parsed = parseInt(filter.budget.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) {
          budgetLimit = parsed < 100 ? parsed * 10000 : parsed;
        }
      }
      const withinBudget = candidates.filter((p) => p.costValue <= budgetLimit);
      if (withinBudget.length > 0) {
        candidates = withinBudget;
      }
    }

    // 3. 관심 활동, 동행 유형, 원하는 경험 점수 산정
    const scored = candidates.map((place) => {
      let score = 0;
      if (filter.activities.includes(place.category)) score += 30;
      if (place.suitableCompanions?.includes(filter.companion)) score += 15;
      if (place.suitableExperiences?.includes(filter.experience)) score += 15;
      if (place.boundary === filter.movementBoundary) score += 10;
      return { place, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // 4. 가용 여유시간 계산 후 알맞은 개수의 시설 배정
    const startMin = timeStrToMinutes(filter.currentTime || '16:35');
    const depMin = timeStrToMinutes(filter.busDepartureTime || '18:00');
    const totalAvail = Math.max(30, depMin - startMin);
    const targetBuffer = 15;
    const maxActivityTime = totalAvail - targetBuffer - 10; // 이동시간 약 10분 제외

    const chosenPlaces = [];
    let accumulatedMinutes = 0;
    let accumulatedCost = 0;

    for (const item of scored) {
      if (chosenPlaces.length >= 3) break;
      if (filter.useBudgetFilter && budgetLimit < Infinity && accumulatedCost + item.place.costValue > budgetLimit) {
        continue;
      }
      if (accumulatedMinutes + item.place.defaultDurationMinutes <= maxActivityTime || chosenPlaces.length === 0) {
        chosenPlaces.push(item.place);
        accumulatedMinutes += item.place.defaultDurationMinutes;
        accumulatedCost += item.place.costValue;
      }
    }

    if (chosenPlaces.length === 0) {
      chosenPlaces.push(mockTimelinePlaces[0]);
    }

    // 남은 시간에 맞춰 각 장소의 체류시간을 탄력적으로 조율
    const rawItems: TimelineItem[] = chosenPlaces.map((place, index) => {
      const transitTime = place.boundary === 'surrounding_area' ? 6 : place.boundary === 'complex_space' ? 3 : 2;
      return {
        id: `item-${Date.now()}-${index}`,
        placeId: place.id,
        title: place.name,
        category: place.category,
        location: place.location,
        startTime: '16:40',
        endTime: '17:10',
        durationMinutes: place.defaultDurationMinutes,
        cost: place.defaultCost,
        costValue: place.costValue,
        description: place.description,
        transitTimeToNext: transitTime,
        status: index === 0 ? 'current' : 'upcoming',
        guideFloor: place.guideFloor,
        routeInstruction: place.routeInstruction,
        routeSteps: place.routeSteps,
      };
    });

    const { items: finalItems, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      rawItems,
      filter.currentTime || '16:35',
      filter.busDepartureTime || '18:00',
      filter.boardingPlatform || '7번 홈',
      0
    );

    const boundaryLabel =
      filter.movementBoundary === 'terminal_inside'
        ? '터미널 내부'
        : filter.movementBoundary === 'complex_space'
        ? '신세계·교보 복합공간'
        : '터미널 주변상권';

    const budgetText = filter.useBudgetFilter ? `예산(${filter.budget})` : '예산 제한 없음';

    const newTimeline: CustomTimeline = {
      id: `timeline-${Date.now()}`,
      busDepartureTime: filter.busDepartureTime || '18:00',
      boardingPlatform: filter.boardingPlatform || '7번 홈',
      currentTime: filter.currentTime || '16:35',
      currentLocation: filter.currentLocation || '천안터미널 1층 대합실',
      totalAvailableMinutes,
      bufferMinutes: 15,
      actualBufferMinutes,
      filter,
      items: finalItems,
      isConfirmed: false,
      voiceGuideEnabled: false,
      currentActivityIndex: 0,
      isAlertedForBoarding: false,
      isDelayedAdjusted: false,
      aiAnalysisSummary: `${boundaryLabel} 내 [${filter.companion} · ${filter.experience} · ${budgetText}] 조건을 분석해 이동 동선이 가장 짧은 ${
        finalItems.length - 1
      }개 시설과 승차장(${filter.boardingPlatform}) 이동 일정을 구성했습니다.`,
    };

    setCustomTimeline(newTimeline);
    setTimelineStep('recommendation');
    showToast('AI가 이용 조건과 여유시간에 맞춘 타임라인을 생성했습니다.');
  };

  const confirmTimeline = () => {
    if (!customTimeline) return;
    setCustomTimeline((prev) => (prev ? { ...prev, isConfirmed: true, currentActivityIndex: 0 } : null));
    setTimelineStep('wayfinding');
    showToast('타임라인이 확정되었습니다! 실시간 길 안내를 시작합니다.');
  };

  const deleteTimelineItem = (itemId: string) => {
    if (!customTimeline) return;
    const filtered = customTimeline.items.filter((it) => it.id !== itemId || it.isBoardingStep);
    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      filtered,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );
    setCustomTimeline((prev) =>
      prev ? { ...prev, items, actualBufferMinutes, totalAvailableMinutes, isConfirmed: false } : null
    );
    showToast('일정이 삭제되고 전체 소요시간 및 동선이 재계산되었습니다.');
  };

  const addTimelineItemFromPlace = (placeId: string) => {
    if (!customTimeline) return;
    const place = mockTimelinePlaces.find((p) => p.id === placeId);
    if (!place) return;

    const newItem: TimelineItem = {
      id: `item-${Date.now()}`,
      placeId: place.id,
      title: place.name,
      category: place.category,
      location: place.location,
      startTime: '17:20',
      endTime: '17:40',
      durationMinutes: place.defaultDurationMinutes,
      cost: place.defaultCost,
      costValue: place.costValue,
      description: place.description,
      transitTimeToNext: place.boundary === 'surrounding_area' ? 6 : 3,
      status: 'upcoming',
      guideFloor: place.guideFloor,
      routeInstruction: place.routeInstruction,
      routeSteps: place.routeSteps,
    };

    const list = [...customTimeline.items];
    const boardingIdx = list.findIndex((it) => it.isBoardingStep);
    if (boardingIdx !== -1) {
      list.splice(boardingIdx, 0, newItem);
    } else {
      list.push(newItem);
    }

    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      list,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );

    setCustomTimeline((prev) =>
      prev ? { ...prev, items, actualBufferMinutes, totalAvailableMinutes, isConfirmed: false } : null
    );

    if (actualBufferMinutes < 15) {
      showToast(`⚠️ '${place.name}' 추가로 탑승 준비시간이 부족합니다. AI 축소 제안을 확인하세요.`);
    } else {
      showToast(`'${place.name}' 일정이 추가되고 동선이 재계산되었습니다.`);
    }
  };

  const moveTimelineItem = (itemId: string, direction: 'up' | 'down') => {
    if (!customTimeline) return;
    const activities = customTimeline.items.filter((it) => !it.isBoardingStep);
    const boarding = customTimeline.items.find((it) => it.isBoardingStep);
    const idx = activities.findIndex((it) => it.id === itemId);
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activities.length) return;

    const swapped = [...activities];
    const temp = swapped[idx];
    swapped[idx] = swapped[targetIdx];
    swapped[targetIdx] = temp;

    const combined = boarding ? [...swapped, boarding] : swapped;
    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      combined,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );

    setCustomTimeline((prev) =>
      prev ? { ...prev, items, actualBufferMinutes, totalAvailableMinutes } : null
    );
    showToast('방문 순서가 변경되어 AI가 최적 이동 동선과 시각을 재계산했습니다.');
  };

  const updateTimelineItemDuration = (itemId: string, deltaMinutes: number) => {
    if (!customTimeline) return;
    const updatedRaw = customTimeline.items.map((it) => {
      if (it.id === itemId && !it.isBoardingStep) {
        const nextDur = Math.max(10, Math.min(90, it.durationMinutes + deltaMinutes));
        return { ...it, durationMinutes: nextDur };
      }
      return it;
    });

    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      updatedRaw,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );

    setCustomTimeline((prev) =>
      prev ? { ...prev, items, actualBufferMinutes, totalAvailableMinutes } : null
    );
  };

  const replaceTimelineItem = (itemId: string, newPlaceId: string) => {
    if (!customTimeline) return;
    const place = mockTimelinePlaces.find((p) => p.id === newPlaceId);
    if (!place) return;

    const updatedRaw = customTimeline.items.map((it) => {
      if (it.id === itemId && !it.isBoardingStep) {
        return {
          ...it,
          placeId: place.id,
          title: place.name,
          category: place.category,
          location: place.location,
          durationMinutes: place.defaultDurationMinutes,
          cost: place.defaultCost,
          costValue: place.costValue,
          description: place.description,
          transitTimeToNext: place.boundary === 'surrounding_area' ? 6 : 3,
          guideFloor: place.guideFloor,
          routeInstruction: place.routeInstruction,
          routeSteps: place.routeSteps,
        };
      }
      return it;
    });

    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      updatedRaw,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );

    setCustomTimeline((prev) =>
      prev ? { ...prev, items, actualBufferMinutes, totalAvailableMinutes } : null
    );
    showToast(`'${place.name}'(으)로 장소가 변경되고 동선이 재계산되었습니다.`);
  };

  // STEP 04 & 06: 탑승 준비시간 부족 시 AI가 활동시간을 자동 축소해 15분 여유시간 확보
  const autoAdjustOverflowTimeline = () => {
    if (!customTimeline) return;
    const shortage = 15 - customTimeline.actualBufferMinutes;
    if (shortage <= 0) {
      showToast('현재 탑승 준비 여유시간(15분 이상)이 충분히 확보되어 있습니다.');
      return;
    }

    const activities = customTimeline.items.filter((it) => !it.isBoardingStep);
    const boarding = customTimeline.items.find((it) => it.isBoardingStep);

    let remainingToCut = shortage + 2; // 17분 여유 확보 목표
    const adjustedActivities = activities.map((act) => {
      if (remainingToCut <= 0) return act;
      const maxCut = Math.max(0, act.durationMinutes - 15);
      const cut = Math.min(maxCut, Math.ceil(remainingToCut / activities.length) + 3);
      remainingToCut -= cut;
      return {
        ...act,
        durationMinutes: act.durationMinutes - cut,
        description: act.description.includes('(AI 시간 최적화)')
          ? act.description
          : `${act.description} (AI 시간 최적화)`,
      };
    });

    // 만약 활동 시간 단축만으로 부족하면 마지막 활동 제거
    let finalCandidate = adjustedActivities;
    const testCalc = recalculateTimelineSchedule(
      boarding ? [...finalCandidate, boarding] : finalCandidate,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );

    if (testCalc.actualBufferMinutes < 15 && finalCandidate.length > 1) {
      finalCandidate = finalCandidate.slice(0, finalCandidate.length - 1);
    }

    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      boarding ? [...finalCandidate, boarding] : finalCandidate,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      customTimeline.currentActivityIndex
    );

    setCustomTimeline((prev) =>
      prev
        ? {
            ...prev,
            items,
            actualBufferMinutes,
            totalAvailableMinutes,
            isDelayedAdjusted: true,
            delayAdjustmentReason: `탑승 준비시간(15분) 확보를 위해 활동 체류시간을 자동 조율했습니다 (여유 ${actualBufferMinutes}분 확보).`,
          }
        : null
    );
    showToast(`✨ AI가 활동 시간을 자동 축소하여 탑승 준비시간(${actualBufferMinutes}분)을 확보했습니다!`);
  };

  // 대체 일정(터미널 내부 단거리 코스)으로 변경 제안 적용
  const applyAlternativeShortCourse = () => {
    if (!customTimeline) return;
    const quickPlaces = mockTimelinePlaces.filter((p) => p.boundary === 'terminal_inside').slice(0, 2);
    const rawItems: TimelineItem[] = quickPlaces.map((place, idx) => ({
      id: `item-alt-${Date.now()}-${idx}`,
      placeId: place.id,
      title: place.name,
      category: place.category,
      location: place.location,
      startTime: '16:40',
      endTime: '17:00',
      durationMinutes: 20,
      cost: place.defaultCost,
      costValue: place.costValue,
      description: `${place.description} (터미널 내부 안전 대체 일정)`,
      transitTimeToNext: 2,
      status: idx === 0 ? 'current' : 'upcoming',
      guideFloor: place.guideFloor,
      routeInstruction: place.routeInstruction,
      routeSteps: place.routeSteps,
    }));

    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      rawItems,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      0
    );

    setCustomTimeline((prev) =>
      prev
        ? {
            ...prev,
            items,
            actualBufferMinutes,
            totalAvailableMinutes,
            currentActivityIndex: 0,
            isDelayedAdjusted: true,
            delayAdjustmentReason: '이동 부담이 적은 터미널 1층 내부 대체 코스로 일정을 재구성했습니다.',
          }
        : null
    );
    showToast('🔄 승차장 1분 거리의 터미널 내부 대체 일정으로 변경되었습니다.');
  };

  const setCurrentActivityIndex = (index: number) => {
    if (!customTimeline) return;
    const bounded = Math.max(0, Math.min(customTimeline.items.length - 1, index));
    const updatedItems = customTimeline.items.map((it, idx) => ({
      ...it,
      status: (idx < bounded ? 'completed' : idx === bounded ? 'current' : 'upcoming') as TimelineItem['status'],
    }));

    setCustomTimeline((prev) =>
      prev ? { ...prev, currentActivityIndex: bounded, items: updatedItems } : null
    );

    const activeItem = updatedItems[bounded];
    if (activeItem) {
      if (customTimeline.voiceGuideEnabled) {
        speakRouteGuide(`${activeItem.title} 안내를 시작합니다. ${activeItem.routeInstruction}`);
      }
      if (activeItem.isBoardingStep) {
        setIsBoardingAlertOpen(true);
      }
    }
  };

  const advanceTimelineActivity = () => {
    if (!customTimeline) return;
    const nextIdx = customTimeline.currentActivityIndex + 1;
    if (nextIdx >= customTimeline.items.length) {
      showToast('모든 타임라인 일정과 승차장 이동 안내가 완료되었습니다!');
      return;
    }
    setCurrentActivityIndex(nextIdx);
    const nextItem = customTimeline.items[nextIdx];
    showToast(`📍 다음 일정 이동: '${nextItem.title}' 길 안내로 전환되었습니다.`);
  };

  const toggleVoiceGuide = () => {
    if (!customTimeline) return;
    const nextVal = !customTimeline.voiceGuideEnabled;
    setCustomTimeline((prev) => (prev ? { ...prev, voiceGuideEnabled: nextVal } : null));

    const currentItem = customTimeline.items[customTimeline.currentActivityIndex] || customTimeline.items[0];
    if (nextVal) {
      speakRouteGuide(
        `AI 맞춤형 타임라인 음성 길 안내를 시작합니다. 현재 일정은 ${currentItem.title}이며, 이동 경로는 ${currentItem.routeInstruction} 입니다.`
      );
      showToast('🔊 음성 길 안내가 켜졌습니다.');
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      showToast('음성 길 안내가 꺼졌습니다.');
    }
  };

  const simulateActivityDelay = () => {
    if (!customTimeline) return;
    const currIdx = customTimeline.currentActivityIndex;

    // 현재 활동이 10분 지연되었을 때 다음 활동을 10분 자동 단축하여 탑승 준비시간(15분)을 지킴
    const updatedRaw = customTimeline.items.map((item, idx) => {
      if (idx === currIdx && !item.isBoardingStep) {
        return {
          ...item,
          durationMinutes: item.durationMinutes + 10,
          description: item.description.includes('(이용 10분 지연)')
            ? item.description
            : `${item.description} (이용 10분 지연 발생)`,
        };
      }
      if (idx > currIdx && !item.isBoardingStep) {
        return {
          ...item,
          durationMinutes: Math.max(15, item.durationMinutes - 10),
          description: item.description.includes('(AI 10분 단축 조정)')
            ? item.description
            : `${item.description} (AI 10분 단축 조정 적용)`,
        };
      }
      return item;
    });

    const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
      updatedRaw,
      customTimeline.currentTime,
      customTimeline.busDepartureTime,
      customTimeline.boardingPlatform,
      currIdx
    );

    setCustomTimeline((prev) =>
      prev
        ? {
            ...prev,
            items,
            actualBufferMinutes,
            totalAvailableMinutes,
            isDelayedAdjusted: true,
            delayAdjustmentReason:
              '현재 시설 이용이 예상보다 10분 길어져, 이후 활동 시간을 10분 단축하고 승차장 이동 시각을 안전하게 방어했습니다.',
          }
        : null
    );

    if (customTimeline.voiceGuideEnabled) {
      speakRouteGuide(
        '시설 이용이 10분 지연되어 다음 일정을 10분 단축했습니다. 버스 출발 15분 전 승차장 도착은 안전하게 유지됩니다.'
      );
    }
    showToast('⚡ AI 일정 재조정: 활동 10분 지연 감지 → 다음 일정을 단축해 탑승 준비시간을 확보했습니다.');
  };

  const triggerBoardingAlert = () => {
    setIsBoardingAlertOpen(true);
    if (customTimeline?.voiceGuideEnabled) {
      speakRouteGuide(
        `버스 출발 15분 전입니다. 현재 활동을 마무리하고 ${customTimeline.boardingPlatform}으로 이동해 주세요.`
      );
    }
    showToast(`📢 승차장 이동 알림: 출발 15분 전입니다. ${customTimeline?.boardingPlatform || '7번 홈'}으로 이동해 주세요!`);
  };

  const dismissBoardingAlert = () => {
    setIsBoardingAlertOpen(false);
  };

  const resetTimelineToInitial = () => {
    setCustomTimeline(initialCustomTimeline);
    setTimelineStep('wayfinding');
    showToast('기본 추천 타임라인(교보문고→스타벅스→7번홈)으로 복원되었습니다.');
  };

  // 시뮬레이터 조작 함수들
  const applyTrafficDelay = () => {
    setSimulationState('traffic_delay');
    if (activeTicket) {
      setActiveTicket((prev) =>
        prev
          ? {
              ...prev,
              recommendedDepartureTime: '16:55',
            }
          : null
      );
    }
    showToast('교통 정체 감지: 권장 출발시간이 16:55로 앞당겨졌습니다.');
  };

  const applyBusDelay = () => {
    setSimulationState('bus_delay');
    if (activeTicket) {
      setActiveTicket((prev) =>
        prev
          ? {
              ...prev,
              busSchedule: {
                ...prev.busSchedule,
                departureTime: '18:20',
              },
              recommendedDepartureTime: '17:30',
            }
          : null
      );
    }
    // 버스 지연 시 맞춤형 타임라인의 버스 출발 시각도 18:20으로 연동 가능
    if (customTimeline) {
      const { items, actualBufferMinutes, totalAvailableMinutes } = recalculateTimelineSchedule(
        customTimeline.items,
        customTimeline.currentTime,
        '18:20',
        customTimeline.boardingPlatform,
        customTimeline.currentActivityIndex
      );
      setCustomTimeline((prev) =>
        prev
          ? {
              ...prev,
              busDepartureTime: '18:20',
              items,
              actualBufferMinutes,
              totalAvailableMinutes,
              isDelayedAdjusted: true,
              delayAdjustmentReason: '버스 공식 출발시각이 18:20으로 20분 지연되어 여유시간이 20분 늘어났습니다.',
            }
          : null
      );
    }
    showToast('공식 버스 지연: 출발시간이 18:20으로 변경되었습니다.');
  };

  const resetToDefaultBooked = () => {
    setActiveTicket(initialTicket);
    setSimulationState('booked');
    setCustomTimeline(initialCustomTimeline);
    showToast('기본 예매 완료 상태(18:00 출발)로 초기화되었습니다.');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        user,
        updateUser,
        simulationState,
        setSimulationState,
        activeTicket,
        pastTickets,
        bookBusTicket,
        cancelActiveTicket,
        updateTicketDepartureTime,
        routines,
        addRoutine,
        toggleRoutine,
        deleteRoutine,
        bookingPreset,
        setBookingPreset,
        customTimeline,
        timelineStep,
        setTimelineStep,
        generateTimeline,
        confirmTimeline,
        deleteTimelineItem,
        addTimelineItemFromPlace,
        moveTimelineItem,
        updateTimelineItemDuration,
        replaceTimelineItem,
        autoAdjustOverflowTimeline,
        applyAlternativeShortCourse,
        setCurrentActivityIndex,
        advanceTimelineActivity,
        toggleVoiceGuide,
        speakRouteGuide,
        simulateActivityDelay,
        isBoardingAlertOpen,
        triggerBoardingAlert,
        dismissBoardingAlert,
        resetTimelineToInitial,
        toast,
        showToast,
        applyTrafficDelay,
        applyBusDelay,
        resetToDefaultBooked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
