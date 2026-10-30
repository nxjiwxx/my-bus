'use client';

import React, { useState } from 'react';
import { X, CreditCard, Check, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  totalFee: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  totalFee,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('naverpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'naverpay', label: '네이버페이', badge: '포인트 적립', color: 'text-[#03C75A]' },
    { id: 'kakaopay', label: '카카오페이', badge: '간편인증', color: 'text-[#FEE500]' },
    { id: 'tosspay', label: '토스페이', badge: '원클릭', color: 'text-[#0064FF]' },
    { id: 'card', label: '신용 / 체크카드', badge: '무이자할부', color: 'text-[#334155]' },
    { id: 'tmoney', label: '모바일 티머니', badge: '교통카드 연동', color: 'text-[#0284C7]' },
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm p-5 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#132B45]" />
            <h3 className="font-extrabold text-base text-[#0F172A]">결제 수단 선택</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Box */}
        <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6] flex items-center justify-between">
          <span className="text-xs text-[#64748B] font-semibold">총 결제 금액</span>
          <span className="text-xl font-black text-[#132B45]">{formatPrice(totalFee)}</span>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-2">
          {paymentMethods.map((pm) => {
            const isSelected = selectedMethod === pm.id;
            return (
              <button
                key={pm.id}
                type="button"
                onClick={() => setSelectedMethod(pm.id)}
                disabled={isProcessing}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all text-left ${
                  isSelected
                    ? 'border-[#132B45] bg-[#E1EDFB]/40 shadow-xs'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#132B45] bg-[#132B45] text-white'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span className="text-xs font-bold text-[#0F172A]">{pm.label}</span>
                </div>
                <span className="text-[10px] text-[#64748B] bg-white px-2 py-0.5 rounded-full border border-[#EEF2F6]">
                  {pm.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePay}
          className="w-full py-3.5 bg-[#132B45] text-white rounded-2xl text-xs font-extrabold hover:bg-[#1E3A8A] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
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
