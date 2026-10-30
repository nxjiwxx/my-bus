import { BusSchedule, RouteStop, SeatInfo, Station, Ticket, TravelRoutine, UserProfile, TimelinePlace, CustomTimeline } from '@/types';

export const mockUser: UserProfile = {
  name: '김지우',
  role: '대학생',
  university: '상명대학교 천안캠퍼스',
  frequentTerminal: '천안종합버스터미널',
  preferredRoute: '천안 → 서울경부',
  autoAiAlert: true,
  liveTrafficAlert: true,
  locationPermission: true,
};

export const popularDestinations: Station[] = [
  { id: 'seoul-gyeongbu', name: '서울경부', region: '수도권', isPopular: true },
  { id: 'dong-seoul', name: '동서울', region: '수도권', isPopular: true },
  { id: 'incheon', name: '인천', region: '수도권', isPopular: true },
  { id: 'suwon', name: '수원', region: '경기', isPopular: true },
  { id: 'daejeon-complex', name: '대전복합', region: '충청', isPopular: true },
  { id: 'cheongju', name: '청주', region: '충청', isPopular: true },
  { id: 'busan', name: '부산', region: '영남', isPopular: true },
  { id: 'dong-daegu', name: '동대구', region: '영남', isPopular: true },
  { id: 'gwangju', name: '광주(유·스퀘어)', region: '호남', isPopular: true },
];

export const allStations: Station[] = [
  { id: 'cheonan', name: '천안', region: '충청', isPopular: true },
  ...popularDestinations,
  { id: 'ansan', name: '안산', region: '수도권' },
  { id: 'seongnam', name: '성남(야탑)', region: '수도권' },
  { id: 'goyang', name: '고양백석', region: '수도권' },
  { id: 'wonju', name: '원주', region: '강원' },
  { id: 'gangneung', name: '강릉', region: '강원' },
  { id: 'sejong', name: '세종고속', region: '충청' },
  { id: 'asan', name: '아산(온양)', region: '충청' },
  { id: 'jeonju', name: '전주', region: '호남' },
  { id: 'ulsan', name: '울산', region: '영남' },
  { id: 'pohang', name: '포항', region: '영남' },
];

// 천안발 버스 시간표 (고속 및 시외)
export const mockBusSchedules: BusSchedule[] = [
  {
    id: 'exp-101',
    busType: 'express',
    departureStation: '천안',
    arrivalStation: '서울경부',
    departureTime: '17:00',
    arrivalTime: '18:15',
    duration: '1시간 15분',
    grade: '우등',
    company: '동양고속',
    fee: 7400,
    totalSeats: 28,
    remainingSeats: 6,
    platform: '7번 홈',
  },
  {
    id: 'exp-102',
    busType: 'express',
    departureStation: '천안',
    arrivalStation: '서울경부',
    departureTime: '17:30',
    arrivalTime: '18:45',
    duration: '1시간 15분',
    grade: '일반',
    company: '천안고속',
    fee: 5500,
    totalSeats: 45,
    remainingSeats: 18,
    platform: '7번 홈',
  },
  {
    id: 'exp-103', // 김지우의 주요 이용 버스 (18:00)
    busType: 'express',
    departureStation: '천안',
    arrivalStation: '서울경부',
    departureTime: '18:00',
    arrivalTime: '19:15',
    duration: '1시간 15분',
    grade: '우등',
    company: '동양고속',
    fee: 7400,
    totalSeats: 28,
    remainingSeats: 12,
    platform: '7번 홈',
  },
  {
    id: 'exp-104',
    busType: 'express',
    departureStation: '천안',
    arrivalStation: '서울경부',
    departureTime: '18:30',
    arrivalTime: '19:45',
    duration: '1시간 15분',
    grade: '프리미엄',
    company: '중앙고속',
    fee: 10600,
    totalSeats: 21,
    remainingSeats: 4,
    platform: '7번 홈',
  },
  {
    id: 'exp-105',
    busType: 'express',
    departureStation: '천안',
    arrivalStation: '서울경부',
    departureTime: '19:00',
    arrivalTime: '20:15',
    duration: '1시간 15분',
    grade: '우등',
    company: '동양고속',
    fee: 7400,
    totalSeats: 28,
    remainingSeats: 9,
    platform: '7번 홈',
  },
  {
    id: 'exp-106',
    busType: 'express',
    departureStation: '천안',
    arrivalStation: '서울경부',
    departureTime: '19:30',
    arrivalTime: '20:45',
    duration: '1시간 15분',
    grade: '우등',
    company: '금호고속',
    fee: 7400,
    totalSeats: 28,
    remainingSeats: 15,
    platform: '7번 홈',
  },
  // 시외버스 (동서울 방면)
  {
    id: 'int-201',
    busType: 'intercity',
    departureStation: '천안',
    arrivalStation: '동서울',
    departureTime: '17:20',
    arrivalTime: '18:40',
    duration: '1시간 20분',
    grade: '일반',
    company: '충남고속',
    fee: 6800,
    totalSeats: 37,
    remainingSeats: 14,
    platform: '3번 홈',
  },
  {
    id: 'int-202',
    busType: 'intercity',
    departureStation: '천안',
    arrivalStation: '동서울',
    departureTime: '18:10',
    arrivalTime: '19:30',
    duration: '1시간 20분',
    grade: '우등',
    company: '대원고속',
    fee: 8200,
    totalSeats: 28,
    remainingSeats: 8,
    platform: '3번 홈',
  },
  {
    id: 'int-203',
    busType: 'intercity',
    departureStation: '천안',
    arrivalStation: '수원',
    departureTime: '18:25',
    arrivalTime: '19:15',
    duration: '50분',
    grade: '일반',
    company: '용남고속',
    fee: 4500,
    totalSeats: 41,
    remainingSeats: 19,
    platform: '12번 홈',
  },
];

