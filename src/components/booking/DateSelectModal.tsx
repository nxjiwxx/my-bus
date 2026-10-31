'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';

interface DateSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: string;
  currentHour: number;
  onSelect: (dateStr: string, hour: number) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const HOURS = Array.from({ length: 25 }, (_, i) => i); // 00시 ~ 24시

// 기준 오늘 날짜: 2026-10-30
const TODAY_YEAR = 2026;
const TODAY_MONTH = 9; // 0-indexed (10월)
const TODAY_DAY = 30;

function parseDateStr(dateStr: string): { year: number; month: number; day: number } {
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return { year: TODAY_YEAR, month: TODAY_MONTH, day: TODAY_DAY };
  }
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10) - 1,
    day: parseInt(match[3], 10),
  };
}

function formatDateLabel(year: number, monthZeroIdx: number, day: number): string {
  const dateObj = new Date(year, monthZeroIdx, day);
  const dow = WEEKDAYS[dateObj.getDay()];
  const mm = String(monthZeroIdx + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd} (${dow})`;
}

export const DateSelectModal: React.FC<DateSelectModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  currentHour,
  onSelect,
}) => {
  const parsed = parseDateStr(currentDate);
  const [viewYear, setViewYear] = useState<number>(parsed.year);
  const [viewMonth, setViewMonth] = useState<number>(parsed.month);
  const [selectedDate, setSelectedDate] = useState<string>(currentDate);
  const [selectedHour, setSelectedHour] = useState<number>(currentHour);
  const [dateChosenInSession, setDateChosenInSession] = useState<boolean>(false);
  const [hourChosenInSession, setHourChosenInSession] = useState<boolean>(false);

  const hourScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const p = parseDateStr(currentDate);
      setViewYear(p.year);
      setViewMonth(p.month);
      setSelectedDate(currentDate);
      setSelectedHour(currentHour);
      setDateChosenInSession(false);
      setHourChosenInSession(false);

      // 모달 열릴 때 선택된 시간 배지가 중앙에 오도록 스크롤
      setTimeout(() => {
        const container = hourScrollRef.current;
        if (!container) return;
        const activeBtn = container.querySelector<HTMLButtonElement>(
          `[data-hour="${currentHour}"]`
        );
        if (activeBtn) {
          const offset =
            activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
          container.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
        }
      }, 60);
    }
  }, [isOpen, currentDate, currentHour]);

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const canGoPrevMonth =
    viewYear > TODAY_YEAR || (viewYear === TODAY_YEAR && viewMonth > TODAY_MONTH);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isPastDay = (year: number, month: number, day: number) => {
    if (year < TODAY_YEAR) return true;
    if (year === TODAY_YEAR && month < TODAY_MONTH) return true;
    if (year === TODAY_YEAR && month === TODAY_MONTH && day < TODAY_DAY) return true;
    return false;
  };

  const handlePickDate = (formatted: string) => {
    setSelectedDate(formatted);
    setDateChosenInSession(true);
    onSelect(formatted, selectedHour);
    if (hourChosenInSession) {
      onClose();
    }
  };

  const handlePickHour = (hour: number) => {
    setSelectedHour(hour);
    setHourChosenInSession(true);
    onSelect(selectedDate, hour);
    if (dateChosenInSession || selectedDate) {
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      fixedHeight
      noScroll
      title="가는 날 · 출발 시간 설정"
      subtitle="날짜와 출발 시간을 선택하면 자동으로 적용됩니다"
    >
      <div className="h-full flex flex-col justify-between py-1">
        {/* 1. 달력 그리드 영역 */}
        <div className="space-y-2.5">
          {/* 월 이동 헤더 (날짜와 변경 버튼 중앙 정렬) */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrevMonth}
              aria-label="이전 달"
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                canGoPrevMonth
                  ? 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'
                  : 'bg-[#F8FAFC] border-[#EEF2F6] text-[#CBD5E1] cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-[#0F172A] min-w-[96px] text-center whitespace-nowrap">
              {viewYear}년 {viewMonth + 1}월
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="다음 달"
              className="w-8 h-8 rounded-xl border bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 달력 카드 (세로 스크롤 없이 한눈에 들어오도록 컴팩트 구성) */}
          <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#EEF2F6]">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-center pb-1.5 border-b border-[#E2E8F0]">
              {WEEKDAYS.map((dayName, idx) => (
                <span
                  key={dayName}
                  className={`text-[11px] font-extrabold ${
                    idx === 0
                      ? 'text-[#EF4444]'
                      : idx === 6
                      ? 'text-[#2563EB]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {dayName}
                </span>
              ))}
            </div>

            {/* 날짜 7열 그리드 */}
            <div className="grid grid-cols-7 gap-y-1 gap-x-1 pt-1.5">
              {Array.from({ length: firstDayOfWeek }).map((_, emptyIdx) => (
                <div key={`empty-${emptyIdx}`} className="h-8" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const disabled = isPastDay(viewYear, viewMonth, day);
                const formatted = formatDateLabel(viewYear, viewMonth, day);
                const isSelected = selectedDate === formatted;
                const isToday =
                  viewYear === TODAY_YEAR &&
                  viewMonth === TODAY_MONTH &&
                  day === TODAY_DAY;
                const dow = new Date(viewYear, viewMonth, day).getDay();

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => handlePickDate(formatted)}
                    className={`h-8 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                      disabled
                        ? 'opacity-30 cursor-not-allowed text-[#94A3B8]'
                        : isSelected
                        ? 'bg-[#132B45] text-white font-black shadow-xs'
                        : isToday
                        ? 'bg-[#EFF6FF] text-[#1D4ED8] font-extrabold border border-[#BFDBFE]'
                        : dow === 0
                        ? 'text-[#EF4444] font-bold hover:bg-white'
                        : dow === 6
                        ? 'text-[#2563EB] font-bold hover:bg-white'
                        : 'text-[#0F172A] font-semibold hover:bg-white'
                    }`}
                  >
                    <span className="text-xs leading-none">{day}</span>
                    {isToday && (
                      <span
                        className={`text-[10px] font-extrabold leading-none mt-0.5 ${
                          isSelected ? 'text-[#93C5FD]' : 'text-[#2563EB]'
                        }`}
                      >
                        오늘
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. 출발 시간 가로 선택 영역 (시계 아이콘 · '출발 시간(00시~24시)' · 날짜 표기 제거) */}
        <div className="pt-3 border-t border-[#EEF2F6]">
          <div
            ref={hourScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar"
          >
            {HOURS.map((hour) => {
              const isSelected = selectedHour === hour;
              const label = `${String(hour).padStart(2, '0')}시`;
              return (
                <button
                  key={hour}
                  type="button"
                  data-hour={hour}
                  onClick={() => handlePickHour(hour)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold border whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                      : 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:border-[#94A3B8]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
