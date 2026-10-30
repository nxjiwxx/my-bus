'use client';

import React from 'react';
import { BusSchedule } from '@/types';
import { BusTypeBadge, BusGradeBadge } from '../common/Badge';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Clock, Armchair } from 'lucide-react';

interface BusScheduleCardProps {
  schedule: BusSchedule;
  onSelect: (schedule: BusSchedule) => void;
  isAiRecommended?: boolean;
}

export const BusScheduleCard: React.FC<BusScheduleCardProps> = ({
  schedule,
  onSelect,
  isAiRecommended = false,
}) => {
  const isExpress = schedule.busType === 'express';

  return (
    <div
      onClick={() => onSelect(schedule)}
      className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer relative overflow-hidden active:scale-99 ${
        isAiRecommended
          ? 'border-[#2563EB] shadow-md ring-1 ring-[#2563EB]/30'
          : 'border-[#EEF2F6] hover:border-[#CBD5E1] shadow-xs'
      }`}
    >
      {/* AI Recommendation Banner */}
      {isAiRecommended && (
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-[10px] font-bold px-3 py-0.5 rounded-br-xl absolute top-0 left-0 flex items-center gap-1 shadow-xs">
          <span>김지우 님 평소 이용 시간대 추천</span>
        </div>
      )}

      <div className={`flex items-center justify-between ${isAiRecommended ? 'pt-2.5' : ''}`}>
        <div className="flex items-center gap-1.5">
          <BusTypeBadge busType={schedule.busType} />
          <BusGradeBadge grade={schedule.grade} />
          <span className="text-xs font-semibold text-[#475569]">{schedule.company}</span>
        </div>
        <div className="text-[11px] font-bold text-[#64748B] flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#94A3B8]" />
          <span>소요 {schedule.duration}</span>
        </div>
      </div>

      {/* Main Time & Station Layout */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          {/* Highlighted Departure Time */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#0F172A] tracking-tight">
              {schedule.departureTime}
            </span>
            <span className="text-xs font-bold text-[#64748B]">출발</span>
          </div>
          <span className="text-xs font-medium text-[#475569]">{schedule.departureStation}</span>
        </div>

        <div className="flex flex-col items-center px-4">
          <ArrowRight className="w-5 h-5 text-[#94A3B8]" />
          <span className="text-[10px] font-semibold text-[#2563EB] mt-0.5 bg-[#EFF6FF] px-1.5 py-0.2 rounded">
            {schedule.platform}
          </span>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="text-lg font-bold text-[#334155]">
              {schedule.arrivalTime}
            </span>
            <span className="text-xs text-[#64748B]">도착예정</span>
          </div>
          <span className="text-xs font-medium text-[#475569]">{schedule.arrivalStation}</span>
        </div>
      </div>

      {/* Footer Info: Seats & Price */}
      <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium">
          <Armchair className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[#64748B]">잔여</span>
          <span
            className={`font-bold ${
              schedule.remainingSeats <= 5 ? 'text-[#DC2626]' : 'text-[#059669]'
            }`}
          >
            {schedule.remainingSeats}석
          </span>
          <span className="text-[#94A3B8] text-[11px]">/ {schedule.totalSeats}석</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-black text-[#132B45]">
            {formatPrice(schedule.fee)}
          </span>
          <button
            type="button"
            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl text-white shadow-xs ${
              isExpress ? 'bg-[#2563EB]' : 'bg-[#059669]'
            }`}
          >
            좌석선택
          </button>
        </div>
      </div>
    </div>
  );
};
