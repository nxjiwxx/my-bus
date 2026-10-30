'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockTimelinePlaces } from '@/mock/data';
import {
  Sparkles,
  MapPin,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Footprints,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Minus,
  ShieldCheck,
} from 'lucide-react';

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

  const activityItems = customTimeline.items.filter((it) => !it.isBoardingStep);
  const totalActivityDuration = activityItems.reduce((acc, cur) => acc + cur.durationMinutes, 0);
  const totalTransitDuration = activityItems.reduce((acc, cur) => acc + cur.transitTimeToNext, 0) + 3;
  const totalEstimatedCost = activityItems.reduce((acc, cur) => acc + (cur.costValue || 0), 0);

  // 탑승 준비 여유시간이 권장 15분 미만일 때 경고 및 AI 축소/대체 일정 제안
  const isBufferShort = customTimeline.actualBufferMinutes < 15;

  const boundaryLabel =
    customTimeline.filter.movementBoundary === 'terminal_inside'
      ? '터미널 내부'
      : customTimeline.filter.movementBoundary === 'complex_space'
      ? '복합공간(신세계·교보)'
      : '주변상권(광장·신부동)';

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* STEP 03: AI 맞춤 분석 및 타임라인 요약 헤더 */}
      <div className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] border border-[#DDD6FE] p-4 rounded-3xl shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-[#6366F1] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-extrabold text-[#4F46E5]">
              STEP 03. AI 맞춤형 타임라인 추천
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTimelineStep('config')}
            className="text-[11px] font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-lg border border-[#E2E8F0]"
          >
            <RotateCcw className="w-3 h-3" /> 조건 재설정
          </button>
        </div>

        {/* 분석된 사용자 조건 태그 */}
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] font-bold bg-[#132B45] text-white px-2 py-0.5 rounded-full">
            {customTimeline.busDepartureTime} 버스 ({customTimeline.boardingPlatform})
          </span>
          <span className="text-[10px] font-bold bg-white text-[#1E3A8A] border border-[#BFDBFE] px-2 py-0.5 rounded-full">
            {boundaryLabel}
          </span>
          <span className="text-[10px] font-bold bg-white text-[#4F46E5] border border-[#DDD6FE] px-2 py-0.5 rounded-full">
            {customTimeline.filter.companion} · {customTimeline.filter.experience}
          </span>
          {customTimeline.filter.useBudgetFilter && (
            <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
              예산: {customTimeline.filter.budget}
            </span>
          )}
        </div>

        <p className="text-xs text-[#334155] leading-relaxed font-medium">
          {customTimeline.aiAnalysisSummary ||
            `버스 출발 시각(${customTimeline.busDepartureTime})과 ${customTimeline.boardingPlatform} 이동 동선을 고려해 불필요한 이동을 줄인 최적 타임라인입니다.`}
        </p>

        {/* 전체 소요시간 · 이동시간 · 탑승 준비시간 요약 바 */}
        <div className="p-2.5 bg-white/90 rounded-2xl border border-[#E2E8F0] grid grid-cols-4 gap-1 text-center text-[10px]">
          <div>
            <span className="text-[#64748B] block">총 활동시간</span>
            <strong className="text-xs font-black text-[#0F172A]">{totalActivityDuration}분</strong>
          </div>
          <div>
            <span className="text-[#64748B] block">총 도보이동</span>
            <strong className="text-xs font-black text-[#2563EB]">{totalTransitDuration}분</strong>
          </div>
          <div>
            <span className="text-[#64748B] block">탑승준비 여유</span>
            <strong
              className={`text-xs font-black ${
                isBufferShort ? 'text-[#DC2626]' : 'text-[#059669]'
              }`}
            >
              {customTimeline.actualBufferMinutes}분
            </strong>
          </div>
          <div>
            <span className="text-[#64748B] block">예상 총비용</span>
            <strong className="text-xs font-black text-[#0F172A]">
              {totalEstimatedCost === 0 ? '무료' : `${totalEstimatedCost.toLocaleString()}원`}
            </strong>
          </div>
        </div>

        {/* STEP 04: 탑승 준비시간 부족 시 AI 활동 축소 및 대체 일정 안내 */}
        {isBufferShort ? (
          <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-start gap-2 text-xs text-[#991B1B]">
              <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block">
                  탑승 준비시간이 부족합니다! (현재 여유 {customTimeline.actualBufferMinutes}분 / 권장 15분)
                </span>
                <span className="text-[11px] text-[#7F1D1D] leading-relaxed block mt-0.5">
                  안전한 버스 탑승을 위해 AI가 활동 시간을 축소하거나 터미널 내부 대체 일정을 제안합니다.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={autoAdjustOverflowTimeline}
                className="py-2 px-2.5 bg-[#DC2626] text-white rounded-xl text-[11px] font-extrabold hover:bg-[#B91C1C] transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI 활동시간 자동 축소</span>
              </button>
              <button
                type="button"
                onClick={applyAlternativeShortCourse}
                className="py-2 px-2.5 bg-white text-[#991B1B] border border-[#FCA5A5] rounded-xl text-[11px] font-extrabold hover:bg-[#FEE2E2] transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>대체 일정으로 변경</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center justify-between text-[11px] text-[#065F46]">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              버스 출발 {customTimeline.actualBufferMinutes}분 전 승차장 도착 보장
            </span>
            <span className="text-[10px] font-extrabold bg-white px-2 py-0.5 rounded-full text-[#059669]">
              탑승 안전
            </span>
          </div>
        )}
      </div>

      {/* STEP 04: 타임라인 편집 및 순서/시간/장소 조정 영역 */}
      <div className="space-y-2.5 relative">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-extrabold text-[#2563EB] block">
              STEP 04. 타임라인 자유 편집 (추가·삭제·변경·순서조정)
            </span>
            <span className="text-xs font-extrabold text-[#0F172A]">
              추천 일정 및 이동 동선 ({customTimeline.items.length}개 구간)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-extrabold text-white bg-[#2563EB] px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-[#1D4ED8] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> 장소 추가
          </button>
        </div>

        <div className="space-y-2">
          {customTimeline.items.map((item, idx) => {
            const isBoarding = item.isBoardingStep;
            const isLast = idx === customTimeline.items.length - 1;
            const canMoveUp = !isBoarding && idx > 0;
            const canMoveDown = !isBoarding && idx < activityItems.length - 1;

            return (
              <React.Fragment key={item.id}>
                {/* Timeline Item Card */}
                <div
                  className={`rounded-3xl p-4 border transition-all ${
                    isBoarding
                      ? 'bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] border-[#6EE7B7] shadow-xs'
                      : 'bg-white border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isBoarding
                              ? 'bg-[#059669] text-white'
                              : 'bg-[#132B45] text-white'
                          }`}
                        >
                          {idx + 1}. {item.category}
                        </span>
                        <span className="text-xs font-black text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-lg">
                          {item.startTime} ~ {item.endTime} ({item.durationMinutes}분)
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#0F172A] truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                        <span className="truncate">
                          {item.location} · <strong className="text-[#334155]">{item.guideFloor}</strong>
                        </span>
                      </p>
                    </div>

                    {/* 순서 이동(▲/▼) 및 삭제 버튼 */}
                    {!isBoarding && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={!canMoveUp}
                          onClick={() => moveTimelineItem(item.id, 'up')}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            canMoveUp
                              ? 'border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
                              : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                          }`}
                          title="순서 위로 이동"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={!canMoveDown}
                          onClick={() => moveTimelineItem(item.id, 'down')}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            canMoveDown
                              ? 'border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
                              : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                          }`}
                          title="순서 아래로 이동"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTimelineItem(item.id)}
                          className="p-1.5 rounded-lg border border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                          title="일정 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#475569] mt-2 pt-2 border-t border-[#F1F5F9] leading-relaxed">
                    {item.description}
                  </p>

                  {/* 하단 비용 표시 & 체류시간 조절 / 장소 변경 컨트롤 */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F8FAFC] text-[11px]">
                    <span className="text-[#64748B]">
                      예상 비용: <strong className="text-[#0F172A]">{item.cost}</strong>
                    </span>

                    {!isBoarding ? (
                      <div className="flex items-center gap-1.5">
                        {/* 소요시간 -5분 / +5분 조절 */}
                        <div className="flex items-center bg-[#F1F5F9] rounded-lg p-0.5 border border-[#E2E8F0]">
                          <button
                            type="button"
                            onClick={() => updateTimelineItemDuration(item.id, -5)}
                            className="px-1.5 py-0.5 text-[#334155] hover:bg-white rounded font-bold text-[10px] flex items-center"
                            title="5분 축소"
                          >
                            <Minus className="w-2.5 h-2.5 mr-0.5" />5분
                          </button>
                          <span className="px-1.5 text-[10px] font-extrabold text-[#132B45]">
                            {item.durationMinutes}분
                          </span>
                          <button
                            type="button"
                            onClick={() => updateTimelineItemDuration(item.id, 5)}
                            className="px-1.5 py-0.5 text-[#334155] hover:bg-white rounded font-bold text-[10px] flex items-center"
                            title="5분 연장"
                          >
                            <Plus className="w-2.5 h-2.5 mr-0.5" />5분
                          </button>
                        </div>

                        {/* 다른 추천 장소로 교체 */}
                        <button
                          type="button"
                          onClick={() => setReplacingItemId(item.id)}
                          className="px-2 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] hover:bg-[#DBEAFE] flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>장소변경</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#059669] font-extrabold">
                        출발 {customTimeline.actualBufferMinutes}분 전 도착 완료
                      </span>
                    )}
                  </div>
                </div>

                {/* 시설 간 도보 이동 동선 표시 */}
                {!isLast && (
                  <div className="flex items-center justify-center gap-2 py-0.5 text-[11px] text-[#64748B]">
                    <div className="w-10 h-px bg-[#CBD5E1]" />
                    <span className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-[#CBD5E1] shadow-2xs font-bold text-[#1E3A8A]">
                      <Footprints className="w-3 h-3 text-[#2563EB]" />
                      도보 {item.transitTimeToNext}분 이동 (AI 최단 동선)
                    </span>
                    <div className="w-10 h-px bg-[#CBD5E1]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 04: 타임라인 확정 및 실시간 길 안내 시작 버튼 */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={confirmTimeline}
          className="w-full py-3.5 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-xs font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#93C5FD]" />
          <span>최종 타임라인 확정 및 길 안내 시작 (STEP 05)</span>
        </button>
        <p className="text-[11px] text-center text-[#64748B]">
          확정 시 메인 홈 화면 AI 비서와 실시간 길 안내 페이지에서 동선 모니터링이 시작됩니다.
        </p>
      </div>

      {/* 장소 추가 / 교체 모달 */}
      {(isAddModalOpen || replacingItemId) && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-xs p-3">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col p-4 shadow-2xl border border-[#CBD5E1] space-y-3 animate-in slide-in-from-bottom-4 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
              <div>
                <span className="text-[10px] font-bold text-[#2563EB] block">
                  천안터미널 · 신세계 복합공간 · 주변상권
                </span>
                <h4 className="font-extrabold text-sm text-[#0F172A]">
                  {replacingItemId ? '대체할 장소를 선택해 주세요' : '타임라인에 추가할 장소 선택'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setReplacingItemId(null);
                }}
                className="text-xs font-bold text-[#64748B] px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:text-[#0F172A]"
              >
                닫기
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
              {mockTimelinePlaces.map((place) => {
                const bLabel =
                  place.boundary === 'terminal_inside'
                    ? '터미널 내부'
                    : place.boundary === 'complex_space'
                    ? '복합공간'
                    : '주변상권';
                return (
                  <div
                    key={place.id}
                    className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] flex items-center justify-between gap-2 hover:border-[#CBD5E1] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold bg-[#E1EDFB] text-[#17365D] px-1.5 py-0.5 rounded">
                          {place.category}
                        </span>
                        <span className="text-[10px] font-semibold bg-white border border-[#E2E8F0] text-[#64748B] px-1.5 py-0.5 rounded">
                          {bLabel}
                        </span>
                        <span className="text-[10px] font-bold text-[#059669]">
                          {place.defaultDurationMinutes}분 · {place.defaultCost}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#0F172A] block truncate">
                        {place.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] block truncate">
                        {place.location} ({place.recommendedTag})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (replacingItemId) {
                          replaceTimelineItem(replacingItemId, place.id);
                          setReplacingItemId(null);
                        } else {
                          addTimelineItemFromPlace(place.id);
                          setIsAddModalOpen(false);
                        }
                      }}
                      className="shrink-0 px-3 py-2 bg-[#132B45] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A]"
                    >
                      {replacingItemId ? '변경' : '추가'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