// 초기 기본 예매 티켓 (김지우의 금요일 18:00 천안->서울경부)
export const initialTicket: Ticket = {
  id: 'ticket-20261030-001',
  bookingNumber: 'T261030-8849',
  busSchedule: mockBusSchedules[2], // 18:00 동양고속 우등
  travelDate: '2026-10-30 (금)',
  seatNumbers: [7],
  passengerCount: { adult: 1, teen: 0, child: 0 },
  totalFee: 7400,
  paymentMethod: '네이버페이',
  bookedAt: '2026-10-29 21:15',
  status: 'upcoming',
  originPlace: '상명대학교(천안)',
  transitMode: '시내버스 (400번)',
  targetArrivalTime: '17:40',
  recommendedDepartureTime: '17:10',
};

// 지난 승차권 목업
export const pastTickets: Ticket[] = [
  {
    id: 'ticket-past-001',
    bookingNumber: 'T261023-1123',
    busSchedule: {
      ...mockBusSchedules[2],
      departureTime: '18:00',
      arrivalTime: '19:15',
    },
    travelDate: '2026-10-23 (금)',
    seatNumbers: [7],
    passengerCount: { adult: 1, teen: 0, child: 0 },
    totalFee: 7400,
    paymentMethod: '카카오페이',
    bookedAt: '2026-10-22 14:10',
    status: 'completed',
    originPlace: '상명대학교',
    transitMode: '시내버스',
    targetArrivalTime: '17:40',
    recommendedDepartureTime: '17:10',
  },
  {
    id: 'ticket-past-002',
    bookingNumber: 'T261016-9932',
    busSchedule: {
      ...mockBusSchedules[0],
      departureTime: '17:00',
      arrivalTime: '18:15',
    },
    travelDate: '2026-10-16 (금)',
    seatNumbers: [11],
    passengerCount: { adult: 1, teen: 0, child: 0 },
    totalFee: 7400,
    paymentMethod: '신용카드',
    bookedAt: '2026-10-15 19:30',
    status: 'completed',
    originPlace: '상명대학교',
    transitMode: '시내버스',
    targetArrivalTime: '16:40',
    recommendedDepartureTime: '16:10',
  },
];

// 사용자 이동 루틴 목록
export const initialRoutines: TravelRoutine[] = [
  {
    id: 'routine-01',
    title: '금요 본가 귀가 루틴',
    departureStation: '천안',
    arrivalStation: '서울경부',
    busType: 'express',
    daysOfWeek: ['금'],
    preferredTime: '오후 6시대 (18:00)',
    originPlace: '상명대학교 천안캠',
    transitMode: '시내버스 (약 30분 소요)',
    estimatedTransitMinutes: 30,
    isActive: true,
  },
];

