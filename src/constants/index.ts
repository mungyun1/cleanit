import { Space } from "../types";

// 기본 공간 설정
export const DEFAULT_SPACES: Space[] = [
  { id: "living-room", name: "거실", color: "#FF6B6B", icon: "home" },
  { id: "kitchen", name: "주방", color: "#4ECDC4", icon: "restaurant" },
  { id: "bathroom", name: "욕실", color: "#45B7D1", icon: "wc" },
  { id: "bedroom", name: "방", color: "#96CEB4", icon: "bed" },
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

// 기본 청소 템플릿
export const DEFAULT_TASKS = [
  {
    title: "욕실 청소",
    description: "변기, 세면대, 샤워기 청소",
    space: "bathroom",
    frequency: "weekly" as const,
  },
  {
    title: "거실 먼지 제거",
    description: "가구와 바닥 먼지 닦기",
    space: "living-room",
    frequency: "daily" as const,
  },
  {
    title: "주방 정리",
    description: "주방 카운터와 싱크 정리",
    space: "kitchen",
    frequency: "daily" as const,
  },
  {
    title: "이불 정리",
    description: "침대 이불 정리",
    space: "bedroom",
    frequency: "daily" as const,
  },
  {
    title: "쓰레기 배출",
    description: "분리수거 및 쓰레기 배출",
    space: "common",
    frequency: "weekly" as const,
  },
];
