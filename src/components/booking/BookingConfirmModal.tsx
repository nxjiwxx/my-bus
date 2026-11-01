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
            className="py-3 px-4 rounded-xl bg-surface-container text-surface-on-variant text-caption font-bold hover:bg-surface-container-high transition-colors whitespace-nowrap"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onProceedPayment}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-white text-body-sm font-bold hover:bg-primary-hover transition-colors shadow-md active:scale-98"
          >
            {formatPrice(totalFee)} 결제하기
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* 운행 정보 */}
        <section className="p-4 rounded-2xl bg-surface-bright border border-surface-container space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <BusTypeBadge busType={schedule.busType} />
              <BusGradeBadge grade={schedule.grade} />
              <span className="text-caption font-semibold text-surface-subtle truncate">{schedule.company}</span>
            </div>
            <span className="text-caption font-bold text-express bg-express-container px-2 py-0.5 rounded whitespace-nowrap">
              {schedule.platform}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-caption-sm text-surface-outline block">출발</span>
              <span className="text-title font-black text-surface-on-surface tabular-nums">{schedule.departureTime}</span>
              <span className="text-caption font-medium text-surface-subtle block">{schedule.departureStation}</span>
            </div>
            <div className="text-center text-caption-sm text-surface-outline whitespace-nowrap">
              <span>{schedule.duration}</span>
              <div className="w-12 h-0.5 bg-surface-outline-variant mx-auto mt-1" />
            </div>
            <div className="text-right">
              <span className="text-caption-sm text-surface-outline block">도착예정</span>
              <span className="text-title font-bold text-surface-on-variant tabular-nums">{schedule.arrivalTime}</span>
              <span className="text-caption font-medium text-surface-subtle block">{schedule.arrivalStation}</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-surface-container-high flex items-center justify-between text-caption">
            <span className="flex items-center gap-1.5 text-surface-outline">
              <Calendar className="w-3.5 h-3.5" /> 출발일
            </span>
            <span className="font-bold text-surface-on-surface">{date}</span>
          </div>
        </section>

        {/* 좌석 · 탑승 유형별 요금 */}
        <section className="space-y-2">
          <h4 className="text-caption font-extrabold text-surface-on-surface flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-surface-outline" /> 좌석 · 탑승 유형 ({seats.length}매)
          </h4>
          <ul className="rounded-2xl border border-surface-container divide-y divide-surface-soft">
            {seats.map((s) => (
              <li key={s.seatNumber} className="px-4 py-2.5 flex items-center justify-between gap-2 text-caption">
                <span className="flex items-center gap-2">
                  <span className="font-extrabold text-express whitespace-nowrap">{s.seatNumber}번</span>
                  <span className="text-surface-subtle whitespace-nowrap">{PASSENGER_TYPE_INFO[s.type].label}</span>
                  {s.type !== 'adult' && (
                    <span className="text-caption-xs font-bold text-express bg-express-container px-1.5 py-0.5 rounded whitespace-nowrap">
                      {PASSENGER_TYPE_INFO[s.type].discountLabel}
                    </span>
                  )}
                </span>
                <span className="font-bold text-surface-on-surface tabular-nums whitespace-nowrap">{formatPrice(s.fare)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-label font-bold text-surface-on-surface">총 결제금액</span>
            <span className="text-title font-black text-primary tabular-nums">{formatPrice(totalFee)}</span>
          </div>
        </section>

        <div className="p-3 rounded-xl bg-express-container text-caption-sm text-express-on-container flex items-start gap-2 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-express shrink-0 mt-0.5" />
          <span>출발 전까지 모바일 승차권으로 탑승구에서 바로 검표할 수 있습니다.</span>
        </div>
      </div>
    </BottomSheet>
  );
};
