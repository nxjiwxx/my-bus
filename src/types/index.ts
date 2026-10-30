export type BusType = 'express' | 'intercity';

export type BusGrade = '우등' | '프리미엄' | '일반';

export interface Station {
  id: string;
  name: string;
  region: string;
  isPopular?: boolean;
}

export interface BusSchedule {
  id: string;
  busType: BusType;
  departureStation: string;
  arrivalStation: string;
  departureTime: string; // "18:00"
  arrivalTime: string;   // "19:30"
  duration: string;      // "1시간 30분"
  grade: BusGrade;
  company: string;       // "동양고속", "금호고속", "충남고속", etc.
  fee: number;           // 7400
  totalSeats: number;    // 28
  remainingSeats: number;// 12
  platform: string;      // "7번 홈"
}

// 탑승 유형 (좌석 선택 시 좌석별로 지정)
export type PassengerType = 'adult' | 'teen' | 'child' | 'veteran';

export type PassengerState = Record<PassengerType, number>;

// 좌석별 탑승 유형 지정 정보
export interface SeatPassenger {
  seatNumber: number;
  type: PassengerType;
  fare: number;
  // 보훈 인증 정보 (보훈 선택 시)
  veteranVerified?: boolean;
}

// 노선도(경유지) 정보
export interface RouteStop {
  name: string;
  kind: 'origin' | 'via' | 'rest' | 'destination';
  time: string; // "17:35"
  note?: string;
}

export type SeatStatus = 'available' | 'selected' | 'occupied' | 'disabled';

export interface SeatInfo {
  number: number;
  status: SeatStatus;
  isSingle?: boolean; // 우등버스 좌측 1인석 여부
}

export interface Ticket {
  id: string;
  bookingNumber: string;
  busSchedule: BusSchedule;
  travelDate: string; // "2026-10-30 (금)"
  seatNumbers: number[];
  passengerCount: {
    adult: number;
    teen: number;
    child: number;
    veteran?: number;
  };
  totalFee: number;
  paymentMethod: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  // AI 연계 필드
  originPlace: string;     // "상명대학교"
  transitMode: string;     // "시내버스"
  targetArrivalTime: string; // "17:40"
  recommendedDepartureTime: string; // "17:10"
}

export interface TravelRoutine {
  id: string;
  title: string;
  departureStation: string;
  arrivalStation: string;
  busType: BusType;
  daysOfWeek: string[]; // ["금"]
  preferredTime: string;// "오후 6시대 (18:00)"
  originPlace: string;  // "대학교"
  transitMode: string;  // "시내버스"
  estimatedTransitMinutes: number; // 30
  isActive: boolean;
  isAiLearned?: boolean;
}

// 홈 화면 5대 시뮬레이션 상태
export type SimulationState =
  | 'before_booking'   // STATE 01. 예매 전: AI가 다음 이동을 예측하고 예매 제안
  | 'booked'           // STATE 02. 예매 완료: 예매 정보와 권장 출발시간 안내 (17:10)
  | 'traffic_delay'    // STATE 03-A. 교통 상황 변경: 정체 발생 (+15분 -> 권장 출발 16:55)
  | 'bus_delay'        // STATE 03-B. 버스 운행시간 지연: 공식 출발시간 18:00 -> 18:20
  | 'in_transit'       // STATE 04. 터미널 이동 중: 이동 중 게이지 & 예상 도착시간
  | 'arrived';         // STATE 05. 터미널 도착: 모바일 승차권 및 7번 탑승구 안내

// 5대 탭 내비게이션 (타임라인 탭 포함)
export type TabType = 'home' | 'booking' | 'timeline' | 'tickets' | 'mypage';

export interface UserProfile {
  name: string;
  role: string;
  university: string;
  frequentTerminal: string;
  preferredRoute: string;
  autoAiAlert: boolean;
  liveTrafficAlert: boolean;
  locationPermission: boolean;
}

// ==========================================
// AI 기반 맞춤형 터미널 여유시간 타임라인 (가제: 맞춤형 타임라인)
// ==========================================

export type MovementBoundary = 'terminal_inside' | 'complex_space' | 'surrounding_area';

export type ActivityCategory = '식사' | '카페' | '쇼핑' | '휴식' | '문화/서점' | '승차장이동';

export interface TimelinePlace {
  id: string;
  name: string;
  category: ActivityCategory;
  location: string;
  boundary: MovementBoundary;
  defaultDurationMinutes: number;
  defaultCost: string;
  costValue: number; // 예산 필터링용 금액 (원)
  description: string;
  recommendedTag: string;
  guideFloor: string;
  routeInstruction: string;
  routeSteps?: string[]; // 구체적인 단계별 길 안내 흐름
  suitableCompanions?: string[]; // ['혼자', '연인', '친구', '가족']
  suitableExperiences?: string[]; // ['여유롭게', '조용하게', '활동적이게']
  imageUrl?: string;
}

export interface TimelineItem {
  id: string;
  placeId: string;
  title: string;
  category: ActivityCategory;
  location: string;
  startTime: string; // "16:40"
  endTime: string;   // "17:15"
  durationMinutes: number; // 35
  cost: string;
  costValue?: number;
  description: string;
  transitTimeToNext: number; // 4분
  isBoardingStep?: boolean;
  status: 'upcoming' | 'current' | 'completed';
  guideFloor: string;
  routeInstruction: string;
  routeSteps?: string[];
}

export interface TimelineFilterState {
  // 필수 입력 (STEP 01)
  busDepartureTime: string; // "18:00"
  boardingPlatform: string; // "7번 홈"
  currentTime: string;      // "16:35"
  currentLocation: string;  // "천안터미널 1층 대합실"
  movementBoundary: MovementBoundary;
  // 선택 필터링 입력 (STEP 01)
  activities: string[];     // ['문화/서점', '카페']
  companion: string;        // '혼자' | '연인' | '친구' | '가족' | 직접입력 값
  experience: string;       // '여유롭게' | '조용하게' | '활동적이게' | 직접입력 값
  useBudgetFilter: boolean; // 예산 분석 포함 여부 (사용자 선택에 따른 분석 진행)
  budget: string;           // '무료' | '1만원' | '2만원' | '3만원' | 직접입력 값
}

export interface CustomTimeline {
  id: string;
  busDepartureTime: string; // "18:00"
  boardingPlatform: string;  // "7번 홈"
  currentTime: string;       // "16:35"
  currentLocation: string;   // "천안터미널 1층 대합실"
  totalAvailableMinutes: number; // 85분 (현재 시각 ~ 버스 출발)
  bufferMinutes: number;         // 15분 (탑승 준비 권장 여유시간)
  actualBufferMinutes: number;   // 실제 확보된 탑승 준비 시간
  filter: TimelineFilterState;
  items: TimelineItem[];
  isConfirmed: boolean;
  voiceGuideEnabled: boolean;
  currentActivityIndex: number;
  isAlertedForBoarding: boolean;
  isDelayedAdjusted?: boolean;
  delayAdjustmentReason?: string;
  aiAnalysisSummary?: string;
}
