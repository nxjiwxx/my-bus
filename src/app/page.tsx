'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { MobileFrame } from '@/components/common/MobileFrame';
import { BottomNav } from '@/components/common/BottomNav';
import { Toast } from '@/components/common/Toast';
import { HomeView } from '@/components/home/HomeView';
import { BookingView } from '@/components/booking/BookingView';
import { TimelineView } from '@/components/timeline/TimelineView';
import { TicketsView } from '@/components/tickets/TicketsView';
import { MyPageView } from '@/components/mypage/MyPageView';

function AppContent() {
  const { currentTab } = useApp();

  return (
    <MobileFrame>
      <Toast />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
        {currentTab === 'home' && <HomeView />}
        {currentTab === 'booking' && <BookingView />}
        {currentTab === 'timeline' && <TimelineView />}
        {currentTab === 'tickets' && <TicketsView />}
        {currentTab === 'mypage' && <MyPageView />}
      </main>
      <BottomNav />
    </MobileFrame>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
