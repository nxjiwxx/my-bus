'use client';

import React, { useState } from 'react';
import { MapPin, Search, Check, Sparkles } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { allStations, popularDestinations } from '@/mock/data';

interface ArrivalSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentArrival: string;
  onSelect: (stationName: string) => void;
}

const REGIONS = ['전체', '수도권', '경기', '충청', '강원', '영남', '호남'] as const;

export const ArrivalSelectSheet: React.FC<ArrivalSelectSheetProps> = ({
  isOpen,
  onClose,
  currentArrival,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');

  // 출발지인 '천안'은 제외한 도착지 목록
  const arrivalStations = allStations.filter((st) => st.name !== '천안');

  const filteredStations = arrivalStations.filter((st) => {
    const matchRegion = selectedRegion === '전체' || st.region === selectedRegion;
    const matchQuery =
      !searchQuery.trim() ||
      st.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      st.region.includes(searchQuery.trim());
    return matchRegion && matchQuery;
  });

  const handleChoose = (name: string) => {
    onSelect(name);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="도착지 터미널 선택"
      subtitle="천안종합버스터미널에서 출발하는 노선의 도착지를 선택하세요"
    >
      <div className="p-4 space-y-4">
        {/* 검색 입력창 */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="도착지 터미널 검색 (예: 서울경부, 동서울, 부산)"
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* 권역 필터 탭 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {REGIONS.map((region) => {
            const active = selectedRegion === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#132B45] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>

        {/* 주요 인기 도착지 그리드 (전체 권역 & 검색어 없을 때) */}
        {selectedRegion === '전체' && !searchQuery.trim() && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#64748B]">
              <Sparkles className="w-3 h-3 text-[#2563EB]" />
              <span>주요 도착지 바로 선택</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {popularDestinations.slice(0, 6).map((dest) => {
                const isSelected = currentArrival === dest.name;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleChoose(dest.name)}
                    className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border text-center whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8] shadow-xs'
                        : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-[#94A3B8]'
                    }`}
                  >
                    {dest.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 전체 도착지 세로 리스트 */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#64748B] block">
            터미널 목록 ({filteredStations.length})
          </span>
          {filteredStations.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#94A3B8]">
              검색 조건에 맞는 도착지 터미널이 없습니다.
            </div>
          ) : (
            <div className="rounded-2xl border border-[#EEF2F6] divide-y divide-[#EEF2F6] overflow-hidden bg-white">
              {filteredStations.map((st) => {
                const isSelected = currentArrival === st.name;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleChoose(st.name)}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                      isSelected ? 'bg-[#EFF6FF]/80' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                        }`}
                      />
                      <span
                        className={`text-sm font-bold truncate ${
                          isSelected ? 'text-[#1D4ED8]' : 'text-[#0F172A]'
                        }`}
                      >
                        {st.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] whitespace-nowrap">
                        {st.region}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#2563EB] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