// 28인승 우등버스 기본 좌석 상태 생성
export function generateInitialSeats(selectedSeat = 7): SeatInfo[] {
  const seats: SeatInfo[] = [];
  const occupiedNumbers = [1, 2, 4, 5, 8, 12, 13, 17, 18, 22, 23, 27]; // 이미 예약된 좌석들

  for (let i = 1; i <= 28; i++) {
    const isSingle = i % 3 === 1; // 1, 4, 7, 10, 13, 16, 19, 22, 25, 28 단독석
    let status: SeatInfo['status'] = 'available';

    if (i === selectedSeat) {
      status = 'selected';
    } else if (occupiedNumbers.includes(i)) {
      status = 'occupied';
    }

    seats.push({
      number: i,
      status,
      isSingle,
    });
  }

  return seats;
}

// ==========================================
// 노선도(경유지) 목업: 도착지별 경유지와 소요시간 비율
// ==========================================
const ROUTE_TEMPLATES: Record<string, { name: string; kind: RouteStop['kind']; ratio: number; note?: string }[]> = {
  서울경부: [
    { name: '천안종합버스터미널', kind: 'origin', ratio: 0, note: '출발' },
    { name: '천안IC', kind: 'via', ratio: 0.1, note: '고속도로 진입' },
    { name: '안성휴게소', kind: 'rest', ratio: 0.4, note: '통과 (직통)' },
    { name: '신갈JC', kind: 'via', ratio: 0.7 },
    { name: '양재IC', kind: 'via', ratio: 0.88 },
    { name: '서울경부', kind: 'destination', ratio: 1, note: '도착' },
  ],
  동서울: [
    { name: '천안종합버스터미널', kind: 'origin', ratio: 0, note: '출발' },
    { name: '천안IC', kind: 'via', ratio: 0.1 },
    { name: '안성IC', kind: 'via', ratio: 0.35 },
    { name: '용인IC', kind: 'via', ratio: 0.6 },
    { name: '강변역', kind: 'via', ratio: 0.9 },
    { name: '동서울', kind: 'destination', ratio: 1, note: '도착' },
  ],
  수원: [
    { name: '천안종합버스터미널', kind: 'origin', ratio: 0, note: '출발' },
    { name: '직산', kind: 'via', ratio: 0.2 },
    { name: '평택', kind: 'via', ratio: 0.55 },
    { name: '수원', kind: 'destination', ratio: 1, note: '도착' },
  ],
};

function hhmmToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToHhmm(total: number): string {
  const n = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}

export function getRouteStops(schedule: BusSchedule): RouteStop[] {
  const defaultTemplate: { name: string; kind: RouteStop['kind']; ratio: number; note?: string }[] = [
    { name: '천안종합버스터미널', kind: 'origin', ratio: 0, note: '출발' },
    { name: '천안IC', kind: 'via', ratio: 0.12, note: '고속도로 진입' },
    { name: '중간 휴게소 · 분기점', kind: 'rest', ratio: 0.5, note: '경유/정차' },
    { name: `${schedule.arrivalStation}IC`, kind: 'via', ratio: 0.85 },
    { name: schedule.arrivalStation, kind: 'destination', ratio: 1, note: '도착' },
  ];
  const template = ROUTE_TEMPLATES[schedule.arrivalStation] || defaultTemplate;
  const dep = hhmmToMinutes(schedule.departureTime);
  const arr = hhmmToMinutes(schedule.arrivalTime);
  const total = Math.max(10, arr >= dep ? arr - dep : arr + 1440 - dep);
  return template.map((stop) => ({
    name: stop.name,
    kind: stop.kind,
    note: stop.note,
    time: stop.kind === 'destination' ? schedule.arrivalTime : minutesToHhmm(dep + Math.round(total * stop.ratio)),
  }));
}

// 도착지별 노선 메타데이터 및 00시~24시 전 시간대 스케줄 생성기
const DESTINATION_META: Record<
  string,
  { durationMinutes: number; durationLabel: string; baseFee: number; platform: string; companies: string[] }
