'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { AISuggestionCard } from './AISuggestionCard';
import { HomeTimelineLiveCard } from './HomeTimelineLiveCard';
import { QuickBookingSection } from './QuickBookingSection';
import { TerminalLiveCard } from './TerminalLiveCard';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { user, setCurrentTab, routines } = useApp();

  return (
    <div className="flex-1 flex flex-col pb-6">
      <TopAppBar />

      <div className="p-4 space-y-4">
        {/* 사용자 인사말 */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <span>천안 청년 이동 파트너</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
            {user.name} 님, 좋은 하루 되세요 👋
          </h2>
        </div>

        {/* AI 이동 비서 핵심 제안 카드 (다음 이동 및 권장 출발시간) */}
        <AISuggestionCard />

        {/* AI 기반 맞춤형 터미널 여유시간 타임라인 실시간 모니터링 위젯 */}
        <HomeTimelineLiveCard />

        {/* 빠른 버스 예매 */}
        <QuickBookingSection />

        {/* 나의 이동 루틴 미니 카드 */}
        {routines.length > 0 && (
          <div className="bg-white rounded-3xl p-4 border border-[#EEF2F6] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#132B45]" />
                <h4 className="font-bold text-xs text-[#0F172A]">나의 등록 이동 루틴</h4>
              </div>
              <button
                onClick={() => setCurrentTab('mypage')}
                className="text-[11px] text-[#2563EB] font-semibold flex items-center hover:underline"
              >
                관리 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  {routines[0].departureStation} → {routines[0].arrivalStation}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  매주 {routines[0].daysOfWeek.join(', ')}요일 · {routines[0].preferredTime}
                </span>
              </div>
              <span className="text-[10px] bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded-full font-bold">
                {routines[0].isActive ? '활성' : '일시정지'}
              </span>
            </div>
          </div>
        )}

        {/* 천안종합버스터미널 실시간 현황 */}
        <TerminalLiveCard />
      </div>
    </div>
  );
};
