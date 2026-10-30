'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BusGrade, BusSchedule, BusType, SeatPassenger, Ticket } from '@/types';
import { mockBusSchedules } from '@/mock/data';
import { TopAppBar } from '../common/TopAppBar';
import { BusSearchForm } from './BusSearchForm';
import { BusScheduleCard } from './BusScheduleCard';
import { SeatSelector } from './SeatSelector';
import { BookingConfirmModal } from './BookingConfirmModal';
import { PaymentModal } from './PaymentModal';
import { BookingSuccessModal } from './BookingSuccessModal';
import { emptyPassengerState } from '@/lib/utils';

export const BookingView: React.FC = () => {
  const {
    setCurrentTab,
    bookingPreset,
    setBookingPreset,
    bookBusTicket,
    activeTicket,
  } = useApp();

  const [step, setStep] = useState<'search' | 'results' | 'seats'>('search');
  const [busType, setBusType] = useState<BusType>('express');
  const [searchCriteria, setSearchCriteria] = useState({
    departure: '천안',
    arrival: '서울경부',
    date: '2026-10-30 (금)',
  });

  // 조회 결과 필터
  const [selectedGrade, setSelectedGrade] = useState<'전체' | BusGrade>('전체');

  // 좌석 및 결제 진행 상태
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatPassenger[]>([]);

  // 모달 제어
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [completedTicket, setCompletedTicket] = useState<Ticket | null>(null);

  // AI 프리셋 감지 시 자동 검색 결과 화면으로 이동
  useEffect(() => {
    if (bookingPreset) {
      setBusType(bookingPreset.busType);
      setSearchCriteria((prev) => ({
        ...prev,
        departure: bookingPreset.departure,
        arrival: bookingPreset.arrival,
      }));
      setStep('results');
      setBookingPreset(null);
    }
  }, [bookingPreset, setBookingPreset]);

  // 스케줄 필터링
  const filteredSchedules = mockBusSchedules.filter((s) => {
    const matchType = s.busType === busType;
    const matchGrade = selectedGrade === '전체' || s.grade === selectedGrade;
    return matchType && matchGrade;
  });

  // 좌석별 탑승 유형에서 집계한 승객 구성과 총 요금
  const passengers = selectedSeats.reduce((acc, s) => {
    acc[s.type] += 1;
    return acc;
  }, emptyPassengerState());
  const totalFee = selectedSeats.reduce((sum, s) => sum + s.fare, 0);

  const handleSearchSubmit = (criteria: {
    departure: string;
    arrival: string;
    date: string;
  }) => {
    setSearchCriteria(criteria);
    setStep('results');
  };

  const handleSelectSchedule = (schedule: BusSchedule) => {
    setSelectedSchedule(schedule);
    setStep('seats');
  };

  const handleConfirmSeats = (seats: SeatPassenger[]) => {
    setSelectedSeats(seats);
    setIsConfirmModalOpen(true);
  };

  const handleProceedPayment = () => {
    setIsConfirmModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!selectedSchedule) return;
    setIsPaymentModalOpen(false);
    const newTicket = bookBusTicket(
      selectedSchedule,
      selectedSeats.map((s) => s.seatNumber),
      passengers,
      totalFee
    );
    setCompletedTicket(newTicket);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9]">
      <TopAppBar
        title={
          step === 'search'
            ? '버스 예매'
            : step === 'results'
            ? `${searchCriteria.departure} 출발 ${busType === 'express' ? '고속' : '시외'}버스`
            : '좌석 선택'
        }
        showBack={step !== 'search'}
        onBack={() => {
          if (step === 'seats') setStep('results');
          else if (step === 'results') setStep('search');
        }}
      />

      {/* STEP 1: 버스 예매 메인 검색 폼 */}
      {step === 'search' && (
        <div className="p-4 space-y-4">
          <BusSearchForm
            busType={busType}
            onBusTypeChange={setBusType}
            onSearch={handleSearchSubmit}
            initialDeparture={searchCriteria.departure}
            initialArrival={searchCriteria.arrival}
          />

          {/* 안내 배너 */}
          <div className="p-4 rounded-3xl bg-white border border-[#EEF2F6] text-xs space-y-2">
            <h4 className="font-extrabold text-[#0F172A]">천안종합버스터미널 예매 안내</h4>
            <ul className="space-y-1 text-[#64748B] text-[11px] list-disc pl-4 leading-relaxed">
              <li>고속버스는 모바일 승차권 QR코드로 검표원 또는 단말기에 태그할 수 있습니다.</li>
              <li>출발 1시간 전까지는 취소 수수료가 전액 면제됩니다.</li>
              <li>AI 이동 비서가 터미널 이동 소요시간과 권장 출발시간을 자동으로 안내합니다.</li>
            </ul>
          </div>
        </div>
      )}

      {/* STEP 2: 버스 시간표 조회 결과 목록 */}
      {step === 'results' && (
        <div className="flex-1 flex flex-col p-4 space-y-3 pb-8">
          {/* Header Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#EEF2F6] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] text-[#64748B] block font-medium">{searchCriteria.date}</span>
              <span className="text-sm font-extrabold text-[#0F172A]">
                총 {filteredSchedules.length}개의 운행 편
              </span>
            </div>
            <button
              onClick={() => setStep('search')}
              className="text-xs text-[#2563EB] font-bold px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
            >
              조건 변경
            </button>
          </div>

          {/* Grade Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['전체', '우등', '프리미엄', '일반'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGrade === grade
                    ? 'bg-[#132B45] text-white shadow-xs'
                    : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:text-[#0F172A]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Schedules List */}
          <div className="space-y-2.5">
            {filteredSchedules.map((schedule) => {
              const isAiTarget = schedule.id === 'exp-103'; // 18:00 버스
              return (
                <BusScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onSelect={handleSelectSchedule}
                  isAiRecommended={isAiTarget}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: 좌석 선택 화면 */}
      {step === 'seats' && selectedSchedule && (
        <SeatSelector
          schedule={selectedSchedule}
          onConfirm={handleConfirmSeats}
          onBack={() => setStep('results')}
        />
      )}

      {/* STEP 4: 예매 정보 확인 모달 */}
      {selectedSchedule && (
        <BookingConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onProceedPayment={handleProceedPayment}
          schedule={selectedSchedule}
          seats={selectedSeats}
          date={searchCriteria.date}
          totalFee={totalFee}
        />
      )}

      {/* STEP 5: 결제 시뮬레이션 모달 */}
      {selectedSchedule && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          totalFee={totalFee}
        />
      )}

      {/* STEP 6: 예매 완료 & AI 이동일정 연계 모달 */}
      {completedTicket && (
        <BookingSuccessModal
          isOpen={true}
          ticket={completedTicket}
          onViewTicket={() => {
            setCompletedTicket(null);
            setStep('search');
            setCurrentTab('tickets');
          }}
          onGoHome={() => {
            setCompletedTicket(null);
            setStep('search');
            setCurrentTab('home');
          }}
        />
      )}
    </div>
  );
};
