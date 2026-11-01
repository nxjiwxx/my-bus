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
    <div className="flex-1 flex flex-col bg-surface-container-low pb-8">
      <TopAppBar title="내 승차권" />

      {/* Tabs */}
      <div className="p-4 pb-2">
        <div className="flex p-1 bg-surface-soft rounded-2xl">
          <button
            onClick={() => setTicketTab('upcoming')}
            className={`flex-1 py-2.5 rounded-xl text-caption font-bold transition-all flex items-center justify-center gap-1.5 ${
              ticketTab === 'upcoming'
                ? 'bg-primary text-white shadow-xs'
                : 'text-surface-outline hover:text-surface-on-surface'
            }`}
          >
            <span>다가오는 승차권</span>
            {activeTicket && (
              <span className="w-2 h-2 rounded-full bg-express" />
            )}
          </button>
          <button
            onClick={() => setTicketTab('past')}
            className={`flex-1 py-2.5 rounded-xl text-caption font-bold transition-all flex items-center justify-center gap-1.5 ${
              ticketTab === 'past'
                ? 'bg-primary text-white shadow-xs'
                : 'text-surface-outline hover:text-surface-on-surface'
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
            <div className="bg-white rounded-3xl p-8 border border-surface-container text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center mx-auto text-surface-outline">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-body text-surface-on-surface">
                다가오는 승차권이 없습니다
              </h3>
              <p className="text-caption text-surface-outline leading-relaxed">
                원하시는 목적지와 시간대의 고속·시외버스를 조회하고 빠르게 예매해보세요.
              </p>
              <button
                onClick={() => setCurrentTab('booking')}
                className="py-2.5 px-4 bg-primary text-white rounded-xl text-caption font-bold hover:bg-primary-hover transition-colors"
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
                className="bg-white rounded-2xl p-4 border border-surface-container shadow-xs space-y-2 opacity-85 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BusTypeBadge busType={ticket.busSchedule.busType} />
                    <span className="text-caption font-semibold text-surface-outline">{ticket.travelDate}</span>
                  </div>
                  <span
                    className={`text-caption-xs px-2 py-0.5 rounded-full font-bold ${
                      ticket.status === 'cancelled'
                        ? 'bg-error-container text-error-on-container'
                        : 'bg-surface-container text-surface-outline'
                    }`}
                  >
                    {ticket.status === 'cancelled' ? '예매 취소' : '탑승 완료'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="font-bold text-label text-surface-on-surface">
                    {ticket.busSchedule.departureStation} → {ticket.busSchedule.arrivalStation}
                  </div>
                  <span className="text-label font-black text-surface-outline">
                    {formatPrice(ticket.totalFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-caption-sm text-surface-outline pt-1 border-t border-surface-bright">
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
