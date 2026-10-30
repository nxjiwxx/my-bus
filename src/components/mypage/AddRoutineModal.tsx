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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl w-full max-w-sm max-h-[90vh] flex flex-col p-5 shadow-2xl border border-[#CBD5E1] animate-in slide-in-from-bottom-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#132B45]" />
            <h3 className="font-extrabold text-base text-[#0F172A]">새 이동 루틴 등록</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1">
          {/* 1. Title */}
          <div>
            <label className="text-[11px] font-bold text-[#64748B] block mb-1">루틴 이름</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 금요 귀가 루틴, 주말 서울 약속"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:border-[#132B45]"
            />
          </div>

          {/* 2. Route & Bus Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#64748B] block mb-1">출발지</label>
              <input
                type="text"
                value={departureStation}
                onChange={(e) => setDepartureStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#64748B] block mb-1">도착지</label>
              <input
                type="text"
                value={arrivalStation}
                onChange={(e) => setArrivalStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold"
              />
            </div>
          </div>

          {/* Bus Type Radio */}
          <div className="flex p-1 bg-[#F1F5F9] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setBusType('express')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                busType === 'express' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              고속버스
            </button>
            <button
              type="button"
              onClick={() => setBusType('intercity')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                busType === 'intercity' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              시외버스
            </button>
          </div>

          {/* 3. Days of Week */}
          <div>
            <label className="text-[11px] font-bold text-[#64748B] block mb-1">반복 요일</label>
            <div className="flex items-center justify-between gap-1">
              {dayList.map((d) => {
                const isSelected = days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#132B45] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
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
            <label className="text-[11px] font-bold text-[#64748B] block mb-1">선호 출발시간대</label>
            <input
              type="text"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              placeholder="예: 오후 6시대 (18:00)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold"
            />
          </div>

          {/* 5. Terminal Departure Origin & Transport Mode */}
          <div className="space-y-2 p-3 bg-[#F8FAFC] rounded-2xl border border-[#EEF2F6]">
            <div>
              <label className="text-[11px] font-bold text-[#64748B] block mb-1">
                터미널 이동 출발 위치
              </label>
              <input
                type="text"
                value={originPlace}
                onChange={(e) => setOriginPlace(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] block mb-1">
                  이동 수단
                </label>
                <input
                  type="text"
                  value={transitMode}
                  onChange={(e) => setTransitMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] block mb-1">
                  소요 시간 (분)
                </label>
                <input
                  type="number"
                  value={estimatedTransitMinutes}
                  onChange={(e) => setEstimatedTransitMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#132B45] text-white rounded-2xl text-xs font-extrabold hover:bg-[#1E3A8A] transition-all shadow-md active:scale-98"
          >
            루틴 등록 완료
          </button>
        </form>
      </div>
    </div>
  );
};
