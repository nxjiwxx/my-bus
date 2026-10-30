'use client';

import React from 'react';
import { Footprints } from 'lucide-react';

// ==========================================
// 버스 노선도 형태의 세로 노선 레일
// 좌측 시각 · 중앙 노선선(정류장 노드) · 우측 내용으로 구성
// ==========================================

export type RailNodeKind = 'origin' | 'stop' | 'current' | 'done' | 'terminal' | 'none';

interface RouteRowProps {
  time?: string;
  timeSub?: string;
  node: RailNodeKind;
  /** 노드 위쪽 노선선 색 (없으면 선 미표시) */
  topColor?: string | null;
  /** 노드 아래쪽 노선선 색 (없으면 선 미표시) */
  bottomColor?: string | null;
  nodeColor?: string;
  /** 노드 중심의 세로 위치(px) */
  nodeY?: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  contentClassName?: string;
}

const NODE_SIZE: Record<Exclude<RailNodeKind, 'none'>, number> = {
  origin: 18,
  stop: 16,
  current: 28,
  done: 16,
  terminal: 24,
};

export const RouteRow: React.FC<RouteRowProps> = ({
  time,
  timeSub,
  node,
  topColor,
  bottomColor,
  nodeColor = '#2563EB',
  nodeY = 22,
  icon,
  children,
  contentClassName = '',
}) => {
  const size = node === 'none' ? 0 : NODE_SIZE[node];

  return (
    <div className="flex">
      {/* 시각 */}
      <div className="w-12 shrink-0 text-right pr-2" style={{ paddingTop: Math.max(0, nodeY - 8) }}>
        {time && <span className="block text-xs font-black text-[#0F172A] tabular-nums leading-4">{time}</span>}
        {timeSub && <span className="block text-[10px] font-medium text-[#94A3B8] leading-3 mt-0.5">{timeSub}</span>}
      </div>

      {/* 노선 레일 */}
      <div className="relative w-7 shrink-0">
        {node === 'none' ? (
          (topColor || bottomColor) && (
            <span
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5"
              style={{ backgroundColor: (topColor || bottomColor) as string }}
            />
          )
        ) : (
          <>
            {topColor && (
              <span
                className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5"
                style={{ height: nodeY, backgroundColor: topColor }}
              />
            )}
            {bottomColor && (
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1.5"
                style={{ top: nodeY, backgroundColor: bottomColor }}
              />
            )}
            <span
              className={`absolute left-1/2 flex items-center justify-center rounded-full ${
                node === 'current' ? 'text-white shadow-md' : ''
              }`}
              style={{
                width: size,
                height: size,
                top: nodeY - size / 2,
                transform: 'translateX(-50%)',
                backgroundColor:
                  node === 'stop' || node === 'origin' ? '#FFFFFF' : nodeColor,
                border:
                  node === 'stop' || node === 'origin'
                    ? `3px solid ${nodeColor}`
                    : node === 'current'
                    ? '3px solid #FFFFFF'
                    : 'none',
                boxShadow: node === 'current' ? `0 0 0 3px ${nodeColor}55` : undefined,
              }}
            >
              {icon}
            </span>
          </>
        )}
      </div>

      {/* 내용 */}
      <div className={`flex-1 min-w-0 ${contentClassName}`}>{children}</div>
    </div>
  );
};

// 시설 간 도보 이동 구간 표시
export const WalkSegment: React.FC<{
  minutes: number;
  topColor: string;
  note?: string;
}> = ({ minutes, topColor, note }) => (
  <RouteRow node="none" topColor={topColor} contentClassName="py-2">
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#475569] bg-white border border-[#E2E8F0] rounded-full pl-2 pr-3 py-1 whitespace-nowrap shadow-xs">
      <Footprints className="w-3.5 h-3.5 text-[#2563EB]" />
      도보 {minutes}분{note ? ` · ${note}` : ''}
    </span>
  </RouteRow>
);

export const RAIL_COLORS = {
  done: '#94A3B8',
  active: '#2563EB',
  boarding: '#059669',
};
