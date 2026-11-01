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
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-surface-container space-y-5">
      {/* 1. 운행 노선 (출발지 고정 · 도착지 선택 가능) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-label font-bold text-surface-subtle">운행 노선</span>
          <span className="text-caption font-bold text-express whitespace-nowrap">
            고속 · 시외 통합 예매
          </span>
        </div>
        <div className="rounded-2xl bg-surface-bright border border-surface-container divide-y divide-surface-container-high overflow-hidden">
          {/* 출발지 (천안고속버스터미널 고정) */}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <span className="text-caption font-semibold text-surface-outline block">출발</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-title-sm font-extrabold text-surface-on-surface">{initialDeparture}</span>
                <span className="text-caption bg-surface-container text-surface-subtle px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                  천안고속버스터미널
                </span>
              </div>
            </div>
            <span className="text-caption font-bold text-surface-outline whitespace-nowrap">고정</span>
          </div>

          {/* 도착지 (선택 가능) */}
          <button
            type="button"
            onClick={() => setIsArrivalModalOpen(true)}
            className="w-full px-4 py-3.5 relative text-left hover:bg-express-container/50 transition-colors flex items-center justify-between group"
          >
            <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-white border border-surface-container-high flex items-center justify-center text-surface-outline">
              <ArrowDown className="w-3 h-3" />
            </div>
            <div>
              <span className="text-caption font-semibold text-surface-outline block">도착</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-express shrink-0" />
                <span className="text-title-sm font-extrabold text-surface-on-surface">{arrival}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-0.5 text-label-sm font-bold text-express bg-express-container px-3 py-1.5 rounded-xl whitespace-nowrap group-hover:bg-express-soft transition-colors">
              도착지 변경 <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      {/* 2. 가는 날 · 출발 시간 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-label font-bold text-surface-subtle">가는 날 · 출발 시간</span>
          <span className="text-caption font-semibold text-express whitespace-nowrap">
            선택 시간 이후 버스 조회
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsDateModalOpen(true)}
          className="w-full px-4 py-3.5 bg-surface-bright rounded-2xl border border-surface-container text-left hover:bg-express-container/40 transition-colors flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-body-sm font-extrabold text-surface-on-surface whitespace-nowrap">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              {date}
            </span>
            <span className="h-4 w-px bg-surface-outline-variant shrink-0" aria-hidden="true" />
            <span className="text-body-sm font-extrabold text-express whitespace-nowrap">
              {String(departureHour).padStart(2, '0')}:00시 이후
            </span>
          </div>
          <span className="text-label-sm text-express font-bold whitespace-nowrap shrink-0">변경</span>
        </button>
      </div>

      {/* 인원 안내 */}
      <div className="p-3.5 rounded-2xl bg-surface-bright border border-surface-container text-label-sm text-surface-subtle flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-express shrink-0 mt-0.5" />
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
        className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-body font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
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
