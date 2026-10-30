'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Search, ArrowDown, Info, MapPin, Clock, ChevronRight } from 'lucide-react';
import { BusType } from '@/types';
import { DateSelectModal } from './DateSelectModal';
import { ArrivalSelectSheet } from './ArrivalSelectSheet';

interface BusSearchFormProps {
  busType: BusType;
  onBusTypeChange: (type: BusType) => void;
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
  busType,
  onBusTypeChange,
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

  const handleBusTypeSwitch = (nextType: BusType) => {
    onBusTypeChange(nextType);
    if (nextType === 'intercity' && arrival === '서울경부') {
      setArrival('동서울');
    } else if (nextType === 'express' && arrival === '동서울') {
      setArrival('서울경부');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EEF2F6] space-y-4">
      {/* 1. 버스 종류 */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[#64748B]">버스 종류</span>
        <div className="flex p-1 bg-[#F1F5F9] rounded-2xl">
          <button
            type="button"
            onClick={() => handleBusTypeSwitch('express')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              busType === 'express'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            고속버스
          </button>
          <button
            type="button"
            onClick={() => handleBusTypeSwitch('intercity')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              busType === 'intercity'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            시외버스
          </button>
        </div>
      </div>

      {/* 2. 운행 노선 (출발지 고정 · 도착지 선택 가능) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#64748B]">운행 노선</span>
          <span className="text-[10px] font-semibold text-[#94A3B8] whitespace-nowrap">
            출발지 고정 · 도착지 선택
          </span>
        </div>
        <div className="rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] divide-y divide-[#E2E8F0] overflow-hidden">
          {/* 출발지 (고정) */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] block">출발</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base font-extrabold text-[#0F172A]">{initialDeparture}</span>
                <span className="text-[10px] bg-[#EEF2F6] text-[#475569] px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                  천안종합버스터미널
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#94A3B8] whitespace-nowrap">고정</span>
          </div>

          {/* 도착지 (선택 가능) */}
          <button
            type="button"
            onClick={() => setIsArrivalModalOpen(true)}
            className="w-full px-4 py-3 relative text-left hover:bg-[#EFF6FF]/50 transition-colors flex items-center justify-between group"
          >
            <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8]">
              <ArrowDown className="w-3 h-3" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] block">도착</span>
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
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
              <Calendar className="w-4 h-4 text-[#132B45] shrink-0" />
              {date}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {String(departureHour).padStart(2, '0')}시 이후
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
        className={`w-full py-3.5 rounded-2xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all ${
          busType === 'express' ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#059669] hover:bg-[#047857]'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>버스 시간표 조회하기</span>
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
