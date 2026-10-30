'use client';

import React from 'react';
import { PassengerType } from '@/types';
import { BottomSheet } from '../common/BottomSheet';
import { PASSENGER_TYPE_INFO, PASSENGER_TYPE_ORDER, calcFare, formatPrice } from '@/lib/utils';
import { Check, BadgeCheck } from 'lucide-react';

interface SeatPassengerSheetProps {
  isOpen: boolean;
  seatNumber: number | null;
  baseFee: number;
  currentType?: PassengerType;
  isVeteranVerified?: boolean;
  isExpress: boolean;
  onSelectType: (type: PassengerType) => void;
  onRemove: () => void;
  onClose: () => void;
}

// 좌석 선택 시 나타나는 탑승 유형 선택 바텀시트
export const SeatPassengerSheet: React.FC<SeatPassengerSheetProps> = ({
  isOpen,
  seatNumber,
  baseFee,
  currentType,
  isVeteranVerified,
  isExpress,
  onSelectType,
  onRemove,
  onClose,
}) => {
  if (seatNumber === null) return null;
  const accent = isExpress ? '#2563EB' : '#059669';

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${seatNumber}번 좌석 탑승 유형`}
      subtitle="탑승하실 분의 유형을 선택해 주세요. 유형에 따라 요금이 달라집니다."
      footer={
        currentType ? (
          <button
            type="button"
            onClick={onRemove}
            className="w-full py-3 rounded-2xl border border-[#FCA5A5] text-[#DC2626] text-xs font-bold hover:bg-[#FEF2F2] transition-colors"
          >
            이 좌석 선택 해제
          </button>
        ) : undefined
      }
    >
      <ul className="space-y-2">
        {PASSENGER_TYPE_ORDER.map((type) => {
          const info = PASSENGER_TYPE_INFO[type];
          const fare = calcFare(baseFee, type);
          const isCurrent = currentType === type;
          return (
            <li key={type}>
              <button
                type="button"
                onClick={() => onSelectType(type)}
                className={`w-full px-4 py-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-99 ${
                  isCurrent ? 'bg-[#F8FAFC]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
                style={isCurrent ? { borderColor: accent, boxShadow: `0 0 0 1px ${accent}` } : undefined}
              >
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isCurrent ? 'text-white' : 'border-[#CBD5E1] bg-white'
                  }`}
                  style={isCurrent ? { backgroundColor: accent, borderColor: accent } : undefined}
                >
                  {isCurrent && <Check className="w-3 h-3" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-extrabold text-[#0F172A]">{info.label}</span>
                    {type !== 'adult' && (
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded whitespace-nowrap">
                        {info.discountLabel}
                      </span>
                    )}
                    {type === 'veteran' && isCurrent && isVeteranVerified && (
                      <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 whitespace-nowrap">
                        <BadgeCheck className="w-3 h-3" /> 인증완료
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">{info.desc}</span>
                </span>
                <span className="text-sm font-black text-[#132B45] whitespace-nowrap tabular-nums">
                  {formatPrice(fare)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
};
