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
    sm: 'text-caption-sm px-2 py-0.5 rounded-md font-semibold tracking-tight',
    md: 'text-caption px-2.5 py-1 rounded-lg font-semibold',
  };

  const variantClasses = {
    express: 'bg-express-container text-express-on-container border border-express-border',
    intercity: 'bg-intercity-container text-intercity-on-container border border-intercity-border',
    primary: 'bg-primary-container text-primary-on-container border border-[#BDD7F5]',
    ai: 'bg-gradient-to-r from-ai-container to-express-container text-ai-on-container border border-ai-border',
    warning: 'bg-warning-container text-warning-on-container border border-[#FDE68A]',
    error: 'bg-error-container text-error-on-container border border-[#FECACA]',
    surface: 'bg-surface-container text-surface-on-variant',
    outline: 'border border-surface-outline-variant text-surface-on-variant bg-transparent',
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
    <span className="text-caption-sm font-medium text-surface-outline bg-surface-soft px-1.5 py-0.5 rounded">
      {grade}
    </span>
  );
};
