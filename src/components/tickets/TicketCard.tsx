'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types';
import { BusTypeBadge, BusGradeBadge } from '../common/Badge';
import { formatPrice, formatPassengerSummary } from '@/lib/utils';
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
    <div className="bg-white rounded-3xl overflow-hidden border border-surface-outline-variant shadow-md transition-all">
      {/* Top Header Ticket Band */}
      <div
        className={`px-5 py-3 text-white flex items-center justify-between ${
          isExpress ? 'bg-express' : 'bg-intercity'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-caption font-black tracking-wider uppercase">
            {isExpress ? 'EXPRESS BUS TICKET' : 'INTERCITY BUS TICKET'}
          </span>
          <span className="text-caption-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
            {ticket.busSchedule.company}
          </span>
        </div>
        <span className="text-caption font-bold bg-white text-surface-on-surface px-2.5 py-0.5 rounded-full shadow-xs">
          {ticket.busSchedule.platform}
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 space-y-4">
        {/* Route & Times */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-caption text-surface-outline block font-medium">출발</span>
            <span className="text-headline font-black text-surface-on-surface tracking-tight">
              {ticket.busSchedule.departureTime}
            </span>
            <span className="text-caption font-bold text-surface-on-variant block mt-0.5">
              {ticket.busSchedule.departureStation}
            </span>
          </div>

          {/* Center Graphic */}
          <div className="flex flex-col items-center px-4">
            <span className="text-caption-sm font-semibold text-surface-outline">
              {ticket.busSchedule.duration}
            </span>
            <div className="w-20 flex items-center gap-1 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-outline-variant" />
              <div className="flex-1 border-t-2 border-dashed border-surface-outline-variant" />
              <span className={`w-2 h-2 rounded-full ${isExpress ? 'bg-express' : 'bg-intercity'}`} />
            </div>
            <span className="text-caption-xs text-surface-outline font-mono">직통</span>
          </div>

          <div className="text-right">
            <span className="text-caption text-surface-outline block font-medium">도착예정</span>
            <span className="text-title font-extrabold text-surface-on-variant">
              {ticket.busSchedule.arrivalTime}
            </span>
            <span className="text-caption font-bold text-surface-on-variant block mt-0.5">
              {ticket.busSchedule.arrivalStation}
            </span>
          </div>
        </div>

        {/* Seat & Passenger Info (세로 정보 리스트) */}
        <dl className="bg-surface-bright rounded-2xl border border-surface-container divide-y divide-surface-container text-caption">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <dt className="text-surface-outline">좌석 번호</dt>
            <dd className="font-extrabold text-primary text-right">{ticket.seatNumbers.join(', ')}번</dd>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <dt className="text-surface-outline whitespace-nowrap">탑승 인원</dt>
            <dd className="font-bold text-surface-on-surface text-right">{formatPassengerSummary(ticket.passengerCount)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <dt className="text-surface-outline">버스 등급</dt>
            <dd className="font-bold text-express text-right">{ticket.busSchedule.grade}</dd>
          </div>
        </dl>

        {/* QR Code Quick Area */}
        <div className="pt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenQR(ticket)}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-primary text-white text-body-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-hover active:scale-98 transition-all"
          >
            <QrCode className="w-4 h-4 text-[#93C5FD]" />
            <span>모바일 승차권 QR 검표</span>
          </button>
        </div>

        {/* Ticket Perforated Tear Line */}
        <div className="relative -mx-5 my-2">
          <div className="border-t-2 border-dashed border-surface-container-high" />
          <div className="absolute -left-3 -top-3 w-6 h-6 bg-surface-container-low rounded-full border-r border-surface-outline-variant" />
          <div className="absolute -right-3 -top-3 w-6 h-6 bg-surface-container-low rounded-full border-l border-surface-outline-variant" />
        </div>

        {/* AI Travel Assistant Linked Status */}
        <div className="p-3 bg-express-container rounded-2xl border border-express-border space-y-1.5 text-caption text-express-on-container">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-express" /> AI 이동 비서 연동
            </span>
            <span className="text-caption-xs bg-white px-2 py-0.5 rounded-full text-express">
              정상 작동 중
            </span>
          </div>
          <p className="text-caption-sm text-primary-hover">
            출발지: {ticket.originPlace} ({ticket.transitMode} 기준 30분 소요)
          </p>
          <div className="flex items-center justify-between text-caption pt-0.5">
            <span className="font-semibold text-surface-outline">권장 출발시간</span>
            <strong className="text-primary text-label font-black">
              {ticket.recommendedDepartureTime}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setTimelineStep('config');
              setCurrentTab('timeline');
            }}
            className="w-full mt-1.5 py-2 px-3 rounded-xl bg-white border border-[#93C5FD] text-express-on-container text-caption font-extrabold flex items-center justify-between hover:bg-express-soft/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ai-primary" />
              터미널 여유시간 맞춤형 타임라인
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Detail Accordion Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 text-caption text-surface-outline hover:text-surface-on-surface font-medium pt-1"
        >
          <span>{isExpanded ? '상세 정보 접기' : '예매 상세 정보 보기'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="pt-2 border-t border-surface-container space-y-2 text-caption text-surface-outline animate-in fade-in duration-150">
            <div className="flex justify-between">
              <span>예매 번호</span>
              <span className="font-mono font-semibold text-surface-on-surface">{ticket.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>출발 날짜</span>
              <span className="font-medium text-surface-on-surface">{ticket.travelDate}</span>
            </div>
            <div className="flex justify-between">
              <span>결제 금액</span>
              <span className="font-bold text-surface-on-surface">{formatPrice(ticket.totalFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>결제 수단</span>
              <span className="font-medium text-surface-on-surface">{ticket.paymentMethod}</span>
            </div>

            {/* Cancel / Modify actions */}
            <div className="pt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCancel(ticket)}
                className="flex-1 py-2 rounded-xl border border-error text-error text-caption font-semibold hover:bg-error-container transition-colors"
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
