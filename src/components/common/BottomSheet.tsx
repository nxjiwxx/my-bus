'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  zIndex?: number;
  fixedHeight?: boolean;
  noScroll?: boolean;
}

// 휴대폰 프레임 안에서 아래에서 위로 올라오고, 완료/취소 시 아래로 내려가는 공통 바텀시트
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  zIndex = 50,
  fixedHeight = false,
  noScroll = false,
}) => {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  // 닫히는 모션 동안 마지막 콘텐츠가 사라지지 않도록 캐시
  const cachedProps = useRef({ title, subtitle, children, footer });
  if (isOpen) {
    cachedProps.current = { title, subtitle, children, footer };
  }

  useEffect(() => {
    let raf1: number;
    let raf2: number;
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setMounted(true);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      timer = setTimeout(() => {
        setMounted(false);
      }, 280);
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!mounted) return null;

  const display = isOpen ? { title, subtitle, children, footer } : cachedProps.current;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center backdrop-blur-xs transition-opacity duration-280 ease-out ${
        visible ? 'bg-black/45 opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'
      }`}
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        className={`w-full ${
          fixedHeight ? 'h-[78%]' : 'max-h-[88%]'
        } flex flex-col bg-white rounded-t-3xl shadow-2xl transition-transform duration-280 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <span className="w-10 h-1 rounded-full bg-[#CBD5E1]" />
        </div>
        <div className="px-5 pt-2 pb-3 flex items-start justify-between gap-3 border-b border-[#EEF2F6] shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">
              {display.title}
            </h3>
            {display.subtitle && (
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                {display.subtitle}
              </p>
            )}
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
        <div
          className={`flex-1 ${
            noScroll ? 'overflow-hidden' : 'overflow-y-auto no-scrollbar'
          } px-5 py-4`}
        >
          {display.children}
        </div>
        {display.footer && (
          <div className="px-5 pt-3 pb-5 border-t border-[#EEF2F6] bg-white shrink-0">
            {display.footer}
          </div>
        )}
      </div>
    </div>
  );
};
