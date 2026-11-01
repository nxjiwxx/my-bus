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
      <span className="w-10 py-1 rounded-lg bg-express text-white text-caption-xs font-extrabold text-center shrink-0 whitespace-nowrap shadow-2xs">
        고속
      </span>
    );
  }
  if (type === 'intercity') {
    return (
      <span className="w-10 py-1 rounded-lg bg-intercity text-white text-caption-xs font-extrabold text-center shrink-0 whitespace-nowrap shadow-2xs">
        시외
      </span>
    );
  }
  return (
    <span className="w-10 py-1 rounded-lg bg-primary text-white text-caption-xs font-extrabold text-center shrink-0 whitespace-nowrap shadow-2xs">
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
              className="py-3.5 px-4 rounded-2xl bg-surface-soft hover:bg-surface-container-high text-surface-on-variant text-body-sm font-extrabold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>목록으로</span>
            </button>
            <button
              type="button"
              onClick={() => handleChoose(mapStation.name)}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-express hover:bg-express-on-container text-white text-body-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
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
          <div className="map-pinch-zoom relative w-full h-60 rounded-2xl overflow-hidden border border-surface-outline-variant bg-surface-container-high shadow-xs">
            {mapStation.lat && mapStation.lng && (
              <iframe
                title={`${mapStation.name} 터미널 지도`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  mapStation.lng - 0.008
                }%2C${mapStation.lat - 0.005}%2C${mapStation.lng + 0.008}%2C${
                  mapStation.lat + 0.005
                }&layer=mapnik&marker=${mapStation.lat}%2C${mapStation.lng}`}
                className="map-pinch-zoom w-full h-full border-0"
                loading="lazy"
              />
            )}

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-white text-caption-sm font-extrabold shadow-sm backdrop-blur-xs">
                <Compass className="w-3.5 h-3.5 text-[#93C5FD]" />
                {mapStation.region}권역 · {mapStation.name}터미널
              </span>
              {mapStation.lat && mapStation.lng && (
                <span className="px-2 py-0.5 rounded-full bg-white/90 text-surface-on-variant text-caption-xs font-bold border border-surface-outline-variant shadow-xs">
                  {mapStation.lat.toFixed(4)}°N, {mapStation.lng.toFixed(4)}°E
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center">
              <div className="px-3.5 py-2 rounded-2xl bg-white/95 border border-express-border shadow-md flex items-center gap-2 max-w-full">
                <div className="w-7 h-7 rounded-xl bg-express text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-caption font-black text-surface-on-surface block truncate">
                    {mapStation.name}버스터미널
                  </span>
                  <span className="text-caption-xs text-surface-outline block truncate">
                    {mapStation.roads
                      ? `${mapStation.roads[0]} · ${mapStation.roads[1]} 교차 권역`
                      : mapStation.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-container bg-surface-bright divide-y divide-surface-container-high">
            <div className="px-4 py-3 space-y-0.5">
              <span className="text-caption-xs font-bold text-surface-outline block">도로명 주소</span>
              <p className="text-caption font-extrabold text-surface-on-surface">
                {mapStation.address || `${mapStation.region} ${mapStation.name} 버스터미널`}
              </p>
            </div>
            <div className="px-4 py-3 space-y-0.5">
              <span className="text-caption-xs font-bold text-surface-outline block">주변 랜드마크 · 환승 연계</span>
              <p className="text-caption font-semibold text-express-on-container flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-express shrink-0" />
                <span>{mapStation.landmark || '시내버스 및 택시 복합환승 정류장 인접'}</span>
              </p>
            </div>
            {mapStation.roads && (
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-caption-xs font-bold text-surface-outline">인접 주요 도로</span>
                <div className="flex items-center gap-1.5">
                  {mapStation.roads.map((road) => (
                    <span
                      key={road}
                      className="text-caption-sm font-bold px-2 py-0.5 rounded-lg bg-white border border-surface-container-high text-surface-on-variant"
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
            <Search className="w-4 h-4 text-surface-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도착지 터미널 검색 (예: 서울경부, 동서울, 부산)"
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-surface-bright border border-surface-container-high text-caption font-semibold text-surface-on-surface placeholder:text-surface-muted focus:outline-none focus:border-express"
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
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-caption font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-soft text-surface-outline hover:text-surface-on-surface'
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
              <div className="flex items-center gap-1 text-caption-sm font-bold text-surface-outline">
                <Sparkles className="w-3 h-3 text-express" />
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
                      className={`py-2.5 px-2.5 rounded-xl text-caption font-bold border text-center whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-express-container border-express text-express-on-container shadow-xs'
                          : 'bg-white border-surface-container-high text-surface-on-variant hover:border-surface-muted'
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
            <span className="text-caption-sm font-bold text-surface-outline block">
              터미널 목록 ({filteredStations.length})
            </span>
            {filteredStations.length === 0 ? (
              <div className="py-10 text-center text-caption text-surface-outline">
                검색 조건에 맞는 도착지 터미널이 없습니다.
              </div>
            ) : (
              <div className="rounded-2xl border border-surface-container divide-y divide-surface-container overflow-hidden bg-white">
                {filteredStations.map((st) => {
                  const isSelected = currentArrival === st.name;
                  return (
                    <div
                      key={st.id}
                      className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition-colors ${
                        isSelected ? 'bg-express-container/80' : 'hover:bg-surface-bright'
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
                          className={`text-label font-bold truncate ${
                            isSelected ? 'text-express-on-container' : 'text-surface-on-surface'
                          }`}
                        >
                          {st.name}
                        </span>
                        <span className="text-caption-xs font-semibold px-2 py-0.5 rounded-full bg-surface-soft text-surface-outline whitespace-nowrap">
                          {st.region}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-express shrink-0 ml-auto" />}
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
                        className="w-8 h-8 rounded-xl bg-express-container hover:bg-express text-express hover:text-white border border-express-border flex items-center justify-center shrink-0 transition-colors shadow-2xs"
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
