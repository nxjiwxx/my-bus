'use client';

import React, { useState } from 'react';
import { CreditCard, Check, Loader2, ShieldCheck } from 'lucide-react';
import { BusSchedule, SeatPassenger } from '@/types';
import { formatPrice, PASSENGER_TYPE_INFO } from '@/lib/utils';
import { BusTypeBadge, BusGradeBadge } from '../common/Badge';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  totalFee: number;
  schedule?: BusSchedule;
  seats?: SeatPassenger[];
  date?: string;
}

// 결제 전용 페이지 (예매 정보 확인 바텀시트에서 '결제하기' 선택 시 전환되는 전체 화면 페이지)
export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  totalFee,
  schedule,
  seats = [],
  date,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('naverpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'naverpay', label: '네이버페이', badge: '포인트 적립' },
    { id: 'kakaopay', label: '카카오페이', badge: '간편인증' },
    { id: 'tosspay', label: '토스페이', badge: '원클릭 결제' },
    { id: 'card', label: '신용 / 체크카드', badge: '무이자할부' },
    { id: 'tmoney', label: '모바일 티머니', badge: '교통카드 연동' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-dialog bg-surface-container-low flex flex-col animate-in fade-in duration-150">
      {/* 상단 페이지 헤더 */}
      <header className="sticky top-0 z-header bg-white/95 backdrop-blur-md border-b border-surface-container px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="뒤로가기"
            className="p-2 -ml-2 text-surface-on-variant hover:text-surface-on-surface active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-title-sm font-extrabold text-surface-on-surface tracking-tight">
            승차권 결제
          </h1>
        </div>
        <span className="text-caption font-bold bg-express-container text-express-on-container px-2.5 py-1 rounded-full">
          안전 결제
        </span>
      </header>

      {/* 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {/* 1. 예매 내역 요약 카드 */}
        {schedule && (
          <section className="bg-white rounded-3xl p-4 border border-surface-container shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <BusTypeBadge busType={schedule.busType} />
                <BusGradeBadge grade={schedule.grade} />
                <span className="text-caption font-semibold text-surface-subtle truncate">
                  {schedule.company}
                </span>
              </div>
              {date && (
                <span className="text-caption font-bold text-surface-outline whitespace-nowrap">
                  {date}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-caption-sm text-surface-outline block">출발</span>
                <span className="text-title-sm font-black text-surface-on-surface">
                  {schedule.departureStation} {schedule.departureTime}
                </span>
              </div>
              <span className="text-caption font-bold text-express bg-express-container px-2.5 py-1 rounded-full">
                {schedule.platform}
              </span>
              <div className="text-right">
                <span className="text-caption-sm text-surface-outline block">도착</span>
                <span className="text-title-sm font-black text-express">
                  {schedule.arrivalStation} {schedule.arrivalTime}
                </span>
              </div>
            </div>

            {seats.length > 0 && (
              <div className="pt-2.5 border-t border-surface-container flex items-center justify-between text-caption">
                <span className="text-surface-outline font-semibold">선택 좌석 ({seats.length}매)</span>
                <span className="font-extrabold text-surface-on-surface">
                  {seats
                    .map((s) => `${s.seatNumber}번(${PASSENGER_TYPE_INFO[s.type].label})`)
                    .join(', ')}
                </span>
              </div>
            )}
          </section>
        )}

        {/* 2. 결제 수단 선택 카드 */}
        <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="text-body font-extrabold text-surface-on-surface">결제 수단 선택</h2>
          </div>

          <div className="space-y-2">
            {paymentMethods.map((pm) => {
              const isSelected = selectedMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedMethod(pm.id)}
                  disabled={isProcessing}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary-container/40 shadow-xs'
                      : 'border-surface-container-high hover:bg-surface-bright'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-surface-outline-variant bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-label font-bold text-surface-on-surface">{pm.label}</span>
                  </div>
                  <span className="text-caption-sm text-surface-outline bg-white px-2.5 py-0.5 rounded-full border border-surface-container font-semibold">
                    {pm.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. 결제 금액 상세 */}
        <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-label">
            <span className="text-surface-outline font-semibold">총 결제 금액</span>
            <span className="text-headline-sm font-black text-primary tabular-nums">
              {formatPrice(totalFee)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-express-container/70 text-caption text-express-on-container flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-express shrink-0 mt-0.5" />
            <span>출발 1시간 전까지 취소 수수료 없이 100% 환불 가능합니다.</span>
          </div>
        </section>
      </div>

      {/* 하단 고정 결제 버튼 바 */}
      <div className="sticky bottom-0 bg-white border-t border-surface-container px-5 pt-3.5 pb-4 safe-bottom flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="py-3.5 px-5 rounded-2xl bg-surface-container text-surface-on-variant text-body-sm font-bold hover:bg-surface-container-high transition-colors whitespace-nowrap"
        >
          이전
        </button>
        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePay}
          className="flex-1 py-3.5 bg-primary text-white rounded-2xl text-body-sm font-extrabold hover:bg-primary-hover transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>안전하게 결제 진행 중...</span>
            </>
          ) : (
            <span>{formatPrice(totalFee)} 결제하기</span>
          )}
        </button>
      </div>
    </div>
  );
};
