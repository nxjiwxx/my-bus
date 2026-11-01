'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockTimelinePlaces } from '@/mock/data';
import { BottomSheet } from '../common/BottomSheet';
import { BusTypeBadge } from '../common/Badge';
import { RouteRow, RAIL_COLORS } from './RouteRail';
import {
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Minus,
  ShieldCheck,
  Bus,
  Navigation,
  Footprints,
} from 'lucide-react';

const boundaryLabelOf = (b: string) =>
  b === 'terminal_inside' ? '터미널 내부' : b === 'complex_space' ? '복합공간' : '주변상권';

export const TimelineRecommendStep: React.FC = () => {
  const {
    activeTicket,
    customTimeline,
    confirmTimeline,
    deleteTimelineItem,
    addTimelineItemFromPlace,
    moveTimelineItem,
    updateTimelineItemDuration,
    replaceTimelineItem,
    autoAdjustOverflowTimeline,
    applyAlternativeShortCourse,
    setTimelineStep,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);

  if (!customTimeline) return null;

  const busType = activeTicket?.busSchedule.busType || 'express';
  const isExpress = busType === 'express';

  const accentText = isExpress ? 'text-express' : 'text-intercity';
  const accentBg = isExpress ? 'bg-express' : 'bg-intercity';
  const accentContainer = isExpress ? 'bg-express-container' : 'bg-intercity-container';
  const accentOnContainer = isExpress ? 'text-express-on-container' : 'text-intercity-on-container';
  const accentBorder = isExpress ? 'border-express-border' : 'border-intercity-border';
  const railPrimaryColor = isExpress ? RAIL_COLORS.active : RAIL_COLORS.boarding;

  const items = customTimeline.items;
  const activityItems = items.filter((it) => !it.isBoardingStep);
  const totalActivityDuration = activityItems.reduce((acc, cur) => acc + cur.durationMinutes, 0);
  const totalTransitDuration = activityItems.reduce((acc, cur) => acc + cur.transitTimeToNext, 0) + 3;
  const totalEstimatedCost = activityItems.reduce((acc, cur) => acc + (cur.costValue || 0), 0);
  const isBufferShort = customTimeline.actualBufferMinutes < 15;

  const boundaryLabel = boundaryLabelOf(customTimeline.filter.movementBoundary);

  const closeSheet = () => {
    setIsAddModalOpen(false);
    setReplacingItemId(null);
  };

  return (
    <div className="p-5 pb-9 space-y-5">
      {/* 1. 상단 AI 추천 요약 & 안전 상태 바 */}
      <section className="bg-white border border-surface-container-high rounded-3xl p-4 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <BusTypeBadge busType={busType} />
            <span className="text-caption font-extrabold bg-primary text-white px-2.5 py-1 rounded-full whitespace-nowrap">
              {customTimeline.busDepartureTime} · {customTimeline.boardingPlatform}
            </span>
            <span className={`text-caption font-bold ${accentContainer} ${accentOnContainer} border ${accentBorder} px-2.5 py-1 rounded-full whitespace-nowrap`}>
              {boundaryLabel}
            </span>
            <span className="text-caption font-bold bg-surface-container text-surface-on-variant px-2.5 py-1 rounded-full whitespace-nowrap">
              {customTimeline.filter.companion} · {customTimeline.filter.experience}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTimelineStep('config')}
            className="text-label-sm font-bold text-surface-subtle hover:text-surface-on-surface flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 조건변경
          </button>
        </div>

        {/* 4개 핵심 수치 한 줄 요약 */}
        <div className="grid grid-cols-4 bg-surface-bright rounded-2xl border border-surface-container divide-x divide-surface-container-high py-2.5 text-center">
          <div>
            <span className="text-caption text-surface-outline font-medium block">시설 이용</span>
            <span className={`text-body font-extrabold ${accentText} mt-0.5 block tabular-nums`}>
              {totalActivityDuration}분
            </span>
          </div>
          <div>
            <span className="text-caption text-surface-outline font-medium block">도보 이동</span>
            <span className="text-body font-extrabold text-warning-on-container mt-0.5 block tabular-nums">
              {totalTransitDuration}분
            </span>
          </div>
          <div>
            <span className="text-caption text-surface-outline font-medium block">탑승 여유</span>
            <span
              className={`text-body font-extrabold mt-0.5 block tabular-nums ${
                isBufferShort ? 'text-error' : accentText
              }`}
            >
              {customTimeline.actualBufferMinutes}분
            </span>
          </div>
          <div>
            <span className="text-caption text-surface-outline font-medium block">예상 비용</span>
            <span className="text-body font-extrabold text-surface-on-surface mt-0.5 block tabular-nums">
              {totalEstimatedCost === 0 ? '무료' : `${totalEstimatedCost.toLocaleString()}원`}
            </span>
          </div>
        </div>

        {/* 시간 부족 경고 또는 안전 안내 배너 */}
        {isBufferShort ? (
          <div className="p-3 bg-error-container border border-error/30 rounded-2xl flex items-center justify-between gap-2">
            <span className="text-label-sm font-extrabold text-error-on-container flex items-center gap-1.5 truncate">
              <AlertTriangle className="w-4 h-4 text-error shrink-0" />
              탑승 여유 부족 ({customTimeline.actualBufferMinutes}분)
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={autoAdjustOverflowTimeline}
                className="px-2.5 py-1.5 bg-error text-white rounded-xl text-caption font-extrabold whitespace-nowrap"
              >
                AI 시간축소
              </button>
              <button
                type="button"
                onClick={applyAlternativeShortCourse}
                className="px-2.5 py-1.5 bg-white text-error-on-container border border-error/40 rounded-xl text-caption font-extrabold whitespace-nowrap"
              >
                내부코스
              </button>
            </div>
          </div>
        ) : (
          <div className={`px-3.5 py-2.5 ${accentContainer} border ${accentBorder} rounded-2xl flex items-center justify-between text-label-sm ${accentOnContainer}`}>
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${accentText} shrink-0`} />
              출발 {customTimeline.actualBufferMinutes}분 전 승차장 도착 보장
            </span>
            <span className={`text-caption font-extrabold ${accentText}`}>동선 최적화됨</span>
          </div>
        )}
      </section>

      {/* 2. 중앙 노선도형 타임라인 & 인라인 편집 */}
      <section className="bg-white rounded-3xl border border-surface-container-high p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-soft">
          <div className="flex items-baseline gap-2">
            <h3 className="text-title-sm font-extrabold text-surface-on-surface tracking-tight">
              이동 순서 노선도
            </h3>
            <span className="text-label-sm text-surface-outline font-semibold">
              순서·시간 편집 가능
            </span>
          </div>
          {activityItems.length < 3 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className={`text-label-sm font-extrabold text-white ${accentBg} px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity whitespace-nowrap`}
            >
              <Plus className="w-3.5 h-3.5" /> 장소 추가
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* 출발점 */}
          <RouteRow
            node="origin"
            nodeY={12}
            nodeColor={railPrimaryColor}
            bottomColor={railPrimaryColor}
            time={customTimeline.currentTime}
            contentClassName="pb-3"
          >
            <div className="flex items-center justify-between text-label">
              <span className="font-extrabold text-surface-on-surface flex items-center gap-1.5">
                <Navigation className={`w-3.5 h-3.5 ${accentText}`} />
                {customTimeline.currentLocation}
              </span>
              <span className="text-caption font-bold text-surface-outline flex items-center gap-1">
                <Footprints className={`w-3.5 h-3.5 ${accentText}`} /> 도보 3분
              </span>
            </div>
          </RouteRow>

          {/* 방문 시설 및 최종 승차장 노드들 */}
          {items.map((item, idx) => {
            const isBoarding = !!item.isBoardingStep;
            const isLast = idx === items.length - 1;
            const canMoveUp = !isBoarding && idx > 0;
            const canMoveDown = !isBoarding && idx < activityItems.length - 1;

            return (
              <RouteRow
                key={item.id}
                node={isBoarding ? 'terminal' : 'stop'}
                nodeY={20}
                nodeColor={railPrimaryColor}
                topColor={railPrimaryColor}
                bottomColor={isLast ? null : railPrimaryColor}
                icon={isBoarding ? <Bus className="w-3 h-3 text-white" /> : undefined}
                time={item.startTime}
                timeSub={`~${item.endTime}`}
                contentClassName="pb-3"
              >
                <div
                  className={`rounded-2xl border p-3.5 ${
                    isBoarding
                      ? `${accentContainer} ${accentBorder}`
                      : 'bg-surface-bright border-surface-container-high'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-caption-sm font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 ${accentBg} text-white`}
                      >
                        {isBoarding ? '탑승' : item.category}
                      </span>
                      <span className="text-body font-extrabold text-surface-on-surface truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-label-sm font-bold text-surface-subtle whitespace-nowrap shrink-0">
                      {isBoarding
                        ? `${item.durationMinutes}분 여유`
                        : `${item.durationMinutes}분 · ${item.cost}`}
                    </span>
                  </div>

                  {!isBoarding && (
                    <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-surface-container-high/80">
                      {/* 체류시간 -5/+5 조절 */}
                      <div className="flex items-center bg-white rounded-xl border border-surface-container-high px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateTimelineItemDuration(item.id, -5)}
                          className={`px-2 py-0.5 text-caption font-extrabold text-surface-on-variant hover:${accentText} flex items-center gap-0.5`}
                        >
                          <Minus className="w-3.5 h-3.5" />5분
                        </button>
                        <span className="px-2 text-label-sm font-black text-primary tabular-nums">
                          {item.durationMinutes}분
                        </span>
                        <button
                          type="button"
                          onClick={() => updateTimelineItemDuration(item.id, 5)}
                          className={`px-2 py-0.5 text-caption font-extrabold text-surface-on-variant hover:${accentText} flex items-center gap-0.5`}
                        >
                          <Plus className="w-3.5 h-3.5" />5분
                        </button>
                      </div>

                      {/* 순서 이동 · 장소 변경 · 삭제 */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={!canMoveUp}
                          aria-label="위로 이동"
                          onClick={() => moveTimelineItem(item.id, 'up')}
                          className={`p-2 rounded-lg border ${
                            canMoveUp
                              ? 'bg-white border-surface-outline-variant text-surface-on-variant'
                              : 'border-surface-soft text-surface-outline-variant cursor-not-allowed'
                          }`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={!canMoveDown}
                          aria-label="아래로 이동"
                          onClick={() => moveTimelineItem(item.id, 'down')}
                          className={`p-2 rounded-lg border ${
                            canMoveDown
                              ? 'bg-white border-surface-outline-variant text-surface-on-variant'
                              : 'border-surface-soft text-surface-outline-variant cursor-not-allowed'
                          }`}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplacingItemId(item.id)}
                          className={`px-2.5 py-2 rounded-lg ${accentContainer} ${accentText} font-extrabold text-caption flex items-center gap-1 whitespace-nowrap`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          변경
                        </button>
                        <button
                          type="button"
                          aria-label="삭제"
                          onClick={() => deleteTimelineItem(item.id)}
                          className="p-2 rounded-lg border border-error-container bg-white text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </RouteRow>
            );
          })}
        </div>
      </section>

      {/* 3. 하단 확정 CTA 버튼 */}
      <button
        type="button"
        onClick={confirmTimeline}
        className={`w-full py-3.5 ${accentBg} text-white rounded-2xl text-body font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2`}
      >
        <CheckCircle2 className="w-4 h-4 text-white/90" />
        <span>타임라인 확정하고 길 안내 시작</span>
      </button>

      {/* 장소 추가 / 변경 바텀시트 */}
      <BottomSheet
        isOpen={isAddModalOpen || !!replacingItemId}
        onClose={closeSheet}
        title={replacingItemId ? '대체할 장소 선택' : '추가할 장소 선택'}
        subtitle="터미널 내부 · 복합공간 · 주변상권"
      >
        <ul className="space-y-2.5">
          {mockTimelinePlaces.map((place) => (
            <li
              key={place.id}
              className="p-4 rounded-2xl bg-surface-bright border border-surface-container flex items-center gap-3"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-caption font-bold ${accentContainer} ${accentOnContainer} px-2 py-0.5 rounded whitespace-nowrap`}>
                    {place.category}
                  </span>
                  <span className="text-caption font-semibold bg-white border border-surface-container-high text-surface-outline px-2 py-0.5 rounded whitespace-nowrap">
                    {boundaryLabelOf(place.boundary)}
                  </span>
                </div>
                <span className="text-body font-extrabold text-surface-on-surface block leading-snug">
                  {place.name}
                </span>
                <span className="text-label-sm text-surface-outline block leading-snug">
                  {place.defaultDurationMinutes}분 · {place.defaultCost}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (replacingItemId) {
                    replaceTimelineItem(replacingItemId, place.id);
                  } else {
                    addTimelineItemFromPlace(place.id);
                  }
                  closeSheet();
                }}
                className={`shrink-0 px-4 py-2.5 ${accentBg} text-white rounded-xl text-label font-bold hover:opacity-90 whitespace-nowrap`}
              >
                {replacingItemId ? '변경' : '추가'}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  );
};
