'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-xs animate-in slide-in-from-top-3 fade-in duration-200 pointer-events-none">
      <div className="bg-[#132B45] text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 backdrop-blur-md">
        <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0" />
        <span className="leading-snug">{toast}</span>
      </div>
    </div>
  );
};
