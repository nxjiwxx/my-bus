'use client';

import React from 'react';

interface SectionCardProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: string;
  right?: React.ReactNode;
  tone?: 'default' | 'ai';
  children: React.ReactNode;
}

// 타임라인 전 화면에서 공통으로 쓰는 정보 위계 구조
// eyebrow(단계/분류) → title(핵심 제목) → 본문
export const SectionCard: React.FC<SectionCardProps> = ({
  eyebrow,
  eyebrowColor = '#2563EB',
  title,
  right,
  tone = 'default',
  children,
}) => (
  <section
    className={`rounded-3xl border shadow-xs overflow-hidden ${
      tone === 'ai' ? 'bg-white border-express-soft' : 'bg-white border-surface-container'
    }`}
  >
    <header className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-surface-soft">
      <div className="min-w-0">
        {eyebrow && (
          <span className="block text-caption-xs font-extrabold tracking-wide leading-none mb-1.5" style={{ color: eyebrowColor }}>
            {eyebrow}
          </span>
        )}
        <h4 className="text-label font-extrabold text-surface-on-surface tracking-tight leading-snug">{title}</h4>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
    <div className="px-5 py-4">{children}</div>
  </section>
);

// 항목명 + 값 세로 한 줄 (좌: 라벨 / 우: 값)
export const KeyValueRow: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  valueClassName?: string;
  dot?: string;
  dark?: boolean;
}> = ({ label, value, valueClassName = '', dot, dark = false }) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <span className={`flex items-center gap-2 text-caption ${dark ? 'text-white/70' : 'text-surface-outline'}`}>
      {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />}
      {label}
    </span>
    <span className={`text-caption font-extrabold text-right ${dark ? 'text-white' : 'text-surface-on-surface'} ${valueClassName}`}>
      {value}
    </span>
  </div>
);
