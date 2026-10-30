'use client';

import React, { useState } from 'react';
import { X, Search, MapPin, Check } from 'lucide-react';
import { allStations, popularDestinations } from '@/mock/data';
import { Station } from '@/types';

interface StationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stationName: string) => void;
  currentStation: string;
  type: 'departure' | 'arrival';
}

export const StationSelectModal: React.FC<StationSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentStation,
  type,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');

  if (!isOpen) return null;

  const regions = ['전체', '수도권', '충청', '경기', '영남', '호남', '강원'];

  const filteredStations = allStations.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === '전체' || s.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="p-4 border-b border-[#EEF2F6] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#0F172A]">
            {type === 'departure' ? '출발 터미널 선택' : '도착 터미널 선택'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="터미널명 검색 (예: 서울, 대전, 수원)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:outline-none focus:border-[#132B45] focus:ring-1 focus:ring-[#132B45]"
            />
          </div>
        </div>

        {/* Region Chips */}
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#F1F5F9]">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedRegion === reg
                  ? 'bg-[#132B45] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          <span className="text-[11px] font-bold text-[#94A3B8] block mb-1">
            {type === 'departure' ? '천안 중심 터미널' : '추천 및 주요 터미널'}
          </span>
          {filteredStations.map((station) => {
            const isSelected = station.name === currentStation;
            return (
              <button
                key={station.id}
                onClick={() => {
                  onSelect(station.name);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-[#E1EDFB] text-[#17365D]'
                    : 'hover:bg-[#F8FAFC] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'}`} />
                  <span>{station.name}</span>
                  {station.name === '천안' && (
                    <span className="text-[10px] bg-[#EEF2F6] text-[#475569] px-1.5 py-0.5 rounded font-normal">
                      종합버스터미널
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#1D4ED8]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
