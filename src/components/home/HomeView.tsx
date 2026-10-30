'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BusType } from '@/types';
import { TopAppBar } from '../common/TopAppBar';
import { AISuggestionCard } from './AISuggestionCard';
import { BusSearchForm } from '../booking/BusSearchForm';
import { Bus } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setCurrentTab, setBookingPreset } = useApp();
  const [busType, setBusType] = useState<BusType>('express');

  const handleHomeBookingSearch = (criteria: {
    departure: string;
    arrival: string;
    date: string;
    departureHour: number;
  }) => {
    setBookingPreset({
      busType,
      departure: criteria.departure,
      arrival: criteria.arrival,
      date: criteria.date,
      departureHour: criteria.departureHour,
    });
    setCurrentTab('booking');
  };

  return (
    <div className="flex-1 flex flex-col pb-6">
      <TopAppBar />

      <div className="p-4 space-y-5">
        {/* 1. 헤더 바로 아래 메인: AI 비서 서비스 (중앙 정렬 브리핑 히어로) */}
        <AISuggestionCard />

        {/* 2. 일반 버스 예매 서비스 (도착지 선택 · 날짜 달력 및 00~24시 출발 시간 설정) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-[#132B45]" />
              <h3 className="font-extrabold text-sm text-[#0F172A] tracking-tight">
                일반 버스 예매
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#64748B]">
              천안종합버스터미널 출발
            </span>
          </div>

          <BusSearchForm
            busType={busType}
            onBusTypeChange={setBusType}
            onSearch={handleHomeBookingSearch}
            initialDeparture="천안"
            initialArrival={busType === 'express' ? '서울경부' : '동서울'}
          />
        </section>
      </div>
    </div>
  );
};
