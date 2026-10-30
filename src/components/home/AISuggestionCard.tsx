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
  RefreshCw,
  Navigation,
} from 'lucide-react';
import { BusTypeBadge } from '../common/Badge';

export const AISuggestionCard: React.FC = () => {
  const {
    user,
    simulationState,
    setCurrentTab,
    setTimelineStep,
    setBookingPreset,
    activeTicket,
    customTimeline,
    resetToDefaultBooked,
    showToast,
  } = useApp();

  const currentTimelineItem =
    customTimeline && customTimeline.isConfirmed
      ? customTimeline.items[
          Math.min(customTimeline.currentActivityIndex, customTimeline.items.length - 1)
        ]
      : null;

  // STATE 01: 예매 전 (AI 다음 이동 예측 & 예매 제안 - 중앙 정렬)
  if (simulationState === 'before_booking' || !activeTicket) {
    return (
      <div className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-3xl p-5 shadow-md border border-white/10 relative overflow-hidden text-center">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* AI 비서 뱃지 (중앙 정렬) */}
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/15 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
          <span className="text-[11px] font-extrabold text-[#BFDBFE] whitespace-nowrap">
            AI 맞춤 이동 비서 · 학습 기반 예측
          </span>
        </div>

        {/* AI 메인 브리핑 텍스트 (중앙 정렬) */}
        <p className="text-xs font-semibold text-[#93C5FD]">
          {user.name} 님, 안녕하세요
        </p>
        <h3 className="text-lg font-black leading-snug mt-0.5">
          이번 주 금요일도 <span className="text-[#93C5FD]">서울경부</span>로 이동하시나요?
        </h3>
        <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
          평소 이용하시는 <strong className="text-white font-bold">오후 6시대 우등 버스</strong>를 준비했어요.
        </p>

        {/* 추천 노선 요약 (중앙 정렬) */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <BusTypeBadge busType="express" />
            <span className="text-xs font-bold text-[#BFDBFE]">추천 일정 · 10.30(금) 18:00</span>
          </div>
          <div className="text-base font-black flex items-center justify-center gap-2 text-white">
            <span>천안</span>
            <ArrowRight className="w-4 h-4 text-[#93C5FD]" />
            <span>서울경부</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setBookingPreset({
                departure: '천안',
                arrival: '서울경부',
                busType: 'express',
                time: '18:00',
                departureHour: 17,
              });
              setCurrentTab('booking');
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white text-[#132B45] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm hover:bg-slate-100 transition-all"
          >
            <span>추천 시간표 바로 조회</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => showToast('이번 주 추천 일정이 건너뛰어졌습니다.')}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 transition-colors whitespace-nowrap"
          >
            건너뛰기
          </button>
        </div>
      </div>
    );
  }

  // STATE 03-A: 교통 정체 상황 (+15분 지연 감지 - 중앙 정렬)
  if (simulationState === 'traffic_delay') {
    return (
      <div className="bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] text-[#78350F] rounded-3xl p-5 shadow-sm relative overflow-hidden text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border border-[#FCD34D] mb-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
          <span className="text-[11px] font-extrabold text-[#92400E] whitespace-nowrap">
            AI 비서 · 실시간 교통 정체 감지
          </span>
        </div>

        <h3 className="text-lg font-black text-[#78350F] leading-snug">
          터미널까지 이동시간이 <span className="text-[#DC2626]">15분 증가</span>했어요
        </h3>
        <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
          천안대로 정체로 캠퍼스 출발 예상 소요시간이 <strong>30분 → 45분</strong>으로 늘어났습니다.
        </p>

        <div className="mt-3.5 p-3.5 bg-white/90 rounded-2xl border border-[#FCD34D] text-center space-y-1.5">
          <span className="text-[11px] font-bold text-[#92400E] block">AI 변경 권장 출발시간</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-[#94A3B8] line-through font-semibold">17:10</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B45309]" />
            <span className="text-2xl font-black text-[#DC2626]">16:55</span>
            <span className="text-[10px] bg-[#FEE2E2] text-[#991B1B] px-2 py-0.5 rounded-full font-extrabold">
              15분 앞당김
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">
            목표 터미널 도착: <strong className="text-[#0F172A]">17:40 (탑승 여유 20분 확보)</strong>
          </p>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast('변경된 출발시간(16:55)이 알림 일정에 반영되었습니다.')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#B45309] text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs hover:bg-[#92400E] transition-all"
          >
            <span>변경된 일정 반영하기</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={resetToDefaultBooked}
            className="py-2.5 px-3 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-[#475569] hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            기존 유지
          </button>
        </div>
      </div>
    );
  }

  // STATE 03-B: 공식 버스 운행시간 지연 (18:00 -> 18:20 - 중앙 정렬)
  if (simulationState === 'bus_delay') {
    return (
      <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] text-[#1E3A8A] rounded-3xl p-5 shadow-sm relative overflow-hidden text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#BFDBFE] mb-2.5">
          <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="text-[11px] font-extrabold text-[#1D4ED8] whitespace-nowrap">
            AI 비서 · 공식 운행 정보 변경 감지
          </span>
        </div>

        <h3 className="text-lg font-black text-[#1E3A8A] leading-snug">
          예매하신 버스의 출발시각이 변경되었어요
        </h3>
        <p className="text-xs text-[#1E40AF] mt-1 leading-relaxed">
          고속도로 회송 지연으로 천안터미널 출발시각이 20분 늦춰졌습니다.
        </p>

        <div className="mt-3.5 p-3.5 bg-white/95 rounded-2xl border border-[#93C5FD] text-center space-y-1.5">
          <span className="text-[11px] font-bold text-[#64748B] block">변경된 버스 출발 · 권장 출발</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-[#94A3B8] line-through font-semibold">18:00</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-2xl font-black text-[#2563EB]">18:20 출발</span>
          </div>
          <p className="text-[11px] text-[#475569]">
            재계산된 권장 출발시간: <strong className="text-[#0F172A]">오후 5:30 (20분 여유)</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('이동 일정이 오후 5:30 출발로 재계산되었습니다.')}
          className="w-full mt-3.5 py-2.5 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#1D4ED8] transition-all"
        >
          <span>이동 일정 다시 계산하기</span>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // STATE 04: 터미널 이동 중 (중앙 정렬)
  if (simulationState === 'in_transit') {
    return (
      <div className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-3xl p-5 shadow-md border border-white/10 space-y-3.5 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/15">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="text-[11px] font-extrabold text-[#A7F3D0] whitespace-nowrap">
            AI 비서 · 터미널 실시간 이동 중
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white leading-snug">
            천안터미널 도착까지 <span className="text-[#6EE7B7]">약 18분</span> 남았어요
          </h3>
          <p className="text-xs text-white/75 mt-1">
            시내버스 400번 운행 원활 · 목표 도착 17:38 (여유 22분)
          </p>
        </div>

        <div className="space-y-1.5 px-1">
          <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] w-[62%] rounded-full transition-all duration-500" />
          </div>
          <div className="flex justify-between text-[11px] text-white/70 font-semibold">
            <span>상명대 17:10</span>
            <span className="text-white font-bold">18:00 {activeTicket.busSchedule.arrivalStation}행</span>
            <span>터미널 17:38</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('tickets')}
          className="w-full py-2.5 rounded-xl bg-white text-[#132B45] text-xs font-extrabold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
        >
          <span>모바일 승차권 미리 확인</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // STATE 05: 터미널 도착 완료 (승차홈 안내 & QR 바로가기 - 중앙 정렬)
  if (simulationState === 'arrived') {
    return (
      <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] text-white rounded-3xl p-5 shadow-md space-y-3.5 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-[#A7F3D0]" />
          <span className="text-[11px] font-extrabold text-[#D1FAE5] whitespace-nowrap">
            AI 비서 · 터미널 도착 완료
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white leading-snug">
            {activeTicket.busSchedule.arrivalStation}행 버스는{' '}
            <span className="text-[#FEF08A] underline underline-offset-4">
              {activeTicket.busSchedule.platform}
            </span>
            에서 탑승하세요
          </h3>
          <p className="text-xs text-white/85 mt-1">
            출발 15분 전부터 개찰 가능 · 좌석 번호{' '}
            <strong>{activeTicket.seatNumbers.join(', ')}번</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('tickets')}
          className="w-full py-2.5 rounded-xl bg-white text-[#064E3B] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-100 transition-all"
        >
          <span>모바일 승차권 QR 열기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // STATE 02: 기본 예매 완료 상태 (헤더 바로 아래 AI 비서 메인 히어로 - 중앙 정렬)
  return (
    <div className="bg-gradient-to-br from-[#132B45] via-[#17365D] to-[#1E3A8A] text-white rounded-3xl p-5 shadow-md border border-white/10 space-y-4 relative overflow-hidden text-center">
      {/* 은은한 중앙 광원 효과 */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#3B82F6]/20 rounded-full blur-2xl pointer-events-none" />

      {/* 상단 AI 비서 배지 (중앙 정렬) */}
      <div className="flex flex-col items-center space-y-1.5 relative">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
          <span className="text-[11px] font-extrabold text-[#BFDBFE] whitespace-nowrap">
            AI 맞춤 이동 비서 · 실시간 모니터링
          </span>
        </div>

        <p className="text-xs font-semibold text-[#93C5FD] pt-0.5">
          {user.name} 님, 오늘 예정된 {activeTicket.busSchedule.departureStation} →{' '}
          {activeTicket.busSchedule.arrivalStation} 여정입니다
        </p>
        <h2 className="text-lg font-black text-white tracking-tight leading-snug">
          터미널 여유 도착을 위해{' '}
          <span className="text-[#60A5FA]">
            {activeTicket.recommendedDepartureTime || '17:10'}
          </span>
          에 출발하세요
        </h2>
      </div>

      {/* 권장 출발시간 & 버스 출발 요약 박스 (중앙 정렬) */}
      <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-3">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-[#93C5FD] flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 대학교 출발 권장 시각 (교통 원활)
          </span>
          <div className="text-3xl font-black text-white tracking-tight mt-0.5">
            {activeTicket.recommendedDepartureTime || '17:10'}
          </div>
        </div>

        <div className="pt-2.5 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-white/65 block">이동 소요</span>
            <span className="font-extrabold text-white">30분</span>
          </div>
          <div>
            <span className="text-[10px] text-white/65 block">터미널 도착</span>
            <span className="font-extrabold text-white">17:40</span>
          </div>
          <div>
            <span className="text-[10px] text-white/65 block">버스 출발</span>
            <span className="font-extrabold text-[#93C5FD]">
              {activeTicket.busSchedule.departureTime} ({activeTicket.busSchedule.platform})
            </span>
          </div>
        </div>
      </div>

      {/* 맞춤형 타임라인 실시간 연동 요약 (중앙 정렬) */}
      {currentTimelineItem && (
        <button
          type="button"
          onClick={() => {
            setTimelineStep('wayfinding');
            setCurrentTab('timeline');
          }}
          className="w-full py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center gap-2 text-xs transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-[#6EE7B7] shrink-0" />
          <span className="font-bold text-white truncate">
            여유시간 안내 중: {currentTimelineItem.title} ({currentTimelineItem.startTime}~
            {currentTimelineItem.endTime})
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />
        </button>
      )}

      {/* 하단 바로가기 버튼 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setCurrentTab('tickets')}
          className="py-2.5 px-3 rounded-xl bg-white text-[#132B45] text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs hover:bg-slate-100 transition-colors whitespace-nowrap"
        >
          <span>내 승차권 ({activeTicket.seatNumbers.join(',')}번)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (customTimeline?.isConfirmed) {
              setTimelineStep('wayfinding');
            }
            setCurrentTab('timeline');
          }}
          className="py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>맞춤형 타임라인</span>
        </button>
      </div>
    </div>
  );
};
