'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowUpRight, Bus, Compass } from 'lucide-react';
import { popularDestinations } from '@/mock/data';

export const QuickBookingSection: React.FC = () => {
  const { setCurrentTab, setBookingPreset } = useApp();

  const handleQuickBook = (busType: 'express' | 'intercity', arrival = '서울경부') => {
    setBookingPreset({
      departure: '천안',
      arrival,
      busType,
    });
    setCurrentTab('booking');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-[#0F172A] tracking-tight">빠른 버스 예매</h3>
        <span className="text-[11px] text-[#64748B]">천안종합버스터미널 발</span>
      </div>

      {/* Express / Intercity Dual Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Express Card - Blue */}
        <button
          onClick={() => handleQuickBook('express', '서울경부')}
          className="group relative p-4 rounded-3xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] text-left hover:shadow-md transition-all active:scale-98 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
              고속버스
            </span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="font-extrabold text-sm text-[#1E3A8A] leading-tight">
            서울 · 대전 · 부산
          </div>
          <p className="text-[11px] text-[#2563EB] mt-1 font-medium">
            우등 / 프리미엄 전용
          </p>
        </button>

        {/* Intercity Card - Green */}
        <button
          onClick={() => handleQuickBook('intercity', '동서울')}
          className="group relative p-4 rounded-3xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] text-left hover:shadow-md transition-all active:scale-98 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#059669] text-white">
              시외버스
            </span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#059669] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="font-extrabold text-sm text-[#065F46] leading-tight">
            동서울 · 경기 · 충청
          </div>
          <p className="text-[11px] text-[#059669] mt-1 font-medium">
            다양한 경유 및 직행
          </p>
        </button>
      </div>

      {/* Popular Destination Quick Chips */}
      <div className="pt-1">
        <span className="text-[11px] font-bold text-[#64748B] block mb-2">천안발 인기 도착지</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {popularDestinations.slice(0, 6).map((dest) => (
            <button
              key={dest.id}
              onClick={() => handleQuickBook('express', dest.name)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:border-[#132B45] hover:text-[#132B45] transition-colors active:scale-95"
            >
              {dest.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
