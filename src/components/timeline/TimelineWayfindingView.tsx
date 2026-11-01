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
    activeTicket,
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

  const busType = activeTicket?.busSchedule.busType || 'express';
  const isExpress = busType === 'express';

  const accentText = isExpress ? 'text-express' : 'text-intercity';
  const accentBg = isExpress ? 'bg-express' : 'bg-intercity';
  const accentContainer = isExpress ? 'bg-express-container' : 'bg-intercity-container';
  const accentBorder = isExpress ? 'border-express-border' : 'border-intercity-border';
  const railPrimaryColor = isExpress ? RAIL_COLORS.active : RAIL_COLORS.boarding;

  const items = customTimeline.items;
  const activeIdx = Math.min(customTimeline.currentActivityIndex, items.length - 1);
  const currentItem = items[activeIdx] || items[0];
  const nextItem = items[activeIdx + 1] || null;
  const shownIdx = openIdx ?? activeIdx;

  const segColor = (toIdx: number) =>
    toIdx <= activeIdx ? RAIL_COLORS.done : railPrimaryColor;

  return (
    <div className="p-5 pb-9 space-y-5">
      {/* 1. 상단 실시간 길 안내 요약 카드 */}
      <section className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accentBg} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${accentBg}`} />
            </span>
            <span className="text-title-sm font-extrabold tracking-tight truncate">
              현재: {currentItem.title}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleVoiceGuide}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-extrabold whitespace-nowrap transition-all shrink-0 ${
              customTimeline.voiceGuideEnabled
                ? `${accentBg} text-white`
                : 'bg-white/15 text-white/90 hover:bg-white/25'
            }`}
          >
            {customTimeline.voiceGuideEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" /> 음성 ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" /> 음성 안내
              </>
            )}
          </button>
        </div>

        {/* 현재 위치 · 다음 일정 · 버스 출발 남은 시간 3열 요약 */}
        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl px-3 py-2">
            <span className="text-caption-sm text-express-light font-bold block">진행 시간 · 위치</span>
            <span className="text-body-sm font-extrabold text-white block truncate mt-0.5 tabular-nums">
              {currentItem.startTime}~{currentItem.endTime}
            </span>
            <span className="text-caption text-white/75 block truncate">{currentItem.guideFloor}</span>
          </div>
          <div className="bg-white/10 rounded-2xl px-3 py-2">
            <span className="text-caption-sm text-express-light font-bold block">다음 일정</span>
            <span className="text-body-sm font-extrabold text-white block truncate mt-0.5">
              {nextItem ? nextItem.title : '버스 탑승'}
            </span>
            <span className="text-caption text-white/75 block truncate">
              {nextItem ? `도보 ${currentItem.transitTimeToNext}분` : customTimeline.boardingPlatform}
            </span>
          </div>
          <div className={`${accentBg}/40 border border-white/25 rounded-2xl px-3 py-2`}>
            <span className="text-caption-sm text-white/85 font-bold block">
              출발 {customTimeline.busDepartureTime}
            </span>
            <span className="text-body-sm font-black text-white block truncate mt-0.5 tabular-nums">
              {customTimeline.totalAvailableMinutes}분 남음
            </span>
            <span className="text-caption text-white/85 block truncate tabular-nums">
              여유 {customTimeline.actualBufferMinutes}분
            </span>
          </div>
        </div>

        {customTimeline.voiceGuideEnabled && (
          <div className="px-3 py-2 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-between gap-2 text-caption text-white">
            <span className="truncate">{currentItem.routeInstruction}</span>
            <button
              type="button"
              onClick={() =>
                speakRouteGuide(`${currentItem.title} 이동 경로 안내입니다. ${currentItem.routeInstruction}`)
              }
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/20 font-bold whitespace-nowrap"
            >
              다시듣기
            </button>
          </div>
        )}
      </section>

      {/* AI 지연 재조정 알림 배너 */}
      {customTimeline.isDelayedAdjusted && (
        <div className="p-3.5 rounded-2xl bg-warning-container border border-warning/40 flex items-center justify-between gap-2 text-label-sm">
          <span className="font-extrabold text-warning-on-container flex items-center gap-1.5 truncate">
            <Sparkles className="w-4 h-4 text-warning shrink-0" />
            AI 일정 재조정 완료 (탑승 여유 {customTimeline.actualBufferMinutes}분 확보)
          </span>
          <button
            type="button"
            onClick={resetTimelineToInitial}
            className="text-caption font-bold text-warning-on-container underline whitespace-nowrap shrink-0"
          >
            원래대로
          </button>
        </div>
      )}

      {/* 2. 중앙 버스 노선도형 실시간 길 안내 */}
      <section className="bg-white rounded-3xl border border-surface-container-high p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-soft">
          <h3 className="text-title-sm font-extrabold text-surface-on-surface tracking-tight">
            실시간 시설 길 안내 노선도
          </h3>
          <span className={`inline-flex items-center gap-1 text-caption font-extrabold text-white ${accentBg} px-2.5 py-1 rounded-full`}>
            <Bus className="w-3 h-3" /> {customTimeline.boardingPlatform}행
          </span>
        </div>

        <div className="space-y-1">
          {/* 출발점 */}
          <RouteRow
            node="origin"
            nodeY={12}
            nodeColor={RAIL_COLORS.done}
            bottomColor={segColor(0)}
            time={customTimeline.currentTime}
            contentClassName="pb-3"
          >
            <div className="flex items-center justify-between text-label">
              <span className="font-bold text-surface-outline">{customTimeline.currentLocation}</span>
              <span className="text-caption font-semibold text-surface-outline">출발 완료</span>
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
            const nodeColor = isDone ? RAIL_COLORS.done : railPrimaryColor;

            return (
              <RouteRow
                key={item.id}
                node={kind}
                nodeY={18}
                nodeColor={nodeColor}
                topColor={segColor(idx)}
                bottomColor={isLast ? null : segColor(idx + 1)}
                icon={
                  isCurrent ? (
                    isBoarding ? <Bus className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />
                  ) : isDone ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : isBoarding ? (
                    <Flag className="w-3 h-3 text-white" />
                  ) : undefined
                }
                time={item.startTime}
                timeSub={`~${item.endTime}`}
                contentClassName="pb-3"
              >
                <div
                  className={`rounded-2xl border p-3.5 transition-all ${
                    isCurrent
                      ? `${accentContainer} ${accentBorder} shadow-2xs`
                      : isDone
                      ? 'bg-surface-bright border-surface-container-high'
                      : isBoarding
                      ? `${accentContainer} ${accentBorder}`
                      : 'bg-white border-surface-container-high'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="w-full text-left flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isCurrent && (
                        <span className={`text-caption-sm font-extrabold text-white ${accentBg} px-2 py-0.5 rounded-full whitespace-nowrap shrink-0`}>
                          지금 여기
                        </span>
                      )}
                      {isDone && (
                        <span className="text-caption-sm font-bold text-surface-outline bg-surface-container-high px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                          완료
                        </span>
                      )}
                      <span
                        className={`text-body font-extrabold truncate ${
                          isDone ? 'text-surface-outline' : 'text-surface-on-surface'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span className="text-label-sm font-semibold text-surface-outline whitespace-nowrap shrink-0">
                      {item.guideFloor}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={`mt-2.5 pt-2.5 border-t ${accentBorder} space-y-2.5`}>
                      <p className="text-label text-surface-on-variant leading-relaxed flex items-start gap-1.5">
                        <Footprints className={`w-4 h-4 ${accentText} shrink-0 mt-0.5`} />
                        <span>{item.routeInstruction}</span>
                      </p>

                      {isCurrent ? (
                        <button
                          type="button"
                          onClick={nextItem ? advanceTimelineActivity : finishTimelineWayfinding}
                          className={`w-full py-2.5 text-white rounded-xl text-label font-extrabold transition-opacity flex items-center justify-center gap-1.5 ${accentBg} hover:opacity-90`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {nextItem ? '활동 완료 · 다음 장소 안내' : '승차장 도착 완료 · 길 안내 종료'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        !isDone && (
                          <button
                            type="button"
                            onClick={() => setCurrentActivityIndex(idx)}
                            className="w-full py-2 bg-white border border-surface-outline-variant text-primary rounded-xl text-label-sm font-extrabold"
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
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={simulateActivityDelay}
            className="p-3 rounded-2xl bg-white border border-surface-container-high hover:bg-warning-container/40 flex flex-col items-center justify-center gap-1.5 shadow-2xs"
          >
            <Clock className="w-4 h-4 text-warning-on-container" />
            <span className="text-caption font-extrabold text-surface-on-surface whitespace-nowrap">10분 지연</span>
          </button>
          <button
            type="button"
            onClick={triggerBoardingAlert}
            className="p-3 rounded-2xl bg-white border border-surface-container-high hover:bg-intercity-container flex flex-col items-center justify-center gap-1.5 shadow-2xs"
          >
            <Bell className="w-4 h-4 text-intercity" />
            <span className="text-caption font-extrabold text-surface-on-surface whitespace-nowrap">승차장 알림</span>
          </button>
          <button
            type="button"
            onClick={applyAlternativeShortCourse}
            className="p-3 rounded-2xl bg-white border border-surface-container-high hover:bg-express-container flex flex-col items-center justify-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-4 h-4 text-express" />
            <span className="text-caption font-extrabold text-surface-on-surface whitespace-nowrap">내부 코스</span>
          </button>
          <button
            type="button"
            onClick={() => setTimelineStep('recommendation')}
            className="p-3 rounded-2xl bg-white border border-surface-container-high hover:bg-surface-bright flex flex-col items-center justify-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-surface-subtle" />
            <span className="text-caption font-extrabold text-surface-on-surface whitespace-nowrap">일정 편집</span>
          </button>
        </div>

        <button
          type="button"
          onClick={finishTimelineWayfinding}
          className={`w-full py-3.5 ${accentBg} text-white rounded-2xl text-body font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2`}
        >
          <CheckCircle2 className="w-4 h-4 text-white/90" />
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
