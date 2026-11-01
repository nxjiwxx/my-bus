'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Sparkles, ExternalLink } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [showSimModal, setShowSimModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-container-high flex flex-col md:flex-row items-center justify-center p-0 md:p-4 text-surface-on-surface">
      {/* 데스크톱 왼쪽 안내 패널 (데스크톱 전용) */}
      <div className="hidden xl:flex flex-col gap-4 max-w-xs mr-8 text-left">
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-surface-outline-variant shadow-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-caption font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
            천안시 종합버스터미널
          </div>
          <h2 className="text-title font-extrabold text-primary tracking-tight">
            My Bus
          </h2>
          <p className="text-caption text-surface-subtle mt-1 leading-relaxed">
            AI 기반 개인 맞춤형 고속·시외버스 예매 및 실시간 교통 일정 관리 서비스
          </p>

          <div className="mt-4 pt-3 border-t border-surface-container space-y-2 text-caption">
            <div className="flex items-center justify-between text-surface-outline">
              <span>기준 해상도</span>
              <span className="font-semibold text-surface-on-surface">375 × 812 px</span>
            </div>
            <div className="flex items-center justify-between text-surface-outline">
              <span>타깃 사용자</span>
              <span className="font-semibold text-surface-on-surface">대학생 · 직장인</span>
            </div>
            <div className="flex items-center justify-between text-surface-outline">
              <span>주요 노선</span>
              <span className="font-semibold text-express">천안 ↔ 서울경부</span>
            </div>
            <div className="flex items-center justify-between text-surface-outline">
              <span>고속 / 시외</span>
              <span className="font-semibold text-intercity">블루 / 그린 식별</span>
            </div>
          </div>
        </div>

        {/* 핵심 가치 카드 */}
        <div className="bg-primary text-white p-5 rounded-3xl shadow-lg border border-white/10 space-y-2 text-caption">
          <h4 className="font-bold text-label text-[#93C5FD]">서비스 핵심 가치</h4>
          <p className="text-white/80 leading-relaxed font-light">
            “반복되는 이동은 더 편리하게, 변화하는 일정은 더 유연하게.”
          </p>
          <div className="pt-2 text-caption-sm text-white/60">
            AI가 매주 반복되는 이동 루틴을 기억하고, 교통 정체 시 자동으로 권장 출발시간을 안내합니다.
          </div>
        </div>
      </div>

      {/* 스마트폰 목업 프레임 */}
      {/* 일반적인 스마트폰 화면 크기(375 × 812)에 맞춘 프레임. transform으로 모달·시트가 프레임 안에 갇히도록 함 */}
      <div
        className="w-full md:w-[391px] h-[100dvh] md:h-[min(828px,calc(100dvh-32px))] shrink-0 bg-white md:rounded-[44px] overflow-hidden flex flex-col relative mobile-frame-shadow md:border-8 md:border-[#1E293B]"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* 모바일 실기기: 시스템 상태바 영역(Safe Area)만 확보 */}
        <div className="md:hidden bg-white shrink-0 safe-top" aria-hidden="true" />

        {/* 데스크톱 목업 전용 iOS 상태바 */}
        <div className="hidden md:flex h-11 bg-white select-none shrink-0 items-center justify-between px-7 pt-2 text-surface-on-surface z-page">
          <span className="text-label font-semibold tracking-tight">{currentTime}</span>

          {/* Dynamic Island Pill (iPhone 목업 스타일) */}
          <div className="hidden md:flex w-24 h-6 bg-black rounded-full items-center justify-end px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />
          </div>

          <div className="flex items-center gap-1.5 text-surface-on-surface">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <BatteryMedium className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col bg-surface-container-low">
          {children}
        </div>

        {/* 데스크톱 목업 전용 iOS 하단 홈 바 */}
        <div className="hidden md:flex h-5 bg-white select-none shrink-0 items-center justify-center pb-1">
          <div className="w-32 h-1 bg-surface-outline-variant rounded-full" />
        </div>
      </div>

      {/* 데스크톱 오른쪽 시뮬레이터 패널 (화면이 클 때 고정 표시) */}
      <div className="hidden lg:flex flex-col max-w-sm ml-8 self-center">
        <SimulationController />
      </div>

      {/* 프레임 외부 개발자 전용 플로팅 시뮬레이터 버튼 */}
      <div className="lg:hidden fixed bottom-20 right-4 z-dev">
        <button
          type="button"
          onClick={() => setShowSimModal(!showSimModal)}
          className="bg-primary text-white px-3.5 py-2.5 rounded-full shadow-2xl flex items-center gap-1.5 text-caption font-bold border border-white/20 active:scale-95 transition-transform"
        >
          <span className="px-1.5 py-0.5 rounded bg-white/15 text-caption-xs font-extrabold text-express-light">
            DEV
          </span>
          <span>시뮬레이터</span>
        </button>

        {showSimModal && (
          <div className="fixed inset-0 bg-black/50 z-dev flex items-end justify-center p-3">
            <div className="w-full max-w-md bg-white rounded-3xl p-2 pb-6 animate-in slide-in-from-bottom-5">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setShowSimModal(false)}
                  className="text-caption text-surface-outline font-bold px-3 py-1 bg-surface-container rounded-full"
                >
                  닫기
                </button>
              </div>
              <SimulationController />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
