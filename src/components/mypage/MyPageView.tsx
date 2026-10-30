'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TopAppBar } from '../common/TopAppBar';
import { RoutineCard } from './RoutineCard';
import { AddRoutineModal } from './AddRoutineModal';
import { TerminalLiveCard } from '../home/TerminalLiveCard';
import {
  Sparkles,
  Plus,
  Bell,
  MapPin,
  Shield,
  Phone,
  User,
  GraduationCap,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export const MyPageView: React.FC = () => {
  const { user, updateUser, routines, addRoutine, toggleRoutine, deleteRoutine, showToast } =
    useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAiBanner, setShowAiBanner] = useState(true);

  const handleRegisterAiSuggestedRoutine = () => {
    addRoutine({
      title: 'AI 추천: 일요 천안 복귀 루틴',
      departureStation: '서울경부',
      arrivalStation: '천안',
      busType: 'express',
      daysOfWeek: ['일'],
      preferredTime: '오후 8시대 (20:30)',
      originPlace: '서울 본가',
      transitMode: '지하철+도보 (40분 소요)',
      estimatedTransitMinutes: 40,
      isActive: true,
      isAiLearned: true,
    });
    setShowAiBanner(false);
    showToast('AI 추천 복귀 루틴이 내 목록에 등록되었습니다.');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6F9] pb-8">
      <TopAppBar title="마이페이지" />

      <div className="p-4 space-y-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#EEF2F6] shadow-xs flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#132B45] to-[#1E3A8A] flex items-center justify-center text-white font-black text-lg shadow-sm">
            지우
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-[#0F172A] tracking-tight">
                {user.name}
              </h3>
              <span className="text-[10px] bg-[#E1EDFB] text-[#17365D] font-bold px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{user.university}</span>
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              주요 터미널: {user.frequentTerminal}
            </p>
          </div>
        </div>

        {/* STEP 01-A: AI 자동 학습 및 등록 제안 배너 */}
        {showAiBanner && (
          <div className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] border border-[#DDD6FE] rounded-3xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#6366F1] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#4F46E5]">AI 자동 패턴 학습 제안</span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              “최근 일요일 저녁마다 <strong>서울에서 천안으로 복귀</strong>하셨네요. 이 일정도 반복 루틴으로 등록할까요?”
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRegisterAiSuggestedRoutine}
                className="flex-1 py-2 px-3 bg-[#4F46E5] text-white rounded-xl text-xs font-bold hover:bg-[#4338CA] transition-colors shadow-xs"
              >
                루틴 등록하기
              </button>
              <button
                type="button"
                onClick={() => setShowAiBanner(false)}
                className="py-2 px-3 bg-white text-[#64748B] border border-[#CBD5E1] rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                나중에
              </button>
            </div>
          </div>
        )}

        {/* STEP 01-B: 나의 이동 루틴 카드 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A] tracking-tight">나의 이동 루틴</h3>
              <p className="text-[11px] text-[#64748B]">반복 일정 맞춤 예매 및 교통 알림 관리</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 text-xs font-bold text-white bg-[#132B45] hover:bg-[#1E3A8A] px-3 py-1.5 rounded-xl shadow-xs transition-colors active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>직접 등록</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onToggle={toggleRoutine}
                onDelete={deleteRoutine}
              />
            ))}
          </div>
        </div>

        {/* 환경 설정 (알림 및 위치) */}
        <div className="bg-white rounded-3xl p-5 border border-[#EEF2F6] shadow-xs space-y-3">
          <h4 className="font-extrabold text-xs text-[#0F172A] mb-1">스마트 이동 비서 설정</h4>

          {/* AI 권장 출발 알림 */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F1F5F9] text-[#132B45]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  AI 권장 출발시간 알림
                </span>
                <span className="text-[10px] text-[#64748B]">
                  출발 50분 전 여유 있게 푸시 발송
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.autoAiAlert}
              onChange={(e) => updateUser({ autoAiAlert: e.target.checked })}
              className="w-5 h-5 accent-[#132B45] cursor-pointer"
            />
          </div>

          {/* 실시간 교통 정체 반영 */}
          <div className="flex items-center justify-between py-1 border-t border-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F1F5F9] text-[#2563EB]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  교통 상황 변화 자동 반영
                </span>
                <span className="text-[10px] text-[#64748B]">
                  정체 발생 시 출발시간 재계산
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.liveTrafficAlert}
              onChange={(e) => updateUser({ liveTrafficAlert: e.target.checked })}
              className="w-5 h-5 accent-[#132B45] cursor-pointer"
            />
          </div>

          {/* 위치 정보 권한 */}
          <div className="flex items-center justify-between py-1 border-t border-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F1F5F9] text-[#059669]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  정밀 위치 기반 소요시간 계산
                </span>
                <span className="text-[10px] text-[#64748B]">
                  캠퍼스에서 터미널까지 실시간 경로
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={user.locationPermission}
              onChange={(e) => updateUser({ locationPermission: e.target.checked })}
              className="w-5 h-5 accent-[#132B45] cursor-pointer"
            />
          </div>
        </div>

        {/* 천안종합버스터미널 실시간 현황 */}
        <TerminalLiveCard />

        {/* 터미널 고객센터 안내 */}
        <div className="p-4 bg-white rounded-3xl border border-[#EEF2F6] shadow-xs text-xs space-y-1 text-[#64748B]">
          <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
            <Phone className="w-3.5 h-3.5 text-[#132B45]" />
            <span>천안종합버스터미널 고객센터</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            충청남도 천안시 동남구 만남로 43 (신부동) | ARS 1688-2550
          </p>
          <div className="text-[10px] text-[#94A3B8] pt-1">
            My Bus 천안 터미널 AI 개인 맞춤형 모빌리티 프로토타입 v1.0.0
          </div>
        </div>
      </div>

      {/* Add Routine Modal */}
      <AddRoutineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRoutine}
      />
    </div>
  );
};
