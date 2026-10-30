'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Navigation,
} from 'lucide-react';
import { BusTypeBadge } from '../common/Badge';

export const AISuggestionCard: React.FC = () => {
  const {
    simulationState,
    setCurrentTab,
    setBookingPreset,
    activeTicket,
    applyTrafficDelay,
    applyBusDelay,
    resetToDefaultBooked,
    showToast,
  } = useApp();

  // STATE 01: 예매 전 (AI 다음 이동 예측 & 예매 제안)
  if (simulationState === 'before_booking' || !activeTicket) {
    return (
      <div className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-3xl p-5 shadow-lg border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded-lg bg-white/20 text-[#93C5FD]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-tight text-[#BFDBFE]">AI 맞춤 이동 비서</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-auto">
            학습 기반 예측
          </span>
        </div>

        <h3 className="text-base font-bold leading-snug">
          이번 주 금요일도 <span className="text-[#93C5FD]">서울</span>로 이동하시나요?
        </h3>
        <p className="text-xs text-white/80 mt-1 leading-relaxed">
          평소 이용하시는 <strong className="text-white font-semibold">오후 6시대</strong> 버스를 찾아봤어요.
        </p>

        {/* Suggestion Summary Box */}
        <div className="mt-3.5 p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <BusTypeBadge busType="express" />
              <span className="text-xs font-semibold text-white/90">고속 우등</span>
            </div>
            <div className="text-sm font-extrabold flex items-center gap-2 text-white">
              <span>천안</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>서울경부</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#93C5FD] font-semibold block">추천 일정</span>
            <span className="text-xs font-bold text-white">10.30(금) · 18:00</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              setBookingPreset({
                departure: '천안',
                arrival: '서울경부',
                busType: 'express',
                time: '18:00',
              });
              setCurrentTab('booking');
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white text-[#132B45] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-100 active:scale-98 transition-all"
          >
            <span>버스 조회하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => showToast('이번 주 일정이 건너뛰어졌습니다.')}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white/90 transition-colors"
          >
            이번 주 건너뛰기
          </button>
        </div>
      </div>
    );
  }

  // STATE 03-A: 교통 정체 상황 (+15분 지연 감지, 권장 출발시간 16:55 변경)
  if (simulationState === 'traffic_delay') {
    return (
      <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] text-[#78350F] rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded-lg bg-[#F59E0B] text-white">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#B45309]">교통 정체 감지 알림</span>
          <span className="text-[10px] bg-[#FEF08A] text-[#92400E] font-bold px-2 py-0.5 rounded-full ml-auto">
            실시간 재계산
          </span>
        </div>

        <h3 className="text-base font-extrabold text-[#78350F]">
          터미널까지 이동시간이 <span className="text-[#DC2626]">15분 증가</span>했어요
        </h3>
        <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
          대학교 앞 천안대로 정체로 예상 이동시간이 <strong>30분 → 45분</strong>으로 늘어났습니다.
        </p>

        {/* Before / After Departure Comparison */}
        <div className="mt-3.5 p-3.5 bg-white/90 rounded-2xl border border-[#FCD34D] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">기존 권장 출발</span>
            <span className="text-[#94A3B8] line-through font-medium">오후 5:10</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-1 border-t border-[#F1F5F9]">
            <span className="font-bold text-[#78350F]">변경 권장 출발</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-[#DC2626]">오후 4:55</span>
              <span className="text-[10px] bg-[#FEE2E2] text-[#991B1B] px-1.5 py-0.5 rounded font-bold">
                15분 전
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
            <span>목표 터미널 도착</span>
            <span className="font-semibold text-[#1E293B]">오후 5:40 (여유 20분 확보)</span>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={() => showToast('변경된 출발시간(16:55)이 알림 일정에 반영되었습니다.')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#B45309] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-[#92400E] active:scale-98 transition-all"
          >
            <span>변경된 일정 확인 및 반영</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetToDefaultBooked}
            className="py-2.5 px-3 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-slate-50 transition-colors"
          >
            기존 유지
          </button>
        </div>
      </div>
    );
  }

  // STATE 03-B: 공식 버스 운행시간 지연 (18:00 -> 18:20)
  if (simulationState === 'bus_delay') {
    return (
      <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] text-[#1E3A8A] rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded-lg bg-[#2563EB] text-white">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#1D4ED8]">공식 버스 운행 정보 변경</span>
          <span className="text-[10px] bg-white text-[#1D4ED8] font-bold px-2 py-0.5 rounded-full ml-auto border border-[#BFDBFE]">
            운송사 공지
          </span>
        </div>

        <h3 className="text-base font-extrabold text-[#1E3A8A]">
          예매하신 버스의 공식 출발시간이 변경되었어요
        </h3>
        <p className="text-xs text-[#1E40AF] mt-1 leading-relaxed">
          고속도로 상행선 회송 지연으로 천안 터미널 공식 출발시간이 조정되었습니다.
        </p>

        {/* Change Card */}
        <div className="mt-3.5 p-3.5 bg-white/95 rounded-2xl border border-[#93C5FD] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">기존 버스 출발시간</span>
            <span className="text-[#94A3B8] line-through font-medium">오후 6:00 (동양고속 7번홈)</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-1 border-t border-[#F1F5F9]">
            <span className="font-bold text-[#1E3A8A]">변경 버스 출발시간</span>
            <span className="text-base font-extrabold text-[#2563EB]">오후 6:20</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
            <span>재계산된 권장 출발</span>
            <span className="font-bold text-[#0F172A]">오후 5:30 (기존보다 20분 여유)</span>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={() => showToast('이동 일정이 오후 5:30 출발로 재계산되었습니다.')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-[#1D4ED8] active:scale-98 transition-all"
          >
            <span>이동 일정 다시 계산하기</span>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // STATE 04: 터미널 이동 중 (실시간 대중교통 이동 트래킹)
  if (simulationState === 'in_transit') {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-md border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]"></span>
            </span>
            <span className="text-xs font-bold text-[#0F172A]">터미널 이동 중 (시내버스 400번)</span>
          </div>
          <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
            운행 원활
          </span>
        </div>

        {/* Transit Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>상명대 출발 (17:10)</span>
            <span className="font-bold text-[#2563EB]">18분 후 도착 예정</span>
            <span>천안터미널 (17:38)</span>
          </div>
          <div className="w-full h-2.5 bg-[#EEF2F6] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#059669] w-[60%] rounded-full transition-all duration-500" />
          </div>
        </div>

        <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#64748B] block">목표 터미널 도착시간</span>
            <span className="font-bold text-[#0F172A] text-sm">오후 5:38 (여유 22분)</span>
          </div>
          <div className="text-right">
            <span className="text-[#64748B] block">탑승 버스</span>
            <span className="font-bold text-[#2563EB] text-sm">18:00 서울경부행</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('tickets')}
          className="w-full py-2.5 rounded-xl bg-[#132B45] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1E3A8A] transition-colors"
        >
          <span>모바일 승차권 미리 확인</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // STATE 05: 터미널 도착 완료 (승차홈 안내 & QR 바로가기)
  if (simulationState === 'arrived') {
    return (
      <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] text-[#14532D] rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#059669] text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#065F46]">천안종합버스터미널 도착 완료</span>
          </div>
          <span className="text-[10px] bg-white text-[#047857] font-bold px-2 py-0.5 rounded-full border border-[#86EFAC]">
            탑승 준비
          </span>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#064E3B]">
            서울경부행 버스는 <span className="text-[#2563EB] text-lg font-black">7번 홈</span>에서 탑승하세요
          </h3>
          <p className="text-xs text-[#166534] mt-0.5">
            출발 15분 전(17:45)부터 승차 가능합니다. 좌석 번호: <strong>7번</strong>
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('tickets')}
          className="w-full py-2.5 rounded-xl bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#047857] active:scale-98 transition-all"
        >
          <span>모바일 승차권 QR 열기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // STATE 02: 기본 예매 완료 상태 (권장 출발시간 17:10 강조)
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E8F0] space-y-3 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#E1EDFB] text-[#17365D]">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#2563EB] tracking-tight block">오늘의 이동 일정</span>
            <h4 className="text-sm font-extrabold text-[#0F172A] leading-tight">천안 → 서울경부</h4>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] rounded-full border border-[#BFDBFE]">
          고속 우등
        </span>
      </div>

      {/* Main Highlight: Recommended Departure Time */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F6] border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#64748B] font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> 권장 출발시간
          </span>
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md">
            교통 원활
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-black text-[#132B45] tracking-tight">
            {activeTicket?.recommendedDepartureTime || '오후 5:10'}
          </div>
          <span className="text-xs font-semibold text-[#64748B]">
            대학교 출발 기준
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#CBD5E1]/40 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] block">예상 이동</span>
            <span className="font-bold text-[#0F172A]">30분</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block">터미널 도착</span>
            <span className="font-bold text-[#0F172A]">17:40</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block">버스 출발</span>
            <span className="font-bold text-[#2563EB]">{activeTicket?.busSchedule.departureTime || '18:00'}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setCurrentTab('tickets')}
          className="flex-1 py-2.5 rounded-xl bg-[#132B45] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#1E3A8A] transition-colors"
        >
          <span>승차권 확인 (7번 좌석)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
