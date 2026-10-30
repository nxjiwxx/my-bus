'use client';

import React from 'react';
import { TravelRoutine } from '@/types';
import { BusTypeBadge } from '../common/Badge';
import { Calendar, Clock, MapPin, Bus, Power, Trash2, Edit3 } from 'lucide-react';

interface RoutineCardProps {
  routine: TravelRoutine;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onToggle,
  onDelete,
}) => {
  return (
    <div
      className={`bg-white rounded-3xl p-4 border transition-all shadow-xs space-y-3 ${
        routine.isActive
          ? 'border-[#EEF2F6]'
          : 'border-[#E2E8F0] opacity-60 bg-[#F8FAFC]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BusTypeBadge busType={routine.busType} />
          <h4 className="font-extrabold text-sm text-[#0F172A]">{routine.title}</h4>
        </div>
        <button
          type="button"
          onClick={() => onToggle(routine.id)}
          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
            routine.isActive
              ? 'bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]'
              : 'bg-[#EEF2F6] text-[#64748B] hover:bg-[#E2E8F0]'
          }`}
        >
          <Power className="w-3 h-3" />
          <span>{routine.isActive ? '루틴 실행 중' : '일시 중지됨'}</span>
        </button>
      </div>

      {/* Route Details */}
      <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] space-y-1.5 text-xs">
        <div className="flex items-center justify-between font-bold text-[#0F172A]">
          <span>{routine.departureStation} → {routine.arrivalStation}</span>
          <span className="text-[#2563EB]">{routine.preferredTime}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#94A3B8]" />
            매주 {routine.daysOfWeek.join(', ')}요일
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#94A3B8]" />
            출발지: {routine.originPlace}
          </span>
        </div>
        <div className="text-[11px] text-[#059669] font-medium pt-0.5">
          {routine.transitMode} (터미널까지 약 {routine.estimatedTransitMinutes}분 소요)
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-[11px] text-[#94A3B8]">
          AI 예측 예매 제안 적용 노선
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(routine.id)}
            className="text-xs font-semibold text-[#475569] hover:text-[#0F172A] px-2 py-1 rounded-lg hover:bg-[#F1F5F9]"
          >
            {routine.isActive ? '일시 중지' : '다시 시작'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(routine.id)}
            className="text-xs font-semibold text-[#DC2626] hover:text-[#991B1B] p-1 rounded-lg hover:bg-[#FEE2E2]"
            title="루틴 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
