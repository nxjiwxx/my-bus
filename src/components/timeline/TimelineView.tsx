'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { TimelineConfigStep } from './TimelineConfigStep';
import { TimelineRecommendStep } from './TimelineRecommendStep';
import { TimelineWayfindingView } from './TimelineWayfindingView';
import { Sliders, ListOrdered, Navigation } from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { timelineStep, setTimelineStep, customTimeline } = useApp();

  const steps = [
    {
      id: 'config',
      stepBadge: 'STEP 01·02',
      label: '조건 · 여유시간',
      icon: Sliders,
    },
    {
      id: 'recommendation',
      stepBadge: 'STEP 03·04',
      label: '추천 · 편집',
      icon: ListOrdered,
    },
    {
      id: 'wayfinding',
      stepBadge: 'STEP 05·06',
      label: '길안내 · 탑승',
      icon: Navigation,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9]">
      <TopAppBar
        title="맞춤형 타임라인"
        showBack={timelineStep !== 'config'}
        onBack={() => {
          if (timelineStep === 'wayfinding') setTimelineStep('recommendation');
          else if (timelineStep === 'recommendation') setTimelineStep('config');
        }}
        rightElement={
          customTimeline?.isConfirmed ? (
            <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
              일정 가동 중
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-[#E1EDFB] text-[#17365D] px-2 py-0.5 rounded-full">
              AI 타임라인
            </span>
          )
        }
      />

      {/* 6-Step Flow Mapped to 3 Interactive Tabs */}
      <div className="bg-white px-3 py-2 border-b border-[#EEF2F6] grid grid-cols-3 gap-1.5">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = timelineStep === st.id;
          const isDone =
            (st.id === 'config' && (timelineStep === 'recommendation' || timelineStep === 'wayfinding')) ||
            (st.id === 'recommendation' && timelineStep === 'wayfinding');

          return (
            <button
              key={st.id}
              onClick={() => setTimelineStep(st.id as 'config' | 'recommendation' | 'wayfinding')}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all border ${
                isActive
                  ? 'bg-[#132B45] text-white border-[#132B45] shadow-xs'
                  : isDone
                  ? 'bg-[#E1EDFB]/70 text-[#17365D] border-[#BFDBFE]'
                  : 'bg-[#F8FAFC] text-[#64748B] border-[#EEF2F6] hover:text-[#0F172A]'
              }`}
            >
              <span
                className={`text-[9px] font-extrabold tracking-tight ${
                  isActive ? 'text-[#93C5FD]' : isDone ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                }`}
              >
                {st.stepBadge}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Icon className="w-3 h-3 shrink-0" />
                <span className="text-[11px] font-extrabold truncate">{st.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* View router */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {timelineStep === 'config' && <TimelineConfigStep />}
        {timelineStep === 'recommendation' && <TimelineRecommendStep />}
        {timelineStep === 'wayfinding' && <TimelineWayfindingView />}
      </div>
    </div>
  );
};
