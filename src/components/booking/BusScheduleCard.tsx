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
          ? 'border-express shadow-md ring-1 ring-express/30'
          : 'border-surface-container hover:border-surface-outline-variant shadow-xs'
      }`}
    >
      {/* AI Recommendation Banner */}
      {isAiRecommended && (
        <div className="bg-gradient-to-r from-express to-express-on-container text-white text-caption-xs font-bold px-3 py-0.5 rounded-br-xl absolute top-0 left-0 flex items-center gap-1 shadow-xs">
          <span>김지우 님 평소 이용 시간대 추천</span>
        </div>
      )}

      <div className={`flex items-center justify-between ${isAiRecommended ? 'pt-2.5' : ''}`}>
        <div className="flex items-center gap-1.5">
          <BusTypeBadge busType={schedule.busType} />
          <BusGradeBadge grade={schedule.grade} />
          <span className="text-caption font-semibold text-surface-subtle">{schedule.company}</span>
        </div>
        <div className="text-caption-sm font-bold text-surface-outline flex items-center gap-1">
          <Clock className="w-3 h-3 text-surface-outline" />
          <span>소요 {schedule.duration}</span>
        </div>
      </div>

      {/* Main Time & Station Layout */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          {/* Highlighted Departure Time */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-headline font-black text-surface-on-surface tracking-tight">
              {schedule.departureTime}
            </span>
            <span className="text-caption font-bold text-surface-outline">출발</span>
          </div>
          <span className="text-caption font-medium text-surface-subtle">{schedule.departureStation}</span>
        </div>

        <div className="flex flex-col items-center px-4">
          <ArrowRight className="w-5 h-5 text-surface-outline" />
          <span className="text-caption-xs font-semibold text-express mt-0.5 bg-express-container px-1.5 py-0.5 rounded">
            {schedule.platform}
          </span>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="text-title-sm font-bold text-surface-on-variant">
              {schedule.arrivalTime}
            </span>
            <span className="text-caption text-surface-outline">도착예정</span>
          </div>
          <span className="text-caption font-medium text-surface-subtle">{schedule.arrivalStation}</span>
        </div>
      </div>

      {/* Footer Info: Seats & Price */}
      <div className="mt-3 pt-2.5 border-t border-surface-soft flex items-center justify-between">
        <div className="flex items-center gap-1 text-caption font-medium">
          <Armchair className="w-3.5 h-3.5 text-surface-outline" />
          <span className="text-surface-outline">잔여</span>
          <span
            className={`font-bold ${
              schedule.remainingSeats <= 5 ? 'text-error' : 'text-intercity'
            }`}
          >
            {schedule.remainingSeats}석
          </span>
          <span className="text-surface-outline text-caption-sm">/ {schedule.totalSeats}석</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-body font-black text-primary">
            {formatPrice(schedule.fee)}
          </span>
          <button
            type="button"
            className={`text-caption-sm font-bold px-3 py-1.5 rounded-xl text-white shadow-xs ${
              isExpress ? 'bg-express' : 'bg-intercity'
            }`}
          >
            좌석선택
          </button>
        </div>
      </div>
    </div>
  );
};
