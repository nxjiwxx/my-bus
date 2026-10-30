'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BoardingAlertModal } from './BoardingAlertModal';
import { RouteRow, RAIL_COLORS } from './RouteRail';
import {
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  ArrowRight,
  Bell,
  CheckCircle2,
  Edit3,
  Navigation,
  RefreshCw,
  Check,
  Bus,
  Footprints,
  Flag,
} from 'lucide-react';

export const TimelineWayfindingView: React.FC = () => {
  const {
    customTimeline,
    toggleVoiceGuide,
    speakRouteGuide,
    simulateActivityDelay,
    applyAlternativeShortCourse,
    setCurrentActivityIndex,
    advanceTimelineActivity,
    triggerBoardingAlert,
    isBoardingAlertOpen,
    dismissBoardingAlert,
    setTimelineStep,
    resetTimelineToInitial,
    finishTimelineWayfinding,
  } = useApp();

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const currentIdxForReset = customTimeline?.currentActivityIndex;

  useEffect(() => {
    setOpenIdx(null);
  }, [currentIdxForReset]);

  if (!customTimeline) return null;

  const items = customTimeline.items;
  const activeIdx = Math.min(customTimeline.currentActivityIndex, items.length - 1);
  const currentItem = items[activeIdx] || items[0];
  const nextItem = items[activeIdx + 1] || null;
  const shownIdx = openIdx ?? activeIdx;

  const segColor = (toIdx: number) =>
    toIdx <= activeIdx
      ? RAIL_COLORS.done
      : items[toIdx]?.isBoardingStep
      ? RAIL_COLORS.boarding
      : RAIL_COLORS.active;

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 overflow-hidden gap-2.5">
      {/* 1. 상단 실시간 길 안내 요약 카드 (컴팩트 1화면 구성) */}
      <section className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-2xl p-3.5 shadow-sm shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="text-xs font-extrabold tracking-tight truncate">
              현재: {currentItem.title}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleVoiceGuide}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap transition-all shrink-0 ${
              customTimeline.voiceGuideEnabled
                ? 'bg-[#10B981] text-white'
                : 'bg-white/15 text-white/90 hover:bg-white/25'
            }`}
          >
            {customTimeline.voiceGuideEnabled ? (
              <>
                <Volume2 className="w-3 h-3" /> 음성 ON
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3" /> 음성 안내
              </>
            )}
          </button>
        </div>

        {/* 현재 위치 · 다음 일정 · 버스 출발 남은 시간 3열 요약 */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/15 text-[11px]">
          <div className="bg-white/10 rounded-xl px-2.5 py-1.5">
            <span className="text-[9px] text-[#93C5FD] font-bold block">진행 시간 · 위치</span>
            <span className="font-extrabold text-white block truncate">
              {currentItem.startTime}~{currentItem.endTime}
            </span>
            <span className="text-[10px] text-white/75 block truncate">{currentItem.guideFloor}</span>
          </div>
          <div className="bg-white/10 rounded-xl px-2.5 py-1.5">
            <span className="text-[9px] text-[#93C5FD] font-bold block">다음 일정</span>
            <span className="font-extrabold text-white block truncate">
              {nextItem ? nextItem.title : '버스 탑승'}
            </span>
            <span className="text-[10px] text-white/75 block truncate">
              {nextItem ? `도보 ${currentItem.transitTimeToNext}분` : customTimeline.boardingPlatform}
            </span>
          </div>
          <div className="bg-[#059669]/35 border border-[#34D399]/40 rounded-xl px-2.5 py-1.5">
            <span className="text-[9px] text-[#6EE7B7] font-bold block">
              출발 {customTimeline.busDepartureTime}
            </span>
            <span className="font-black text-white block truncate">
              {customTimeline.totalAvailableMinutes}분 남음
            </span>
            <span className="text-[10px] text-[#A7F3D0] block truncate">
              여유 {customTimeline.actualBufferMinutes}분
            </span>
          </div>
        </div>

        {customTimeline.voiceGuideEnabled && (
          <div className="px-2.5 py-1.5 rounded-xl bg-[#065F46]/90 border border-[#34D399]/30 flex items-center justify-between gap-2 text-[10px] text-[#ECFDF5]">
            <span className="truncate">{currentItem.routeInstruction}</span>
            <button
              type="button"
              onClick={() =>
                speakRouteGuide(`${currentItem.title} 이동 경로 안내입니다. ${currentItem.routeInstruction}`)
              }
              className="shrink-0 px-2 py-0.5 rounded bg-white/20 font-bold whitespace-nowrap"
            >
              다시듣기
            </button>
          </div>
        )}
      </section>

      {/* AI 지연 재조정 알림 배너 (발생 시에만 한 줄 표시) */}
      {customTimeline.isDelayedAdjusted && (
        <div className="px-3 py-1.5 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-between gap-2 text-[11px] shrink-0">
          <span className="font-extrabold text-[#92400E] flex items-center gap-1 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            AI 일정 재조정 완료 (탑승 여유 {customTimeline.actualBufferMinutes}분 확보)
          </span>
          <button
            type="button"
            onClick={resetTimelineToInitial}
            className="text-[10px] font-bold text-[#92400E] underline whitespace-nowrap shrink-0"
          >
            원래대로
          </button>
        </div>
      )}

      {/* 2. 중앙 버스 노선도형 실시간 길 안내 (한눈에 들어오는 노선도) */}
      <section className="flex-1 bg-white rounded-2xl border border-[#EEF2F6] p-3 shadow-2xs flex flex-col justify-between overflow-hidden min-h-0">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#F1F5F9] shrink-0">
          <span className="text-xs font-extrabold text-[#0F172A]">실시간 시설 길 안내 노선도</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-[#2563EB] px-2 py-0.5 rounded-full">
            <Bus className="w-2.5 h-2.5" /> {customTimeline.boardingPlatform}행
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-around py-1 overflow-hidden">
          {/* 출발점 */}
          <RouteRow
            node="origin"
            nodeY={10}
            nodeColor={RAIL_COLORS.done}
            bottomColor={segColor(0)}
            time={customTimeline.currentTime}
            contentClassName="pb-0.5"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#64748B]">{customTimeline.currentLocation}</span>
              <span className="text-[10px] font-semibold text-[#94A3B8]">출발 완료</span>
            </div>
          </RouteRow>

          {/* 정류장 목록 */}
          {items.map((item, idx) => {
            const isDone = idx < activeIdx;
            const isCurrent = idx === activeIdx;
            const isBoarding = !!item.isBoardingStep;
            const isOpen = shownIdx === idx;
            const isLast = idx === items.length - 1;
            const kind = isCurrent ? 'current' : isDone ? 'done' : isBoarding ? 'terminal' : 'stop';
            const nodeColor = isDone
              ? RAIL_COLORS.done
              : isBoarding
              ? RAIL_COLORS.boarding
              : RAIL_COLORS.active;

            return (
              <RouteRow
                key={item.id}
                node={kind}
                nodeY={16}
                nodeColor={isCurrent && isBoarding ? RAIL_COLORS.boarding : nodeColor}
                topColor={segColor(idx)}
                bottomColor={isLast ? null : segColor(idx + 1)}
                icon={
                  isCurrent ? (
                    isBoarding ? <Bus className="w-3 h-3" /> : <Navigation className="w-3 h-3" />
                  ) : isDone ? (
                    <Check className="w-2.5 h-2.5 text-white" />
                  ) : isBoarding ? (
                    <Flag className="w-2.5 h-2.5 text-white" />
                  ) : undefined
                }
                time={item.startTime}
                timeSub={`~${item.endTime}`}
                contentClassName="pb-0.5"
              >
                <div
                  className={`rounded-xl border px-3 py-2 transition-all ${
                    isCurrent
                      ? 'bg-[#EFF6FF] border-[#93C5FD] shadow-2xs'
                      : isDone
                      ? 'bg-[#F8FAFC] border-[#E2E8F0]'
                      : isBoarding
                      ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                      : 'bg-white border-[#E2E8F0]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="w-full text-left flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold text-white bg-[#2563EB] px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                          지금 여기
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[9px] font-bold text-[#64748B] bg-[#E2E8F0] px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                          완료
                        </span>
                      )}
                      <span
                        className={`text-xs font-extrabold truncate ${
                          isDone ? 'text-[#94A3B8]' : 'text-[#0F172A]'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#64748B] whitespace-nowrap shrink-0">
                      {item.guideFloor}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-1.5 pt-1.5 border-t border-[#DBEAFE] space-y-1.5">
                      <p className="text-[10px] text-[#334155] leading-snug flex items-start gap-1">
                        <Footprints className="w-3 h-3 text-[#2563EB] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.routeInstruction}</span>
                      </p>

                      {isCurrent ? (
                        <button
                          type="button"
                          onClick={nextItem ? advanceTimelineActivity : finishTimelineWayfinding}
                          className={`w-full py-1.5 text-white rounded-lg text-[11px] font-extrabold transition-colors flex items-center justify-center gap-1 ${
                            nextItem
                              ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                              : 'bg-[#059669] hover:bg-[#047857]'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            {nextItem ? '활동 완료 · 다음 장소 안내' : '승차장 도착 완료 · 길 안내 종료'}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        !isDone && (
                          <button
                            type="button"
                            onClick={() => setCurrentActivityIndex(idx)}
                            className="w-full py-1 bg-white border border-[#CBD5E1] text-[#132B45] rounded-lg text-[10px] font-extrabold"
                          >
                            이 장소부터 안내 받기
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </RouteRow>
            );
          })}
        </div>
      </section>

      {/* 3. 하단 STEP 06 현장 대응 퀵 버튼 4종 + 길 안내 종료 버튼 */}
      <div className="space-y-2 shrink-0">
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={simulateActivityDelay}
            className="p-2 rounded-xl bg-white border border-[#EEF2F6] hover:bg-[#FFFBEB] flex flex-col items-center justify-center gap-1 shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-[10px] font-extrabold text-[#0F172A] whitespace-nowrap">10분 지연</span>
          </button>
          <button
            type="button"
            onClick={triggerBoardingAlert}
            className="p-2 rounded-xl bg-white border border-[#EEF2F6] hover:bg-[#ECFDF5] flex flex-col items-center justify-center gap-1 shadow-2xs"
          >
            <Bell className="w-3.5 h-3.5 text-[#059669]" />
            <span className="text-[10px] font-extrabold text-[#0F172A] whitespace-nowrap">승차장 알림</span>
          </button>
          <button
            type="button"
            onClick={applyAlternativeShortCourse}
            className="p-2 rounded-xl bg-white border border-[#EEF2F6] hover:bg-[#EFF6FF] flex flex-col items-center justify-center gap-1 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-[10px] font-extrabold text-[#0F172A] whitespace-nowrap">내부 코스</span>
          </button>
          <button
            type="button"
            onClick={() => setTimelineStep('recommendation')}
            className="p-2 rounded-xl bg-white border border-[#EEF2F6] hover:bg-[#F8FAFC] flex flex-col items-center justify-center gap-1 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-[10px] font-extrabold text-[#0F172A] whitespace-nowrap">일정 편집</span>
          </button>
        </div>

        <button
          type="button"
          onClick={finishTimelineWayfinding}
          className="w-full py-3 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-xs font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#93C5FD]" />
          <span>길 안내 종료하기</span>
        </button>
      </div>

      <BoardingAlertModal
        isOpen={isBoardingAlertOpen}
        onClose={dismissBoardingAlert}
        timeline={customTimeline}
      />
    </div>
  );
};
