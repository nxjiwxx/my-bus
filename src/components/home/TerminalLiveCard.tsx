'use client';

import React from 'react';
import { Building2, Info, MapPin, Users, Compass } from 'lucide-react';

export const TerminalLiveCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#EEF2F6] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#132B45]" />
          <h4 className="font-bold text-xs text-[#0F172A]">터미널 실시간 현황</h4>
        </div>
        <span className="text-[10px] bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded-full font-bold">
          운행 정상
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
          <span className="text-[10px] text-[#64748B] block mb-0.5">터미널 혼잡도</span>
          <span className="font-extrabold text-[#059669]">보통 (원활)</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
          <span className="text-[10px] text-[#64748B] block mb-0.5">고속 승차홈</span>
          <span className="font-extrabold text-[#2563EB]">1 ~ 8번 홈</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
          <span className="text-[10px] text-[#64748B] block mb-0.5">시외 승차홈</span>
          <span className="font-extrabold text-[#059669]">9 ~ 21번 홈</span>
        </div>
      </div>

      <div className="p-2.5 rounded-2xl bg-[#F1F5F9] text-[11px] text-[#475569] flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
        <span className="truncate">신세계백화점 연결 통로 및 승차권 발권 무인 키오스크 운영 중</span>
      </div>
    </div>
  );
};
