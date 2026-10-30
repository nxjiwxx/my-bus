'use client';

import React from 'react';
import { X, Users, Plus, Minus } from 'lucide-react';

export interface PassengerState {
  adult: number;
  teen: number;
  child: number;
}

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  passengers: PassengerState;
  onChange: (passengers: PassengerState) => void;
}

export const PassengerModal: React.FC<PassengerModalProps> = ({
  isOpen,
  onClose,
  passengers,
  onChange,
}) => {
  if (!isOpen) return null;

  const total = passengers.adult + passengers.teen + passengers.child;

  const updateCount = (type: keyof PassengerState, delta: number) => {
    const current = passengers[type];
    const next = Math.max(0, current + delta);

    // 최소 1명 보장 (성인 기준)
    if (type === 'adult' && next === 0 && passengers.teen === 0 && passengers.child === 0) {
      return;
    }
    // 최대 5명
    if (total + delta > 5) return;

    onChange({
      ...passengers,
      [type]: next,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#132B45]" />
            <h3 className="font-bold text-base text-[#0F172A]">승객 및 인원 선택</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* 어른 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">어른 (만 19세 이상)</span>
              <span className="text-[11px] text-[#64748B]">일반 요금</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('adult', -1)}
                disabled={passengers.adult <= 1 && total <= 1}
                className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-[#0F172A]">{passengers.adult}</span>
              <button
                onClick={() => updateCount('adult', 1)}
                disabled={total >= 5}
                className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 중고생 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">중고생 (만 13~18세)</span>
              <span className="text-[11px] text-[#2563EB]">20% 할인</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('teen', -1)}
                disabled={passengers.teen <= 0}
                className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-[#0F172A]">{passengers.teen}</span>
              <button
                onClick={() => updateCount('teen', 1)}
                disabled={total >= 5}
                className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 아동 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">아동 (만 6~12세)</span>
              <span className="text-[11px] text-[#059669]">50% 할인</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('child', -1)}
                disabled={passengers.child <= 0}
                className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-[#0F172A]">{passengers.child}</span>
              <button
                onClick={() => updateCount('child', 1)}
                disabled={total >= 5}
                className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#132B45] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
        >
          총 {total}명 선택 완료
        </button>
      </div>
    </div>
  );
};
