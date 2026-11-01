'use client';

import React, { useState } from 'react';
import { X, Calendar, Plus, MapPin, Clock, Bus } from 'lucide-react';
import { BusType, TravelRoutine } from '@/types';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (routine: Omit<TravelRoutine, 'id'>) => void;
}

export const AddRoutineModal: React.FC<AddRoutineModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('금요 귀가 루틴');
  const [departureStation, setDepartureStation] = useState('천안');
  const [arrivalStation, setArrivalStation] = useState('서울경부');
  const [busType, setBusType] = useState<BusType>('express');
  const [days, setDays] = useState<string[]>(['금']);
  const [preferredTime, setPreferredTime] = useState('오후 6시대 (18:00)');
  const [originPlace, setOriginPlace] = useState('상명대학교 천안캠퍼스');
  const [transitMode, setTransitMode] = useState('시내버스 (400번 계열)');
  const [estimatedTransitMinutes, setEstimatedTransitMinutes] = useState(30);

  if (!isOpen) return null;

  const dayList = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (d: string) => {
    if (days.includes(d)) {
      if (days.length > 1) {
        setDays(days.filter((item) => item !== d));
      }
    } else {
      setDays([...days, d]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      departureStation,
      arrivalStation,
      busType,
      daysOfWeek: days,
      preferredTime,
      originPlace,
      transitMode,
      estimatedTransitMinutes,
      isActive: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-dialog flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm max-h-[90vh] flex flex-col p-5 shadow-2xl border border-surface-outline-variant animate-in slide-in-from-bottom-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-extrabold text-body text-surface-on-surface">새 이동 루틴 등록</h3>
          </div>
          <button onClick={onClose} className="p-1 text-surface-outline hover:text-surface-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1">
          {/* 1. Title */}
          <div>
            <label className="text-caption-sm font-bold text-surface-outline block mb-1">루틴 이름</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 금요 귀가 루틴, 주말 서울 약속"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright border border-surface-outline-variant text-caption font-semibold focus:outline-none focus:border-primary"
            />
          </div>

          {/* 2. Route & Bus Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-caption-sm font-bold text-surface-outline block mb-1">출발지</label>
              <input
                type="text"
                value={departureStation}
                onChange={(e) => setDepartureStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-bright border border-surface-outline-variant text-caption font-semibold"
              />
            </div>
            <div>
              <label className="text-caption-sm font-bold text-surface-outline block mb-1">도착지</label>
              <input
                type="text"
                value={arrivalStation}
                onChange={(e) => setArrivalStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-bright border border-surface-outline-variant text-caption font-semibold"
              />
            </div>
          </div>

          {/* Bus Type Radio */}
          <div className="flex p-1 bg-surface-soft rounded-xl text-caption font-bold">
            <button
              type="button"
              onClick={() => setBusType('express')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                busType === 'express' ? 'bg-express text-white shadow-xs' : 'text-surface-outline'
              }`}
            >
              고속버스
            </button>
            <button
              type="button"
              onClick={() => setBusType('intercity')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                busType === 'intercity' ? 'bg-intercity text-white shadow-xs' : 'text-surface-outline'
              }`}
            >
              시외버스
            </button>
          </div>

          {/* 3. Days of Week */}
          <div>
            <label className="text-caption-sm font-bold text-surface-outline block mb-1">반복 요일</label>
            <div className="flex items-center justify-between gap-1">
              {dayList.map((d) => {
                const isSelected = days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`w-9 h-9 rounded-xl text-caption font-bold transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-soft text-surface-outline hover:text-surface-on-surface'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Preferred Departure Time */}
          <div>
            <label className="text-caption-sm font-bold text-surface-outline block mb-1">선호 출발시간대</label>
            <input
              type="text"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              placeholder="예: 오후 6시대 (18:00)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright border border-surface-outline-variant text-caption font-semibold"
            />
          </div>

          {/* 5. Terminal Departure Origin & Transport Mode */}
          <div className="space-y-2 p-3 bg-surface-bright rounded-2xl border border-surface-container">
            <div>
              <label className="text-caption-sm font-bold text-surface-outline block mb-1">
                터미널 이동 출발 위치
              </label>
              <input
                type="text"
                value={originPlace}
                onChange={(e) => setOriginPlace(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-surface-outline-variant text-caption font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-caption-xs font-bold text-surface-outline block mb-1">
                  이동 수단
                </label>
                <input
                  type="text"
                  value={transitMode}
                  onChange={(e) => setTransitMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-surface-outline-variant text-caption font-semibold"
                />
              </div>
              <div>
                <label className="text-caption-xs font-bold text-surface-outline block mb-1">
                  소요 시간 (분)
                </label>
                <input
                  type="number"
                  value={estimatedTransitMinutes}
                  onChange={(e) => setEstimatedTransitMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-surface-outline-variant text-caption font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white rounded-2xl text-body-sm font-extrabold hover:bg-primary-hover transition-all shadow-md active:scale-98"
          >
            루틴 등록 완료
          </button>
        </form>
      </div>
    </div>
  );
};
