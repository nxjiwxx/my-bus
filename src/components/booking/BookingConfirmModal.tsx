'use client';

import React from 'react';
import { BusSchedule } from '@/types';
import { PassengerState } from './PassengerModal';
import { formatPrice } from '@/lib/utils';
import { BusTypeBadge, BusGradeBadge } from '../common/Badge';
import { X, Calendar, Clock, MapPin, Users, Armchair, ShieldCheck } from 'lucide-react';

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedPayment: () => void;
  schedule: BusSchedule;
  seats: number[];
  date: string;
  passengers: PassengerState;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  isOpen,
  onClose,
  onProceedPayment,
  schedule,
  seats,
  date,
  passengers,
}) => {
  if (!isOpen) return null;

  const totalPassengers = passengers.adult + passengers.teen + passengers.child;
  const totalFee = schedule.fee * seats.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <h3 className="font-extrabold text-base text-[#0F172A]">예매 정보 확인</h3>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Summary */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BusTypeBadge busType={schedule.busType} />
              <BusGradeBadge grade={schedule.grade} />
              <span className="text-xs font-semibold text-[#475569]">{schedule.company}</span>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
              {schedule.platform}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs text-[#64748B] block">출발</span>
              <span className="text-lg font-black text-[#0F172A]">{schedule.departureTime}</span>
              <span className="text-xs font-medium text-[#475569] block">{schedule.departureStation}</span>
            </div>
            <div className="text-center text-xs text-[#94A3B8]">
              <span>소요 {schedule.duration}</span>
              <div className="w-16 h-0.5 bg-[#CBD5E1] mx-auto my-1" />
            </div>
            <div className="text-right">
              <span className="text-xs text-[#64748B] block">도착예정</span>
              <span className="text-lg font-bold text-[#334155]">{schedule.arrivalTime}</span>
              <span className="text-xs font-medium text-[#475569] block">{schedule.arrivalStation}</span>
            </div>
          </div>
        </div>

        {/* Detailed Items Table */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 출발일시
            </span>
            <span className="font-semibold text-[#0F172A]">{date}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 승객 인원
            </span>
            <span className="font-semibold text-[#0F172A]">
              어른 {passengers.adult}명 {passengers.teen > 0 && `, 중고생 ${passengers.teen}명`} {passengers.child > 0 && `, 아동 ${passengers.child}명`}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5" /> 선택 좌석
            </span>
            <span className="font-extrabold text-[#2563EB]">
              {seats.map((s) => `${s}번`).join(', ')} (우등 단독석)
            </span>
          </div>

          <div className="flex items-center justify-between py-2 text-sm">
            <span className="font-bold text-[#0F172A]">총 결제금액</span>
            <span className="text-lg font-black text-[#132B45]">{formatPrice(totalFee)}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[11px] text-[#1D4ED8] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>출발 전까지 모바일 승차권으로 탑승구 즉시 검표가 가능합니다.</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#EEF2F6] text-[#334155] text-xs font-bold hover:bg-[#E2E8F0] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onProceedPayment}
            className="flex-1 py-3 rounded-xl bg-[#132B45] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors shadow-md active:scale-98"
          >
            결제하기 ({formatPrice(totalFee)})
          </button>
        </div>
      </div>
    </div>
  );
};
