'use client';

import React, { useState } from 'react';
import { BadgeCheck, Loader2, X, ChevronDown, Check } from 'lucide-react';

interface VeteranVerifyModalProps {
  isOpen: boolean;
  seatNumber: number;
  onClose: () => void;
  onVerified: () => void;
}

function isValidBirth(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;
  const y = Number(value.slice(0, 4));
  const m = Number(value.slice(4, 6));
  const d = Number(value.slice(6, 8));
  const date = new Date(y, m - 1, d);
  return (
    y >= 1900 &&
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d &&
    date.getTime() <= Date.now()
  );
}

// 보훈 번호 인증 팝업 (생년월일 + 보훈번호 + 약관동의)
export const VeteranVerifyModal: React.FC<VeteranVerifyModalProps> = ({
  isOpen,
  seatNumber,
  onClose,
  onVerified,
}) => {
  const [birth, setBirth] = useState('');
  const [veteranNo, setVeteranNo] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const birthValid = isValidBirth(birth);
  const veteranDigits = veteranNo.replace(/\D/g, '');
  const veteranValid = veteranDigits.length >= 8 && veteranDigits.length <= 12;
  const canSubmit = birthValid && veteranValid && agreed && !isVerifying;

  const reset = () => {
    setBirth('');
    setVeteranNo('');
    setAgreed(false);
    setShowTerms(false);
    setSubmitted(false);
    setIsVerifying(false);
  };

  const handleClose = () => {
    if (isVerifying) return;
    reset();
    onClose();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;
    setIsVerifying(true);
    setTimeout(() => {
      reset();
      onVerified();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-xs p-5 animate-in fade-in duration-150">
      <div className="w-full bg-white rounded-3xl shadow-2xl p-5 space-y-4 max-h-full overflow-y-auto no-scrollbar">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E1EDFB] text-[#17365D] flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">보훈 번호 인증</h3>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                {seatNumber}번 좌석에 보훈 할인을 적용합니다.
              </p>
            </div>
          </div>
          <button type="button" onClick={handleClose} aria-label="닫기" className="p-1 -mr-1 text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 생년월일 */}
        <div className="space-y-1.5">
          <label htmlFor="veteran-birth" className="text-xs font-bold text-[#0F172A]">
            생년월일
          </label>
          <input
            id="veteran-birth"
            inputMode="numeric"
            maxLength={8}
            placeholder="예) 19500101 (8자리)"
            value={birth}
            onChange={(e) => setBirth(e.target.value.replace(/\D/g, ''))}
            className={`w-full px-3.5 py-3 rounded-xl bg-[#F8FAFC] border text-sm font-semibold text-[#0F172A] placeholder:text-[#94A3B8] placeholder:font-normal focus:outline-none focus:border-[#132B45] ${
              submitted && !birthValid ? 'border-[#DC2626]' : 'border-[#CBD5E1]'
            }`}
          />
          {submitted && !birthValid && (
            <p className="text-[11px] text-[#DC2626]">올바른 생년월일 8자리를 입력해 주세요.</p>
          )}
        </div>

        {/* 보훈번호 */}
        <div className="space-y-1.5">
          <label htmlFor="veteran-no" className="text-xs font-bold text-[#0F172A]">
            보훈번호
          </label>
          <input
            id="veteran-no"
            inputMode="numeric"
            maxLength={14}
            placeholder="보훈번호 숫자 8~12자리"
            value={veteranNo}
            onChange={(e) => setVeteranNo(e.target.value.replace(/[^\d-]/g, ''))}
            className={`w-full px-3.5 py-3 rounded-xl bg-[#F8FAFC] border text-sm font-semibold text-[#0F172A] placeholder:text-[#94A3B8] placeholder:font-normal focus:outline-none focus:border-[#132B45] ${
              submitted && !veteranValid ? 'border-[#DC2626]' : 'border-[#CBD5E1]'
            }`}
          />
          {submitted && !veteranValid && (
            <p className="text-[11px] text-[#DC2626]">보훈번호는 숫자 8~12자리로 입력해 주세요.</p>
          )}
        </div>

        {/* 약관 동의 */}
        <div className="rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-3 bg-[#F8FAFC]">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className="flex items-center gap-2 text-left"
            >
              <span
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  agreed ? 'bg-[#132B45] border-[#132B45] text-white' : 'bg-white border-[#CBD5E1]'
                }`}
              >
                {agreed && <Check className="w-3.5 h-3.5" />}
              </span>
              <span className="text-xs font-bold text-[#0F172A]">
                개인정보 수집·이용 동의 <span className="text-[#DC2626]">(필수)</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowTerms(!showTerms)}
              aria-label="약관 내용 보기"
              className="p-1 text-[#64748B]"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showTerms ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {showTerms && (
            <div className="px-3.5 py-3 text-[11px] text-[#64748B] leading-relaxed border-t border-[#E2E8F0] space-y-1">
              <p>· 수집 항목: 생년월일, 보훈번호</p>
              <p>· 이용 목적: 보훈 할인 대상 확인 및 할인 요금 적용</p>
              <p>· 보유 기간: 인증 완료 후 즉시 폐기 (승차권에는 저장되지 않습니다)</p>
              <p>· 동의를 거부할 수 있으나, 거부 시 보훈 할인이 적용되지 않습니다.</p>
            </div>
          )}
        </div>
        {submitted && !agreed && (
          <p className="text-[11px] text-[#DC2626] -mt-2">약관에 동의해 주세요.</p>
        )}

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isVerifying}
            className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-98 ${
              canSubmit || !submitted
                ? 'bg-[#132B45] text-white hover:bg-[#1E3A8A] shadow-md'
                : 'bg-[#CBD5E1] text-white'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>보훈 정보 확인 중...</span>
              </>
            ) : (
              <span>인증 확인 · 보훈 1매 추가</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isVerifying}
            className="w-full py-3 rounded-2xl bg-[#EEF2F6] text-[#334155] text-xs font-bold hover:bg-[#E2E8F0] transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
