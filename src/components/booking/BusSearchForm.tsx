'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Search, ArrowDown, Info, MapPin, ChevronRight } from 'lucide-react';
import { DateSelectModal } from './DateSelectModal';
import { ArrivalSelectSheet } from './ArrivalSelectSheet';

interface BusSearchFormProps {
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

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EEF2F6] space-y-5">
      {/* 1. 운행 노선 (출발지 고정 · 도착지 선택 가능) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#475569]">운행 노선</span>
          <span className="text-[12px] font-bold text-[#2563EB] whitespace-nowrap">
            고속 · 시외 통합 예매
          </span>
        </div>
        <div className="rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] divide-y divide-[#E2E8F0] overflow-hidden">
          {/* 출발지 (천안고속버스터미널 고정) */}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#64748B] block">출발</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[18px] font-extrabold text-[#0F172A]">{initialDeparture}</span>
                <span className="text-[12px] bg-[#EEF2F6] text-[#475569] px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                  천안고속버스터미널
                </span>
              </div>
            </div>
            <span className="text-[12px] font-bold text-[#94A3B8] whitespace-nowrap">고정</span>
          </div>

          {/* 도착지 (선택 가능) */}
          <button
            type="button"
            onClick={() => setIsArrivalModalOpen(true)}
            className="w-full px-4 py-3.5 relative text-left hover:bg-[#EFF6FF]/50 transition-colors flex items-center justify-between group"
          >
            <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8]">
              <ArrowDown className="w-3 h-3" />
            </div>
            <div>
              <span className="text-[12px] font-semibold text-[#64748B] block">도착</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="text-[18px] font-extrabold text-[#0F172A]">{arrival}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-0.5 text-[13px] font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-xl whitespace-nowrap group-hover:bg-[#DBEAFE] transition-colors">
              도착지 변경 <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      {/* 2. 가는 날 · 출발 시간 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#475569]">가는 날 · 출발 시간</span>
          <span className="text-[12px] font-semibold text-[#2563EB] whitespace-nowrap">
            선택 시간 이후 버스 조회
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsDateModalOpen(true)}
          className="w-full px-4 py-3.5 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] text-left hover:bg-[#EFF6FF]/40 transition-colors flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-[15px] font-extrabold text-[#0F172A] whitespace-nowrap">
              <Calendar className="w-4 h-4 text-[#132B45] shrink-0" />
              {date}
            </span>
            <span className="h-4 w-px bg-[#CBD5E1] shrink-0" aria-hidden="true" />
            <span className="text-[15px] font-extrabold text-[#2563EB] whitespace-nowrap">
              {String(departureHour).padStart(2, '0')}:00시 이후
            </span>
          </div>
          <span className="text-[13px] text-[#2563EB] font-bold whitespace-nowrap shrink-0">변경</span>
        </button>
      </div>

      {/* 인원 안내 */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] text-[13px] text-[#475569] flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <span>
          승객 유형(어른·중고생·아동·보훈)은 <strong>좌석 선택 단계</strong>에서 지정합니다. (최대 10매)
        </span>
      </div>

      {/* 3. 조회 버튼 */}
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
        className="w-full py-4 rounded-2xl bg-[#132B45] hover:bg-[#1E3A8A] text-white text-[16px] font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
      >
        <Search className="w-4 h-4" />
        <span>고속·시외 통합 시간표 조회하기</span>
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
