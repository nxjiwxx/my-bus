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

  // STATE 01: 예매 전 (카드 형식 없이 홈 화면 전체를 여유롭게 활용)
  if (simulationState === 'before_booking' || !activeTicket) {
    return (
      <div className="flex-1 flex flex-col justify-between px-6 py-8 bg-gradient-to-b from-[#F8FAFC] via-[#EFF6FF]/60 to-[#F4F6F9] text-center relative overflow-hidden">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#2563EB]/8 rounded-full blur-3xl pointer-events-none" />

        {/* 상단: AI 비서 배지 & 인사말 */}
        <div className="relative space-y-3 pt-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#132B45] text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span className="text-[12px] font-extrabold text-[#E2E8F0] whitespace-nowrap">
              AI 맞춤 이동 비서 · 학습 기반 예측
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-[14px] font-bold text-[#2563EB]">{user.name} 님, 안녕하세요</p>
            <h2 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-snug">
              이번 주 금요일도
              <br />
              <span className="text-[#2563EB]">서울경부</span>로 이동하시나요?
            </h2>
            <p className="text-[15px] text-[#64748B] leading-relaxed pt-1">
              매주 반복되는 금요일 귀경 패턴을 분석해
              <br />
              평소 이용하시는 <strong className="text-[#0F172A] font-extrabold">오후 6시대 우등 노선</strong>을 준비했어요.
            </p>
          </div>
        </div>

        {/* 중앙: 여유로운 추천 노선 디스플레이 */}
        <div className="relative my-auto py-6 space-y-5">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DBEAFE] shadow-2xs">
            <BusTypeBadge busType="express" />
            <span className="text-[13px] font-extrabold text-[#1E3A8A]">추천 일정 · 10.30 (금) 18:00</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="text-[13px] font-bold text-[#64748B] block mb-1">출발</span>
              <span className="text-[28px] font-black text-[#0F172A] tracking-tight">천안</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[12px] font-bold text-[#2563EB] mb-1">소요 1시간</span>
              <div className="w-16 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#93C5FD]" />
                <span className="flex-1 border-t-2 border-dashed border-[#93C5FD]" />
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="text-center">
              <span className="text-[13px] font-bold text-[#64748B] block mb-1">도착</span>
              <span className="text-[28px] font-black text-[#2563EB] tracking-tight">서울경부</span>
            </div>
          </div>

          <p className="text-[14px] font-semibold text-[#64748B]">
            예상 권장 출발시각 <strong className="text-[#0F172A]">17:10</strong> (상명대 기준 30분 소요)
          </p>
        </div>

        {/* 하단: 액션 영역 */}
        <div className="relative space-y-2.5">
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
            className="w-full py-4 px-5 rounded-2xl bg-[#132B45] text-white text-[16px] font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#1E3A8A] active:scale-98 transition-all"
          >
            <span>추천 시간표 바로 조회하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => showToast('이번 주 추천 일정이 건너뛰어졌습니다.')}
            className="w-full py-2.5 text-[14px] font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            이번 주 추천 건너뛰기
          </button>
        </div>
      </div>
    );
  }

  // STATE 03-A: 교통 정체 상황 (+15분 지연 감지 - 전체 화면 활용)
  if (simulationState === 'traffic_delay') {
    return (
      <div className="flex-1 flex flex-col justify-between px-6 py-8 bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7]/45 to-[#F4F6F9] text-center relative overflow-hidden">
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF08A] border border-[#FCD34D]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
            <span className="text-[12px] font-extrabold text-[#92400E] whitespace-nowrap">
              AI 비서 · 실시간 교통 정체 감지
            </span>
          </div>

          <h2 className="text-[24px] font-black text-[#78350F] leading-snug pt-2">
            터미널까지 이동시간이
            <br />
            <span className="text-[#DC2626]">15분 증가</span>했어요
          </h2>
          <p className="text-[15px] text-[#92400E] leading-relaxed">
            천안대로 정체로 캠퍼스 출발 예상 소요시간이
            <br />
            <strong>30분 → 45분</strong>으로 늘어났습니다.
          </p>
        </div>

        <div className="my-auto py-6 space-y-3">
          <span className="text-[14px] font-extrabold text-[#92400E] block">AI 변경 권장 출발시각</span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-[18px] text-[#94A3B8] line-through font-bold">17:10</span>
            <ArrowRight className="w-5 h-5 text-[#B45309]" />
            <span className="text-[30px] font-black text-[#DC2626] tracking-tight">16:55</span>
          </div>
          <span className="inline-block text-[13px] bg-[#FEE2E2] text-[#991B1B] px-3 py-1 rounded-full font-extrabold">
            기존보다 15분 일찍 출발 권장
          </span>
          <p className="text-[14px] text-[#64748B] pt-2">
            목표 터미널 도착 <strong className="text-[#0F172A]">17:40</strong> · 탑승 여유 20분 확보
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => showToast('변경된 출발시간(16:55)이 알림 일정에 반영되었습니다.')}
            className="w-full py-4 px-5 rounded-2xl bg-[#B45309] text-white text-[16px] font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#92400E] transition-all"
          >
            <span>변경된 일정 반영하기</span>
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetToDefaultBooked}
            className="w-full py-2.5 text-[14px] font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            기존 일정 유지하기
          </button>
        </div>
      </div>
    );
  }

  // STATE 03-B: 공식 버스 운행시간 지연 (18:00 -> 18:20 - 전체 화면 활용)
  if (simulationState === 'bus_delay') {
    return (
      <div className="flex-1 flex flex-col justify-between px-6 py-8 bg-gradient-to-b from-[#EFF6FF] via-[#DBEAFE]/45 to-[#F4F6F9] text-center relative overflow-hidden">
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#BFDBFE]">
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-[12px] font-extrabold text-[#1D4ED8] whitespace-nowrap">
              AI 비서 · 공식 운행 정보 변경 감지
            </span>
          </div>

          <h2 className="text-[24px] font-black text-[#1E3A8A] leading-snug pt-2">
            예매하신 버스의 출발시각이
            <br />
            <span className="text-[#2563EB]">20분 지연</span>되었어요
          </h2>
          <p className="text-[15px] text-[#1E40AF] leading-relaxed">
            고속도로 회송 지연으로 출발시각이 늦춰져
            <br />
            여유롭게 이동하실 수 있도록 일정을 다시 계산했습니다.
          </p>
        </div>

        <div className="my-auto py-6 space-y-3">
          <span className="text-[14px] font-bold text-[#64748B] block">변경된 버스 출발시각</span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-[18px] text-[#94A3B8] line-through font-bold">18:00</span>
            <ArrowRight className="w-5 h-5 text-[#2563EB]" />
            <span className="text-[30px] font-black text-[#2563EB] tracking-tight">18:20</span>
          </div>
          <p className="text-[14px] text-[#475569] pt-2">
            재계산된 권장 출발시간: <strong className="text-[#0F172A]">오후 5:30 (20분 여유)</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('이동 일정이 오후 5:30 출발로 재계산되었습니다.')}
          className="w-full py-4 px-5 rounded-2xl bg-[#2563EB] text-white text-[16px] font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#1D4ED8] transition-all"
        >
          <span>이동 일정 다시 계산하기</span>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // STATE 04: 터미널 이동 중 (전체 화면 활용)
  if (simulationState === 'in_transit') {
    return (
      <div className="flex-1 flex flex-col justify-between px-6 py-8 bg-gradient-to-b from-[#F8FAFC] via-[#ECFDF5]/50 to-[#F4F6F9] text-center relative overflow-hidden">
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#132B45] text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="text-[12px] font-extrabold text-[#A7F3D0] whitespace-nowrap">
              AI 비서 · 터미널 실시간 이동 중
            </span>
          </div>

          <h2 className="text-[24px] font-black text-[#0F172A] leading-snug pt-2">
            터미널 도착까지
            <br />
            <span className="text-[#059669]">약 18분</span> 남았어요
          </h2>
          <p className="text-[14px] text-[#64748B]">
            시내버스 400번 운행 원활 · 목표 도착 17:38 (여유 22분)
          </p>
        </div>

        <div className="my-auto py-8 space-y-4">
          <div className="text-[30px] font-black text-[#0F172A] tracking-tight">
            17:38 <span className="text-[18px] font-extrabold text-[#059669]">도착 예정</span>
          </div>
          <div className="space-y-2 px-2">
            <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] w-[62%] rounded-full transition-all duration-500" />
            </div>
            <div className="flex justify-between text-[13px] text-[#64748B] font-bold">
              <span>상명대 17:10</span>
              <span className="text-[#132B45]">18:00 {activeTicket.busSchedule.arrivalStation}행</span>
              <span>터미널 17:38</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('tickets')}
          className="w-full py-4 rounded-2xl bg-[#132B45] text-white text-[16px] font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#1E3A8A] transition-colors"
        >
          <span>모바일 승차권 미리 확인</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // STATE 05: 터미널 도착 완료 (승차홈 안내 & QR 바로가기 - 전체 화면 활용)
  if (simulationState === 'arrived') {
    return (
      <div className="flex-1 flex flex-col justify-between px-6 py-8 bg-gradient-to-b from-[#ECFDF5] via-[#D1FAE5]/40 to-[#F4F6F9] text-center relative overflow-hidden">
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#065F46] text-white">
            <MapPin className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span className="text-[12px] font-extrabold text-[#D1FAE5] whitespace-nowrap">
              AI 비서 · 터미널 도착 완료
            </span>
          </div>

          <h2 className="text-[24px] font-black text-[#0F172A] leading-snug pt-2">
            {activeTicket.busSchedule.arrivalStation}행 버스는
            <br />
            <span className="text-[#059669] underline underline-offset-4">
              {activeTicket.busSchedule.platform}
            </span>
            에서 탑승하세요
          </h2>
          <p className="text-[15px] text-[#475569]">
            출발 15분 전부터 개찰 가능 · 좌석 번호{' '}
            <strong className="text-[#0F172A]">{activeTicket.seatNumbers.join(', ')}번</strong>
          </p>
        </div>

        <div className="my-auto py-8 space-y-2">
          <span className="text-[14px] font-extrabold text-[#059669] block">탑승 게이트</span>
          <div className="text-[30px] font-black text-[#065F46] tracking-tight">
            {activeTicket.busSchedule.platform}
          </div>
          <p className="text-[14px] font-bold text-[#64748B] pt-1">
            {activeTicket.busSchedule.departureTime} 출발 · {activeTicket.busSchedule.company}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('tickets')}
          className="w-full py-4 rounded-2xl bg-[#059669] text-white text-[16px] font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#047857] transition-all"
        >
          <span>모바일 승차권 QR 열기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // STATE 02: 기본 예매 완료 상태 (카드 형태 없이 홈 화면 전체를 여유롭게 사용하는 AI 비서 페이지)
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-7 bg-gradient-to-b from-[#F8FAFC] via-[#EFF6FF]/65 to-[#F4F6F9] text-center relative overflow-hidden">
      {/* 은은한 배경 광원 */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 상단 AI 브리핑 헤더 */}
      <div className="relative space-y-2.5 pt-1">
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#132B45] text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
          <span className="text-[12px] font-extrabold text-[#E2E8F0] whitespace-nowrap">
            AI 맞춤 이동 비서 · 실시간 모니터링
          </span>
        </div>

        <p className="text-[14px] font-bold text-[#2563EB] pt-1">
          {user.name} 님, 오늘 예정된 {activeTicket.busSchedule.departureStation} →{' '}
          {activeTicket.busSchedule.arrivalStation} 여정입니다
        </p>
        <h2 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-snug">
          여유 있는 터미널 도착을 위해
          <br />
          <span className="text-[#2563EB]">
            {activeTicket.recommendedDepartureTime || '17:10'}
          </span>
          에 출발하세요
        </h2>
      </div>

      {/* 2. 중앙 메인 권장 출발시각 & 여정 흐름 */}
      <div className="relative my-auto py-4 space-y-6">
        <div className="space-y-1.5">
          <span className="text-[14px] font-extrabold text-[#64748B] flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> 대학교 출발 권장 시각 (교통 원활)
          </span>
          <div className="text-[30px] font-black text-[#132B45] tracking-tight leading-none pt-1">
            {activeTicket.recommendedDepartureTime || '17:10'}
          </div>
        </div>

        {/* 여정 3단계 수치 */}
        <div className="grid grid-cols-3 divide-x divide-[#CBD5E1]/70 pt-2">
          <div className="px-2">
            <span className="text-[13px] font-semibold text-[#64748B] block">이동 소요</span>
            <span className="text-[18px] font-black text-[#0F172A] mt-0.5 block">30분</span>
          </div>
          <div className="px-2">
            <span className="text-[13px] font-semibold text-[#64748B] block">터미널 도착</span>
            <span className="text-[18px] font-black text-[#0F172A] mt-0.5 block">17:40</span>
          </div>
          <div className="px-2">
            <span className="text-[13px] font-semibold text-[#64748B] block">버스 출발</span>
            <span className="text-[18px] font-black text-[#2563EB] mt-0.5 block">
              {activeTicket.busSchedule.departureTime} ({activeTicket.busSchedule.platform})
            </span>
          </div>
        </div>

        {/* 맞춤형 타임라인 가동 중일 때 실시간 배너 */}
        {currentTimelineItem && (
          <button
            type="button"
            onClick={() => {
              setTimelineStep('wayfinding');
              setCurrentTab('timeline');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-white/90 hover:bg-white border border-[#BFDBFE] shadow-xs flex items-center justify-center gap-2 text-[14px] transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#059669] shrink-0" />
            <span className="font-extrabold text-[#0F172A] truncate">
              여유시간 안내 중: {currentTimelineItem.title} ({currentTimelineItem.startTime}~
              {currentTimelineItem.endTime})
            </span>
            <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
          </button>
        )}
      </div>

      {/* 3. 하단 액션 버튼 영역 */}
      <div className="relative grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => setCurrentTab('tickets')}
          className="py-3.5 px-4 rounded-2xl bg-white border border-[#CBD5E1] text-[#132B45] text-[15px] font-extrabold flex items-center justify-center gap-1 shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <span>내 승차권 ({activeTicket.seatNumbers.join(',')}번)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (customTimeline?.isConfirmed) {
              setTimelineStep('wayfinding');
            }
            setCurrentTab('timeline');
          }}
          className="py-3.5 px-4 rounded-2xl bg-[#132B45] hover:bg-[#1E3A8A] text-white text-[15px] font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#93C5FD]" />
          <span>맞춤형 타임라인</span>
        </button>
      </div>
    </div>
  );
};
