'use client';

import React from 'react';
import { BusSchedule, SeatPassenger } from '@/types';
import { PASSENGER_TYPE_INFO, formatPrice } from '@/lib/utils';
import { BusTypeBadge, BusGradeBadge } from '../common/Badge';
import { BottomSheet } from '../common/BottomSheet';
import { Calendar, Armchair, ShieldCheck } from 'lucide-react';

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedPayment: () => void;
  schedule: BusSchedule;
  seats: SeatPassenger[];
  date: string;
  totalFee: number;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  isOpen,
  onClose,
  onProceedPayment,
  schedule,
  seats,
  date,
  totalFee,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="예매 정보 확인"
      footer={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#EEF2F6] text-[#334155] text-xs font-bold hover:bg-[#E2E8F0] transition-colors whitespace-nowrap"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onProceedPayment}
            className="flex-1 py-3 rounded-xl bg-[#132B45] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors shadow-md active:scale-98"
          >
            {formatPrice(totalFee)} 결제하기
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* 운행 정보 */}
        <section className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <BusTypeBadge busType={schedule.busType} />
              <BusGradeBadge grade={schedule.grade} />
              <span className="text-xs font-semibold text-[#475569] truncate">{schedule.company}</span>
            </div>
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded whitespace-nowrap">
              {schedule.platform}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-[#64748B] block">출발</span>
              <span className="text-xl font-black text-[#0F172A] tabular-nums">{schedule.departureTime}</span>
              <span className="text-xs font-medium text-[#475569] block">{schedule.departureStation}</span>
            </div>
            <div className="text-center text-[11px] text-[#94A3B8] whitespace-nowrap">
              <span>{schedule.duration}</span>
              <div className="w-12 h-0.5 bg-[#CBD5E1] mx-auto mt-1" />
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#64748B] block">도착예정</span>
              <span className="text-xl font-bold text-[#334155] tabular-nums">{schedule.arrivalTime}</span>
              <span className="text-xs font-medium text-[#475569] block">{schedule.arrivalStation}</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#64748B]">
              <Calendar className="w-3.5 h-3.5" /> 출발일
            </span>
            <span className="font-bold text-[#0F172A]">{date}</span>
          </div>
        </section>

        {/* 좌석 · 탑승 유형별 요금 */}
        <section className="space-y-2">
          <h4 className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-[#64748B]" /> 좌석 · 탑승 유형 ({seats.length}매)
          </h4>
          <ul className="rounded-2xl border border-[#EEF2F6] divide-y divide-[#F1F5F9]">
            {seats.map((s) => (
              <li key={s.seatNumber} className="px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2">
                  <span className="font-extrabold text-[#2563EB] whitespace-nowrap">{s.seatNumber}번</span>
                  <span className="text-[#475569] whitespace-nowrap">{PASSENGER_TYPE_INFO[s.type].label}</span>
                  {s.type !== 'adult' && (
                    <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded whitespace-nowrap">
                      {PASSENGER_TYPE_INFO[s.type].discountLabel}
                    </span>
                  )}
                </span>
                <span className="font-bold text-[#0F172A] tabular-nums whitespace-nowrap">{formatPrice(s.fare)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-sm font-bold text-[#0F172A]">총 결제금액</span>
            <span className="text-xl font-black text-[#132B45] tabular-nums">{formatPrice(totalFee)}</span>
          </div>
        </section>

        <div className="p-3 rounded-xl bg-[#EFF6FF] text-[11px] text-[#1D4ED8] flex items-start gap-2 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <span>출발 전까지 모바일 승차권으로 탑승구에서 바로 검표할 수 있습니다.</span>
        </div>
      </div>
    </BottomSheet>
  );
};
