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

// 색상 테마
export const LIGHT_COLORS = {
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

export const DARK_COLORS = {
  primary: "#BB86FC",
  primaryVariant: "#3700B3",
  secondary: "#03DAC6",
  background: "#121212",
  surface: "#000000",
  error: "#CF6679",
  onPrimary: "#000000",
  onSecondary: "#000000",
  onBackground: "#FFFFFF",
  onSurface: "#FFFFFF",
  onError: "#000000",
  livingRoom: "#FF6B6B",
  kitchen: "#4ECDC4",
  bathroom: "#45B7D1",
  toilet: "#FF8A80",
  bedroom: "#96CEB4",
  common: "#FFEAA7",
};

// 기본 색상 (라이트 모드)
export const COLORS = LIGHT_COLORS;

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
