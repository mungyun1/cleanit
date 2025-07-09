import { DayOfWeek } from "../types";

// 공간 목록
export const SPACES = ["거실", "주방", "침실", "욕실", "화장실", "공용"];

// 빨래 타입 목록
export const LAUNDRY_TYPES = [
  { label: "흰 옷", value: "whites" as const },
  { label: "색 옷", value: "colors" as const },
  { label: "섬세한 옷", value: "delicates" as const },
  { label: "침구", value: "bedding" as const },
  { label: "수건", value: "towels" as const },
];

// 반려동물 타입 목록
export const PET_TYPES = [
  { label: "강아지", value: "dog" as const },
  { label: "고양이", value: "cat" as const },
  { label: "새", value: "bird" as const },
  { label: "물고기", value: "fish" as const },
  { label: "햄스터", value: "hamster" as const },
];

// 주기 목록
export const FREQUENCIES = [
  { label: "매일", value: "daily" as const },
  { label: "매주", value: "weekly" as const },
  { label: "격주", value: "biweekly" as const },
  { label: "월 1회", value: "monthly" as const },
];

// 요일 목록
export const DAYS_OF_WEEK = [
  { label: "월요일", value: "monday" as DayOfWeek },
  { label: "화요일", value: "tuesday" as DayOfWeek },
  { label: "수요일", value: "wednesday" as DayOfWeek },
  { label: "목요일", value: "thursday" as DayOfWeek },
  { label: "금요일", value: "friday" as DayOfWeek },
  { label: "토요일", value: "saturday" as DayOfWeek },
  { label: "일요일", value: "sunday" as DayOfWeek },
];

// 월간 주기 목록
export const MONTHLY_WEEKS = [
  { label: "첫째주", value: "first" as const },
  { label: "둘째주", value: "second" as const },
  { label: "셋째주", value: "third" as const },
  { label: "넷째주", value: "fourth" as const },
  { label: "마지막주", value: "last" as const },
];

// 빨래 기본 체크리스트 템플릿
export const LAUNDRY_TEMPLATES = {
  whites: ["흰 옷 분류하기", "세제 넣고 세탁", "건조기 돌리기", "정리하기"],
  colors: ["색 옷 분류하기", "세제 넣고 세탁", "건조기 돌리기", "정리하기"],
  delicates: [
    "섬세한 옷 분류하기",
    "손세탁 또는 섬세모드",
    "건조기 사용 금지",
    "정리하기",
  ],
  bedding: ["침구 분리하기", "세탁 및 건조", "정리하기"],
  towels: ["수건 분류하기", "세탁 및 건조", "정리하기"],
} as const;

// 반려동물 기본 체크리스트 템플릿
export const PET_TEMPLATES = {
  dog: [
    "산책하기",
    "사료 주기",
    "물 갈아주기",
    "배변 처리하기",
    "털 빗어주기",
    "장난감 정리하기",
  ],
  cat: [
    "사료 주기",
    "물 갈아주기",
    "모래통 정리하기",
    "털 빗어주기",
    "장난감 정리하기",
  ],
  bird: ["사료 주기", "물 갈아주기", "새장 청소하기", "장난감 정리하기"],
  fish: ["사료 주기", "수질 확인하기", "필터 청소하기", "수조 청소하기"],
  hamster: ["사료 주기", "물 갈아주기", "새장 청소하기", "장난감 정리하기"],
  other: ["사료 주기", "물 갈아주기", "청소하기", "장난감 정리하기"],
} as const;
