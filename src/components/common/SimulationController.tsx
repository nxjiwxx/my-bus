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
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#CBD5E1] p-4 shadow-xl max-w-sm w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F172A] leading-tight">AI 상황 시뮬레이터</h4>
            <p className="text-[11px] text-[#64748B]">평가 및 검증용 실시간 제어 도구</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-transform"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-[#64748B] leading-relaxed">
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
                      ? 'bg-[#132B45] text-white border-[#132B45] shadow-sm'
                      : 'bg-[#F8FAFC] hover:bg-[#EEF2F6] text-[#1E293B] border-[#E2E8F0]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold leading-tight truncate">{st.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isCurrent
                            ? 'bg-white/25 text-white'
                            : 'bg-[#EEF2F6] text-[#64748B]'
                        }`}
                      >
                        {st.badge}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 truncate ${
                        isCurrent ? 'text-white/80' : 'text-[#64748B]'
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
          <div className="pt-2.5 border-t border-[#F1F5F9] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#4F46E5] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 맞춤형 타임라인 (STEP 01~06)
              </span>
              <span className="text-[10px] text-[#64748B]">신규 기능</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  setTimelineStep('config');
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-bold hover:bg-[#DBEAFE] transition-colors"
              >
                1. 조건·여유시간
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimelineStep('recommendation');
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-[#F5F3FF] text-[#4F46E5] text-[10px] font-bold hover:bg-[#EDE9FE] transition-colors"
              >
                2. 추천·편집
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimelineStep('wayfinding');
                  setCurrentTab('timeline');
                }}
                className="py-1.5 px-2 rounded-lg bg-[#ECFDF5] text-[#059669] text-[10px] font-bold hover:bg-[#D1FAE5] transition-colors"
              >
                3. 길안내·탑승
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setTimelineStep('wayfinding');
                  setCurrentTab('timeline');
                  simulateActivityDelay();
                }}
                className="py-1.5 px-2 rounded-lg bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold hover:bg-[#FDE68A] transition-colors"
              >
                ⚡ 활동 10분 지연 재조정
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimelineStep('wayfinding');
                  setCurrentTab('timeline');
                  triggerBoardingAlert();
                }}
                className="py-1.5 px-2 rounded-lg bg-[#132B45] text-white text-[10px] font-bold hover:bg-[#1E3A8A] transition-colors"
              >
                🔔 승차장 이동 알림
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#64748B] border-t border-[#F1F5F9]">
            <span>현재 상태: <strong className="text-[#132B45]">{simulationState}</strong></span>
            <button
              onClick={resetToDefaultBooked}
              className="flex items-center gap-1 text-[#2563EB] hover:underline font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