> = {
  서울경부: { durationMinutes: 75, durationLabel: '1시간 15분', baseFee: 7400, platform: '7번 홈', companies: ['동양고속', '천안고속', '중앙고속', '금호고속'] },
  동서울: { durationMinutes: 80, durationLabel: '1시간 20분', baseFee: 8200, platform: '3번 홈', companies: ['충남고속', '대원고속', '동양고속'] },
  인천: { durationMinutes: 95, durationLabel: '1시간 35분', baseFee: 9400, platform: '5번 홈', companies: ['금남고속', '대원고속'] },
  수원: { durationMinutes: 50, durationLabel: '50분', baseFee: 4500, platform: '12번 홈', companies: ['용남고속', '삼흥고속'] },
  대전복합: { durationMinutes: 55, durationLabel: '55분', baseFee: 5800, platform: '6번 홈', companies: ['동양고속', '금남고속'] },
  청주: { durationMinutes: 50, durationLabel: '50분', baseFee: 5200, platform: '14번 홈', companies: ['서울고속', '새서울고속'] },
  부산: { durationMinutes: 210, durationLabel: '3시간 30분', baseFee: 24800, platform: '1번 홈', companies: ['천일고속', '한일고속'] },
  동대구: { durationMinutes: 145, durationLabel: '2시간 25분', baseFee: 16900, platform: '2번 홈', companies: ['동양고속', '코리아와이드'] },
  '광주(유·스퀘어)': { durationMinutes: 140, durationLabel: '2시간 20분', baseFee: 16200, platform: '4번 홈', companies: ['금호고속', '중앙고속'] },
  안산: { durationMinutes: 75, durationLabel: '1시간 15분', baseFee: 6900, platform: '11번 홈', companies: ['대원고속', '경남여객'] },
  '성남(야탑)': { durationMinutes: 65, durationLabel: '1시간 05분', baseFee: 6300, platform: '10번 홈', companies: ['대원고속', '충남고속'] },
  고양백석: { durationMinutes: 105, durationLabel: '1시간 45분', baseFee: 10200, platform: '9번 홈', companies: ['대원고속'] },
  원주: { durationMinutes: 110, durationLabel: '1시간 50분', baseFee: 10800, platform: '15번 홈', companies: ['대원고속', '강원고속'] },
  강릉: { durationMinutes: 185, durationLabel: '3시간 05분', baseFee: 21400, platform: '15번 홈', companies: ['강원고속', '동해상사고속'] },
  세종고속: { durationMinutes: 35, durationLabel: '35분', baseFee: 3800, platform: '13번 홈', companies: ['금남고속', '삼흥고속'] },
  '아산(온양)': { durationMinutes: 25, durationLabel: '25분', baseFee: 2800, platform: '16번 홈', companies: ['충남고속'] },
  전주: { durationMinutes: 95, durationLabel: '1시간 35분', baseFee: 11200, platform: '4번 홈', companies: ['전북고속', '금호고속'] },
  울산: { durationMinutes: 195, durationLabel: '3시간 15분', baseFee: 22900, platform: '1번 홈', companies: ['천일고속', '한일고속'] },
  포항: { durationMinutes: 180, durationLabel: '3시간 00분', baseFee: 20500, platform: '2번 홈', companies: ['천마고속', '아성고속'] },
};

const DEPARTURE_TIMES_FULL_DAY = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:30',
  '21:30',
  '22:30',
  '23:30',
  '24:00',
];

