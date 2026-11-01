'use client';

import React from 'react';
import { Home, Bus, Sparkles, QrCode, User } from 'lucide-react';
import { TabType } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, setBookingMode, activeTicket, customTimeline } = useApp();

  const tabs: {
    id: TabType;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: boolean;
    badgeColor?: string;
  }[] = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'booking', label: '버스 예매', icon: Bus },
    {
      id: 'timeline',
      label: '여유시간',
      icon: Sparkles,
      badge: !!customTimeline?.isConfirmed,
      badgeColor: 'bg-ai-primary',
    },
    {
      id: 'tickets',
      label: '내 승차권',
      icon: QrCode,
      badge: !!activeTicket,
      badgeColor: 'bg-express',
    },
    { id: 'mypage', label: '마이페이지', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-surface-container px-2 py-1 safe-bottom shadow-sm">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'booking') {
                  setBookingMode('integrated');
                }
                setCurrentTab(tab.id);
              }}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative select-none min-w-[60px] min-h-[48px]',
                isActive ? 'text-primary' : 'text-surface-outline hover:text-surface-on-variant'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive ? 'scale-105 stroke-[2.4] text-primary' : 'stroke-[1.8]'
                  )}
                />
                {tab.badge && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1.5 w-2 h-2 rounded-full ring-2 ring-white',
                      tab.badgeColor || 'bg-express'
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-caption-sm mt-1 transition-all leading-none',
                  isActive ? 'font-extrabold text-primary' : 'font-medium text-surface-outline'
                )}
              >
                {tab.label}
              </span>
              <span
                className={cn(
                  'w-1 h-1 rounded-full mt-0.5 transition-opacity',
                  isActive ? 'bg-primary opacity-100' : 'opacity-0'
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
