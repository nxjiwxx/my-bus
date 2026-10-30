'use client';

import React, { useEffect } from 'react';
import { Ticket } from '@/types';
import { CheckCircle2, QrCode, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { BusTypeBadge } from '../common/Badge';
import confetti from 'canvas-confetti';

interface BookingSuccessModalProps {
  isOpen: boolean;
  ticket: Ticket;
  onViewTicket: () => void;
  onGoHome: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  ticket,
  onViewTicket,
  onGoHome,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-4">
        {/* Success Icon */}
        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto mb-2 border border-[#A7F3D0]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
            예매가 완료되었습니다!
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            예매번호: <span className="font-mono font-semibold">{ticket.bookingNumber}</span>
          </p>
        </div>

        {/* Ticket Summary Card */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BusTypeBadge busType={ticket.busSchedule.busType} />
              <span className="text-xs font-bold text-[#0F172A]">{ticket.travelDate}</span>
            </div>
            <span className="text-xs font-black text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
              {ticket.busSchedule.platform}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-base font-extrabold text-[#0F172A]">
              {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation}
            </div>
            <div className="text-base font-black text-[#2563EB]">
              {ticket.busSchedule.departureTime}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 border-t border-[#EEF2F6]">
            <span>좌석: <strong>{ticket.seatNumbers.join(', ')}번 (우등)</strong></span>
            <span>{ticket.busSchedule.company}</span>
          </div>
        </div>

        {/* AI Travel Schedule Auto-Generation Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1D4ED8]">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>AI 이동 일정이 등록되었습니다</span>
          </div>
          <p className="text-[11px] text-[#1E3A8A] leading-relaxed">
            김지우 님의 <strong>{ticket.originPlace}</strong> 위치를 기준으로 터미널까지 30분이 소요됩니다.
          </p>
          <div className="bg-white/80 p-2 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#64748B] font-medium flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-[#2563EB]" /> 권장 출발시간
            </span>
            <span className="font-extrabold text-[#132B45] text-sm">
              {ticket.recommendedDepartureTime} (출발 50분 전)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onViewTicket}
            className="w-full py-3 bg-[#132B45] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>모바일 승차권 확인하기</span>
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 bg-[#EEF2F6] text-[#334155] rounded-xl text-xs font-bold hover:bg-[#E2E8F0] transition-colors"
          >
            홈 화면으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};
