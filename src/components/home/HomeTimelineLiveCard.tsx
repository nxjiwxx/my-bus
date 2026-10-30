'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Volume2,
  VolumeX,
  Footprints,
  Navigation,
  Sliders,
} from 'lucide-react';

export const HomeTimelineLiveCard: React.FC = () => {
  const {
    customTimeline,
    setCurrentTab,
    setTimelineStep,
    toggleVoiceGuide,
    advanceTimelineActivity,
  } = useApp();

  const handleOpenWayfinding = () => {
    setTimelineStep('wayfinding');
    setCurrentTab('timeline');
  };

  const handleOpenConfig = () => {
    setTimelineStep('config');
    setCurrentTab('timeline');
  };

  if (customTimeline && customTimeline.isConfirmed) {
    const activeIdx = Math.min(
      customTimeline.currentActivityIndex,
      customTimeline.items.length - 1
    );
    const current = customTimeline.items[activeIdx] || customTimeline.items[0];
    const next = customTimeline.items[activeIdx + 1] || null;
    const boardingItem = customTimeline.items.find((it) => it.isBoardingStep);

    return (
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white rounded-3xl p-4.5 shadow-md border border-white/10 space-y-3 relative overflow-hidden">
        {/* Ambient background accent */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#6366F1]/25 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
            </span>
            <span className="text-[11px] font-extrabold text-[#A5B4FC] tracking-tight">
              AI 비서 · 맞춤형 타임라인 실시간 길 안내
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoiceGuide}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                customTimeline.voiceGuideEnabled
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-white/15 text-white/80 hover:bg-white/25'
              }`}
            >
              {customTimeline.voiceGuideEnabled ? (
                <>
                  <Volume2 className="w-3 h-3" /> 음성 ON
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3" /> 음성안내
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleOpenConfig}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
              title="타임라인 조건 설정"
            >
              <Sliders className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 현재 활동 및 실시간 동선 안내 */}
        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-[#6366F1] text-white px-2 py-0.5 rounded-full">
              현재 일정 ({activeIdx + 1}/{customTimeline.items.length})
            </span>
            <span className="text-xs font-bold text-[#93C5FD]">
              {current?.startTime} ~ {current?.endTime}
            </span>
          </div>
          <h4 className="text-sm font-black text-white tracking-tight">
            {current?.title || '교보문고 천안점'}
          </h4>
          <p className="text-[11px] text-white/80 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#6EE7B7] shrink-0" />
            <span className="truncate">{current?.routeInstruction}</span>
          </p>
        </div>

        {/* 다음 일정 & 탑승까지 남은 시간 요약 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] text-white/60 block mb-0.5">다음 일정 안내</span>
            <span className="font-bold text-white text-[11px] truncate block">
              {next ? `${next.title.split(' ')[0]} (도보 ${current.transitTimeToNext}분)` : '승차홈 대기'}
            </span>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-white/60 block mb-0.5">
              탑승 준비 ({customTimeline.boardingPlatform})
            </span>
            <span className="font-bold text-[#6EE7B7] text-[11px] block">
              {boardingItem?.startTime || '17:44'} 이동 (여유 {customTimeline.actualBufferMinutes}분)
            </span>
          </div>
        </div>

        {/* 액션 버튼: 다음 구간 전환 / 상세 길 안내 페이지 이동 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenWayfinding}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm hover:from-[#4F46E5] hover:to-[#4338CA] active:scale-98 transition-all"
          >
            <span>상세 길 안내 흐름 페이지</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={advanceTimelineActivity}
            className="py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            다음 구간
          </button>
        </div>
      </div>
    );
  }

  // 아직 타임라인을 확정하지 않은 경우
  return (
    <div className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] border border-[#DDD6FE] rounded-3xl p-4 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-[#6366F1] text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold text-[#4F46E5]">
            맞춤형 타임라인 (AI 여유시간 가이드)
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#6366F1] bg-white px-2 py-0.5 rounded-full border border-[#DDD6FE]">
          천안터미널 복합공간
        </span>
      </div>

      <div>
        <h4 className="text-sm font-extrabold text-[#0F172A]">
          버스 탑승 전 남은 여유시간, 어떻게 보낼지 고민되시나요?
        </h4>
        <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
          관심 활동·동행·예산을 분석해 시설 이용부터 승차장 이동까지 탑승 걱정 없는 맞춤 타임라인을 제안합니다.
        </p>
      </div>

      <button
        type="button"
        onClick={handleOpenConfig}
        className="w-full py-2.5 bg-[#6366F1] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#4F46E5] active:scale-98 transition-colors shadow-xs"
      >
        <span>여유시간 맞춤형 타임라인 시작하기</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
