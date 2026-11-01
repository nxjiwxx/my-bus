'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SimulationState } from '@/types';
import { Sparkles, SlidersHorizontal, AlertTriangle, Clock, MapPin, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { initialTicket } from '@/mock/data';

export const SimulationController: React.FC = () => {
  const {
    simulationState,
    setSimulationState,
    applyTrafficDelay,
    applyBusDelay,
    resetToDefaultBooked,
    showToast,
    setCurrentTab,
    setTimelineStep,
    customTimeline,
    resetTimelineToInitial,
    finishTimelineWayfinding,
    simulateActivityDelay,
    triggerBoardingAlert,
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);

  const states: {
    id: SimulationState;
    label: string;
    sublabel: string;
    badge: string;
    icon: React.FC<{ className?: string }>;
    action: () => void;
  }[] = [
    {
      id: 'before_booking',
      label: 'STATE 01. 예매 전',
      sublabel: 'AI 다음 이동 예측 & 예매 제안',
      badge: '예측 제안',
      icon: Sparkles,
      action: () => {
        setSimulationState('before_booking');
        showToast('시나리오: [예매 전] AI 맞춤 예매 제안 모드');
      },
    },
    {
      id: 'booked',
      label: 'STATE 02. 예매 완료',
      sublabel: '출발 18:00 · 권장 출발 17:10',
      badge: '기본 안내',
      icon: CheckCircle,
      action: () => {
        resetToDefaultBooked();
      },
    },
    {
      id: 'traffic_delay',
      label: 'STATE 03-A. 교통 정체',
      sublabel: '정체 +15분 · 권장 출발 16:55 변경',
      badge: '정체 경보',
      icon: AlertTriangle,
      action: () => {
        applyTrafficDelay();
      },
    },
    {
      id: 'bus_delay',
      label: 'STATE 03-B. 버스 지연',
      sublabel: '공식 18:20 지연 · 일정 재계산',
      badge: '운행 변경',
      icon: Clock,
      action: () => {
        applyBusDelay();
      },
    },
    {
      id: 'in_transit',
      label: 'STATE 04. 터미널 이동 중',
      sublabel: '시내버스 탑승 중 · 18분 후 도착',
      badge: '실시간 이동',
      icon: MapPin,
      action: () => {
        setSimulationState('in_transit');
        showToast('시나리오: [터미널 이동 중] 실시간 경로 트래킹');
      },
    },
    {
      id: 'arrived',
      label: 'STATE 05. 터미널 도착',
      sublabel: '승차홈 7번 안내 & 승차권 QR',
      badge: '탑승 준비',
      icon: CheckCircle,
      action: () => {
        setSimulationState('arrived');
        showToast('시나리오: [터미널 도착 완료] 탑승 안내 및 QR');
      },
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-surface-outline-variant p-4 shadow-xl max-w-sm w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-soft">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ai-primary to-ai-on-container flex items-center justify-center text-white shadow-xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-label text-surface-on-surface leading-tight">AI 상황 시뮬레이터</h4>
            <p className="text-caption-sm text-surface-outline">평가 및 검증용 실시간 제어 도구</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-surface-outline hover:text-surface-on-surface rounded-lg transition-transform"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-1.5">
          <p className="text-caption-sm text-surface-outline leading-relaxed">
            아래 시나리오를 클릭하면 앱 화면의 AI 제안 카드, 출발시간, 상태가 즉시 변경됩니다.
          </p>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {states.map((st) => {
              const Icon = st.icon;
              const isCurrent = simulationState === st.id;

              return (
                <button
                  key={st.id}
                  onClick={st.action}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isCurrent
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-bright hover:bg-surface-container text-[#1E293B] border-surface-container-high'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-surface-container-high text-surface-subtle'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-bold leading-tight truncate">{st.label}</span>
                      <span
                        className={`text-caption-xs px-1.5 py-0.5 rounded-full font-medium ${
                          isCurrent
                            ? 'bg-white/25 text-white'
                            : 'bg-surface-container text-surface-outline'
                        }`}
                      >
                        {st.badge}
                      </span>
                    </div>
                    <p
                      className={`text-caption-sm mt-0.5 truncate ${
                        isCurrent ? 'text-white/80' : 'text-surface-outline'
                      }`}
                    >
                      {st.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 맞춤형 타임라인 6단계 빠른 시연 제어 */}
          <div className="pt-2.5 border-t border-surface-soft space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-caption-sm font-extrabold text-ai-on-container flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 맞춤형 타임라인 (STEP 01~06)
              </span>
              <span className="text-caption-xs text-surface-outline">신규 기능</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  finishTimelineWayfinding();
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-surface-soft text-surface-on-variant text-caption-xs font-bold hover:bg-surface-container-high transition-colors"
              >
                0. 초기 Empty 화면
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimelineStep('config');
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-express-container text-express-on-container text-caption-xs font-bold hover:bg-express-soft transition-colors"
              >
                1. 조건·여유시간
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!customTimeline) resetTimelineToInitial();
                  setTimelineStep('recommendation');
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-ai-container text-ai-on-container text-caption-xs font-bold hover:bg-[#EDE9FE] transition-colors"
              >
                2. 추천·편집
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!customTimeline) resetTimelineToInitial();
                  setTimelineStep('wayfinding');
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-intercity-container text-intercity text-caption-xs font-bold hover:bg-[#D1FAE5] transition-colors"
              >
                3. 길안내·탑승
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  if (!customTimeline) resetTimelineToInitial();
                  setTimelineStep('wayfinding');
                  setCurrentTab('timeline');
                  simulateActivityDelay();
                }}
                className="py-1.5 px-2 rounded-lg bg-warning-container text-[#92400E] text-caption-xs font-bold hover:bg-[#FDE68A] transition-colors"
              >
                ⚡ 활동 10분 지연 재조정
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!customTimeline) resetTimelineToInitial();
                  setTimelineStep('wayfinding');
                  setCurrentTab('timeline');
                  triggerBoardingAlert();
                }}
                className="py-1.5 px-2 rounded-lg bg-primary text-white text-caption-xs font-bold hover:bg-primary-hover transition-colors"
              >
                🔔 승차장 이동 알림
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-caption-sm text-surface-outline border-t border-surface-soft">
            <span>현재 상태: <strong className="text-primary">{simulationState}</strong></span>
            <button
              onClick={resetToDefaultBooked}
              className="flex items-center gap-1 text-express hover:underline font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