export function getBusSchedules(
  busType: 'express' | 'intercity',
  departure: string,
  arrival: string,
  minHour = 0
): BusSchedule[] {
  const meta = DESTINATION_META[arrival] || {
    durationMinutes: 80,
    durationLabel: '1시간 20분',
    baseFee: 7800,
    platform: busType === 'express' ? '7번 홈' : '11번 홈',
    companies: ['동양고속', '충남고속'],
  };

  const grades: ('우등' | '일반' | '프리미엄')[] = ['우등', '일반', '우등', '프리미엄', '우등'];

  return DEPARTURE_TIMES_FULL_DAY.filter((timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m >= minHour * 60;
  }).map((timeStr, idx) => {
    const [h, m] = timeStr.split(':').map(Number);
    const depMinutes = h * 60 + m;
    const arrTimeStr = minutesToHhmm(depMinutes + meta.durationMinutes);
    const grade = timeStr === '18:00' ? '우등' : timeStr === '18:30' ? '프리미엄' : grades[idx % grades.length];
    const fee =
      grade === '프리미엄'
        ? Math.round((meta.baseFee * 1.43) / 100) * 100
        : grade === '일반'
        ? Math.round((meta.baseFee * 0.75) / 100) * 100
        : meta.baseFee;
    const totalSeats = grade === '프리미엄' ? 21 : grade === '일반' ? 45 : 28;
    const remainingSeats = Math.max(3, ((idx * 5 + 7) % (totalSeats - 4)) + 3);
    const company = meta.companies[idx % meta.companies.length];

    const id =
      arrival === '서울경부' && timeStr === '18:00'
        ? 'exp-103'
        : `${busType}-${arrival}-${timeStr.replace(':', '')}`;

    return {
      id,
      busType,
      departureStation: departure,
      arrivalStation: arrival,
      departureTime: timeStr,
      arrivalTime: arrTimeStr,
      duration: meta.durationLabel,
      grade,
      company,
      fee,
      totalSeats,
      remainingSeats,
      platform: meta.platform,
    };
  });
}

// ==========================================
// AI 기반 맞춤형 터미널 여유시간 타임라인 목업 데이터
// ==========================================

