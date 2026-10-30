'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Search, ArrowDown, Info, MapPin, ChevronRight, Layers } from 'lucide-react';
import { BookingMode } from '@/types';
import { DateSelectModal } from './DateSelectModal';
import { ArrivalSelectSheet } from './ArrivalSelectSheet';

interface BusSearchFormProps {
  mode: BookingMode;
  onModeChange: (mode: BookingMode) => void;
  lockedMode?: boolean;
  onSearch: (criteria: {
    departure: string;
    arrival: string;
    date: string;
    departureHour: number;
  }) => void;
  initialDeparture?: string;
  initialArrival?: string;
  initialDate?: string;
  initialDepartureHour?: number;
}

export const BusSearchForm: React.FC<BusSearchFormProps> = ({
  mode,
  onModeChange,
  lockedMode = false,
  onSearch,
  initialDeparture = '천안',
  initialArrival = '서울경부',
  initialDate = '2026-10-30 (금)',
  initialDepartureHour = 17,
}) => {
  const [arrival, setArrival] = useState(initialArrival);
  const [date, setDate] = useState(initialDate);
  const [departureHour, setDepartureHour] = useState<number>(initialDepartureHour);

  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  useEffect(() => {
    setArrival(initialArrival);
  }, [initialArrival]);

  useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    setDepartureHour(initialDepartureHour);
  }, [initialDepartureHour]);

  const handleModeSwitch = (nextMode: BookingMode) => {
    onModeChange(nextMode);
    if (nextMode === 'intercity' && arrival === '서울경부') {
      setArrival('동서울');
    } else if (nextMode === 'express' && arrival === '동서울') {
      setArrival('서울경부');
    }
  };

  const buttonColorClass =
    mode === 'express'
      ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
      : mode === 'intercity'
      ? 'bg-[#059669] hover:bg-[#047857]'
      : 'bg-[#132B45] hover:bg-[#1E3A8A]';

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EEF2F6] space-y-4">
      {/* 1. 버스 구분 (네비게이션 진입 시 통합 예매 / 홈 버튼 진입 시 해당 버스 전용) */}
      {lockedMode ? (
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full text-white ${
                mode === 'express' ? 'bg-[#2563EB]' : 'bg-[#059669]'
              }`}
            >
              {mode === 'express' ? '고속버스' : '시외버스'}
            </span>
            <span className="text-xs font-extrabold text-[#0F172A]">
              {mode === 'express' ? '고속버스 전용 승차권 예매' : '시외버스 전용 승차권 예매'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#64748B]">
            {mode === 'express' ? '1~8번 홈' : '9~21번 홈'}
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B]">조회 구분</span>
            <span className="text-[10px] font-bold text-[#4F46E5] flex items-center gap-1">
              <Layers className="w-3 h-3" /> 고속 · 시외 통합 버스 예매
            </span>
          </div>
          <div className="grid grid-cols-3 p-1 bg-[#F1F5F9] rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => handleModeSwitch('integrated')}
              className={`py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                mode === 'integrated'
                  ? 'bg-[#132B45] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              고속·시외 통합
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('express')}
              className={`py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                mode === 'express'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              고속버스
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('intercity')}
              className={`py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                mode === 'intercity'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              시외버스
            </button>
          </div>
        </div>
      )}

      {/* 2. 운행 노선 (도착지 선택) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#64748B]">도착지 터미널</span>
          <span className="text-[10px] font-semibold text-[#94A3B8] whitespace-nowrap">
            터미널 선택 가능
          </span>
        </div>
        <div className="rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] overflow-hidden">
          <button
            type="button"
            onClick={() => setIsArrivalModalOpen(true)}
            className="w-full px-4 py-3.5 text-left hover:bg-[#EFF6FF]/50 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] block">도착지</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="text-base font-extrabold text-[#0F172A]">{arrival}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-xl whitespace-nowrap group-hover:bg-[#DBEAFE] transition-colors">
              도착지 변경 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>

      {/* 3. 가는 날 · 출발 시간 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#64748B]">가는 날 · 출발 시간</span>
          <span className="text-[10px] font-semibold text-[#2563EB] whitespace-nowrap">
            선택 시간 이후 버스 조회
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsDateModalOpen(true)}
          className="w-full px-4 py-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] text-left hover:bg-[#EFF6FF]/40 transition-colors flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
              <Calendar className="w-4 h-4 text-[#132B45] shrink-0" />
              {date}
            </span>
            <span className="h-4 w-px bg-[#CBD5E1] shrink-0" aria-hidden="true" />
            <span className="text-sm font-extrabold text-[#2563EB] whitespace-nowrap">
              {String(departureHour).padStart(2, '0')}:00시 이후
            </span>
          </div>
          <span className="text-xs text-[#2563EB] font-bold whitespace-nowrap shrink-0">변경</span>
        </button>
      </div>

      {/* 인원 안내 */}
      <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] text-[11px] text-[#475569] flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <span>
          승객 유형(어른·중고생·아동·보훈)은 <strong>좌석 선택 단계</strong>에서 지정합니다. (최대 10매)
        </span>
      </div>

      {/* 4. 조회 버튼 */}
      <button
        type="button"
        onClick={() =>
          onSearch({
            departure: initialDeparture,
            arrival,
            date,
            departureHour,
          })
        }
        className={`w-full py-3.5 rounded-2xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all ${buttonColorClass}`}
      >
        <Search className="w-4 h-4" />
        <span>
          {mode === 'integrated'
            ? '고속·시외 통합 시간표 조회하기'
            : mode === 'express'
            ? '고속버스 시간표 조회하기'
            : '시외버스 시간표 조회하기'}
        </span>
      </button>

      {/* 도착지 선택 바텀시트 */}
      <ArrivalSelectSheet
        isOpen={isArrivalModalOpen}
        onClose={() => setIsArrivalModalOpen(false)}
        currentArrival={arrival}
        onSelect={(stationName) => setArrival(stationName)}
      />

      {/* 가는 날 · 출발 시간 달력 바텀시트 */}
      <DateSelectModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentDate={date}
        currentHour={departureHour}
        onSelect={(d, h) => {
          setDate(d);
          setDepartureHour(h);
        }}
      />
    </div>
  );
};
