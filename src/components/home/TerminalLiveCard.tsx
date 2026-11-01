'use client';

import React from 'react';
import { Building2, Info, MapPin, Users, Compass } from 'lucide-react';

export const TerminalLiveCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-surface-container space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-caption text-surface-on-surface">터미널 실시간 현황</h4>
        </div>
        <span className="text-caption-xs bg-intercity-container text-intercity-on-container px-2 py-0.5 rounded-full font-bold">
          운행 정상
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-caption">
        <div className="p-2.5 rounded-2xl bg-surface-bright border border-surface-container">
          <span className="text-caption-xs text-surface-outline block mb-0.5">터미널 혼잡도</span>
          <span className="font-extrabold text-intercity">보통 (원활)</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-surface-bright border border-surface-container">
          <span className="text-caption-xs text-surface-outline block mb-0.5">고속 승차홈</span>
          <span className="font-extrabold text-express">1 ~ 8번 홈</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-surface-bright border border-surface-container">
          <span className="text-caption-xs text-surface-outline block mb-0.5">시외 승차홈</span>
          <span className="font-extrabold text-intercity">9 ~ 21번 홈</span>
        </div>
      </div>

      <div className="p-2.5 rounded-2xl bg-surface-soft text-caption-sm text-surface-subtle flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-surface-outline shrink-0" />
        <span className="truncate">신세계백화점 연결 통로 및 승차권 발권 무인 키오스크 운영 중</span>
      </div>
    </div>
  );
};
