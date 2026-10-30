'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Sparkles, ExternalLink } from 'lucide-react';
import { SimulationController } from './SimulationController';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isMobileScreen, setIsMobileScreen] = useState(false);
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

    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#E2E8F0] flex flex-col md:flex-row items-center justify-center p-0 md:p-6 lg:p-10 text-[#0F172A]">
      {/* 데스크톱 왼쪽 안내 패널 (데스크톱 전용) */}
      <div className="hidden xl:flex flex-col gap-4 max-w-xs mr-8 text-left">
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-[#CBD5E1] shadow-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132B45] text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#93C5FD]" />
            천안시 종합버스터미널
          </div>
          <h2 className="text-xl font-extrabold text-[#132B45] tracking-tight">
            My Bus
          </h2>
          <p className="text-xs text-[#475569] mt-1 leading-relaxed">
            AI 기반 개인 맞춤형 고속·시외버스 예매 및 실시간 교통 일정 관리 서비스
          </p>

          <div className="mt-4 pt-3 border-t border-[#EEF2F6] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#64748B]">
              <span>기준 해상도</span>
              <span className="font-semibold text-[#0F172A]">393 × 852 px</span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>타깃 사용자</span>
              <span className="font-semibold text-[#0F172A]">대학생 · 직장인</span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>주요 노선</span>
              <span className="font-semibold text-[#2563EB]">천안 ↔ 서울경부</span>
            </div>
            <div className="flex items-center justify-between text-[#64748B]">
              <span>고속 / 시외</span>
              <span className="font-semibold text-[#059669]">블루 / 그린 식별</span>
            </div>
          </div>
        </div>

        {/* 핵심 가치 카드 */}
        <div className="bg-[#132B45] text-white p-5 rounded-3xl shadow-lg border border-white/10 space-y-2 text-xs">
          <h4 className="font-bold text-sm text-[#93C5FD]">서비스 핵심 가치</h4>
          <p className="text-white/80 leading-relaxed font-light">
            “반복되는 이동은 더 편리하게, 변화하는 일정은 더 유연하게.”
          </p>
          <div className="pt-2 text-[11px] text-white/60">
            AI가 매주 반복되는 이동 루틴을 기억하고, 교통 정체 시 자동으로 권장 출발시간을 안내합니다.
          </div>
        </div>
      </div>

      {/* 스마트폰 목업 프레임 */}
      <div className="w-full md:w-[393px] h-screen md:h-[852px] bg-white md:rounded-[52px] overflow-hidden flex flex-col relative mobile-frame-shadow md:border-[10px] md:border-[#1E293B]">
        {/* iOS 상태바 (데스크톱 및 모바일 상단) */}
        <div className="h-11 bg-white select-none shrink-0 flex items-center justify-between px-7 pt-2 text-[#0F172A] z-40">
          <span className="text-[14px] font-semibold tracking-tight">{currentTime}</span>

          {/* Dynamic Island Pill (iPhone 목업 스타일) */}
          <div className="hidden md:flex w-24 h-6 bg-black rounded-full items-center justify-end px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />
          </div>

          <div className="flex items-center gap-1.5 text-[#0F172A]">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <BatteryMedium className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#F4F6F9]">
          {children}
        </div>

        {/* iOS 하단 홈 바 */}
        <div className="h-5 bg-white select-none shrink-0 flex items-center justify-center pb-1">
          <div className="w-32 h-1 bg-[#CBD5E1] rounded-full" />
        </div>
      </div>

      {/* 데스크톱 오른쪽 시뮬레이터 패널 (화면이 클 때 고정 표시) */}
      <div className="hidden md:flex flex-col max-w-sm ml-8 self-center">
        <SimulationController />
      </div>

      {/* 모바일 화면에서 열 수 있는 플로팅 시뮬레이터 버튼 */}
      <div className="md:hidden fixed bottom-18 right-4 z-50">
        <button
          onClick={() => setShowSimModal(!showSimModal)}
          className="bg-[#132B45] text-white p-3 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-white/20 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-[#93C5FD]" />
          <span>AI 시뮬레이터</span>
        </button>

        {showSimModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-3">
            <div className="w-full max-w-md bg-white rounded-3xl p-2 pb-6 animate-in slide-in-from-bottom-5">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setShowSimModal(false)}
                  className="text-xs text-[#64748B] font-bold px-3 py-1 bg-[#EEF2F6] rounded-full"
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
