'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BoardingAlertModal } from './BoardingAlertModal';
import { RouteRow, WalkSegment, RAIL_COLORS } from './RouteRail';
import { SectionCard } from './TimelineSection';
import {
  MapPin,
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
  ChevronRight,
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
  } = useApp();

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const currentIdxForReset = customTimeline?.currentActivityIndex;

  // 현재 구간이 바뀌면 펼침 상태를 초기화해 현재 구간을 자동으로 보여줌
  useEffect(() => {
    setOpenIdx(null);
  }, [currentIdxForReset]);

  if (!customTimeline) return null;

  const items = customTimeline.items;
  const activeIdx = Math.min(customTimeline.currentActivityIndex, items.length - 1);
  const currentItem = items[activeIdx] || items[0];
  const nextItem = items[activeIdx + 1] || null;
  const boardingItem = items.find((it) => it.isBoardingStep);
  const shownIdx = openIdx ?? activeIdx;

  // 노선선 색: 이미 지나온 구간은 회색, 남은 구간은 파랑, 승차장 구간은 초록
  const segColor = (toIdx: number) =>
    toIdx <= activeIdx
      ? RAIL_COLORS.done
      : items[toIdx]?.isBoardingStep
      ? RAIL_COLORS.boarding
      : RAIL_COLORS.active;

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* STEP 05 · 실시간 현황 (세로 정보 리스트) */}
      <section className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white rounded-3xl shadow-md border border-white/10 overflow-hidden">
        <header className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold tracking-wide text-[#93C5FD] leading-none mb-1">
                STEP 05 · 실시간 길 안내
              </span>
              <h4 className="text-sm font-extrabold tracking-tight">지금 진행 중</h4>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleVoiceGuide}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all ${
              customTimeline.voiceGuideEnabled
                ? 'bg-[#10B981] text-white shadow-sm'
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
        </header>

        <ul className="border-t border-white/10 divide-y divide-white/10">
          <li className="px-5 py-3.5 flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#93C5FD] block">현재 활동</span>
              <span className="text-sm font-black tracking-tight block leading-snug">{currentItem.title}</span>
              <span className="text-[11px] text-white/70 block mt-0.5">
                {currentItem.startTime} ~ {currentItem.endTime} · {currentItem.guideFloor}
              </span>
            </div>
          </li>
          <li className="px-5 py-3.5 flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#93C5FD] block">다음 일정</span>
              <span className="text-sm font-extrabold block leading-snug">
                {nextItem ? nextItem.title : '버스 탑승 대기'}
              </span>
              <span className="text-[11px] text-white/70 block mt-0.5">
                {nextItem
                  ? `${nextItem.startTime} 시작 · 도보 ${currentItem.transitTimeToNext}분 이동`
                  : `${customTimeline.boardingPlatform}에서 탑승`}
              </span>
            </div>
          </li>
          <li className="px-5 py-3.5 flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#059669] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#6EE7B7] block">
                버스 출발 {customTimeline.busDepartureTime}까지
              </span>
              <span className="text-sm font-black block leading-snug">
                남은 시간 {customTimeline.totalAvailableMinutes}분
              </span>
              <span className="text-[11px] text-white/70 block mt-0.5">
                {boardingItem?.startTime || '17:44'}에 {customTimeline.boardingPlatform}으로 이동 시작
              </span>
            </div>
          </li>
        </ul>

        {customTimeline.voiceGuideEnabled && (
          <div className="px-5 py-3 bg-[#065F46]/80 border-t border-[#34D399]/30 flex items-center justify-between gap-3 text-[11px] text-[#ECFDF5]">
            <span className="flex items-start gap-2 min-w-0 leading-snug">
              <Volume2 className="w-4 h-4 text-[#34D399] shrink-0 mt-px" />
              <span>{currentItem.routeInstruction}</span>
            </span>
            <button
              type="button"
              onClick={() => speakRouteGuide(`${currentItem.title} 이동 경로 안내입니다. ${currentItem.routeInstruction}`)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-bold whitespace-nowrap"
            >
              다시 듣기
            </button>
          </div>
        )}
      </section>

      {/* STEP 06 · 재조정 알림 */}
      {customTimeline.isDelayedAdjusted && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#FCD34D] shadow-xs space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-extrabold text-xs text-[#B45309]">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              STEP 06 · AI가 일정을 조정했어요
            </span>
            <button
              type="button"
              onClick={resetTimelineToInitial}
              className="text-[11px] font-bold text-[#92400E] underline whitespace-nowrap"
            >
              원래대로
            </button>
          </div>
          <p className="text-xs text-[#92400E] leading-relaxed">
            {customTimeline.delayAdjustmentReason ||
              `이후 활동 시간을 조정해 버스 출발 ${customTimeline.actualBufferMinutes}분 전에 ${customTimeline.boardingPlatform}에 도착하도록 맞췄어요.`}
          </p>
        </div>
      )}

      {/* 노선도형 길 안내 */}
      <SectionCard
        eyebrow="ROUTE MAP"
        title="시설 길 안내 노선도"
        right={
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-[#2563EB] px-2.5 py-1 rounded-full whitespace-nowrap">
            <Bus className="w-3 h-3" /> {customTimeline.boardingPlatform}행
          </span>
        }
      >
        <p className="text-[11px] text-[#64748B] leading-relaxed mb-4">
          정류장을 누르면 그곳까지의 세부 경로를 볼 수 있어요.
        </p>

        <div className="-mx-1">
          {/* 출발 */}
          <RouteRow
            node="origin"
            nodeY={14}
            nodeColor={RAIL_COLORS.done}
            bottomColor={segColor(0)}
            time={customTimeline.currentTime}
            timeSub="출발"
            contentClassName="pb-1"
          >
            <span className="text-xs font-bold text-[#64748B]">{customTimeline.currentLocation}</span>
          </RouteRow>
          <WalkSegment minutes={3} topColor={segColor(0)} />

          {items.map((item, idx) => {
            const isDone = idx < activeIdx;
            const isCurrent = idx === activeIdx;
            const isBoarding = !!item.isBoardingStep;
            const isOpen = shownIdx === idx;
            const isLast = idx === items.length - 1;
            const kind = isCurrent ? 'current' : isDone ? 'done' : isBoarding ? 'terminal' : 'stop';
            const nodeColor = isDone ? RAIL_COLORS.done : isBoarding ? RAIL_COLORS.boarding : RAIL_COLORS.active;

            return (
              <React.Fragment key={item.id}>
                <RouteRow
                  node={kind}
                  nodeY={isCurrent ? 26 : 24}
                  nodeColor={isCurrent && isBoarding ? RAIL_COLORS.boarding : nodeColor}
                  topColor={segColor(idx)}
                  bottomColor={isLast ? null : segColor(idx + 1)}
                  icon={
                    isCurrent ? (
                      isBoarding ? <Bus className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />
                    ) : isDone ? (
                      <Check className="w-2.5 h-2.5 text-white" />
                    ) : isBoarding ? (
                      <Flag className="w-3 h-3 text-white" />
                    ) : undefined
                  }
                  time={item.startTime}
                  timeSub={`~${item.endTime}`}
                  contentClassName="pb-0"
                >
                  <div
                    className={`rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#EFF6FF] border-[#93C5FD] shadow-sm'
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
                      className="w-full p-3.5 text-left flex items-start justify-between gap-2"
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 flex-wrap mb-1">
                          {isCurrent && (
                            <span className="text-[10px] font-extrabold text-white bg-[#2563EB] px-2 py-0.5 rounded-full whitespace-nowrap">
                              지금 여기
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[10px] font-bold text-[#64748B] bg-[#E2E8F0] px-2 py-0.5 rounded-full whitespace-nowrap">
                              완료
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-[#64748B] whitespace-nowrap">
                            {isBoarding ? '탑승' : item.category}
                          </span>
                        </span>
                        <span
                          className={`block text-sm font-extrabold leading-snug ${
                            isDone ? 'text-[#94A3B8]' : 'text-[#0F172A]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-[#64748B] mt-0.5 leading-snug">{item.guideFloor}</span>
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-[#94A3B8] shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 space-y-3 animate-in fade-in duration-150">
                        <div className="pt-3 border-t border-[#DBEAFE]/70">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-extrabold text-[#0F172A] flex items-center gap-1">
                              <Footprints className="w-3.5 h-3.5 text-[#2563EB]" /> 이동 경로
                            </span>
                            <span className="text-[10px] font-bold text-[#059669] whitespace-nowrap">
                              도보 약 {idx === 0 ? 3 : items[idx - 1]?.transitTimeToNext || 4}분
                            </span>
                          </div>
                          <p className="text-[11px] text-[#334155] leading-relaxed mb-3">{item.routeInstruction}</p>

                          {item.routeSteps && item.routeSteps.length > 0 && (
                            <ol>
                              {item.routeSteps.map((stepText, sIdx) => {
                                const last = sIdx === (item.routeSteps?.length ?? 0) - 1;
                                return (
                                  <li key={sIdx} className="flex gap-2.5">
                                    <div className="flex flex-col items-center">
                                      <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                        {sIdx + 1}
                                      </span>
                                      {!last && <span className="flex-1 border-l-2 border-dashed border-[#BFDBFE] my-1" />}
                                    </div>
                                    <p className={`text-[11px] text-[#475569] leading-relaxed pt-0.5 ${last ? '' : 'pb-3'}`}>
                                      {stepText}
                                    </p>
                                  </li>
                                );
                              })}
                            </ol>
                          )}
                        </div>

                        {isCurrent ? (
                          <button
                            type="button"
                            onClick={advanceTimelineActivity}
                            className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-extrabold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {nextItem ? '활동 완료 · 다음 장소 안내' : '승차장 도착 완료'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          !isDone && (
                            <button
                              type="button"
                              onClick={() => setCurrentActivityIndex(idx)}
                              className="w-full py-2.5 bg-white border border-[#CBD5E1] text-[#132B45] rounded-xl text-xs font-extrabold hover:bg-[#F8FAFC] transition-colors"
                            >
                              이 장소부터 안내 받기
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </RouteRow>

                {!isLast && <WalkSegment minutes={item.transitTimeToNext} topColor={segColor(idx + 1)} />}
              </React.Fragment>
            );
          })}
        </div>
      </SectionCard>

      {/* STEP 06 · 일정 조정 및 승차장 이동 */}
      <SectionCard eyebrow="STEP 06 · 현장 대응" title="일정 조정 · 승차장 이동">
        <ul className="divide-y divide-[#F1F5F9] -my-1">
          {[
            {
              icon: Clock,
              tone: 'bg-[#FEF3C7] text-[#D97706]',
              title: '시설 이용이 10분 길어졌어요',
              desc: '남은 시간에 맞춰 이후 활동을 자동으로 줄여요.',
              onClick: simulateActivityDelay,
            },
            {
              icon: Bell,
              tone: 'bg-[#D1FAE5] text-[#059669]',
              title: '승차장 이동 시점 알림',
              desc: `활동을 마무리하고 ${customTimeline.boardingPlatform}으로 가는 경로를 안내해요.`,
              onClick: triggerBoardingAlert,
            },
            {
              icon: RefreshCw,
              tone: 'bg-[#DBEAFE] text-[#2563EB]',
              title: '터미널 내부 코스로 줄이기',
              desc: '승차장과 가까운 대체 일정으로 바꿔요.',
              onClick: applyAlternativeShortCourse,
            },
            {
              icon: Edit3,
              tone: 'bg-[#F1F5F9] text-[#475569]',
              title: '일정 직접 편집',
              desc: '장소를 추가·삭제하고 순서를 바꿔요.',
              onClick: () => setTimelineStep('recommendation'),
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.title}>
                <button
                  type="button"
                  onClick={action.onClick}
                  className="w-full py-3.5 flex items-center gap-3 text-left hover:bg-[#F8FAFC] transition-colors active:scale-99"
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${action.tone}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="text-xs font-extrabold text-[#0F172A] block leading-snug">{action.title}</span>
                    <span className="text-[11px] text-[#64748B] block mt-0.5 leading-snug">{action.desc}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <button
        type="button"
        onClick={() => setTimelineStep('config')}
        className="w-full py-3 bg-white border border-[#CBD5E1] text-[#64748B] rounded-2xl text-xs font-bold hover:bg-[#F8FAFC] transition-colors"
      >
        새 조건으로 다시 만들기
      </button>

      <BoardingAlertModal isOpen={isBoardingAlertOpen} onClose={dismissBoardingAlert} timeline={customTimeline} />
    </div>
  );
};
