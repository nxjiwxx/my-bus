'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { AISuggestionCard } from './AISuggestionCard';
import { Bus, ArrowUpRight, Navigation } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setCurrentTab, setBookingMode } = useApp();

  const handleOpenBusBooking = (mode: 'express' | 'intercity') => {
    setBookingMode(mode);
    setCurrentTab('booking');
  };

  return (
    <div className="flex-1 flex flex-col pb-6">
      <TopAppBar />

      <div className="p-4 space-y-5">
        {/* 1. 헤더 바로 아래 메인: AI 비서 서비스 (중앙 정렬 브리핑 히어로) */}
        <AISuggestionCard />

        {/* 2. 버스 예매 (고속버스 · 시외버스 정사각형 버튼 2개 배치) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-[#132B45]" />
              <h3 className="font-extrabold text-sm text-[#0F172A] tracking-tight">
                버스 예매
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#64748B]">
              노선 유형 선택
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* 고속버스 정사각형 버튼 */}
            <button
              type="button"
              onClick={() => handleOpenBusBooking('express')}
              className="aspect-square rounded-3xl bg-white border border-[#DBEAFE] p-4 shadow-xs hover:shadow-md hover:border-[#2563EB] active:scale-98 transition-all flex flex-col justify-between text-left group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#EFF6FF] pointer-events-none group-hover:scale-110 transition-transform" />

              <div className="relative flex items-center justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                  <Bus className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full whitespace-nowrap">
                  1~8번 홈
                </span>
              </div>

              <div className="relative space-y-1">
                <span className="text-[10px] font-extrabold tracking-wider text-[#2563EB] uppercase block">
                  EXPRESS BUS
                </span>
                <h4 className="text-lg font-black text-[#0F172A] tracking-tight">
                  고속버스
                </h4>
                <p className="text-[11px] text-[#64748B] leading-snug">
                  서울경부 · 센트럴 · 대전 · 광주 등 직통 고속 노선
                </p>
              </div>

              <div className="relative pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-extrabold text-[#2563EB]">
                <span>고속버스 예매</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>

            {/* 시외버스 정사각형 버튼 */}
            <button
              type="button"
              onClick={() => handleOpenBusBooking('intercity')}
              className="aspect-square rounded-3xl bg-white border border-[#D1FAE5] p-4 shadow-xs hover:shadow-md hover:border-[#059669] active:scale-98 transition-all flex flex-col justify-between text-left group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#ECFDF5] pointer-events-none group-hover:scale-110 transition-transform" />

              <div className="relative flex items-center justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-xs">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full whitespace-nowrap">
                  9~21번 홈
                </span>
              </div>

              <div className="relative space-y-1">
                <span className="text-[10px] font-extrabold tracking-wider text-[#059669] uppercase block">
                  INTERCITY BUS
                </span>
                <h4 className="text-lg font-black text-[#0F172A] tracking-tight">
                  시외버스
                </h4>
                <p className="text-[11px] text-[#64748B] leading-snug">
                  동서울 · 남부터미널 · 수원 · 청주 · 공항 등 시외 노선
                </p>
              </div>

              <div className="relative pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-extrabold text-[#059669]">
                <span>시외버스 예매</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
