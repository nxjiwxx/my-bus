'use client';

import React, { useState } from 'react';
import { BusSchedule, PassengerType, SeatInfo, SeatPassenger } from '@/types';
import { generateInitialSeats } from '@/mock/data';
import {
  MAX_TICKETS_PER_BOOKING,
  PASSENGER_TYPE_INFO,
  calcFare,
  formatPrice,
} from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { BusTypeBadge } from '../common/Badge';
import { SeatPassengerSheet } from './SeatPassengerSheet';
import { VeteranVerifyModal } from './VeteranVerifyModal';
import { RouteMapSheet } from './RouteMapSheet';
import { Sparkles, Route, ChevronRight, BadgeCheck } from 'lucide-react';

interface SeatSelectorProps {
  schedule: BusSchedule;
  onConfirm: (selected: SeatPassenger[]) => void;
  onBack: () => void;
}

const TYPE_SHORT: Record<PassengerType, string> = {
  adult: '어른',
  teen: '중고',
  child: '아동',
  veteran: '보훈',
};

export const SeatSelector: React.FC<SeatSelectorProps> = ({ schedule, onConfirm, onBack }) => {
  const { showToast } = useApp();
  const [seats] = useState<SeatInfo[]>(() => generateInitialSeats(7));
  // AI가 추천한 7번 단독석은 어른 요금으로 기본 선택
  const [selected, setSelected] = useState<SeatPassenger[]>([
    { seatNumber: 7, type: 'adult', fare: calcFare(schedule.fee, 'adult') },
  ]);

  const [sheetSeat, setSheetSeat] = useState<number | null>(null);
  const [veteranSeat, setVeteranSeat] = useState<number | null>(null);
  const [isRouteOpen, setIsRouteOpen] = useState(false);

  const isExpress = schedule.busType === 'express';
  const accent = isExpress ? '#2563EB' : '#059669';
  const accentBg = isExpress ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#059669] hover:bg-[#047857]';

  const findSelected = (n: number) => selected.find((s) => s.seatNumber === n);
  const sortedSelected = [...selected].sort((a, b) => a.seatNumber - b.seatNumber);
  const totalFee = selected.reduce((sum, s) => sum + s.fare, 0);

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.status === 'occupied' || seat.status === 'disabled') return;
    if (!findSelected(seat.number) && selected.length >= MAX_TICKETS_PER_BOOKING) {
      showToast(`한 번에 최대 ${MAX_TICKETS_PER_BOOKING}매까지 예매할 수 있어요.`);
      return;
    }
    setSheetSeat(seat.number);
  };

  const assignType = (seatNumber: number, type: PassengerType, veteranVerified = false) => {
    const next: SeatPassenger = {
      seatNumber,
      type,
      fare: calcFare(schedule.fee, type),
      veteranVerified: type === 'veteran' ? veteranVerified : undefined,
    };
    setSelected((prev) => [...prev.filter((s) => s.seatNumber !== seatNumber), next]);
  };

  const handleSelectType = (type: PassengerType) => {
    if (sheetSeat === null) return;
    if (type === 'veteran') {
      const current = findSelected(sheetSeat);
      if (current?.type === 'veteran' && current.veteranVerified) {
        setSheetSeat(null);
        return;
      }
      setVeteranSeat(sheetSeat);
      return;
    }
    assignType(sheetSeat, type);
    setSheetSeat(null);
  };

  const handleVeteranVerified = () => {
    if (veteranSeat === null) return;
    assignType(veteranSeat, 'veteran', true);
    showToast(`${veteranSeat}번 좌석 보훈 인증이 완료되어 1매가 추가되었습니다.`);
    setVeteranSeat(null);
    setSheetSeat(null);
  };

  const handleRemove = () => {
    if (sheetSeat === null) return;
    setSelected((prev) => prev.filter((s) => s.seatNumber !== sheetSeat));
    setSheetSeat(null);
  };

  const renderSeat = (seat?: SeatInfo) =>
    seat ? (
      <SeatButton
        key={seat.number}
        seat={seat}
        passenger={findSelected(seat.number)}
        isExpress={isExpress}
        onClick={() => handleSeatClick(seat)}
      />
    ) : (
      <div className="w-10 h-11" />
    );

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9]">
      {/* 운행 정보 + 노선도 상세보기 */}
      <div className="bg-white px-4 py-3.5 border-b border-[#EEF2F6] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <BusTypeBadge busType={schedule.busType} />
              <span className="text-sm font-extrabold text-[#0F172A] whitespace-nowrap">
                {schedule.departureTime} 출발
              </span>
            </div>
            <span className="text-xs text-[#64748B] block">
              {schedule.departureStation} → {schedule.arrivalStation}
            </span>
            <span className="text-[11px] text-[#94A3B8] block">
              {schedule.company} {schedule.grade} · {schedule.platform}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsRouteOpen(true)}
            className="shrink-0 px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#132B45] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
          >
            <Route className="w-3.5 h-3.5 text-[#2563EB]" />
            노선도 상세보기
          </button>
        </div>
      </div>

      {/* 안내 */}
      <div className="mx-4 mt-3 p-3 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-2 text-xs text-[#1D4ED8] leading-relaxed">
        <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <span>
          좌석을 누르면 <strong>탑승 유형</strong>을 고를 수 있어요. 최대 {MAX_TICKETS_PER_BOOKING}매까지 선택 가능하며,
          평소 선호하는 <strong>7번 단독석</strong>이 어른으로 미리 선택되어 있어요.
        </span>
      </div>

      {/* 범례 */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-center gap-4 text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-white border border-[#CBD5E1]" />
          <span className="whitespace-nowrap">선택가능</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded text-white flex items-center justify-center text-[10px]" style={{ backgroundColor: accent }}>
            ✓
          </span>
          <span className="whitespace-nowrap">선택됨</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[#E2E8F0] border border-[#CBD5E1]" />
          <span className="whitespace-nowrap">예매완료</span>
        </div>
      </div>

      {/* 좌석 배치도 */}
      <div className="px-4 py-2">
        <div className="max-w-[300px] mx-auto bg-white rounded-3xl p-4 shadow-sm border border-[#E2E8F0]">
          <div className="pb-3 mb-3 border-b border-[#EEF2F6] flex items-center justify-between text-[11px] font-bold text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#EEF2F6] flex items-center justify-center text-[10px] text-[#475569]">운</div>
              <span className="whitespace-nowrap">운전석</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="whitespace-nowrap">출입문</span>
              <div className="w-2 h-4 rounded-r bg-[#CBD5E1]" />
            </div>
          </div>

          <div className="space-y-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-between">
                {renderSeat(seats[rowIdx * 3])}
                <div className="w-6 text-center text-[10px] text-[#CBD5E1] font-mono select-none">{rowIdx + 1}</div>
                <div className="flex items-center gap-2">
                  {renderSeat(seats[rowIdx * 3 + 1])}
                  {renderSeat(seats[rowIdx * 3 + 2])}
                </div>
              </div>
            ))}
            {/* 맨 뒷줄 4석 */}
            <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#E2E8F0]">
              {[24, 25, 26, 27].map((i) => renderSeat(seats[i]))}
            </div>
          </div>
        </div>
      </div>

      {/* 선택 내역 */}
      <div className="px-4 pt-1 pb-4">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-[#EEF2F6]">
            <span className="text-xs font-extrabold text-[#0F172A]">선택 내역</span>
            <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: accent }}>
              {selected.length} / {MAX_TICKETS_PER_BOOKING}매
            </span>
          </div>
          {sortedSelected.length === 0 ? (
            <p className="px-4 py-5 text-xs text-[#94A3B8] text-center">좌석을 선택해 주세요.</p>
          ) : (
            <ul className="divide-y divide-[#F1F5F9]">
              {sortedSelected.map((p) => (
                <li key={p.seatNumber}>
                  <button
                    type="button"
                    onClick={() => setSheetSeat(p.seatNumber)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span
                      className="w-8 h-8 rounded-lg text-white text-xs font-extrabold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: accent }}
                    >
                      {p.seatNumber}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#0F172A]">{PASSENGER_TYPE_INFO[p.type].label}</span>
                        {p.type !== 'adult' && (
                          <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {PASSENGER_TYPE_INFO[p.type].discountLabel}
                          </span>
                        )}
                        {p.type === 'veteran' && p.veteranVerified && (
                          <span className="text-[10px] font-bold text-[#059669] inline-flex items-center gap-0.5 whitespace-nowrap">
                            <BadgeCheck className="w-3 h-3" /> 인증완료
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">탑승 유형 변경</span>
                    </span>
                    <span className="text-sm font-black text-[#132B45] whitespace-nowrap tabular-nums">
                      {formatPrice(p.fare)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 하단 고정 결제 바 */}
      <div className="sticky bottom-0 mt-auto bg-white border-t border-[#EEF2F6] px-4 pt-3 pb-4 shadow-lg safe-bottom space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[11px] text-[#64748B] block">총 {selected.length}매</span>
            <span className="text-[11px] text-[#94A3B8]">총 결제예정금액</span>
          </div>
          <span className="text-xl font-black text-[#132B45] tabular-nums">{formatPrice(totalFee)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="py-3 px-4 rounded-2xl bg-[#EEF2F6] text-[#334155] text-xs font-bold hover:bg-[#E2E8F0] transition-colors whitespace-nowrap"
          >
            이전
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => onConfirm(sortedSelected)}
            className={`flex-1 py-3 rounded-2xl text-white text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed ${accentBg}`}
          >
            {selected.length > 0 ? `${selected.length}매 선택 완료 · 예매 확인` : '좌석을 선택해 주세요'}
          </button>
        </div>
      </div>

      {/* 탑승 유형 선택 바텀시트 */}
      <SeatPassengerSheet
        isOpen={sheetSeat !== null}
        seatNumber={sheetSeat}
        baseFee={schedule.fee}
        currentType={sheetSeat !== null ? findSelected(sheetSeat)?.type : undefined}
        isVeteranVerified={sheetSeat !== null ? findSelected(sheetSeat)?.veteranVerified : undefined}
        isExpress={isExpress}
        onSelectType={handleSelectType}
        onRemove={handleRemove}
        onClose={() => setSheetSeat(null)}
      />

      {/* 보훈 번호 인증 팝업 */}
      <VeteranVerifyModal
        isOpen={veteranSeat !== null}
        seatNumber={veteranSeat ?? 0}
        onClose={() => setVeteranSeat(null)}
        onVerified={handleVeteranVerified}
      />

      {/* 노선도 상세보기 바텀시트 */}
      <RouteMapSheet isOpen={isRouteOpen} onClose={() => setIsRouteOpen(false)} schedule={schedule} />
    </div>
  );
};

const SeatButton: React.FC<{
  seat: SeatInfo;
  passenger?: SeatPassenger;
  isExpress: boolean;
  onClick: () => void;
}> = ({ seat, passenger, isExpress, onClick }) => {
  const isOccupied = seat.status === 'occupied';
  const isSelected = !!passenger;

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
      aria-label={`${seat.number}번 좌석${passenger ? ` ${PASSENGER_TYPE_INFO[passenger.type].label}` : ''}`}
      className={`w-10 h-11 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all relative ${bgClass}`}
    >
      <span className="leading-none">{seat.number}</span>
      {passenger && <span className="text-[10px] font-semibold leading-none mt-1 opacity-90">{TYPE_SHORT[passenger.type]}</span>}
      {seat.number === 7 && !isOccupied && !isSelected && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] absolute top-1 right-1" />
      )}
    </button>
  );
};
