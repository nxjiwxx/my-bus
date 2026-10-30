'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types';
import { BusTypeBadge, BusGradeBadge } from '../common/Badge';
import { formatPrice } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  ChevronDown,
  Navigation,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onOpenQR: (ticket: Ticket) => void;
  onCancel: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onOpenQR,
  onCancel,
}) => {
  const { setCurrentTab, setTimelineStep } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpress = ticket.busSchedule.busType === 'express';

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#CBD5E1] shadow-md transition-all">
      {/* Top Header Ticket Band */}
      <div
        className={`px-5 py-3 text-white flex items-center justify-between ${
          isExpress ? 'bg-[#2563EB]' : 'bg-[#059669]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-wider uppercase">
            {isExpress ? 'EXPRESS BUS TICKET' : 'INTERCITY BUS TICKET'}
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            {ticket.busSchedule.company}
          </span>
        </div>
        <span className="text-xs font-bold bg-white text-[#0F172A] px-2.5 py-0.5 rounded-full shadow-xs">
          {ticket.busSchedule.platform}
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 space-y-4">
        {/* Route & Times */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block font-medium">출발</span>
            <span className="text-2xl font-black text-[#0F172A] tracking-tight">
              {ticket.busSchedule.departureTime}
            </span>
            <span className="text-xs font-bold text-[#334155] block mt-0.5">
              {ticket.busSchedule.departureStation}
            </span>
          </div>

          {/* Center Graphic */}
          <div className="flex flex-col items-center px-4">
            <span className="text-[11px] font-semibold text-[#64748B]">
              {ticket.busSchedule.duration}
            </span>
            <div className="w-20 flex items-center gap-1 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
              <div className="flex-1 border-t-2 border-dashed border-[#CBD5E1]" />
              <span className={`w-2 h-2 rounded-full ${isExpress ? 'bg-[#2563EB]' : 'bg-[#059669]'}`} />
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono">직통</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#64748B] block font-medium">도착예정</span>
            <span className="text-xl font-extrabold text-[#334155]">
              {ticket.busSchedule.arrivalTime}
            </span>
            <span className="text-xs font-bold text-[#334155] block mt-0.5">
              {ticket.busSchedule.arrivalStation}
            </span>
          </div>
        </div>

        {/* Seat & Passenger Info Grid */}
        <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] block mb-0.5">좌석 번호</span>
            <span className="font-extrabold text-base text-[#132B45]">
              {ticket.seatNumbers.join(', ')}번
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block mb-0.5">탑승 인원</span>
            <span className="font-bold text-xs text-[#0F172A] pt-1 block">
              성인 {ticket.passengerCount.adult}명
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] block mb-0.5">버스 등급</span>
            <span className="font-bold text-xs text-[#2563EB] pt-1 block">
              {ticket.busSchedule.grade}
            </span>
          </div>
        </div>

        {/* QR Code Quick Area */}
        <div className="pt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenQR(ticket)}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#132B45] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#1E3A8A] active:scale-98 transition-all"
          >
            <QrCode className="w-4 h-4 text-[#93C5FD]" />
            <span>모바일 승차권 QR 검표</span>
          </button>
        </div>

        {/* Ticket Perforated Tear Line */}
        <div className="relative -mx-5 my-2">
          <div className="border-t-2 border-dashed border-[#E2E8F0]" />
          <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#F4F6F9] rounded-full border-r border-[#CBD5E1]" />
          <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#F4F6F9] rounded-full border-l border-[#CBD5E1]" />
        </div>

        {/* AI Travel Assistant Linked Status */}
        <div className="p-3 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] space-y-1.5 text-xs text-[#1D4ED8]">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> AI 이동 비서 연동
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#2563EB]">
              정상 작동 중
            </span>
          </div>
          <p className="text-[11px] text-[#1E3A8A]">
            출발지: {ticket.originPlace} ({ticket.transitMode} 기준 30분 소요)
          </p>
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="font-semibold text-[#64748B]">권장 출발시간</span>
            <strong className="text-[#132B45] text-sm font-black">
              {ticket.recommendedDepartureTime}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setTimelineStep('config');
              setCurrentTab('timeline');
            }}
            className="w-full mt-1.5 py-2 px-3 rounded-xl bg-white border border-[#93C5FD] text-[#1D4ED8] text-xs font-extrabold flex items-center justify-between hover:bg-[#DBEAFE]/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
              터미널 여유시간 맞춤형 타임라인
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Detail Accordion Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] font-medium pt-1"
        >
          <span>{isExpanded ? '상세 정보 접기' : '예매 상세 정보 보기'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="pt-2 border-t border-[#EEF2F6] space-y-2 text-xs text-[#64748B] animate-in fade-in duration-150">
            <div className="flex justify-between">
              <span>예매 번호</span>
              <span className="font-mono font-semibold text-[#0F172A]">{ticket.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>출발 날짜</span>
              <span className="font-medium text-[#0F172A]">{ticket.travelDate}</span>
            </div>
            <div className="flex justify-between">
              <span>결제 금액</span>
              <span className="font-bold text-[#0F172A]">{formatPrice(ticket.totalFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>결제 수단</span>
              <span className="font-medium text-[#0F172A]">{ticket.paymentMethod}</span>
            </div>

            {/* Cancel / Modify actions */}
            <div className="pt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCancel(ticket)}
                className="flex-1 py-2 rounded-xl border border-[#DC2626] text-[#DC2626] text-xs font-semibold hover:bg-[#FEE2E2] transition-colors"
              >
                예매 취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
