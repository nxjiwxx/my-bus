import React from 'react';
import { cn } from '@/lib/utils';
import { BusType, BusGrade } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'express' | 'intercity' | 'primary' | 'outline' | 'ai' | 'warning' | 'error' | 'surface';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'surface',
  size = 'sm',
  className,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-semibold tracking-tight',
    md: 'text-xs px-2.5 py-1 rounded-lg font-semibold',
  };

  const variantClasses = {
    express: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    intercity: 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]',
    primary: 'bg-[#E1EDFB] text-[#17365D] border border-[#BDD7F5]',
    ai: 'bg-gradient-to-r from-[#F5F3FF] to-[#EFF6FF] text-[#4F46E5] border border-[#DDD6FE]',
    warning: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]',
    error: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
    surface: 'bg-[#EEF2F6] text-[#334155]',
    outline: 'border border-[#CBD5E1] text-[#334155] bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 shrink-0 select-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export const BusTypeBadge: React.FC<{ busType: BusType; className?: string }> = ({
  busType,
  className,
}) => {
  return busType === 'express' ? (
    <Badge variant="express" className={className}>
      고속
    </Badge>
  ) : (
    <Badge variant="intercity" className={className}>
      시외
    </Badge>
  );
};

export const BusGradeBadge: React.FC<{ grade: BusGrade; className?: string }> = ({
  grade,
  className,
}) => {
  return (
    <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
      {grade}
    </span>
  );
};
