'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { TimelineConfigStep } from './TimelineConfigStep';
import { TimelineRecommendStep } from './TimelineRecommendStep';
import { TimelineWayfindingView } from './TimelineWayfindingView';
import {
  Sparkles,
  Bus,
  Clock,
  Compass,
  Navigation,
  CheckCircle2,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { timelineStep, setTimelineStep, customTimeline, activeTicket } = useApp();

  const headerTitle =
    timelineStep === 'empty'
      ? '맞춤형 타임라인'
      : timelineStep === 'config'
      ? '이용 조건 설정'
      : timelineStep === 'loading'
      ? 'AI 타임라인 분석'
      : timelineStep === 'recommendation'
      ? '추천 타임라인 편집 · 확정'
      : '실시간 길 안내';

  const canGoBack =
    timelineStep === 'config' ||
    timelineStep === 'loading' ||
    timelineStep === 'recommendation' ||
    timelineStep === 'wayfinding';

  const handleBack = () => {
    if (timelineStep === 'wayfinding') setTimelineStep('recommendation');
    else if (timelineStep === 'recommendation') setTimelineStep('config');
    else if (timelineStep === 'loading') setTimelineStep('config');
    else if (timelineStep === 'config') setTimelineStep('empty');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9]">
      <TopAppBar
        title={headerTitle}
        showBack={canGoBack}
        onBack={handleBack}
        rightElement={
          customTimeline?.isConfirmed && timelineStep === 'wayfinding' ? (
            <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
              길 안내 중
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-[#E1EDFB] text-[#17365D] px-2 py-0.5 rounded-full">
              AI 타임라인
            </span>
          )
        }
      />

      {/* 자연스러운 단계별 화면 전환 (조건 선택 전 Empty > 조건 선택 > AI 추천 로딩 > 편집·확정 > 길안내 > 종료) */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* 0. 추천 기능 사용 전 Empty 페이지 */}
        {timelineStep === 'empty' && (
          <div className="flex-1 flex flex-col justify-between p-5 pb-8 space-y-5">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#EFF6FF] to-[#E0E7FF] border border-[#BFDBFE] flex items-center justify-center shadow-xs mb-5 relative">
                <CalendarClock className="w-9 h-9 text-[#2563EB]" />
                <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#132B45] text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
                </span>
              </div>

              <span className="text-[11px] font-extrabold text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE] mb-2.5">
                AI 맞춤형 여유시간 타임라인
              </span>
              <h2 className="text-lg font-black text-[#0F172A] tracking-tight leading-snug">
                아직 생성된 타임라인이 없어요
              </h2>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed max-w-[270px]">
                버스 탑승 전까지 남은 여유시간과 취향을 분석해 터미널 내·외부 맞춤 코스와 승차장 길 안내를 제공해 드려요.
              </p>

              {/* 예매된 승차권 연동 요약 */}
              {activeTicket && (
                <div className="w-full mt-6 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      예매 승차권 연동됨
                    </span>
                    <span className="text-[11px] font-bold text-[#64748B]">
                      {activeTicket.busSchedule.platform}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#0F172A]">
                      {activeTicket.busSchedule.arrivalStation}행 버스
                    </span>
                    <span className="text-sm font-black text-[#132B45]">
                      {activeTicket.busSchedule.departureTime} 출발
                    </span>
                  </div>
                </div>
              )}

              {/* 흐름 안내 카드 */}
              <div className="w-full mt-3 p-4 rounded-2xl bg-white/80 border border-[#EEF2F6] text-left space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-[#334155] font-semibold">
                    이동 범위 · 관심 활동 · 예산 조건 선택
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-6 h-6 rounded-lg bg-[#F5F3FF] text-[#4F46E5] font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-[#334155] font-semibold">
                    AI 여유시간 산정 및 맞춤 코스 편집 · 확정
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-6 h-6 rounded-lg bg-[#ECFDF5] text-[#059669] font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-[#334155] font-semibold">
                    시설별 실시간 길 안내 및 승차장 이동 알림
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTimelineStep('config')}
              className="w-full py-4 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-sm font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#93C5FD]" />
              <span>타임라인 추천 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. 조건 선택 단계 */}
        {timelineStep === 'config' && <TimelineConfigStep />}

        {/* 2. AI 추천 로딩 화면 (확인 버튼을 누르기 전까지 유지 + 버스 좌->우 이동 반복 모션) */}
        {timelineStep === 'loading' && (
          <div className="flex-1 flex flex-col justify-between p-5 pb-8">
            <style>{`
              @keyframes busMoveLeftToRight {
                0% {
                  transform: translateX(-48px);
                }
                100% {
                  transform: translateX(280px);
                }
              }
              .animate-bus-loop {
                animation: busMoveLeftToRight 2.2s linear infinite;
              }
            `}</style>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-spin" />
                <span className="text-xs font-extrabold text-[#1D4ED8]">
                  AI 맞춤형 타임라인 생성 완료
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  여유시간 맞춤 코스를 구성하고 있어요
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  버스 출발 시각과 승차장 이동 동선을 분석해
                  <br />
                  가장 여유롭고 안전한 일정을 준비했습니다.
                </p>
              </div>

              {/* 버스 아이콘 좌측 -> 우측 반복 이동 트랙 */}
              <div className="w-full max-w-[280px] bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                  <span>현재 위치</span>
                  <span className="text-[#2563EB] font-extrabold">AI 동선 시뮬레이션</span>
                  <span>{customTimeline?.boardingPlatform || '승차장'}</span>
                </div>

                <div className="relative h-14 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] overflow-hidden flex items-center">
                  {/* 도로 점선 */}
                  <div className="w-full border-t-2 border-dashed border-[#CBD5E1]" />

                  {/* 좌측에서 우측으로 반복 이동하는 버스 아이콘 */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-bus-loop">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md ring-4 ring-[#DBEAFE]">
                      <Bus className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#475569] pt-1">
                  <span>출발 {customTimeline?.currentTime || '16:35'}</span>
                  <span className="font-extrabold text-[#059669]">
                    탑승 여유 {customTimeline?.actualBufferMinutes || 15}분 확보
                  </span>
                  <span>버스 {customTimeline?.busDepartureTime || '18:00'}</span>
                </div>
              </div>

              {/* 분석 요약 카드 */}
              {customTimeline && (
                <div className="w-full bg-white rounded-2xl p-4 border border-[#EEF2F6] text-left space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>
                      총 {customTimeline.items.filter((i) => !i.isBoardingStep).length}개 추천 장소 · 승차장 이동 포함
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    {customTimeline.aiAnalysisSummary}
                  </p>
                </div>
              )}
            </div>

            {/* 확인 버튼 (클릭 시 추천 내용 편집 및 확정 화면으로 이동) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTimelineStep('recommendation')}
                className="w-full py-4 bg-gradient-to-r from-[#132B45] to-[#1E3A8A] text-white rounded-2xl text-sm font-black shadow-md hover:from-[#1E3A8A] hover:to-[#2563EB] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#93C5FD]" />
                <span>확인 · 추천 타임라인 보기</span>
              </button>
              <button
                type="button"
                onClick={() => setTimelineStep('config')}
                className="w-full py-2.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                조건 다시 선택하기
              </button>
            </div>
          </div>
        )}

        {/* 3. 추천 내용 편집 및 확정 단계 */}
        {timelineStep === 'recommendation' && <TimelineRecommendStep />}

        {/* 4. 실시간 길 안내 및 종료 단계 */}
        {timelineStep === 'wayfinding' && <TimelineWayfindingView />}
      </div>
    </div>
  );
};
