'use client';

import React, { useState } from 'react';
import { BusSchedule } from '@/types';
import { getRouteStops } from '@/mock/data';
import { BottomSheet } from '../common/BottomSheet';
import { Coffee, Clock } from 'lucide-react';

interface RouteMapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: BusSchedule;
}

// 버스 노선도 상세보기 바텀시트
export const RouteMapSheet: React.FC<RouteMapSheetProps> = ({ isOpen, onClose, schedule }) => {
  const stops = getRouteStops(schedule);
  const isExpress = schedule.busType === 'express';
  const lineColor = isExpress ? '#2563EB' : '#059669';

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="노선도 상세보기"
      subtitle={`${schedule.departureStation} → ${schedule.arrivalStation} · ${schedule.company} ${schedule.grade}`}
    >
      {/* 요약 */}
      <div className="rounded-2xl bg-surface-bright border border-surface-container divide-y divide-surface-container mb-5">
        <div className="flex items-center justify-between px-4 py-2.5 text-caption">
          <span className="text-surface-outline">출발 · 도착</span>
          <span className="font-extrabold text-surface-on-surface">
            {schedule.departureTime} → {schedule.arrivalTime}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-caption">
          <span className="text-surface-outline">총 소요시간</span>
          <span className="font-extrabold text-surface-on-surface">{schedule.duration}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-caption">
          <span className="text-surface-outline">승차장</span>
          <span className="font-extrabold" style={{ color: lineColor }}>
            {schedule.platform}
          </span>
        </div>
      </div>

      {/* 노선도 */}
      <ol className="relative">
        {stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;
          const isTerminal = isFirst || isLast;

          return (
            <li key={stop.name} className="relative flex gap-3 pb-6 last:pb-0">
              <span className="w-11 shrink-0 text-right text-caption font-black text-surface-on-surface tabular-nums pt-0.5">
                {stop.time}
              </span>

              {/* 노선선 + 정류장 노드 */}
              <div className="relative w-5 shrink-0">
                {!isLast && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 top-3 -bottom-[14px] w-1.5 rounded-full"
                    style={{ backgroundColor: lineColor }}
                  />
                )}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 top-0.5 rounded-full bg-white border-[3px] ${
                    isTerminal ? 'w-5 h-5' : 'w-3.5 h-3.5 top-1'
                  }`}
                  style={{ borderColor: lineColor }}
                />
                {isTerminal && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 top-[7px] w-2 h-2 rounded-full"
                    style={{ backgroundColor: lineColor }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-label tracking-tight ${
                      isTerminal ? 'font-black text-surface-on-surface' : 'font-bold text-surface-on-variant'
                    }`}
                  >
                    {stop.name}
                  </span>
                  {isFirst && (
                    <span className="text-caption-xs font-bold text-white px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: lineColor }}>
                      기점
                    </span>
                  )}
                  {isLast && (
                    <span className="text-caption-xs font-bold text-white px-1.5 py-0.5 rounded bg-surface-on-surface whitespace-nowrap">
                      종점
                    </span>
                  )}
                  {stop.kind === 'rest' && (
                    <span className="text-caption-xs font-bold text-warning-on-container bg-warning-container px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 whitespace-nowrap">
                      <Coffee className="w-2.5 h-2.5" /> 휴게소
                    </span>
                  )}
                </div>
                {stop.note && <p className="text-caption-sm text-surface-outline mt-0.5">{stop.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 text-caption-sm text-surface-outline leading-relaxed flex items-start gap-1.5">
        <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>경유지 도착 시각은 교통 상황에 따라 달라질 수 있는 예상 시각입니다.</span>
      </p>
    </BottomSheet>
  );
};
