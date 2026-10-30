'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, Users, MapPin, Search } from 'lucide-react';
import { BusType } from '@/types';
import { StationSelectModal } from './StationSelectModal';
import { DateSelectModal } from './DateSelectModal';
import { PassengerModal, PassengerState } from './PassengerModal';

interface BusSearchFormProps {
  busType: BusType;
  onBusTypeChange: (type: BusType) => void;
  onSearch: (criteria: {
    departure: string;
    arrival: string;
    date: string;
    passengers: PassengerState;
  }) => void;
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
  const [departure, setDeparture] = useState(initialDeparture);
  const [arrival, setArrival] = useState(initialArrival);
  const [date, setDate] = useState('2026-10-30 (금)');
  const [passengers, setPassengers] = useState<PassengerState>({
    adult: 1,
    teen: 0,
    child: 0,
  });

  // Modal open states
  const [stationModalType, setStationModalType] = useState<'departure' | 'arrival' | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);

  const swapStations = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const totalPassengers = passengers.adult + passengers.teen + passengers.child;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      departure,
      arrival,
      date,
      passengers,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EEF2F6] space-y-4">
      {/* 1. Bus Type Toggle: Express (Blue) vs Intercity (Green) */}
      <div className="flex p-1 bg-[#F1F5F9] rounded-2xl">
        <button
          type="button"
          onClick={() => onBusTypeChange('express')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            busType === 'express'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          고속버스 (Express)
        </button>
        <button
          type="button"
          onClick={() => onBusTypeChange('intercity')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            busType === 'intercity'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          시외버스 (Intercity)
        </button>
      </div>

      {/* 2. Stations Route Selector */}
      <div className="relative bg-[#F8FAFC] rounded-2xl p-3 border border-[#EEF2F6] space-y-2">
        {/* Departure */}
        <button
          type="button"
          onClick={() => setStationModalType('departure')}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors text-left"
        >
          <div>
            <span className="text-[10px] text-[#64748B] block font-semibold">출발지</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-[#0F172A]">{departure}</span>
              {departure === '천안' && (
                <span className="text-[10px] bg-[#EEF2F6] text-[#475569] px-1.5 py-0.5 rounded font-medium">
                  천안종합터미널
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-[#2563EB] font-semibold">변경</span>
        </button>

        {/* Swap Button */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={swapStations}
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:text-[#0F172A] active:rotate-180 transition-all duration-300"
            aria-label="출발지 도착지 교환"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border-t border-[#E2E8F0]" />

        {/* Arrival */}
        <button
          type="button"
          onClick={() => setStationModalType('arrival')}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors text-left"
        >
          <div>
            <span className="text-[10px] text-[#64748B] block font-semibold">도착지</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-[#0F172A]">{arrival}</span>
            </div>
          </div>
          <span className="text-xs text-[#2563EB] font-semibold">변경</span>
        </button>
      </div>

      {/* 3. Date & Passenger Selectors */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Date */}
        <button
          type="button"
          onClick={() => setIsDateModalOpen(true)}
          className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-1 text-[10px] text-[#64748B] font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#132B45]" />
            <span>가는 날</span>
          </div>
          <div className="text-xs font-extrabold text-[#0F172A] mt-1 truncate">{date}</div>
        </button>

        {/* Passengers */}
        <button
          type="button"
          onClick={() => setIsPassengerModalOpen(true)}
          className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-1 text-[10px] text-[#64748B] font-semibold">
            <Users className="w-3.5 h-3.5 text-[#132B45]" />
            <span>승객 수</span>
          </div>
          <div className="text-xs font-extrabold text-[#0F172A] mt-1">
            총 {totalPassengers}명 {passengers.teen > 0 && `(중고생 ${passengers.teen})`}
          </div>
        </button>
      </div>

      {/* 4. Search Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className={`w-full py-3.5 rounded-2xl text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all ${
          busType === 'express'
            ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
            : 'bg-[#059669] hover:bg-[#047857]'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>버스 시간표 조회하기</span>
      </button>

      {/* Modals */}
      <StationSelectModal
        isOpen={stationModalType !== null}
        onClose={() => setStationModalType(null)}
        onSelect={(st) => {
          if (stationModalType === 'departure') setDeparture(st);
          if (stationModalType === 'arrival') setArrival(st);
        }}
        currentStation={stationModalType === 'departure' ? departure : arrival}
        type={stationModalType || 'departure'}
      />

      <DateSelectModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSelect={(d) => setDate(d)}
        currentDate={date}
      />

      <PassengerModal
        isOpen={isPassengerModalOpen}
        onClose={() => setIsPassengerModalOpen(false)}
        passengers={passengers}
        onChange={(p) => setPassengers(p)}
      />
    </div>
  );
};
