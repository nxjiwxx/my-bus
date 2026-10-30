'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { TicketCard } from './TicketCard';
import { TicketQRCodeModal } from './TicketQRCodeModal';
import { TicketCancelModal } from './TicketCancelModal';
import { Ticket } from '@/types';
import { Bus, Clock, History, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { BusTypeBadge } from '../common/Badge';
import { formatPrice } from '@/lib/utils';

export const TicketsView: React.FC = () => {
  const { activeTicket, pastTickets, cancelActiveTicket, setCurrentTab } = useApp();
  const [ticketTab, setTicketTab] = useState<'upcoming' | 'past'>('upcoming');

  const [selectedQR, setSelectedQR] = useState<Ticket | null>(null);
  const [cancellingTicket, setCancellingTicket] = useState<Ticket | null>(null);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9] pb-8">
      <TopAppBar title="내 승차권" />

      {/* Tabs */}
      <div className="p-4 pb-2">
        <div className="flex p-1 bg-[#F1F5F9] rounded-2xl">
          <button
            onClick={() => setTicketTab('upcoming')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              ticketTab === 'upcoming'
                ? 'bg-[#132B45] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span>다가오는 승차권</span>
            {activeTicket && (
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            )}
          </button>
          <button
            onClick={() => setTicketTab('past')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              ticketTab === 'past'
                ? 'bg-[#132B45] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>지난 예매 내역 ({pastTickets.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {ticketTab === 'upcoming' ? (
          activeTicket ? (
            <TicketCard
              ticket={activeTicket}
              onOpenQR={(t) => setSelectedQR(t)}
              onCancel={(t) => setCancellingTicket(t)}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#EEF2F6] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto text-[#64748B]">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#0F172A]">
                다가오는 승차권이 없습니다
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                원하시는 목적지와 시간대의 고속·시외버스를 조회하고 빠르게 예매해보세요.
              </p>
              <button
                onClick={() => setCurrentTab('booking')}
                className="py-2.5 px-4 bg-[#132B45] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
              >
                버스 예매하러 가기
              </button>
            </div>
          )
        ) : (
          /* Past Tickets History */
          <div className="space-y-3">
            {pastTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl p-4 border border-[#EEF2F6] shadow-xs space-y-2 opacity-85 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BusTypeBadge busType={ticket.busSchedule.busType} />
                    <span className="text-xs font-semibold text-[#64748B]">{ticket.travelDate}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      ticket.status === 'cancelled'
                        ? 'bg-[#FEE2E2] text-[#991B1B]'
                        : 'bg-[#EEF2F6] text-[#64748B]'
                    }`}
                  >
                    {ticket.status === 'cancelled' ? '예매 취소' : '탑승 완료'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="font-bold text-sm text-[#0F172A]">
                    {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation}
                  </div>
                  <span className="text-sm font-black text-[#64748B]">
                    {formatPrice(ticket.totalFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-[#F8FAFC]">
                  <span>출발 {ticket.busSchedule.departureTime} (좌석 {ticket.seatNumbers.join(', ')}번)</span>
                  <span className="font-mono">{ticket.bookingNumber}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedQR && (
        <TicketQRCodeModal
          isOpen={true}
          onClose={() => setSelectedQR(null)}
          ticket={selectedQR}
        />
      )}

      {/* Cancel Modal */}
      {cancellingTicket && (
        <TicketCancelModal
          isOpen={true}
          onClose={() => setCancellingTicket(null)}
          onConfirmCancel={() => {
            cancelActiveTicket();
            setCancellingTicket(null);
          }}
          ticket={cancellingTicket}
        />
      )}
    </div>
  );
};
