import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PassengerState, PassengerType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

// ==========================================
// 탑승 유형(어른/중고생/아동/보훈) 요금 정책
// ==========================================

export const MAX_TICKETS_PER_BOOKING = 10;

export const PASSENGER_TYPE_INFO: Record<
  PassengerType,
  { label: string; desc: string; ratio: number; discountLabel: string }
> = {
  adult: { label: "어른", desc: "만 19세 이상", ratio: 1, discountLabel: "일반 요금" },
  teen: { label: "중고생", desc: "만 13~18세", ratio: 0.8, discountLabel: "20% 할인" },
  child: { label: "아동", desc: "만 6~12세", ratio: 0.5, discountLabel: "50% 할인" },
  veteran: { label: "보훈", desc: "국가유공자 등 · 번호 인증 필요", ratio: 0.5, discountLabel: "50% 할인" },
};

export const PASSENGER_TYPE_ORDER: PassengerType[] = ["adult", "teen", "child", "veteran"];

// 100원 단위 반올림
export function calcFare(baseFee: number, type: PassengerType): number {
  return Math.round((baseFee * PASSENGER_TYPE_INFO[type].ratio) / 100) * 100;
}

export function emptyPassengerState(): PassengerState {
  return { adult: 0, teen: 0, child: 0, veteran: 0 };
}

// "어른 2명 · 보훈 1명" 형태의 요약 문자열
export function formatPassengerSummary(passengers: Partial<PassengerState>): string {
  const parts = PASSENGER_TYPE_ORDER.filter((t) => (passengers[t] ?? 0) > 0).map(
    (t) => `${PASSENGER_TYPE_INFO[t].label} ${passengers[t]}명`
  );
  return parts.length > 0 ? parts.join(" · ") : "어른 1명";
}
