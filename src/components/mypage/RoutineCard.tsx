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
          ? 'border-surface-container'
          : 'border-surface-container-high opacity-60 bg-surface-bright'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BusTypeBadge busType={routine.busType} />
          <h4 className="font-extrabold text-label text-surface-on-surface">{routine.title}</h4>
        </div>
        <button
          type="button"
          onClick={() => onToggle(routine.id)}
          className={`flex items-center gap-1 text-caption-sm font-bold px-2.5 py-1 rounded-full transition-colors ${
            routine.isActive
              ? 'bg-intercity-container text-intercity-on-container hover:bg-[#D1FAE5]'
              : 'bg-surface-container text-surface-outline hover:bg-surface-container-high'
          }`}
        >
          <Power className="w-3 h-3" />
          <span>{routine.isActive ? '루틴 실행 중' : '일시 중지됨'}</span>
        </button>
      </div>

      {/* Route Details */}
      <div className="p-3 bg-surface-bright rounded-2xl border border-surface-container space-y-1.5 text-caption">
        <div className="flex items-center justify-between font-bold text-surface-on-surface">
          <span>{routine.departureStation} → {routine.arrivalStation}</span>
          <span className="text-express">{routine.preferredTime}</span>
        </div>
        <div className="flex items-center gap-2 text-caption-sm text-surface-outline">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-surface-outline" />
            매주 {routine.daysOfWeek.join(', ')}요일
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-surface-outline" />
            출발지: {routine.originPlace}
          </span>
        </div>
        <div className="text-caption-sm text-intercity font-medium pt-0.5">
          {routine.transitMode} (터미널까지 약 {routine.estimatedTransitMinutes}분 소요)
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between text-caption pt-1">
        <span className="text-caption-sm text-surface-outline">
          AI 예측 예매 제안 적용 노선
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(routine.id)}
            className="text-caption font-semibold text-surface-subtle hover:text-surface-on-surface px-2 py-1 rounded-lg hover:bg-surface-soft"
          >
            {routine.isActive ? '일시 중지' : '다시 시작'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(routine.id)}
            className="text-caption font-semibold text-error hover:text-error-on-container p-1 rounded-lg hover:bg-error-container"
            title="루틴 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
