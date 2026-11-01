'use client';

import React from 'react';
import { Ticket } from '@/types';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface TicketCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  ticket: Ticket;
}

export const TicketCancelModal: React.FC<TicketCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  ticket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-dialog flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm p-5 shadow-2xl border border-surface-outline-variant animate-in slide-in-from-bottom-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-extrabold text-body text-surface-on-surface">승차권 예매 취소</h3>
          </div>
          <button onClick={onClose} className="p-1 text-surface-outline hover:text-surface-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-surface-bright rounded-2xl border border-surface-container space-y-1 text-caption">
          <div className="font-bold text-surface-on-surface">
            {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation} ({ticket.busSchedule.departureTime})
          </div>
          <div className="text-surface-outline">좌석 {ticket.seatNumbers.join(', ')}번 · {ticket.travelDate}</div>
        </div>

        {/* Refund Policy */}
        <div className="p-3 rounded-2xl bg-express-container border border-express-border space-y-2 text-caption">
          <div className="flex justify-between font-bold text-express-on-container">
            <span>취소 수수료 안내</span>
            <span>전액 환불 (0원)</span>
          </div>
          <p className="text-caption-sm text-primary-hover">
            출발 1시간 이전 취소 건으로 취소 수수료가 부과되지 않습니다.
          </p>
          <div className="flex justify-between pt-1 border-t border-express-border text-label">
            <span className="font-bold text-surface-on-surface">환불 예정 금액</span>
            <span className="font-black text-express">{formatPrice(ticket.totalFee)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-surface-container text-surface-on-variant rounded-2xl text-body-sm font-bold hover:bg-surface-container-high transition-colors"
          >
            유지하기
          </button>
          <button
            type="button"
            onClick={onConfirmCancel}
            className="flex-1 py-3.5 bg-error text-white rounded-2xl text-body-sm font-bold hover:bg-[#B91C1C] transition-colors shadow-md"
          >
            예매 취소 확정
          </button>
        </div>
      </div>
    </div>
  );
};
