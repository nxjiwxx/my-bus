'use client';

import React, { useState } from 'react';
import { Bell, Sparkles, X, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightElement,
}) => {
  const { simulationState, setSimulationState, showToast } = useApp();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // 시뮬레이션 상태에 따른 알림 개수
  const unreadCount = simulationState === 'traffic_delay' || simulationState === 'bus_delay' ? 2 : 1;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EEF2F6] px-5 py-3.5 flex items-center justify-between transition-colors">
        {showBack ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="뒤로가기"
              className="p-1 -ml-1 text-[#334155] hover:text-[#0F172A] active:scale-95 transition-transform"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-[19px] font-extrabold text-[#0F172A] tracking-tight">{title}</h1>
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="font-extrabold text-[20px] tracking-tight text-[#132B45]">
              {title || 'My Bus'}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-1">
          {rightElement ? (
            rightElement
          ) : (
            <button
              onClick={() => setShowNotificationModal(true)}
              className="relative p-2 text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors active:scale-95"
              aria-label="알림"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full ring-2 ring-white" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* 알림 모달/시트 */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-2xl border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6366F1]" />
                <h3 className="font-bold text-[#0F172A] text-base">스마트 알림 센터</h3>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
              {simulationState === 'traffic_delay' && (
                <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs">
                  <div className="flex items-center gap-1 text-[#B45309] font-bold mb-1">
                    <span>⚠️ 교통 상황 정체 알림</span>
                  </div>
                  <p className="text-[#78350F] font-medium leading-relaxed">
                    터미널 방면 도로 정체로 이동시간이 15분 증가했습니다. 권장 출발시간이 16:55로 변경되었습니다.
                  </p>
                </div>
              )}

              {simulationState === 'bus_delay' && (
                <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs">
                  <div className="flex items-center gap-1 text-[#1D4ED8] font-bold mb-1">
                    <span>📢 공식 운행시간 지연 안내</span>
                  </div>
                  <p className="text-[#1E3A8A] font-medium leading-relaxed">
                    예매하신 천안→서울경부 버스 출발시간이 18:00에서 18:20으로 공식 변경되었습니다.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div className="flex items-center gap-1 text-[#334155] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>AI 맞춤 이동 제안</span>
                </div>
                <p className="text-[#475569] leading-relaxed">
                  김지우 님의 매주 금요일 통학 패턴을 감지하여 18시대 우등고속 예매 추천이 준비되어 있습니다.
                </p>
                <span className="text-[10px] text-[#94A3B8] block mt-1">오늘 14:30</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div className="flex items-center gap-1 text-[#334155] font-semibold mb-1">
                  <span>터미널 운영 공지</span>
                </div>
                <p className="text-[#475569] leading-relaxed">
                  주말 고속·시외버스 승차홈이 원활히 운영 중입니다. 모바일 승차권을 사전 준비해 주세요.
                </p>
                <span className="text-[10px] text-[#94A3B8] block mt-1">어제 09:00</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowNotificationModal(false);
                showToast('모든 알림을 확인했습니다.');
              }}
              className="w-full py-2.5 bg-[#132B45] text-white rounded-xl text-xs font-semibold hover:bg-[#1E3A8A] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
