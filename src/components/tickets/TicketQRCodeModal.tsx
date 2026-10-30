'use client';

import React from 'react';
import { Ticket } from '@/types';
import { X, QrCode, Sun, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BusTypeBadge } from '../common/Badge';

interface TicketQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
}

export const TicketQRCodeModal: React.FC<TicketQRCodeModalProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  if (!isOpen) return null;

  const isExpress = ticket.busSchedule.busType === 'express';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-white/20 text-center space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs font-bold text-[#64748B]">화면 밝기가 최적화되었습니다</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bus Info */}
        <div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <BusTypeBadge busType={ticket.busSchedule.busType} />
            <span className="text-xs font-bold text-[#0F172A]">{ticket.travelDate}</span>
          </div>
          <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
            {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-sm font-extrabold text-[#2563EB]">
              {ticket.busSchedule.departureTime} 출발
            </span>
            <span className="text-xs font-bold bg-[#EFF6FF] text-[#1D4ED8] px-2 py-0.5 rounded-md">
              {ticket.busSchedule.platform}
            </span>
            <span className="text-xs font-bold bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded-md">
              좌석 {ticket.seatNumbers.join(', ')}번
            </span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#CBD5E1] inline-block shadow-inner">
          {/* Custom SVG Realistic QR Code */}
          <div className="w-48 h-48 mx-auto bg-white p-2 flex flex-col items-center justify-center relative">
            <svg
              className="w-full h-full text-[#132B45]"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Outer corners */}
              <rect x="5" y="5" width="26" height="26" rx="2" />
              <rect x="9" y="9" width="18" height="18" fill="white" />
              <rect x="13" y="13" width="10" height="10" />

              <rect x="69" y="5" width="26" height="26" rx="2" />
              <rect x="73" y="9" width="18" height="18" fill="white" />
              <rect x="77" y="13" width="10" height="10" />

              <rect x="5" y="69" width="26" height="26" rx="2" />
              <rect x="9" y="73" width="18" height="18" fill="white" />
              <rect x="13" y="77" width="10" height="10" />

              {/* Data pattern blocks */}
              <rect x="36" y="8" width="8" height="8" />
              <rect x="48" y="12" width="6" height="6" />
              <rect x="58" y="8" width="6" height="6" />
              <rect x="36" y="22" width="12" height="6" />
              <rect x="52" y="24" width="8" height="8" />

              <rect x="8" y="36" width="6" height="12" />
              <rect x="20" y="38" width="10" height="6" />
              <rect x="36" y="36" width="10" height="10" />
              <rect x="50" y="38" width="6" height="12" />
              <rect x="62" y="36" width="12" height="6" />
              <rect x="78" y="38" width="14" height="6" />

              <rect x="8" y="52" width="12" height="8" />
              <rect x="24" y="48" width="6" height="12" />
              <rect x="38" y="52" width="14" height="8" />
              <rect x="56" y="54" width="10" height="6" />
              <rect x="70" y="48" width="8" height="12" />
              <rect x="82" y="52" width="10" height="8" />

              <rect x="36" y="68" width="8" height="12" />
              <rect x="48" y="66" width="12" height="6" />
              <rect x="64" y="68" width="8" height="10" />
              <rect x="76" y="66" width="16" height="6" />
              <rect x="36" y="84" width="14" height="8" />
              <rect x="54" y="82" width="8" height="10" />
              <rect x="66" y="84" width="14" height="8" />
              <rect x="84" y="78" width="8" height="14" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-[#E2E8F0] flex items-center justify-center font-black text-xs text-[#132B45]">
                MB
              </div>
            </div>
          </div>

          {/* Barcode graphic */}
          <div className="mt-2 pt-2 border-t border-[#EEF2F6] flex justify-center items-center gap-0.5 h-6">
            {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 2, 5, 1, 3, 2, 4, 1, 3, 5, 2, 1, 4].map(
              (w, idx) => (
                <div
                  key={idx}
                  className="bg-[#0F172A] h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              )
            )}
          </div>
          <span className="font-mono text-[10px] text-[#64748B] tracking-widest block mt-1">
            {ticket.bookingNumber}
          </span>
        </div>

        <p className="text-xs text-[#475569] leading-tight">
          터미널 검표기 스캐너에 위 QR코드를 태그해 주세요.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#132B45] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
