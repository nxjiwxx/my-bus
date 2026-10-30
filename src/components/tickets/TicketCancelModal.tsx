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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm p-5 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-2 text-[#DC2626]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-[#0F172A]">승차권 예매 취소</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] space-y-1 text-xs">
          <div className="font-bold text-[#0F172A]">
            {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation} ({ticket.busSchedule.departureTime})
          </div>
          <div className="text-[#64748B]">좌석 {ticket.seatNumbers.join(', ')}번 · {ticket.travelDate}</div>
        </div>

        {/* Refund Policy */}
        <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2 text-xs">
          <div className="flex justify-between font-bold text-[#1D4ED8]">
            <span>취소 수수료 안내</span>
            <span>전액 환불 (0원)</span>
          </div>
          <p className="text-[11px] text-[#1E3A8A]">
            출발 1시간 이전 취소 건으로 취소 수수료가 부과되지 않습니다.
          </p>
          <div className="flex justify-between pt-1 border-t border-[#BFDBFE] text-sm">
            <span className="font-bold text-[#0F172A]">환불 예정 금액</span>
            <span className="font-black text-[#2563EB]">{formatPrice(ticket.totalFee)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-[#EEF2F6] text-[#334155] rounded-xl text-xs font-bold hover:bg-[#E2E8F0] transition-colors"
          >
            유지하기
          </button>
          <button
            type="button"
            onClick={onConfirmCancel}
            className="flex-1 py-3 bg-[#DC2626] text-white rounded-xl text-xs font-bold hover:bg-[#B91C1C] transition-colors shadow-md"
          >
            예매 취소 확정
          </button>
        </div>
      </div>
    </div>
  );
};
