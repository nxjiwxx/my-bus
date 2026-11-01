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
    <div className="fixed inset-0 z-dialog flex items-end justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm p-5 shadow-2xl border border-surface-outline-variant animate-in slide-in-from-bottom-5 space-y-4">
        {/* Success Icon */}
        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-intercity-container text-intercity flex items-center justify-center mx-auto mb-2 border border-intercity-border">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-title-sm font-black text-surface-on-surface tracking-tight">
            예매가 완료되었습니다!
          </h3>
          <p className="text-caption text-surface-outline mt-0.5">
            예매번호: <span className="font-mono font-semibold">{ticket.bookingNumber}</span>
          </p>
        </div>

        {/* Ticket Summary Card */}
        <div className="p-4 rounded-2xl bg-surface-bright border border-surface-container space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BusTypeBadge busType={ticket.busSchedule.busType} />
              <span className="text-caption font-bold text-surface-on-surface">{ticket.travelDate}</span>
            </div>
            <span className="text-caption font-black text-express bg-express-container px-2 py-0.5 rounded">
              {ticket.busSchedule.platform}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-body font-extrabold text-surface-on-surface">
              {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation}
            </div>
            <div className="text-body font-black text-express">
              {ticket.busSchedule.departureTime}
            </div>
          </div>

          <div className="flex items-center justify-between text-caption text-surface-outline pt-1 border-t border-surface-container">
            <span>좌석: <strong>{ticket.seatNumbers.join(', ')}번 (우등)</strong></span>
            <span>{ticket.busSchedule.company}</span>
          </div>
        </div>

        {/* AI Travel Schedule Auto-Generation Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-express-container to-express-soft border border-express-border space-y-2">
          <div className="flex items-center gap-1.5 text-caption font-extrabold text-express-on-container">
            <Sparkles className="w-4 h-4 text-express" />
            <span>AI 이동 일정이 등록되었습니다</span>
          </div>
          <p className="text-caption-sm text-primary-hover leading-relaxed">
            김지우 님의 <strong>{ticket.originPlace}</strong> 위치를 기준으로 터미널까지 30분이 소요됩니다.
          </p>
          <div className="bg-white/80 p-2 rounded-xl flex items-center justify-between text-caption">
            <span className="text-surface-outline font-medium flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-express" /> 권장 출발시간
            </span>
            <span className="font-extrabold text-primary text-label">
              {ticket.recommendedDepartureTime} (출발 50분 전)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onViewTicket}
            className="w-full py-3.5 bg-primary text-white rounded-2xl text-body-sm font-bold hover:bg-primary-hover transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>모바일 승차권 확인하기</span>
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 bg-surface-container text-surface-on-variant rounded-xl text-caption font-bold hover:bg-surface-container-high transition-colors"
          >
            홈 화면으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};