export const mockTimelinePlaces: TimelinePlace[] = [
  {
    id: 'place-kyobo',
    name: '교보문고 천안점',
    category: '문화/서점',
    location: '신세계백화점 B관 3층',
    boundary: 'complex_space',
    defaultDurationMinutes: 30,
    defaultCost: '무료 (도서 열람)',
    costValue: 0,
    description: '조용하고 아늑한 독서 테이블에서 신간 도서 및 매거진 열람',
    recommendedTag: '조용한 문화 휴식',
    guideFloor: '신세계 B관 3층',
    routeInstruction: '터미널 1층 연결통로 진입 → B관 에스컬레이터로 3층 이동 (도보 3분)',
    routeSteps: [
      '천안터미널 1층 대합실 동측 신세계백화점 연결통로 진입',
      'B관 중앙 에스컬레이터 탑승 후 3층 하차',
      '우측 20m 직진하여 교보문고 메인 입구 도착',
    ],
    suitableCompanions: ['혼자', '연인', '친구'],
    suitableExperiences: ['조용하게', '여유롭게'],
  },
  {
    id: 'place-starbucks',
    name: '스타벅스 신세계천안아산점',
    category: '카페',
    location: '신세계백화점 B관 4층',
    boundary: 'complex_space',
    defaultDurationMinutes: 25,
    defaultCost: '약 5,000원',
    costValue: 5000,
    description: '창가 좌석과 스마트폰 고속 충전 콘센트가 완비된 카페 휴식',
    recommendedTag: '음료 & 배터리 충전',
    guideFloor: '신세계 B관 4층',
    routeInstruction: 'B관 3층 교보문고 옆 에스컬레이터로 4층 이동 (도보 2분)',
    routeSteps: [
      '교보문고 출구 옆 상행 에스컬레이터 탑승',
      '4층 CGV 시네마 라운지 맞은편 스타벅스 매장 도착',
      '사이렌 오더 픽업대 옆 충전 바 좌석 이용',
    ],
    suitableCompanions: ['혼자', '연인', '친구', '가족'],
    suitableExperiences: ['여유롭게', '조용하게'],
  },
  {
    id: 'place-foodstreet',
    name: '신세계 푸드스트리트 & 뚜쥬루',
    category: '식사',
    location: '신세계백화점 A관 지하 1층',
    boundary: 'complex_space',
    defaultDurationMinutes: 35,
    defaultCost: '약 12,000원',
    costValue: 12000,
    description: '천안 명물 거북이빵(뚜쥬루)과 든든한 1인 한식·델리 다이닝',
    recommendedTag: '든든한 식사·간식',
    guideFloor: '신세계 A관 B1층',
    routeInstruction: '터미널 매표소 옆 백화점 연결통로에서 지하 1층 에스컬레이터 이동 (도보 3분)',
    routeSteps: [
      '터미널 대합실 중앙 백화점 A관 게이트 통과',
      '하행 에스컬레이터로 지하 1층 푸드스트리트 진입',
      '중앙 델리존 및 뚜쥬루 베이커리 코너 도착',
    ],
    suitableCompanions: ['혼자', '연인', '친구', '가족'],
    suitableExperiences: ['여유롭게', '활동적이게'],
  },
  {
    id: 'place-oliveyoung',
    name: '올리브영 천안신세계점',
    category: '쇼핑',
    location: '신세계백화점 A관 1층 연결통로',
    boundary: 'complex_space',
    defaultDurationMinutes: 20,
    defaultCost: '약 10,000원',
    costValue: 10000,
    description: '버스 탑승 전 필요한 여행용 소품, 핸드크림, 간편 스낵 쇼핑',
    recommendedTag: '가벼운 트렌드 쇼핑',
    guideFloor: '신세계 A관 1층',
    routeInstruction: '터미널 1층 매표소 우측 백화점 연결 게이트 바로 앞 (도보 2분)',
    routeSteps: [
      '터미널 1층 고속버스 매표소 우측 통로로 이동',
      '신세계 A관 1층 진입 직후 우측 올리브영 매장 도착',
    ],
    suitableCompanions: ['혼자', '친구', '연인'],
    suitableExperiences: ['활동적이게', '여유롭게'],
  },
  {
    id: 'place-arario-gallery',
    name: '아라리오 갤러리 천안',
    category: '문화/서점',
    location: '신세계백화점 옆 아라리오 뮤지엄',
    boundary: 'complex_space',
    defaultDurationMinutes: 35,
    defaultCost: '약 5,000원',
    costValue: 5000,
    description: '세계적인 현대미술 컬렉션 전시를 감상하는 고품격 예술 공간',
    recommendedTag: '예술 전시 관람',
    guideFloor: '아라리오 갤러리 1~3층',
    routeInstruction: '터미널 정문 광장 우측 아라리오 갤러리 전용 입구 이동 (도보 3분)',
    routeSteps: [
      '터미널 1층 정문 게이트를 통해 야외 조각광장으로 이동',
      '광장 우측 붉은 벽돌 외관의 아라리오 갤러리 입구 도착',
    ],
    suitableCompanions: ['혼자', '연인', '친구'],
    suitableExperiences: ['조용하게', '여유롭게'],
  },
  {
    id: 'place-lounge',
    name: '천안터미널 스마트 여행자 라운지',
    category: '휴식',
    location: '터미널 본관 1층 6번 홈 맞은편',
    boundary: 'terminal_inside',
    defaultDurationMinutes: 20,
    defaultCost: '무료',
    costValue: 0,
    description: '무료 와이파이, 무선 충전 테이블, 실시간 출발 전광판이 갖춰진 쾌적 쉼터',
    recommendedTag: '승차장 1분 거리 휴식',
    guideFloor: '터미널 본관 1층',
    routeInstruction: '고속버스 승차홈 5번과 7번 홈 사이 스마트 라운지 (도보 1분)',
    routeSteps: [
      '터미널 1층 대합실 중앙 통로로 이동',
      '6번 승차홈 맞은편 유리 자동문 라운지 진입',
    ],
    suitableCompanions: ['혼자', '가족'],
    suitableExperiences: ['조용하게', '여유롭게'],
  },
  {
    id: 'place-terminal-cafe',
    name: '터미널 드롭탑 익스프레스',
    category: '카페',
    location: '터미널 본관 1층 매표소 옆',
    boundary: 'terminal_inside',
    defaultDurationMinutes: 20,
    defaultCost: '약 4,500원',
    costValue: 4500,
    description: '승차홈 바로 앞에서 빠르게 음료를 픽업하고 쉬어가는 터미널 내부 카페',
    recommendedTag: '빠른 음료 픽업',
    guideFloor: '터미널 본관 1층',
    routeInstruction: '터미널 1층 무인발권기 좌측 15m 이동 (도보 1분)',
    routeSteps: [
      '터미널 1층 대합실 무인발권기 구역 확인',
      '좌측 15m 직진 후 드롭탑 매장 도착',
    ],
    suitableCompanions: ['혼자', '친구', '가족'],
    suitableExperiences: ['여유롭게', '조용하게'],
  },
  {
    id: 'place-terminal-udon',
    name: '터미널 역전우동 & 김밥천국',
    category: '식사',
    location: '터미널 본관 1층 서측 식당가',
    boundary: 'terminal_inside',
    defaultDurationMinutes: 25,
    defaultCost: '약 8,000원',
    costValue: 8000,
    description: '주문 후 5분 내 제공되는 따뜻한 우동과 덮밥으로 빠른 식사 해결',
    recommendedTag: '10분 컷 든든 한 끼',
    guideFloor: '터미널 본관 1층',
    routeInstruction: '터미널 1층 시외버스 승차홈(1~4번) 방향 식당가 (도보 1분)',
    routeSteps: [
      '터미널 1층 대합실에서 시외버스 1~4번 홈 방향으로 이동',
      '서측 식당가 아케이드 첫 번째 매장 도착',
    ],
    suitableCompanions: ['혼자', '친구'],
    suitableExperiences: ['여유롭게', '활동적이게'],
  },
  {
    id: 'place-arario-plaza',
    name: '아라리오 조각광장 산책로',
    category: '휴식',
    location: '터미널 정문 야외 예술광장',
    boundary: 'surrounding_area',
    defaultDurationMinutes: 20,
    defaultCost: '무료',
    costValue: 0,
    description: '데미안 허스트의 대형 조각 작품 사이를 걸으며 야외 바람 쐬기',
    recommendedTag: '야외 예술 산책',
    guideFloor: '야외 1층 광장',
    routeInstruction: '터미널 1층 정문 회전문 밖 야외 조각공원 방면 (도보 2분)',
    routeSteps: [
      '터미널 1층 정문 회전문을 통과하여 야외로 이동',
      '광장 중앙 조각 산책로를 따라 벤치 구역 도착',
    ],
    suitableCompanions: ['혼자', '연인', '친구', '가족'],
    suitableExperiences: ['여유롭게', '활동적이게'],
  },
  {
    id: 'place-sinbu-cafe',
    name: '신부동 감성 로스터리 카페거리',
    category: '카페',
    location: '터미널 맞은편 신부문화거리',
    boundary: 'surrounding_area',
    defaultDurationMinutes: 35,
    defaultCost: '약 9,000원',
    costValue: 9000,
    description: '천안 신부동 핫플레이스 수제 디저트와 스페셜티 커피 즐기기',
    recommendedTag: '신부동 핫플 투어',
    guideFloor: '신부동 카페거리 1~2층',
    routeInstruction: '터미널 앞 횡단보도 건너 신부문화거리 메인 골목 진입 (도보 6분)',
    routeSteps: [
      '터미널 정문 앞 횡단보도를 건너 신부문화거리 진입',
      '직진 150m 후 우측 로스터리 카페 골목 도착',
    ],
    suitableCompanions: ['연인', '친구', '혼자'],
    suitableExperiences: ['활동적이게', '여유롭게'],
  },
  {
    id: 'place-sinbu-dining',
    name: '신부동 맛집 골목 (파스타 & 직화구이)',
    category: '식사',
    location: '신부문화거리 먹자골목 중심가',
    boundary: 'surrounding_area',
    defaultDurationMinutes: 45,
    defaultCost: '약 22,000원',
    costValue: 22000,
    description: '동행과 함께 여유롭게 즐기는 신부동 대표 맛집 거리 식사',
    recommendedTag: '제대로 된 만찬',
    guideFloor: '신부동 먹자골목 1층',
    routeInstruction: '터미널 앞 횡단보도 건너 먹자골목 중앙 사거리 이동 (도보 6분)',
    routeSteps: [
      '터미널 정문 횡단보도 도보 이동',
      '신부문화거리 중앙 사거리에서 좌회전하여 맛집 골목 도착',
    ],
    suitableCompanions: ['연인', '친구', '가족'],
    suitableExperiences: ['활동적이게', '여유롭게'],
  },
];

