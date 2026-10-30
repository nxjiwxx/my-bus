'use client';

import React from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  zIndex?: number;
}

// 휴대폰 프레임 안에서 하단에서 올라오는 공통 바텀시트
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  zIndex = 50,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        className="w-full max-h-[88%] flex flex-col bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <span className="w-10 h-1 rounded-full bg-[#CBD5E1]" />
        </div>
        <div className="px-5 pt-2 pb-3 flex items-start justify-between gap-3 border-b border-[#EEF2F6] shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">{title}</h3>
            {subtitle && <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 -mr-1 text-[#64748B] hover:text-[#0F172A] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">{children}</div>
        {footer && <div className="px-5 pt-3 pb-5 border-t border-[#EEF2F6] bg-white shrink-0">{footer}</div>}
      </div>
    </div>
  );
};
