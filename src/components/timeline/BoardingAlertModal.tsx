'use client';

import React from 'react';
import { CustomTimeline } from '@/types';
import { useApp } from '@/context/AppContext';
import { BellRing, QrCode, Navigation, Footprints } from 'lucide-react';

interface BoardingAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: CustomTimeline;
}

export const BoardingAlertModal: React.FC<BoardingAlertModalProps> = ({
  isOpen,
  onClose,
  timeline,
}) => {
  const { setCurrentTab, setCurrentActivityIndex } = useApp();

  if (!isOpen) return null;

  const boardingItem = timeline.items.find((it) => it.isBoardingStep);
  const currentItem =
    timeline.items[Math.min(timeline.currentActivityIndex, timeline.items.length - 1)];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-white/20 text-center space-y-4">
        {/* Animated Bell Header */}
        <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto border-2 border-[#A7F3D0] shadow-sm animate-bounce">
          <BellRing className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            STEP 06. 승차장 이동 시점 알림
          </span>
          <h3 className="text-lg font-black text-[#0F172A] tracking-tight mt-1.5">
            버스 출발 {timeline.actualBufferMinutes}분 전입니다!
          </h3>
          <p className="text-xs text-[#475569] mt-1 leading-relaxed">
            현재 이용 중인 <strong>{currentItem?.title}</strong> 활동을 마무리하고{' '}
            <strong className="text-[#2563EB]">{timeline.boardingPlatform}</strong>으로 이동해 주세요.
          </p>
        </div>

        {/* Departure & Route Summary Box */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs text-left">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">예매 버스 출발 시각</span>
            <span className="text-sm font-black text-[#0F172A]">{timeline.busDepartureTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">탑승 승차장 위치</span>
            <span className="text-sm font-black text-[#2563EB]">
              천안터미널 1층 {timeline.boardingPlatform}
            </span>
          </div>
          <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#0F172A] flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-[#059669]" /> 승차장 이동 최단 경로
              </span>
              <span className="text-[11px] font-bold text-[#059669] flex items-center gap-0.5">
                <Footprints className="w-3 h-3" /> 도보 4분
              </span>
            </div>
            <p className="text-[11px] text-[#334155] leading-relaxed bg-white p-2.5 rounded-xl border border-[#EEF2F6]">
              {boardingItem?.routeInstruction ||
                `현재 위치에서 중앙 엘리베이터를 이용해 1층 대합실로 이동 후 ${timeline.boardingPlatform} 게이트로 직진하세요.`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setCurrentActivityIndex(timeline.items.length - 1);
              onClose();
              setCurrentTab('tickets');
            }}
            className="w-full py-3.5 bg-[#132B45] text-white rounded-2xl text-xs font-black hover:bg-[#1E3A8A] transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
          >
            <QrCode className="w-4 h-4 text-[#93C5FD]" />
            <span>승차장 이동 시작 & 모바일 승차권 QR 열기</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentActivityIndex(timeline.items.length - 1);
              onClose();
            }}
            className="w-full py-2.5 bg-[#EEF2F6] text-[#334155] rounded-xl text-xs font-bold hover:bg-[#E2E8F0] transition-colors"
          >
            길 안내 화면에서 승차장 경로 계속 보기
          </button>
        </div>
      </div>
    </div>
  );
};
