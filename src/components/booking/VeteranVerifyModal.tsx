'use client';

import React, { useState, useEffect } from 'react';
import { BadgeCheck, Loader2, ChevronDown, Check, AlertCircle, ShieldAlert } from 'lucide-react';

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

// 1단계: 보훈 번호 인증 안내 중앙 모달 (아니요 / 네)
// 2단계: '네' 선택 시 전환되는 보훈 번호 인증 전용 페이지 (생년월일 + 보훈번호 + 약관동의)
export const VeteranVerifyModal: React.FC<VeteranVerifyModalProps> = ({
  isOpen,
  seatNumber,
  onClose,
  onVerified,
}) => {
  const [stage, setStage] = useState<'confirm' | 'page'>('confirm');
  const [birth, setBirth] = useState('');
  const [veteranNo, setVeteranNo] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStage('confirm');
      setBirth('');
      setVeteranNo('');
      setAgreed(false);
      setShowTerms(false);
      setSubmitted(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const birthValid = isValidBirth(birth);
  const veteranDigits = veteranNo.replace(/\D/g, '');
  const veteranValid = veteranDigits.length >= 8 && veteranDigits.length <= 12;
  const canSubmit = birthValid && veteranValid && agreed && !isVerifying;

  const reset = () => {
    setStage('confirm');
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

  // STEP 1: 보훈 페이지 진입 전 중앙 확인 모달
  if (stage === 'confirm') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="veteran-confirm-title"
        className="fixed inset-0 z-dialog flex items-center justify-center bg-black/50 backdrop-blur-xs p-5 animate-in fade-in duration-150"
      >
        <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl p-6 border border-surface-container-high text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary-on-container flex items-center justify-center mx-auto">
            <BadgeCheck className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3
              id="veteran-confirm-title"
              className="text-title-sm font-extrabold text-surface-on-surface tracking-tight"
            >
              보훈 번호 인증
            </h3>
            <p className="text-label text-surface-on-variant leading-relaxed">
              승차 시 <strong className="text-surface-on-surface font-extrabold">국가유공자 확인증</strong>을 반드시 지참하셔야 합니다.
            </p>
            <p className="text-label-sm text-surface-outline leading-relaxed">
              {seatNumber}번 좌석 보훈 할인을 적용하려면 추가 인증이 필요합니다. 지금 보훈 번호 인증을 진행하시겠어요?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="py-3.5 rounded-2xl bg-surface-container text-surface-on-variant text-body-sm font-bold hover:bg-surface-container-high active:scale-98 transition-all"
            >
              아니요
            </button>
            <button
              type="button"
              onClick={() => setStage('page')}
              className="py-3.5 rounded-2xl bg-primary text-white text-body-sm font-extrabold hover:bg-primary-hover shadow-md active:scale-98 transition-all"
            >
              네
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: 보훈 번호 인증 전용 페이지 (전체 화면 페이지)
  return (
    <div className="fixed inset-0 z-dialog bg-surface-container-low flex flex-col animate-in fade-in duration-150">
      {/* 상단 앱 헤더 */}
      <header className="sticky top-0 z-header bg-white/95 backdrop-blur-md border-b border-surface-container px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClose}
            aria-label="뒤로가기"
            className="p-2 -ml-2 text-surface-on-variant hover:text-surface-on-surface active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-title-sm font-extrabold text-surface-on-surface tracking-tight">
            보훈 번호 인증
          </h1>
        </div>
        <span className="text-caption font-extrabold bg-primary-container text-primary-on-container px-2.5 py-1 rounded-full">
          {seatNumber}번 좌석
        </span>
      </header>

      {/* 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        {/* 상단 안내 카드 */}
        <section className="bg-white rounded-3xl p-4 border border-surface-container shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-primary-on-container flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-body font-extrabold text-surface-on-surface">
                국가유공자 보훈 할인 자격 확인
              </h2>
              <p className="text-label-sm text-surface-outline">
                인증 완료 시 {seatNumber}번 좌석에 보훈 할인(30%)이 적용됩니다.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-warning-container/60 border border-warning/30 flex items-start gap-2 text-caption text-warning-on-container leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              승차 시 검표원에게 <strong>국가유공자증 또는 확인증</strong>을 반드시 제시하셔야 합니다.
            </span>
          </div>
        </section>

        {/* 입력 폼 카드 */}
        <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-xs space-y-4">
          {/* 생년월일 */}
          <div className="space-y-1.5">
            <label htmlFor="veteran-birth" className="text-label font-bold text-surface-on-surface block">
              생년월일 (8자리)
            </label>
            <input
              id="veteran-birth"
              inputMode="numeric"
              maxLength={8}
              placeholder="예) 19500101"
              value={birth}
              onChange={(e) => setBirth(e.target.value.replace(/\D/g, ''))}
              className={`w-full px-4 py-3.5 rounded-2xl bg-surface-bright border text-body-sm font-semibold text-surface-on-surface placeholder:text-surface-muted placeholder:font-normal focus:outline-none focus:border-primary ${
                submitted && !birthValid ? 'border-error' : 'border-surface-outline-variant'
              }`}
            />
            {submitted && !birthValid && (
              <p className="text-caption text-error flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                올바른 생년월일 8자리를 입력해 주세요.
              </p>
            )}
          </div>

          {/* 보훈번호 */}
          <div className="space-y-1.5">
            <label htmlFor="veteran-no" className="text-label font-bold text-surface-on-surface block">
              보훈번호
            </label>
            <input
              id="veteran-no"
              inputMode="numeric"
              maxLength={14}
              placeholder="보훈번호 숫자 8~12자리 입력"
              value={veteranNo}
              onChange={(e) => setVeteranNo(e.target.value.replace(/[^\d-]/g, ''))}
              className={`w-full px-4 py-3.5 rounded-2xl bg-surface-bright border text-body-sm font-semibold text-surface-on-surface placeholder:text-surface-muted placeholder:font-normal focus:outline-none focus:border-primary ${
                submitted && !veteranValid ? 'border-error' : 'border-surface-outline-variant'
              }`}
            />
            {submitted && !veteranValid && (
              <p className="text-caption text-error flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                보훈번호는 숫자 8~12자리로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="rounded-2xl border border-surface-container-high overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 bg-surface-bright">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="flex items-center gap-2.5 text-left flex-1"
              >
                <span
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    agreed ? 'bg-primary border-primary text-white' : 'bg-white border-surface-outline-variant'
                  }`}
                >
                  {agreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <span className="text-label font-bold text-surface-on-surface">
                  개인정보 수집·이용 동의 <span className="text-error">(필수)</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowTerms(!showTerms)}
                aria-label="약관 내용 보기"
                className="p-2 -mr-1 text-surface-outline hover:text-surface-on-surface"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showTerms ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showTerms && (
              <div className="px-4 py-3 text-caption text-surface-outline leading-relaxed border-t border-surface-container-high space-y-1 bg-white">
                <p>· 수집 항목: 생년월일, 보훈번호</p>
                <p>· 이용 목적: 국가유공자 보훈 할인 자격 검증 및 할인 운임 적용</p>
                <p>· 보유 기간: 인증 완료 후 즉시 폐기 (승차권에는 저장되지 않습니다)</p>
                <p>· 동의를 거부할 수 있으나, 거부 시 보훈 할인이 적용되지 않습니다.</p>
              </div>
            )}
          </div>
          {submitted && !agreed && (
            <p className="text-caption text-error flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              개인정보 수집·이용 약관에 동의해 주세요.
            </p>
          )}
        </section>
      </div>

      {/* 하단 고정 액션 바 */}
      <div className="sticky bottom-0 bg-white border-t border-surface-container px-5 pt-3.5 pb-4 safe-bottom flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={handleClose}
          disabled={isVerifying}
          className="py-3.5 px-5 rounded-2xl bg-surface-container text-surface-on-variant text-body-sm font-bold hover:bg-surface-container-high transition-colors whitespace-nowrap"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isVerifying}
          className={`flex-1 py-3.5 rounded-2xl text-body-sm font-extrabold flex items-center justify-center gap-2 transition-all active:scale-98 ${
            canSubmit || !submitted
              ? 'bg-primary text-white hover:bg-primary-hover shadow-md'
              : 'bg-surface-outline-variant text-white'
          }`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>보훈 정보 확인 중...</span>
            </>
          ) : (
            <span>인증 완료 · 보훈 1매 추가</span>
          )}
        </button>
      </div>
    </div>
  );
};
