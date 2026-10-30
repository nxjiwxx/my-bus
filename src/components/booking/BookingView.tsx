'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BusGrade, BusSchedule, BusType, SeatPassenger, Ticket } from '@/types';
import { getBusSchedules } from '@/mock/data';
import { TopAppBar } from '../common/TopAppBar';
import { BusSearchForm } from './BusSearchForm';
import { BusScheduleCard } from './BusScheduleCard';
import { SeatSelector } from './SeatSelector';
import { BookingConfirmModal } from './BookingConfirmModal';
import { PaymentModal } from './PaymentModal';
import { BookingSuccessModal } from './BookingSuccessModal';
import { emptyPassengerState } from '@/lib/utils';
import { Clock } from 'lucide-react';

export const BookingView: React.FC = () => {
  const {
    setCurrentTab,
    bookingPreset,
    setBookingPreset,
    bookBusTicket,
  } = useApp();

  const [step, setStep] = useState<'search' | 'results' | 'seats'>('search');
  const [busType, setBusType] = useState<BusType>('express');
  const [searchCriteria, setSearchCriteria] = useState({
    departure: '천안',
    arrival: '서울경부',
    date: '2026-10-30 (금)',
    departureHour: 17,
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

  // 홈 화면 예매 폼 또는 AI 프리셋 감지 시 자동 검색 결과 화면으로 이동
  useEffect(() => {
    if (bookingPreset) {
      setBusType(bookingPreset.busType);
      const parsedHour =
        typeof bookingPreset.departureHour === 'number'
          ? bookingPreset.departureHour
          : bookingPreset.time
          ? parseInt(bookingPreset.time.split(':')[0], 10) || 17
          : 17;
      setSearchCriteria((prev) => ({
        ...prev,
        departure: bookingPreset.departure,
        arrival: bookingPreset.arrival,
        date: bookingPreset.date || prev.date,
        departureHour: parsedHour,
      }));
      setStep('results');
      setBookingPreset(null);
    }
  }, [bookingPreset, setBookingPreset]);

  // 선택된 도착지 및 출발 시간(00시~24시) 이후 버스만 필터링
  const allRouteSchedules = getBusSchedules(
    busType,
    searchCriteria.departure,
    searchCriteria.arrival,
    searchCriteria.departureHour
  );

  const filteredSchedules = allRouteSchedules.filter(
    (s) => selectedGrade === '전체' || s.grade === selectedGrade
  );

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
    departureHour: number;
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
            ? `${searchCriteria.departure} → ${searchCriteria.arrival}`
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
            initialDate={searchCriteria.date}
            initialDepartureHour={searchCriteria.departureHour}
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
          <div className="bg-white p-3.5 rounded-2xl border border-[#EEF2F6] flex items-center justify-between shadow-xs gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#475569] font-bold whitespace-nowrap">
                  {searchCriteria.date}
                </span>
                <span className="h-3.5 w-px bg-[#CBD5E1] shrink-0" aria-hidden="true" />
                <span className="text-xs font-extrabold text-[#2563EB] whitespace-nowrap">
                  {String(searchCriteria.departureHour).padStart(2, '0')}:00시 이후
                </span>
              </div>
              <span className="text-sm font-extrabold text-[#0F172A] block mt-1">
                {searchCriteria.departure} → {searchCriteria.arrival} ({filteredSchedules.length}편)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep('search')}
              className="text-xs text-[#2563EB] font-bold px-3 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors whitespace-nowrap shrink-0"
            >
              조건 변경
            </button>
          </div>

          {/* Grade Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['전체', '우등', '프리미엄', '일반'] as const).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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
          {filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#EEF2F6] space-y-2">
              <p className="text-sm font-extrabold text-[#0F172A]">
                선택하신 조건의 운행 버스가 없습니다.
              </p>
              <p className="text-xs text-[#64748B]">
                출발 시간을 앞당기거나 버스 등급 필터를 &apos;전체&apos;로 변경해 보세요.
              </p>
            </div>
          ) : (
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
          )}
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
