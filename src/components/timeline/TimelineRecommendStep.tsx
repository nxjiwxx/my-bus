'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockTimelinePlaces } from '@/mock/data';
import { BottomSheet } from '../common/BottomSheet';
import { RouteRow, WalkSegment, RAIL_COLORS } from './RouteRail';
import { SectionCard, KeyValueRow } from './TimelineSection';
import {
  Sparkles,
  MapPin,
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

  const boundaryLabel =
    customTimeline.filter.movementBoundary === 'terminal_inside'
      ? '터미널 내부'
      : customTimeline.filter.movementBoundary === 'complex_space'
      ? '복합공간'
      : '주변상권';

  const closeSheet = () => {
    setIsAddModalOpen(false);
    setReplacingItemId(null);
  };

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* STEP 03 · AI 분석 요약 */}
      <section className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] border border-[#DDD6FE] rounded-3xl shadow-xs overflow-hidden">
        <header className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[10px] font-extrabold tracking-wide text-[#4F46E5] leading-none mb-1.5">
              STEP 03 · AI 추천 완료
            </span>
            <h4 className="text-sm font-extrabold text-[#0F172A] tracking-tight">내 맞춤형 타임라인</h4>
          </div>
          <button
            type="button"
            onClick={() => setTimelineStep('config')}
            className="text-[11px] font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-[#E2E8F0] whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" /> 조건 변경
          </button>
        </header>

        <div className="px-5 pb-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-bold bg-[#132B45] text-white px-2.5 py-1 rounded-full whitespace-nowrap">
              {customTimeline.busDepartureTime} · {customTimeline.boardingPlatform}
            </span>
            <span className="text-[10px] font-bold bg-white text-[#1E3A8A] border border-[#BFDBFE] px-2.5 py-1 rounded-full whitespace-nowrap">
              {boundaryLabel}
            </span>
            <span className="text-[10px] font-bold bg-white text-[#4F46E5] border border-[#DDD6FE] px-2.5 py-1 rounded-full whitespace-nowrap">
              {customTimeline.filter.companion} · {customTimeline.filter.experience}
            </span>
            {customTimeline.filter.useBudgetFilter && (
              <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2.5 py-1 rounded-full whitespace-nowrap">
                예산 {customTimeline.filter.budget}
              </span>
            )}
          </div>

          <p className="text-xs text-[#334155] leading-relaxed">
            {customTimeline.aiAnalysisSummary ||
              `버스 출발(${customTimeline.busDepartureTime})과 ${customTimeline.boardingPlatform} 이동 동선을 고려해 불필요한 이동을 줄인 타임라인이에요.`}
          </p>
        </div>

        {/* 세로 요약 리스트 */}
        <div className="bg-white/90 border-t border-[#E9E5FF] px-5 divide-y divide-[#F1F5F9]">
          <KeyValueRow dot="#2563EB" label="시설 이용" value={`${totalActivityDuration}분`} />
          <KeyValueRow dot="#F59E0B" label="도보 이동" value={`${totalTransitDuration}분`} />
          <KeyValueRow
            dot="#059669"
            label="탑승 준비 여유"
            value={`${customTimeline.actualBufferMinutes}분`}
            valueClassName={isBufferShort ? 'text-[#DC2626]' : 'text-[#059669]'}
          />
          <KeyValueRow
            label="예상 비용"
            value={totalEstimatedCost === 0 ? '무료' : `${totalEstimatedCost.toLocaleString()}원`}
          />
        </div>
      </section>

      {/* STEP 04 · 시간 부족 경고 / 안전 안내 */}
      {isBufferShort ? (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-3xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#991B1B] block">
                탑승 준비시간이 부족해요 ({customTimeline.actualBufferMinutes}분 / 권장 15분)
              </span>
              <span className="text-[11px] text-[#7F1D1D] leading-relaxed block">
                AI가 활동 시간을 줄이거나 터미널 내부 대체 일정으로 바꿔 드릴 수 있어요.
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={autoAdjustOverflowTimeline}
              className="w-full py-2.5 bg-[#DC2626] text-white rounded-xl text-xs font-extrabold hover:bg-[#B91C1C] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI 활동시간 자동 축소
            </button>
            <button
              type="button"
              onClick={applyAlternativeShortCourse}
              className="w-full py-2.5 bg-white text-[#991B1B] border border-[#FCA5A5] rounded-xl text-xs font-extrabold hover:bg-[#FEE2E2] transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              터미널 내부 대체 일정으로 변경
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl flex items-center gap-2.5 text-xs text-[#065F46]">
          <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
          <span className="font-bold leading-snug">
            출발 {customTimeline.actualBufferMinutes}분 전 승차장 도착이 보장돼요
          </span>
        </div>
      )}

      {/* STEP 04 · 노선도형 타임라인 + 편집 */}
      <SectionCard
        eyebrow="STEP 04 · 편집"
        title="이동 순서"
        right={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-extrabold text-white bg-[#2563EB] px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-[#1D4ED8] transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> 장소 추가
          </button>
        }
      >
        <p className="text-[11px] text-[#64748B] leading-relaxed mb-4">
          순서 변경·시간 조절·장소 변경·삭제를 하면 이동 시간과 도착 시각이 자동으로 다시 계산돼요.
        </p>

        <div className="-mx-1">
          {/* 출발점 */}
          <RouteRow
            node="origin"
            nodeY={14}
            nodeColor={RAIL_COLORS.active}
            bottomColor={RAIL_COLORS.active}
            time={customTimeline.currentTime}
            timeSub="현재"
            contentClassName="pb-1"
          >
            <div className="flex items-center gap-1.5 text-xs">
              <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-extrabold text-[#0F172A]">{customTimeline.currentLocation}</span>
            </div>
          </RouteRow>
          <WalkSegment minutes={3} topColor={RAIL_COLORS.active} />

          {items.map((item, idx) => {
            const isBoarding = !!item.isBoardingStep;
            const isLast = idx === items.length - 1;
            const nextIsBoarding = !!items[idx + 1]?.isBoardingStep;
            const segColor = nextIsBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active;
            const topColor = isBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active;
            const canMoveUp = !isBoarding && idx > 0;
            const canMoveDown = !isBoarding && idx < activityItems.length - 1;

            return (
              <React.Fragment key={item.id}>
                <RouteRow
                  node={isBoarding ? 'terminal' : 'stop'}
                  nodeY={24}
                  nodeColor={isBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active}
                  topColor={topColor}
                  bottomColor={isLast ? null : segColor}
                  icon={isBoarding ? <Bus className="w-3 h-3 text-white" /> : undefined}
                  time={item.startTime}
                  timeSub={`~${item.endTime}`}
                  contentClassName="pb-0"
                >
                  <div
                    className={`rounded-2xl border p-3.5 ${
                      isBoarding ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-white border-[#E2E8F0] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap mb-1.5 ${
                            isBoarding ? 'bg-[#059669] text-white' : 'bg-[#E1EDFB] text-[#17365D]'
                          }`}
                        >
                          {isBoarding ? '최종 · 탑승' : item.category}
                        </span>
                        <h5 className="text-sm font-extrabold text-[#0F172A] leading-snug">{item.title}</h5>
                        <p className="text-[11px] text-[#64748B] flex items-start gap-1 mt-1 leading-snug">
                          <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0 mt-0.5" />
                          <span>{item.location}</span>
                        </p>
                      </div>

                      {!isBoarding && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={!canMoveUp}
                              onClick={() => moveTimelineItem(item.id, 'up')}
                              aria-label="순서 위로"
                              className={`p-1.5 rounded-lg border ${
                                canMoveUp ? 'border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]' : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                              }`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={!canMoveDown}
                              onClick={() => moveTimelineItem(item.id, 'down')}
                              aria-label="순서 아래로"
                              className={`p-1.5 rounded-lg border ${
                                canMoveDown ? 'border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]' : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                              }`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-[#475569] leading-relaxed mt-2.5 pt-2.5 border-t border-[#F1F5F9]">
                      {item.description}
                    </p>

                    <div className="mt-2.5 pt-2.5 border-t border-[#F1F5F9] space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">
                          {isBoarding ? '버스 출발까지' : '이용 시간 · 비용'}
                        </span>
                        <span className="font-extrabold text-[#0F172A] text-right">
                          {isBoarding ? `${item.durationMinutes}분 여유` : `${item.durationMinutes}분 · ${item.cost}`}
                        </span>
                      </div>

                      {!isBoarding && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center bg-[#F1F5F9] rounded-lg p-0.5 border border-[#E2E8F0]">
                            <button
                              type="button"
                              onClick={() => updateTimelineItemDuration(item.id, -5)}
                              aria-label="5분 단축"
                              className="px-2 py-1 text-[#334155] hover:bg-white rounded font-bold text-[10px] flex items-center whitespace-nowrap"
                            >
                              <Minus className="w-2.5 h-2.5 mr-0.5" />5분
                            </button>
                            <span className="px-2 text-[11px] font-extrabold text-[#132B45] whitespace-nowrap">
                              {item.durationMinutes}분
                            </span>
                            <button
                              type="button"
                              onClick={() => updateTimelineItemDuration(item.id, 5)}
                              aria-label="5분 연장"
                              className="px-2 py-1 text-[#334155] hover:bg-white rounded font-bold text-[10px] flex items-center whitespace-nowrap"
                            >
                              <Plus className="w-2.5 h-2.5 mr-0.5" />5분
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setReplacingItemId(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] hover:bg-[#DBEAFE] flex items-center gap-1 whitespace-nowrap"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              변경
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTimelineItem(item.id)}
                              aria-label="일정 삭제"
                              className="p-1.5 rounded-lg border border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </RouteRow>

                {!isLast && (
                  <WalkSegment
                    minutes={item.transitTimeToNext}
                    topColor={segColor}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </SectionCard>

      {/* STEP 04 · 확정 */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={confirmTimeline}
          className="w-full py-4 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-sm font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#93C5FD]" />
          <span>타임라인 확정하고 길 안내 시작</span>
        </button>
        <p className="text-[11px] text-center text-[#94A3B8] leading-relaxed">
          확정하면 홈 화면의 AI 비서가 실시간으로 안내해 드려요.
        </p>
      </div>

      {/* 장소 추가 / 변경 바텀시트 */}
      <BottomSheet
        isOpen={isAddModalOpen || !!replacingItemId}
        onClose={closeSheet}
        title={replacingItemId ? '대체할 장소 선택' : '추가할 장소 선택'}
        subtitle="천안터미널 · 신세계 복합공간 · 주변상권"
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
