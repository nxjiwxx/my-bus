'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { BusTypeBadge } from '../common/Badge';
import { TimelineConfigStep } from './TimelineConfigStep';
import { TimelineRecommendStep } from './TimelineRecommendStep';
import { TimelineWayfindingView } from './TimelineWayfindingView';
import {
  Sparkles,
  Bus,
  CheckCircle2,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { timelineStep, setTimelineStep, customTimeline, activeTicket } = useApp();

  const busType = activeTicket?.busSchedule.busType || 'express';
  const isExpress = busType === 'express';

  const accentText = isExpress ? 'text-express' : 'text-intercity';
  const accentBg = isExpress ? 'bg-express' : 'bg-intercity';
  const accentContainer = isExpress ? 'bg-express-container' : 'bg-intercity-container';
  const accentOnContainer = isExpress ? 'text-express-on-container' : 'text-intercity-on-container';
  const accentBorder = isExpress ? 'border-express-border' : 'border-intercity-border';

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

  const isEmptyStep = timelineStep === 'empty';

  return (
    <div
      className={`flex-1 flex flex-col ${
        timelineStep === 'config' ? 'bg-white' : 'bg-surface-container-low'
      } ${isEmptyStep ? 'overflow-hidden' : ''}`}
    >
      <TopAppBar
        title={headerTitle}
        showBack={canGoBack}
        onBack={handleBack}
        rightElement={
          customTimeline?.isConfirmed && timelineStep === 'wayfinding' ? (
            <span className={`text-caption font-bold ${accentContainer} ${accentText} border ${accentBorder} px-2.5 py-0.5 rounded-full`}>
              길 안내 중
            </span>
          ) : (
            <span className={`text-caption font-bold ${accentContainer} ${accentOnContainer} px-2.5 py-0.5 rounded-full`}>
              AI 타임라인
            </span>
          )
        }
      />

      {/* 타임라인 추천 시작하기 이전(empty)은 한 화면 고정, 시작 이후(config / loading / recommendation / wayfinding)는 자연스러운 세로 스크롤 지원 */}
      <div className={`flex-1 flex flex-col ${isEmptyStep ? 'overflow-hidden' : ''}`}>
        {/* 0. 추천 기능 사용 전 Empty 페이지 */}
        {timelineStep === 'empty' && (
          <div className="flex-1 flex flex-col justify-between p-5">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
              <div className={`w-16 h-16 rounded-3xl ${accentContainer} border ${accentBorder} flex items-center justify-center shadow-xs mb-4 relative`}>
                <CalendarClock className={`w-8 h-8 ${accentText}`} />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3 h-3 text-express-light" />
                </span>
              </div>

              <span className={`text-caption font-extrabold ${accentText} ${accentContainer} px-3 py-1 rounded-full border ${accentBorder} mb-2`}>
                AI 맞춤형 여유시간 타임라인
              </span>
              <h2 className="text-headline-sm font-black text-surface-on-surface tracking-tight leading-snug">
                아직 생성된 타임라인이 없어요
              </h2>
              <p className="text-body-sm text-surface-outline mt-2 leading-relaxed max-w-[290px]">
                버스 탑승 전까지 남은 여유시간과 취향을 분석해 맞춤 코스와 승차장 길 안내를 제공해 드려요.
              </p>

              {/* 예매된 승차권 연동 요약 */}
              {activeTicket && (
                <div className="w-full mt-4 p-4 rounded-2xl bg-white border border-surface-container-high shadow-xs text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BusTypeBadge busType={busType} />
                      <span className={`text-caption font-extrabold ${accentText} ${accentContainer} px-2.5 py-0.5 rounded-md`}>
                        예매 승차권 연동됨
                      </span>
                    </div>
                    <span className="text-label-sm font-bold text-surface-outline">
                      {activeTicket.busSchedule.platform}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-body font-extrabold text-surface-on-surface">
                      {activeTicket.busSchedule.arrivalStation}행 버스
                    </span>
                    <span className={`text-body font-black ${accentText}`}>
                      {activeTicket.busSchedule.departureTime} 출발
                    </span>
                  </div>
                </div>
              )}

              {/* 흐름 안내 카드 */}
              <div className="w-full mt-3 p-4 rounded-2xl bg-white/80 border border-surface-container text-left space-y-2.5">
                <div className="flex items-center gap-2.5 text-label">
                  <span className={`w-6 h-6 rounded-lg ${accentContainer} ${accentText} font-extrabold text-caption flex items-center justify-center shrink-0`}>
                    1
                  </span>
                  <span className="text-surface-on-variant font-semibold">
                    이동 범위 · 관심 활동 · 예산 조건 선택
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-label">
                  <span className={`w-6 h-6 rounded-lg ${accentContainer} ${accentText} font-extrabold text-caption flex items-center justify-center shrink-0`}>
                    2
                  </span>
                  <span className="text-surface-on-variant font-semibold">
                    AI 여유시간 산정 및 맞춤 코스 편집 · 확정
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-label">
                  <span className={`w-6 h-6 rounded-lg ${accentContainer} ${accentText} font-extrabold text-caption flex items-center justify-center shrink-0`}>
                    3
                  </span>
                  <span className="text-surface-on-variant font-semibold">
                    시설별 실시간 길 안내 및 승차장 이동 알림
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTimelineStep('config')}
              className={`w-full py-3.5 ${accentBg} text-white rounded-2xl text-body font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2`}
            >
              <Sparkles className="w-4 h-4 text-white/90" />
              <span>타임라인 추천 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. 조건 선택 단계 */}
        {timelineStep === 'config' && <TimelineConfigStep />}

        {/* 2. AI 추천 로딩 화면 (확인 버튼을 누르기 전까지 유지 + 버스 좌->우 이동 반복 모션) */}
        {timelineStep === 'loading' && (
          <div className="flex-1 flex flex-col justify-between p-5">
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

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${accentContainer} border ${accentBorder}`}>
                <Sparkles className={`w-4 h-4 ${accentText} animate-spin`} />
                <span className={`text-label-sm font-extrabold ${accentOnContainer}`}>
                  AI 맞춤형 타임라인 생성 완료
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-headline-sm font-black text-surface-on-surface tracking-tight">
                  여유시간 맞춤 코스를 구성하고 있어요
                </h3>
                <p className="text-body-sm text-surface-outline leading-relaxed">
                  버스 출발 시각과 승차장 이동 동선을 분석해
                  <br />
                  가장 여유롭고 안전한 일정을 준비했습니다.
                </p>
              </div>

              {/* 버스 아이콘 좌측 -> 우측 반복 이동 트랙 */}
              <div className="w-full max-w-[300px] bg-white rounded-3xl p-4 border border-surface-container-high shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-label-sm font-bold text-surface-outline">
                  <span>현재 위치</span>
                  <span className={`${accentText} font-extrabold`}>AI 동선 시뮬레이션</span>
                  <span>{customTimeline?.boardingPlatform || '승차장'}</span>
                </div>

                <div className="relative h-12 bg-surface-bright rounded-2xl border border-surface-container overflow-hidden flex items-center">
                  {/* 도로 점선 */}
                  <div className="w-full border-t-2 border-dashed border-surface-outline-variant" />

                  {/* 좌측에서 우측으로 반복 이동하는 버스 아이콘 */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-bus-loop">
                    <div
                      className={`w-10 h-10 rounded-2xl ${accentBg} text-white flex items-center justify-center shadow-md ring-4 ${
                        isExpress ? 'ring-express-soft' : 'ring-intercity-border'
                      }`}
                    >
                      <Bus className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-label-sm text-surface-subtle">
                  <span>출발 {customTimeline?.currentTime || '16:35'}</span>
                  <span className={`font-extrabold ${accentText}`}>
                    탑승 여유 {customTimeline?.actualBufferMinutes || 15}분 확보
                  </span>
                  <span>버스 {customTimeline?.busDepartureTime || '18:00'}</span>
                </div>
              </div>

              {/* 분석 요약 카드 */}
              {customTimeline && (
                <div className="w-full bg-white rounded-2xl p-4 border border-surface-container text-left space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-body-sm font-extrabold text-surface-on-surface">
                    <CheckCircle2 className={`w-4 h-4 ${accentText} shrink-0`} />
                    <span>
                      총 {customTimeline.items.filter((i) => !i.isBoardingStep).length}개 추천 장소 · 승차장 이동 포함
                    </span>
                  </div>
                  <p className="text-label-sm text-surface-outline leading-relaxed">
                    {customTimeline.aiAnalysisSummary}
                  </p>
                </div>
              )}
            </div>

            {/* 확인 버튼 (클릭 시 추천 내용 편집 및 확정 화면으로 이동) */}
            <div className="space-y-2 pt-4">
              <button
                type="button"
                onClick={() => setTimelineStep('recommendation')}
                className={`w-full py-3.5 ${accentBg} text-white rounded-2xl text-body font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2`}
              >
                <CheckCircle2 className="w-4 h-4 text-white/90" />
                <span>확인 · 추천 타임라인 보기</span>
              </button>
              <button
                type="button"
                onClick={() => setTimelineStep('config')}
                className="w-full py-2 text-label font-bold text-surface-outline hover:text-surface-on-surface transition-colors"
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
