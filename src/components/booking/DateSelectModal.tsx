'use client';

import React from 'react';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';

interface DateSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dateStr: string) => void;
  currentDate: string;
}

export const DateSelectModal: React.FC<DateSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentDate,
}) => {
  if (!isOpen) return null;

  // 오늘부터 7일간의 날짜 옵션 생성
  const dates = [
    { label: '오늘 (10.30 금)', value: '2026-10-30 (금)', tag: '오늘' },
    { label: '내일 (10.31 토)', value: '2026-10-31 (토)', tag: '내일' },
    { label: '11.01 (일)', value: '2026-11-01 (일)' },
    { label: '11.02 (월)', value: '2026-11-02 (월)' },
    { label: '11.03 (화)', value: '2026-11-03 (화)' },
    { label: '11.04 (수)', value: '2026-11-04 (수)' },
    { label: '다음 주 금요일 (11.06)', value: '2026-11-06 (금)', tag: '루틴일' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm p-4 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#132B45]" />
            <h3 className="font-bold text-base text-[#0F172A]">출발 날짜 선택</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar">
          {dates.map((d) => {
            const isSelected = currentDate === d.value;
            return (
              <button
                key={d.value}
                onClick={() => {
                  onSelect(d.value);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-[#132B45] text-white'
                    : 'bg-[#F8FAFC] hover:bg-[#EEF2F6] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{d.label}</span>
                  {d.tag && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#E1EDFB] text-[#17365D]'
                      }`}
                    >
                      {d.tag}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#EEF2F6] text-[#334155] rounded-xl text-xs font-semibold hover:bg-[#E2E8F0] transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
