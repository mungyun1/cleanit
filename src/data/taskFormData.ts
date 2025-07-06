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

// 주기 목록
export const FREQUENCIES = [
  { label: "매일", value: "daily" as const },
  { label: "매주", value: "weekly" as const },
  { label: "격주", value: "biweekly" as const },
  { label: "월 1회", value: "monthly" as const },
  { label: "사용자 정의", value: "custom" as const },
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
