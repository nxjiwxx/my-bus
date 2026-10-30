'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
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
  Layers,
  Footprints,
  Navigation,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { BoardingAlertModal } from './BoardingAlertModal';

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

  if (!customTimeline) return null;

  const activeIdx = Math.min(
    customTimeline.currentActivityIndex,
    customTimeline.items.length - 1
  );
  const currentItem = customTimeline.items[activeIdx] || customTimeline.items[0];
  const nextItem = customTimeline.items[activeIdx + 1] || null;
  const boardingItem = customTimeline.items.find((it) => it.isBoardingStep);

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* STEP 05 상단: 현재 활동 · 다음 일정 · 탑승까지 남은 시간 통합 대시보드 */}
      <div className="bg-gradient-to-br from-[#132B45] to-[#1E3A8A] text-white p-5 rounded-3xl shadow-md border border-white/10 space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="text-xs font-extrabold text-[#93C5FD]">
              STEP 05. 실시간 시설 길 안내 진행 중
            </span>
          </div>

          {/* 음성 안내 선택 토글 버튼 */}
          <button
            type="button"
            onClick={toggleVoiceGuide}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
              customTimeline.voiceGuideEnabled
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-white/15 text-white/90 hover:bg-white/25'
            }`}
          >
            {customTimeline.voiceGuideEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span>음성 안내 ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>음성 안내 OFF</span>
              </>
            )}
          </button>
        </div>

        {/* 현재 진행 중인 활동 */}
        <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold bg-[#2563EB] text-white px-2 py-0.5 rounded-full">
              현재 활동 ({activeIdx + 1}/{customTimeline.items.length})
            </span>
            <span className="text-xs font-bold text-[#93C5FD]">
              {currentItem.startTime} ~ {currentItem.endTime} ({currentItem.durationMinutes}분)
            </span>
          </div>
          <h3 className="text-base font-black tracking-tight text-white">
            {currentItem.title}
          </h3>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#93C5FD] shrink-0" />
            <span>
              {currentItem.location} ({currentItem.guideFloor})
            </span>
          </p>
        </div>

        {/* 다음 일정 & 버스 탑승까지 남은 시간 2열 카드 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-[10px] text-white/70 block mb-0.5">다음 이동 일정</span>
            <strong className="text-xs font-extrabold text-white truncate block">
              {nextItem ? nextItem.title : '버스 탑승 대기'}
            </strong>
            <span className="text-[10px] text-[#93C5FD] font-semibold block mt-0.5">
              {nextItem
                ? `${nextItem.startTime} 이동 (도보 ${currentItem.transitTimeToNext}분)`
                : `${customTimeline.boardingPlatform} 탑승 완료`}
            </span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-right">
            <span className="text-[10px] text-white/70 block mb-0.5">
              버스 출발 ({customTimeline.busDepartureTime}) 까지
            </span>
            <strong className="text-sm font-black text-[#6EE7B7] block">
              남은 시간 {customTimeline.totalAvailableMinutes}분
            </strong>
            <span className="text-[10px] text-white/80 font-semibold block mt-0.5">
              {boardingItem?.startTime || '17:45'} {customTimeline.boardingPlatform} 이동
            </span>
          </div>
        </div>

        {/* 음성 안내 활성화 시 실시간 음성 브리핑 바 */}
        {customTimeline.voiceGuideEnabled && (
          <div className="p-2.5 rounded-xl bg-[#065F46]/80 border border-[#34D399]/40 flex items-center justify-between gap-2 text-[11px] text-[#ECFDF5]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Volume2 className="w-4 h-4 text-[#34D399] shrink-0" />
              <span className="truncate">
                “{currentItem.title} 경로: {currentItem.routeInstruction}”
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                speakRouteGuide(`${currentItem.title} 이동 경로 안내입니다. ${currentItem.routeInstruction}`)
              }
              className="shrink-0 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-bold"
            >
              다시 듣기
            </button>
          </div>
        )}
      </div>

      {/* STEP 06: AI 실시간 일정 재조정 알림 배너 (지연 발생 또는 대체 코스 적용 시) */}
      {customTimeline.isDelayedAdjusted && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#FCD34D] text-[#78350F] shadow-xs space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#B45309]">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>STEP 06. AI 실시간 일정 재조정 적용됨</span>
            </div>
            <button
              type="button"
              onClick={resetTimelineToInitial}
              className="text-[10px] font-bold text-[#92400E] underline"
            >
              원래대로
            </button>
          </div>
          <p className="text-xs text-[#92400E] leading-relaxed">
            {customTimeline.delayAdjustmentReason ||
              `시설 이용 지연이 반영되어 이후 활동 시간이 자동 조정되었습니다. 버스 출발 ${customTimeline.actualBufferMinutes}분 전(${customTimeline.boardingPlatform}) 도착은 안전하게 유지됩니다.`}
          </p>
        </div>
      )}

      {/* STEP 05 구체적인 길 안내 흐름 & 층별 이동 동선 다이어그램 */}
      <div className="bg-white rounded-3xl p-4 border border-[#EEF2F6] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#132B45]" />
            <h4 className="font-extrabold text-xs text-[#0F172A]">
              구간별 구체적 길 안내 흐름
            </h4>
          </div>
          <span className="text-[10px] bg-[#E1EDFB] text-[#17365D] font-bold px-2 py-0.5 rounded-full">
            현위치: {customTimeline.currentLocation}
          </span>
        </div>

        {/* 타임라인 구간 선택 탭 (클릭 시 해당 구간 길 안내 확인 및 현재 단계 전환) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {customTimeline.items.map((item, idx) => {
            const isSelected = activeIdx === idx;
            const isDone = idx < activeIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentActivityIndex(idx)}
                className={`flex-1 min-w-[92px] py-2 px-2.5 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-[#132B45] text-white border-[#132B45] shadow-xs'
                    : isDone
                    ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-bold opacity-80">
                  <span>{item.isBoardingStep ? 'FINAL' : `COURSE 0${idx + 1}`}</span>
                  <span>{item.startTime}</span>
                </div>
                <div className="text-[11px] font-extrabold truncate mt-0.5">
                  {item.title.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택된 구간의 상세 경로 및 단계별(Step-by-Step) 도보 가이드 */}
        {currentItem && (
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                  {currentItem.guideFloor} · {currentItem.category}
                </span>
                <h5 className="text-sm font-black text-[#0F172A] mt-1">{currentItem.title}</h5>
                <span className="text-[11px] text-[#64748B] block">{currentItem.location}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748B] block">예상 체류</span>
                <strong className="text-xs font-black text-[#132B45]">
                  {currentItem.startTime} ~ {currentItem.endTime}
                </strong>
              </div>
            </div>

            {/* 핵심 한 줄 경로 */}
            <div className="p-3 bg-white rounded-xl border border-[#CBD5E1]/70 space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#132B45]">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
                  핵심 이동 경로
                </span>
                <span className="text-[11px] text-[#059669]">
                  도보 약 {currentItem.transitTimeToNext || 4}분
                </span>
              </div>
              <p className="text-xs text-[#334155] font-medium leading-relaxed">
                {currentItem.routeInstruction}
              </p>

              {/* 세부 단계별 동선 흐름 */}
              {currentItem.routeSteps && currentItem.routeSteps.length > 0 && (
                <div className="pt-2 border-t border-[#F1F5F9] space-y-1.5">
                  {currentItem.routeSteps.map((stepText, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-[11px] text-[#475569]">
                      <span className="w-4 h-4 rounded-full bg-[#E1EDFB] text-[#17365D] font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="leading-snug">{stepText}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 다음 일정으로 진행 버튼 */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={advanceTimelineActivity}
                className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-extrabold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {nextItem
                    ? `현재 활동 완료 → 다음 '${nextItem.title.split(' ')[0]}' 길 안내`
                    : '승차장 도착 확인 및 탑승 QR 보기'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STEP 06: 일정 조정 및 승차장 이동 안내 (상황 대응 컨트롤러) */}
      <div className="bg-white rounded-3xl p-4 border border-[#EEF2F6] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-[#059669] block">
              STEP 06. 일정 조정 및 승차장 이동 안내
            </span>
            <h4 className="font-extrabold text-xs text-[#0F172A]">
              현장 상황 변화에 따른 AI 실시간 일정 재조정
            </h4>
          </div>
          <span className="text-[10px] bg-[#F1F5F9] text-[#64748B] font-bold px-2 py-0.5 rounded-full">
            실시간 대응
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 1. 시설 이용 예상보다 길어짐 (+10분 지연) */}
          <button
            type="button"
            onClick={simulateActivityDelay}
            className="p-3 rounded-2xl bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] text-left hover:bg-[#FEF3C7] transition-colors active:scale-98"
          >
            <div className="flex items-center gap-1 font-extrabold text-xs">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>시설 이용 +10분 지연</span>
            </div>
            <span className="text-[10px] text-[#B45309] block mt-0.5 leading-tight">
              남은 시간 기준 이후 활동 자동 단축
            </span>
          </button>

          {/* 2. 승차장 이동 시점 알림 및 경로 안내 */}
          <button
            type="button"
            onClick={triggerBoardingAlert}
            className="p-3 rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-left hover:bg-[#D1FAE5] transition-colors active:scale-98"
          >
            <div className="flex items-center gap-1 font-extrabold text-xs">
              <Bell className="w-3.5 h-3.5 text-[#059669]" />
              <span>승차장 이동 시점 알림</span>
            </div>
            <span className="text-[10px] text-[#047857] block mt-0.5 leading-tight">
              활동 마무리 알림 & {customTimeline.boardingPlatform} 경로 안내
            </span>
          </button>
        </div>

        {/* 3. 현장 일정 즉시 변경 / 대체 코스 전환 */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setTimelineStep('recommendation')}
            className="flex-1 py-2.5 bg-[#F1F5F9] text-[#334155] rounded-xl text-xs font-bold hover:bg-[#E2E8F0] transition-colors flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>일정 직접 편집·변경</span>
          </button>
          <button
            type="button"
            onClick={applyAlternativeShortCourse}
            className="flex-1 py-2.5 bg-[#EFF6FF] text-[#1D4ED8] rounded-xl text-xs font-bold hover:bg-[#DBEAFE] transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>터미널 내부 코스로 축소</span>
          </button>
        </div>
      </div>

      {/* STEP 06 승차장 이동 긴급 알림 및 최단 경로 모달 */}
      <BoardingAlertModal
        isOpen={isBoardingAlertOpen}
        onClose={dismissBoardingAlert}
        timeline={customTimeline}
      />
    </div>
  );
};
