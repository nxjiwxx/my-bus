'use client';

import React, { useState } from 'react';
import { MapPin, Search, Check, Sparkles, ArrowLeft, Navigation, Compass } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { allStations, popularDestinations } from '@/mock/data';
import { Station } from '@/types';

interface ArrivalSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentArrival: string;
  onSelect: (stationName: string) => void;
}

const REGIONS = ['전체', '수도권', '경기', '충청', '강원', '영남', '호남'] as const;

// 터미널별 고속 / 시외 / 고/시 통일된 Service Color Fill 뱃지
const TerminalTypeBadge: React.FC<{ type?: Station['availableTypes'] }> = ({ type = 'both' }) => {
  if (type === 'express') {
    return (
      <span className="w-10 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-extrabold text-center shrink-0 whitespace-nowrap shadow-2xs">
        고속
      </span>
    );
  }
  if (type === 'intercity') {
    return (
      <span className="w-10 py-1 rounded-lg bg-[#059669] text-white text-[10px] font-extrabold text-center shrink-0 whitespace-nowrap shadow-2xs">
        시외
      </span>
    );
  }
  return (
    <span className="w-10 py-1 rounded-lg bg-[#132B45] text-white text-[10px] font-extrabold text-center shrink-0 whitespace-nowrap shadow-2xs">
      고/시
    </span>
  );
};

export const ArrivalSelectSheet: React.FC<ArrivalSelectSheetProps> = ({
  isOpen,
  onClose,
  currentArrival,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [mapStation, setMapStation] = useState<Station | null>(null);

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
    setMapStation(null);
    onSelect(name);
    onClose();
  };

  const handleClose = () => {
    setMapStation(null);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      fixedHeight
      title={mapStation ? `${mapStation.name} 터미널 위치 지도` : '도착지 터미널 선택'}
      subtitle={mapStation ? mapStation.address : undefined}
      footer={
        mapStation ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMapStation(null)}
              className="py-3 px-4 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>목록으로</span>
            </button>
            <button
              type="button"
              onClick={() => handleChoose(mapStation.name)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>&apos;{mapStation.name}&apos; 도착지로 선택하기</span>
            </button>
          </div>
        ) : undefined
      }
    >
      {mapStation ? (
        /* 터미널 위치 지도 상세 화면 */
        <div className="space-y-4">
          <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-[#CBD5E1] bg-[#E2E8F0] shadow-xs">
            {mapStation.lat && mapStation.lng && (
              <iframe
                title={`${mapStation.name} 터미널 지도`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  mapStation.lng - 0.008
                }%2C${mapStation.lat - 0.005}%2C${mapStation.lng + 0.008}%2C${
                  mapStation.lat + 0.005
                }&layer=mapnik&marker=${mapStation.lat}%2C${mapStation.lng}`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            )}

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#132B45]/90 text-white text-[11px] font-extrabold shadow-sm backdrop-blur-xs">
                <Compass className="w-3.5 h-3.5 text-[#93C5FD]" />
                {mapStation.region}권역 · {mapStation.name}터미널
              </span>
              {mapStation.lat && mapStation.lng && (
                <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#334155] text-[10px] font-bold border border-[#CBD5E1] shadow-xs">
                  {mapStation.lat.toFixed(4)}°N, {mapStation.lng.toFixed(4)}°E
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center">
              <div className="px-3.5 py-2 rounded-2xl bg-white/95 border border-[#BFDBFE] shadow-md flex items-center gap-2 max-w-full">
                <div className="w-7 h-7 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-[#0F172A] block truncate">
                    {mapStation.name}버스터미널
                  </span>
                  <span className="text-[10px] text-[#64748B] block truncate">
                    {mapStation.roads
                      ? `${mapStation.roads[0]} · ${mapStation.roads[1]} 교차 권역`
                      : mapStation.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] divide-y divide-[#E2E8F0]">
            <div className="px-4 py-3 space-y-0.5">
              <span className="text-[10px] font-bold text-[#64748B] block">도로명 주소</span>
              <p className="text-xs font-extrabold text-[#0F172A]">
                {mapStation.address || `${mapStation.region} ${mapStation.name} 버스터미널`}
              </p>
            </div>
            <div className="px-4 py-3 space-y-0.5">
              <span className="text-[10px] font-bold text-[#64748B] block">주변 랜드마크 · 환승 연계</span>
              <p className="text-xs font-semibold text-[#1D4ED8] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>{mapStation.landmark || '시내버스 및 택시 복합환승 정류장 인접'}</span>
              </p>
            </div>
            {mapStation.roads && (
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#64748B]">인접 주요 도로</span>
                <div className="flex items-center gap-1.5">
                  {mapStation.roads.map((road) => (
                    <span
                      key={road}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-[#E2E8F0] text-[#334155]"
                    >
                      {road}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 도착지 터미널 선택 목록 화면 */
        <div className="space-y-4">
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

          {/* 주요 인기 도착지 그리드 */}
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

          {/* 전체 도착지 세로 리스트: 좌측 고속/시외/고·시 뱃지 + 중앙 터미널명 + 우측 위치 지도 버튼 */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#64748B] block">
              터미널 목록 ({filteredStations.length})
            </span>
            {filteredStations.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#94A3B8]">
                검색 조건에 맞는 도착지 터미널이 없습니다.
              </div>
            ) : (
              <div className="rounded-2xl border border-[#EEF2F6] divide-y divide-[#EEF2F6] overflow-hidden bg-white">
                {filteredStations.map((st) => {
                  const isSelected = currentArrival === st.name;
                  return (
                    <div
                      key={st.id}
                      className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition-colors ${
                        isSelected ? 'bg-[#EFF6FF]/80' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {/* 좌측 + 중앙: 컬러 뱃지(고속/시외/고·시) 및 터미널명 선택 영역 */}
                      <button
                        type="button"
                        onClick={() => handleChoose(st.name)}
                        className="flex-1 flex items-center gap-2.5 text-left min-w-0 py-0.5"
                      >
                        <TerminalTypeBadge type={st.availableTypes} />
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
                        {isSelected && <Check className="w-4 h-4 text-[#2563EB] shrink-0 ml-auto" />}
                      </button>

                      {/* 우측: 터미널 위치 지도 열기 버튼 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMapStation(st);
                        }}
                        aria-label={`${st.name} 터미널 위치 지도 보기`}
                        title={`${st.name} 위치 지도 보기`}
                        className="w-8 h-8 rounded-xl bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#BFDBFE] flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </BottomSheet>
  );
};