// 초기 기본 타임라인 (김지우 18:00 버스 예매 시 자동 생성되는 85분 여유 코스)
export const initialCustomTimeline: CustomTimeline = {
  id: 'timeline-initial',
  busDepartureTime: '18:00',
  boardingPlatform: '7번 홈',
  currentTime: '16:35',
  currentLocation: '천안터미널 1층 대합실',
  totalAvailableMinutes: 85,
  bufferMinutes: 15,
  actualBufferMinutes: 16,
  filter: {
    busDepartureTime: '18:00',
    boardingPlatform: '7번 홈',
    currentTime: '16:35',
    currentLocation: '천안터미널 1층 대합실',
    movementBoundary: 'complex_space',
    activities: ['문화/서점', '카페'],
    companion: '혼자',
    experience: '조용하게',
    useBudgetFilter: true,
    budget: '1만원',
  },
  isConfirmed: true,
  voiceGuideEnabled: false,
  currentActivityIndex: 0,
  isAlertedForBoarding: false,
  aiAnalysisSummary:
    '혼자 조용하게 시간을 보낼 수 있는 신세계 복합공간(B관 3층→4층) 수직 동선으로 구성해 이동 피로를 줄이고 출발 16분 전 7번 승차홈 도착을 보장합니다.',
  items: [
    {
      id: 'item-1',
      placeId: 'place-kyobo',
      title: '교보문고 천안점',
      category: '문화/서점',
      location: '신세계백화점 B관 3층',
      startTime: '16:38',
      endTime: '17:13',
      durationMinutes: 35,
      cost: '무료 (도서 열람)',
      costValue: 0,
      description: '조용하고 아늑한 독서 테이블에서 신간 도서 및 매거진 열람',
      transitTimeToNext: 3,
      status: 'current',
      guideFloor: '신세계 B관 3층',
      routeInstruction: '터미널 1층 연결통로 진입 → B관 에스컬레이터로 3층 이동 (도보 3분)',
      routeSteps: [
        '천안터미널 1층 대합실 동측 신세계백화점 연결통로 진입',
        'B관 중앙 에스컬레이터 탑승 후 3층 하차',
        '우측 20m 직진하여 교보문고 메인 입구 도착',
      ],
    },
    {
      id: 'item-2',
      placeId: 'place-starbucks',
      title: '스타벅스 신세계천안아산점',
      category: '카페',
      location: '신세계백화점 B관 4층',
      startTime: '17:16',
      endTime: '17:40',
      durationMinutes: 24,
      cost: '약 5,000원',
      costValue: 5000,
      description: '창가 좌석과 스마트폰 고속 충전 콘센트가 완비된 카페 휴식',
      transitTimeToNext: 4,
      status: 'upcoming',
      guideFloor: '신세계 B관 4층',
      routeInstruction: '교보문고 출구 옆 에스컬레이터를 타고 4층으로 한 층 이동 (도보 2분)',
      routeSteps: [
        '교보문고 출구 옆 상행 에스컬레이터 탑승',
        '4층 CGV 시네마 라운지 맞은편 스타벅스 매장 도착',
        '사이렌 오더 픽업대 옆 충전 바 좌석 이용',
      ],
    },
    {
      id: 'item-3',
      placeId: 'place-platform-7',
      title: '고속버스 7번 승차홈 이동 및 탑승 준비',
      category: '승차장이동',
      location: '천안종합버스터미널 1층 7번 홈',
      startTime: '17:44',
      endTime: '18:00',
      durationMinutes: 16,
      cost: '무료',
      costValue: 0,
      description: '모바일 승차권 QR코드 준비 및 18:00 동양고속 버스 여유 탑승',
      transitTimeToNext: 0,
      isBoardingStep: true,
      status: 'upcoming',
      guideFloor: '터미널 본관 1층',
      routeInstruction: 'B관 중앙 엘리베이터로 1층 하차 → 고속 승차홈 7번으로 직진 (도보 4분)',
      routeSteps: [
        '스타벅스 매장 앞 B관 중앙 엘리베이터 탑승 후 1층 이동',
        '터미널 대합실 연결 게이트 통과 후 우측 고속버스 승차장 진입',
        '7번 승차홈 도착 후 모바일 QR 검표 및 탑승 대기',
      ],
    },
  ],
};
