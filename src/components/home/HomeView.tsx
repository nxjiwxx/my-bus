'use client';

import React from 'react';
import { TopAppBar } from '../common/TopAppBar';
import { AISuggestionCard } from './AISuggestionCard';

export const HomeView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-surface-container-low overflow-hidden">
      <TopAppBar />

      {/* 홈 화면 전체를 여유롭게 활용하는 AI 맞춤 이동 비서 서비스 */}
      <AISuggestionCard />
    </div>
  );
};
