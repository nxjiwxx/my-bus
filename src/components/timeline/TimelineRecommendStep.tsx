'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockTimelinePlaces } from '@/mock/data';
import { BottomSheet } from '../common/BottomSheet';
import { RouteRow, RAIL_COLORS } from './RouteRail';
import {
  Sparkles,
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
    <div className="flex-1 flex flex-col justify-between p-3.5 overflow-hidden gap-2.5">
      {/* 1. 상단 AI 추천 요약 & 안전 상태 바 */}
      <section className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] border border-[#DDD6FE] rounded-2xl p-3 shadow-2xs space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[10px] font-extrabold bg-[#132B45] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              {customTimeline.busDepartureTime} · {customTimeline.boardingPlatform}
            </span>
            <span className="text-[10px] font-bold bg-white text-[#1E3A8A] border border-[#BFDBFE] px-2 py-0.5 rounded-full whitespace-nowrap">
              {boundaryLabel}
            </span>
            <span className="text-[10px] font-bold bg-white text-[#4F46E5] border border-[#DDD6FE] px-2 py-0.5 rounded-full whitespace-nowrap">
              {customTimeline.filter.companion} · {customTimeline.filter.experience}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTimelineStep('config')}
            className="text-[10px] font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-[#E2E8F0] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3 h-3" /> 조건변경
          </button>
        </div>

        {/* 4개 핵심 수치 한 줄 요약 */}
        <div className="grid grid-cols-4 bg-white/90 rounded-xl border border-[#E9E5FF] divide-x divide-[#EEF2F6] py-1.5 text-center">
          <div>
            <span className="text-[9px] text-[#64748B] block">시설 이용</span>
            <span className="text-xs font-extrabold text-[#2563EB]">{totalActivityDuration}분</span>
          </div>
          <div>
            <span className="text-[9px] text-[#64748B] block">도보 이동</span>
            <span className="text-xs font-extrabold text-[#D97706]">{totalTransitDuration}분</span>
          </div>
          <div>
            <span className="text-[9px] text-[#64748B] block">탑승 여유</span>
            <span
              className={`text-xs font-extrabold ${
                isBufferShort ? 'text-[#DC2626]' : 'text-[#059669]'
              }`}
            >
              {customTimeline.actualBufferMinutes}분
            </span>
          </div>
          <div>
            <span className="text-[9px] text-[#64748B] block">예상 비용</span>
            <span className="text-xs font-extrabold text-[#0F172A]">
              {totalEstimatedCost === 0 ? '무료' : `${totalEstimatedCost.toLocaleString()}원`}
            </span>
          </div>
        </div>

        {/* 시간 부족 경고 또는 안전 안내 한 줄 배너 */}
        {isBufferShort ? (
          <div className="px-2.5 py-1.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold text-[#991B1B] flex items-center gap-1 truncate">
              <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
              탑승 여유 부족 ({customTimeline.actualBufferMinutes}분)
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={autoAdjustOverflowTimeline}
                className="px-2 py-1 bg-[#DC2626] text-white rounded-lg text-[10px] font-extrabold whitespace-nowrap"
              >
                AI 시간축소
              </button>
              <button
                type="button"
                onClick={applyAlternativeShortCourse}
                className="px-2 py-1 bg-white text-[#991B1B] border border-[#FCA5A5] rounded-lg text-[10px] font-extrabold whitespace-nowrap"
              >
                내부코스
              </button>
            </div>
          </div>
        ) : (
          <div className="px-2.5 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center justify-between text-[11px] text-[#065F46]">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              출발 {customTimeline.actualBufferMinutes}분 전 승차장 도착 보장
            </span>
            <span className="text-[10px] font-semibold text-[#059669]">동선 최적화됨</span>
          </div>
        )}
      </section>

      {/* 2. 중앙 노선도형 타임라인 & 인라인 편집 (한눈에 들어오는 컴팩트 노선도) */}
      <section className="flex-1 bg-white rounded-2xl border border-[#EEF2F6] p-3 shadow-2xs flex flex-col justify-between overflow-hidden min-h-0">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#0F172A]">이동 순서 노선도</span>
            <span className="text-[10px] text-[#64748B] font-medium">
              (순서·시간·장소 편집)
            </span>
          </div>
          {activityItems.length < 3 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="text-[11px] font-extrabold text-white bg-[#2563EB] px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-[#1D4ED8] transition-colors whitespace-nowrap"
            >
              <Plus className="w-3 h-3" /> 장소 추가
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-around py-1 overflow-hidden">
          {/* 출발점 */}
          <RouteRow
            node="origin"
            nodeY={10}
            nodeColor={RAIL_COLORS.active}
            bottomColor={RAIL_COLORS.active}
            time={customTimeline.currentTime}
            contentClassName="pb-1"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-[#0F172A] flex items-center gap-1">
                <Navigation className="w-3 h-3 text-[#2563EB]" />
                {customTimeline.currentLocation}
              </span>
              <span className="text-[10px] font-bold text-[#64748B] flex items-center gap-0.5">
                <Footprints className="w-2.5 h-2.5 text-[#2563EB]" /> 도보 3분
              </span>
            </div>
          </RouteRow>

          {/* 방문 시설 및 최종 승차장 노드들 */}
          {items.map((item, idx) => {
            const isBoarding = !!item.isBoardingStep;
            const isLast = idx === items.length - 1;
            const nextIsBoarding = !!items[idx + 1]?.isBoardingStep;
            const segColor = nextIsBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active;
            const topColor = isBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active;
            const canMoveUp = !isBoarding && idx > 0;
            const canMoveDown = !isBoarding && idx < activityItems.length - 1;

            return (
              <RouteRow
                key={item.id}
                node={isBoarding ? 'terminal' : 'stop'}
                nodeY={18}
                nodeColor={isBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active}
                topColor={topColor}
                bottomColor={isLast ? null : segColor}
                icon={isBoarding ? <Bus className="w-2.5 h-2.5 text-white" /> : undefined}
                time={item.startTime}
                timeSub={`~${item.endTime}`}
                contentClassName="pb-1"
              >
                <div
                  className={`rounded-xl border px-3 py-2 ${
                    isBoarding
                      ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${
                          isBoarding ? 'bg-[#059669] text-white' : 'bg-[#2563EB] text-white'
                        }`}
                      >
                        {isBoarding ? '탑승' : item.category}
                      </span>
                      <span className="text-xs font-extrabold text-[#0F172A] truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#475569] whitespace-nowrap shrink-0">
                      {isBoarding
                        ? `${item.durationMinutes}분 여유`
                        : `${item.durationMinutes}분 · ${item.cost}`}
                    </span>
                  </div>

                  {!isBoarding && (
                    <div className="flex items-center justify-between gap-1 mt-1.5 pt-1.5 border-t border-[#E2E8F0]/80">
                      {/* 체류시간 -5/+5 조절 */}
                      <div className="flex items-center bg-white rounded-lg border border-[#E2E8F0] px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateTimelineItemDuration(item.id, -5)}
                          className="px-1.5 text-[10px] font-extrabold text-[#334155] hover:text-[#2563EB] flex items-center"
                        >
                          <Minus className="w-2.5 h-2.5" />5분
                        </button>
                        <span className="px-1.5 text-[10px] font-black text-[#132B45]">
                          {item.durationMinutes}분
                        </span>
                        <button
                          type="button"
                          onClick={() => updateTimelineItemDuration(item.id, 5)}
                          className="px-1.5 text-[10px] font-extrabold text-[#334155] hover:text-[#2563EB] flex items-center"
                        >
                          <Plus className="w-2.5 h-2.5" />5분
                        </button>
                      </div>

                      {/* 순서 이동 · 장소 변경 · 삭제 */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={!canMoveUp}
                          onClick={() => moveTimelineItem(item.id, 'up')}
                          className={`p-1 rounded border ${
                            canMoveUp
                              ? 'bg-white border-[#CBD5E1] text-[#334155]'
                              : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                          }`}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={!canMoveDown}
                          onClick={() => moveTimelineItem(item.id, 'down')}
                          className={`p-1 rounded border ${
                            canMoveDown
                              ? 'bg-white border-[#CBD5E1] text-[#334155]'
                              : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                          }`}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplacingItemId(item.id)}
                          className="px-2 py-1 rounded bg-[#EFF6FF] text-[#2563EB] font-extrabold text-[10px] flex items-center gap-0.5 whitespace-nowrap"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          변경
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTimelineItem(item.id)}
                          className="p-1 rounded border border-[#FEE2E2] bg-white text-[#DC2626]"
                        >
                          <Trash2 className="w-3 h-3" />
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
        className="w-full py-3.5 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-xs font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2 shrink-0"
      >
        <CheckCircle2 className="w-4 h-4 text-[#93C5FD]" />
        <span>타임라인 확정하고 길 안내 시작</span>
      </button>

      {/* 장소 추가 / 변경 바텀시트 */}
      <BottomSheet
        isOpen={isAddModalOpen || !!replacingItemId}
        onClose={closeSheet}
        title={replacingItemId ? '대체할 장소 선택' : '추가할 장소 선택'}
        subtitle="터미널 내부 · 복합공간 · 주변상권"
      >
        <ul className="space-y-2">
          {mockTimelinePlaces.map((place) => (
            <li
              key={place.id}
              className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] flex items-center gap-3"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold bg-[#E1EDFB] text-[#17365D] px-1.5 py-0.5 rounded whitespace-nowrap">
                    {place.category}
                  </span>
                  <span className="text-[10px] font-semibold bg-white border border-[#E2E8F0] text-[#64748B] px-1.5 py-0.5 rounded whitespace-nowrap">
                    {boundaryLabelOf(place.boundary)}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#0F172A] block leading-snug">{place.name}</span>
                <span className="text-[11px] text-[#64748B] block leading-snug">
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
                className="shrink-0 px-3.5 py-2 bg-[#132B45] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] whitespace-nowrap"
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
