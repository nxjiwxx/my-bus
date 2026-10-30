'use client';

import React, { useState } from 'react';
import { BusSchedule, SeatInfo } from '@/types';
import { generateInitialSeats } from '@/mock/data';
import { formatPrice } from '@/lib/utils';
import { BusTypeBadge } from '../common/Badge';
import { Armchair, Sparkles } from 'lucide-react';

interface SeatSelectorProps {
  schedule: BusSchedule;
  passengerCount: number;
  onConfirm: (selectedSeats: number[]) => void;
  onBack: () => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  schedule,
  passengerCount,
  onConfirm,
  onBack,
}) => {
  const [seats, setSeats] = useState<SeatInfo[]>(() => generateInitialSeats(7));
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([7]);

  const isExpress = schedule.busType === 'express';

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.status === 'occupied' || seat.status === 'disabled') return;

    if (selectedSeatNumbers.includes(seat.number)) {
      setSelectedSeatNumbers(selectedSeatNumbers.filter((n) => n !== seat.number));
    } else {
      if (selectedSeatNumbers.length >= passengerCount) {
        // 인원수 초과 시 첫 번째 선택 교체
        setSelectedSeatNumbers([...selectedSeatNumbers.slice(1), seat.number]);
      } else {
        setSelectedSeatNumbers([...selectedSeatNumbers, seat.number]);
      }
    }
  };

  const totalFee = schedule.fee * (selectedSeatNumbers.length || passengerCount);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9]">
      {/* Top Header Summary */}
      <div className="bg-white p-4 border-b border-[#EEF2F6] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <BusTypeBadge busType={schedule.busType} />
            <span className="text-xs font-bold text-[#0F172A]">{schedule.departureTime} 출발</span>
          </div>
          <span className="text-xs text-[#64748B]">
            {schedule.departureStation} → {schedule.arrivalStation} ({schedule.grade} {schedule.platform})
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#64748B] block">선택 필요</span>
          <span className="text-xs font-bold text-[#2563EB]">
            {selectedSeatNumbers.length} / {passengerCount}석
          </span>
        </div>
      </div>

      {/* AI Seat Recommendation Tag */}
      <div className="m-4 mb-2 p-2.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2 text-xs text-[#1D4ED8]">
        <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0" />
        <span>김지우 님이 선호하시는 <strong>7번 단독석</strong>이 자동 선택되었습니다.</span>
      </div>

      {/* Seat Status Legend */}
      <div className="px-4 py-2 flex items-center justify-center gap-4 text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-white border border-[#CBD5E1]" />
          <span>선택가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-4 h-4 rounded text-white flex items-center justify-center ${isExpress ? 'bg-[#2563EB]' : 'bg-[#059669]'}`}>
            ✓
          </div>
          <span>선택됨</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-[#E2E8F0] border border-[#CBD5E1]" />
          <span>예매완료</span>
        </div>
      </div>

      {/* Bus Layout Frame */}
      <div className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
        <div className="max-w-[280px] mx-auto bg-white rounded-3xl p-4 shadow-sm border border-[#E2E8F0]">
          {/* Front / Driver Area */}
          <div className="pb-3 mb-3 border-b border-[#EEF2F6] flex items-center justify-between text-[11px] font-bold text-[#94A3B8]">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded bg-[#EEF2F6] flex items-center justify-center text-[10px] text-[#475569]">
                운
              </div>
              <span>운전석</span>
            </div>
            <div className="flex items-center gap-1">
              <span>출입문</span>
              <div className="w-2 h-4 rounded-r bg-[#CBD5E1]" />
            </div>
          </div>

          {/* 28-Seat Layout Grid (1 Column aisle 2 Columns) */}
          <div className="space-y-2.5">
            {/* Generate rows 1 to 9 */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((rowIdx) => {
              // 28 seats: Rows 1-8 have 3 seats (1 left, 2 right). Row 9 (back) has 4 seats.
              const seatA = seats[rowIdx * 3];
              const seatB = seats[rowIdx * 3 + 1];
              const seatC = seats[rowIdx * 3 + 2];
              const isLastRow = rowIdx === 8;

              return (
                <div key={rowIdx} className="flex items-center justify-between">
                  {/* Left Single Seat */}
                  {seatA ? (
                    <SeatButton
                      seat={seatA}
                      isSelected={selectedSeatNumbers.includes(seatA.number)}
                      isExpress={isExpress}
                      onClick={() => handleSeatClick(seatA)}
                    />
                  ) : (
                    <div className="w-9 h-9" />
                  )}

                  {/* Aisle */}
                  <div className="w-6 text-center text-[10px] text-[#CBD5E1] font-mono select-none">
                    {rowIdx + 1}
                  </div>

                  {/* Right Dual Seats */}
                  <div className="flex items-center gap-2">
                    {seatB && (
                      <SeatButton
                        seat={seatB}
                        isSelected={selectedSeatNumbers.includes(seatB.number)}
                        isExpress={isExpress}
                        onClick={() => handleSeatClick(seatB)}
                      />
                    )}
                    {seatC && (
                      <SeatButton
                        seat={seatC}
                        isSelected={selectedSeatNumbers.includes(seatC.number)}
                        isExpress={isExpress}
                        onClick={() => handleSeatClick(seatC)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-[#EEF2F6] p-4 shadow-lg safe-bottom">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] text-[#64748B] block">선택 좌석</span>
            <div className="text-sm font-extrabold text-[#0F172A]">
              {selectedSeatNumbers.length > 0
                ? selectedSeatNumbers.map((n) => `${n}번`).join(', ')
                : '좌석을 선택해 주세요'}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#64748B] block">총 결제예정금액</span>
            <span className="text-lg font-black text-[#132B45]">{formatPrice(totalFee)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="py-3 px-4 rounded-2xl bg-[#EEF2F6] text-[#334155] text-xs font-bold hover:bg-[#E2E8F0] transition-colors"
          >
            이전
          </button>
          <button
            type="button"
            disabled={selectedSeatNumbers.length === 0}
            onClick={() => onConfirm(selectedSeatNumbers)}
            className={`flex-1 py-3 rounded-2xl text-white text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed ${
              isExpress ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#059669] hover:bg-[#047857]'
            }`}
          >
            {selectedSeatNumbers.length}개 좌석 선택 완료 (예매 확인)
          </button>
        </div>
      </div>
    </div>
  );
};

const SeatButton: React.FC<{
  seat: SeatInfo;
  isSelected: boolean;
  isExpress: boolean;
  onClick: () => void;
}> = ({ seat, isSelected, isExpress, onClick }) => {
  const isOccupied = seat.status === 'occupied';

  let bgClass = 'bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#2563EB]';
  if (isOccupied) {
    bgClass = 'bg-[#EEF2F6] border-[#CBD5E1] text-[#94A3B8] cursor-not-allowed opacity-60';
  } else if (isSelected) {
    bgClass = isExpress
      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs font-extrabold'
      : 'bg-[#059669] border-[#059669] text-white shadow-xs font-extrabold';
  }

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={onClick}
      className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all relative ${bgClass}`}
    >
      <span>{seat.number}</span>
      {seat.number === 7 && !isOccupied && !isSelected && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] absolute top-1 right-1" />
      )}
    </button>
  );
};
