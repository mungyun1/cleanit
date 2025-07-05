import { Space } from "../types";

// 기본 공간 설정
export const DEFAULT_SPACES: Space[] = [
  { id: "living-room", name: "거실", color: "#FF6B6B", icon: "home" },
  { id: "kitchen", name: "주방", color: "#4ECDC4", icon: "restaurant" },
  { id: "bathroom", name: "욕실", color: "#45B7D1", icon: "wc" },
  { id: "toilet", name: "화장실", color: "#FF8A80", icon: "wc" },
  { id: "bedroom", name: "침실", color: "#96CEB4", icon: "bed" },
  { id: "common", name: "공용", color: "#FFEAA7", icon: "public" },
];

// 청소 주기 옵션
export const FREQUENCY_OPTIONS = [
  { label: "매일", value: "daily" },
  { label: "매주", value: "weekly" },
  { label: "격주", value: "biweekly" },
  { label: "월 1회", value: "monthly" },
  { label: "사용자 정의", value: "custom" },
];

// 색상 테마
export const COLORS = {
  primary: "#6200EE",
  primaryVariant: "#3700B3",
  secondary: "#03DAC6",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  error: "#B00020",
  onPrimary: "#FFFFFF",
  onSecondary: "#000000",
  onBackground: "#000000",
  onSurface: "#000000",
  onError: "#FFFFFF",
  livingRoom: "#FF6B6B",
  kitchen: "#4ECDC4",
  bathroom: "#45B7D1",
  toilet: "#FF8A80",
  bedroom: "#96CEB4",
  common: "#FFEAA7",
};

// 타이포그래피
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: "bold" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body1: {
    fontSize: 16,
    fontWeight: "normal" as const,
  },
  body2: {
    fontSize: 14,
    fontWeight: "normal" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "normal" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
};

// 스토리지 키
export const STORAGE_KEYS = {
  TASKS: "cleaning_tasks",
  COMPLETIONS: "completion_records",
  SETTINGS: "user_settings",
  SPACES: "user_spaces",
};

// 알림 설정
export const NOTIFICATION_CONFIG = {
  title: "청소 시간입니다! 🧹",
  body: "오늘 할 청소를 확인해보세요.",
  sound: true,
  priority: "high" as const,
};

// 기본 체크리스트 템플릿
export const DEFAULT_CHECKLIST_TEMPLATES = {
  거실: ["청소기", "먼지 털기", "가구 정리", "창문 닦기", "커튼 정리"],
  주방: [
    "설거지",
    "주방 카운터 정리",
    "싱크 청소",
    "가스레인지 청소",
    "냉장고 정리",
  ],
  침실: ["이불 정리", "옷장 정리", "책상 정리", "바닥 청소", "창문 닦기"],
  욕실: ["변기 청소", "세면대 청소", "샤워기 청소", "욕조 청소", "수건 정리"],
  화장실: [
    "변기 청소",
    "세면대 청소",
    "바닥 청소",
    "문고리 소독",
    "휴지통 비우기",
  ],
  공용: [
    "쓰레기 배출",
    "분리수거",
    "공용 공간 정리",
    "문고리 소독",
    "바닥 청소",
  ],
};

// 기본 청소 템플릿
export const DEFAULT_TASKS = [
  {
    title: "욕실 청소",
    description: "변기, 세면대, 샤워기 청소",
    space: "욕실",
    frequency: { type: "weekly", daysOfWeek: ["monday"] },
  },
  {
    title: "화장실 청소",
    description: "변기, 세면대, 바닥 청소",
    space: "화장실",
    frequency: { type: "daily" },
  },
  {
    title: "거실 먼지 제거",
    description: "가구와 바닥 먼지 닦기",
    space: "living-room",
    frequency: { type: "daily" },
  },
  {
    title: "주방 정리",
    description: "주방 카운터와 싱크 정리",
    space: "kitchen",
    frequency: { type: "daily" },
  },
  {
    title: "이불 정리",
    description: "침대 이불 정리",
    space: "침실",
    frequency: { type: "daily" },
  },
  {
    title: "쓰레기 배출",
    description: "분리수거 및 쓰레기 배출",
    space: "common",
    frequency: { type: "weekly", daysOfWeek: ["wednesday"] },
  },
];
