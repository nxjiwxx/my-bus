'use client';

import React, { useState } from 'react';
import { Calendar, Search, ArrowDown, Info } from 'lucide-react';
import { BusType } from '@/types';
import { DateSelectModal } from './DateSelectModal';

interface BusSearchFormProps {
  busType: BusType;
  onBusTypeChange: (type: BusType) => void;
  onSearch: (criteria: { departure: string; arrival: string; date: string }) => void;
  initialDeparture?: string;
  initialArrival?: string;
}

export const BusSearchForm: React.FC<BusSearchFormProps> = ({
  busType,
  onBusTypeChange,
  onSearch,
  initialDeparture = '천안',
  initialArrival = '서울경부',
}) => {
  const [date, setDate] = useState('2026-10-30 (금)');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 출발지·도착지는 변경할 수 없으며 천안종합버스터미널 출발 노선으로 고정
  const arrivalLabel = busType === 'express' ? initialArrival : '동서울 · 수원 방면';

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EEF2F6] space-y-5">
      {/* 1. 버스 종류 */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#64748B]">버스 종류</span>
        <div className="flex p-1 bg-[#F1F5F9] rounded-2xl">
          <button
            type="button"
            onClick={() => onBusTypeChange('express')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              busType === 'express'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            고속버스
          </button>
          <button
            type="button"
            onClick={() => onBusTypeChange('intercity')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              busType === 'intercity'
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            시외버스
          </button>
        </div>
      </div>

      {/* 2. 운행 노선 (변경 불가, 읽기 전용) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#64748B]">운행 노선</span>
          <span className="text-[10px] font-semibold text-[#94A3B8] whitespace-nowrap">출발지 · 도착지 고정</span>
        </div>
        <div className="rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] divide-y divide-[#E2E8F0]">
          <div className="px-4 py-3">
            <span className="text-[10px] font-semibold text-[#64748B] block">출발</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-[#0F172A]">{initialDeparture}</span>
              <span className="text-[10px] bg-[#EEF2F6] text-[#475569] px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                천안종합버스터미널
              </span>
            </div>
          </div>
          <div className="px-4 py-3 relative">
            <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8]">
              <ArrowDown className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-semibold text-[#64748B] block">도착</span>
            <span className="text-base font-extrabold text-[#0F172A] block mt-0.5">{arrivalLabel}</span>
          </div>
        </div>
      </div>

      {/* 3. 가는 날 */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#64748B]">가는 날</span>
        <button
          type="button"
          onClick={() => setIsDateModalOpen(true)}
          className="w-full px-4 py-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A]">
            <Calendar className="w-4 h-4 text-[#132B45]" />
            {date}
          </span>
          <span className="text-xs text-[#2563EB] font-semibold whitespace-nowrap">변경</span>
        </button>
      </div>

      {/* 인원 안내 */}
      <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[11px] text-[#1D4ED8] flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <span>승객 수와 탑승 유형은 <strong>좌석 선택 단계</strong>에서 좌석별로 지정합니다. (최대 10매)</span>
      </div>

      {/* 4. 조회 버튼 */}
      <button
        type="button"
        onClick={() => onSearch({ departure: initialDeparture, arrival: initialArrival, date })}
        className={`w-full py-3.5 rounded-2xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all ${
          busType === 'express' ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#059669] hover:bg-[#047857]'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>버스 시간표 조회하기</span>
      </button>

      <DateSelectModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSelect={(d) => setDate(d)}
        currentDate={date}
      />
    </div>
  );
};
