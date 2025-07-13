import { COLORS } from "../constants";
import { HouseholdTask, DayOfWeek, Space } from "../types";

// ===== 공통 상수 =====

// 공간 목록 (통합)
export const SPACES = ["거실", "주방", "침실", "욕실", "화장실", "공용"];

// 빨래 타입 목록
export const LAUNDRY_TYPES = [
  { label: "흰 옷", value: "whites" },
  { label: "색 옷", value: "colors" },
  { label: "섬세한 옷", value: "delicates" },
  { label: "침구", value: "bedding" },
  { label: "수건", value: "towels" },
];

// 반려동물 타입 목록
export const PET_TYPES = [
  { label: "강아지", value: "dog" },
  { label: "고양이", value: "cat" },
  { label: "새", value: "bird" },
  { label: "물고기", value: "fish" },
  { label: "햄스터", value: "hamster" },
];

// 주기 목록
export const FREQUENCIES = [
  { label: "매일", value: "daily" as const },
  { label: "매주", value: "weekly" as const },
  { label: "격주", value: "biweekly" as const },
  { label: "월 1회", value: "monthly" as const },
] as const;

// 요일 목록
export const DAYS_OF_WEEK = [
  { label: "월요일", value: "monday" as DayOfWeek },
  { label: "화요일", value: "tuesday" as DayOfWeek },
  { label: "수요일", value: "wednesday" as DayOfWeek },
  { label: "목요일", value: "thursday" as DayOfWeek },
  { label: "금요일", value: "friday" as DayOfWeek },
  { label: "토요일", value: "saturday" as DayOfWeek },
  { label: "일요일", value: "sunday" as DayOfWeek },
] as const;

// 월간 주기 목록
export const MONTHLY_WEEKS = [
  { label: "첫째주", value: "first" as const },
  { label: "둘째주", value: "second" as const },
  { label: "셋째주", value: "third" as const },
  { label: "넷째주", value: "fourth" as const },
  { label: "마지막주", value: "last" as const },
] as const;

// 격주 주기 목록
export const BIWEEKLY_WEEKS = [
  { label: "첫째주/셋째주", value: "first_third" as const },
  { label: "둘째주/넷째주", value: "second_fourth" as const },
] as const;

// ===== 체크리스트 템플릿 (통합) =====

// 청소 기본 체크리스트 템플릿
export const CLEANING_TEMPLATES = {
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
} as const;

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

// ===== 통합 작업 데이터 =====

// 기본 작업 데이터 (모든 화면에서 공통 사용)
export const UNIFIED_TASKS: HouseholdTask[] = [
  {
    id: "1",
    title: "거실 청소",
    description: "바닥 쓸기, 먼지 털기, 소파 정리",
    label: "청소",
    category: "cleaning",
    space: "거실",
    frequency: { type: "daily" },
    isCompleted: false,
    checklistItems: [
      {
        id: "1-1",
        title: "바닥 쓸기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1-2",
        title: "먼지 털기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1-3",
        title: "가구 정리",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "주방 정리",
    description: "설거지, 주방 정리, 싱크 청소",
    label: "청소",
    category: "cleaning",
    space: "주방",
    frequency: { type: "daily" },
    isCompleted: true,
    checklistItems: [
      {
        id: "2-1",
        title: "설거지",
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2-2",
        title: "주방 카운터 정리",
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "욕실 청소",
    description: "변기, 세면대, 샤워기 청소",
    label: "청소",
    category: "cleaning",
    space: "욕실",
    frequency: { type: "weekly", daysOfWeek: ["monday"] },
    isCompleted: false,
    checklistItems: [
      {
        id: "3-1",
        title: "변기 청소",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3-2",
        title: "세면대 청소",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3-3",
        title: "샤워기 청소",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "흰 옷 빨래",
    description: "흰 옷 분류 및 세탁",
    label: "빨래",
    category: "laundry",
    laundryType: "whites",
    frequency: { type: "weekly", daysOfWeek: ["wednesday"] },
    isCompleted: false,
    checklistItems: [
      {
        id: "4-1",
        title: "흰 옷 분류하기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4-2",
        title: "세제 넣고 세탁",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4-3",
        title: "건조기 돌리기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "강아지 돌보기",
    description: "산책, 사료 주기, 청소",
    label: "반려동물",
    category: "pet",
    petType: "dog",
    frequency: { type: "daily" },
    isCompleted: false,
    checklistItems: [
      {
        id: "5-1",
        title: "산책하기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5-2",
        title: "사료 주기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5-3",
        title: "물 갈아주기",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 캘린더용 예정 작업 데이터 (UNIFIED_TASKS에서 변환)
export const SCHEDULED_TASKS_DATA: ScheduledTasksByDate = {
  "2025-06-15": [
    {
      id: "1",
      title: "거실 청소",
      description: "바닥 쓸기, 먼지 털기, 소파 정리",
      label: "청소",
      area: "거실",
      priority: "medium",
      estimatedTime: 30,
      color: COLORS.livingRoom,
    },
  ],
  "2025-06-18": [
    {
      id: "2",
      title: "주방 정리",
      description: "설거지, 주방 정리, 싱크 청소",
      label: "청소",
      area: "주방",
      priority: "high",
      estimatedTime: 45,
      color: COLORS.kitchen,
    },
  ],
  "2025-06-20": [
    {
      id: "3",
      title: "욕실 청소",
      description: "변기, 세면대, 샤워기 청소",
      label: "청소",
      area: "욕실",
      priority: "high",
      estimatedTime: 40,
      color: COLORS.bathroom,
    },
  ],
  "2025-06-22": [
    {
      id: "4",
      title: "흰 옷 빨래",
      description: "흰 옷 분류 및 세탁",
      label: "빨래",
      area: "공용",
      priority: "medium",
      estimatedTime: 60,
      color: COLORS.common,
    },
  ],
  "2025-06-25": [
    {
      id: "5",
      title: "침구 세탁",
      description: "침대 시트, 베개커버 세탁",
      label: "빨래",
      area: "침실",
      priority: "medium",
      estimatedTime: 90,
      color: COLORS.bedroom,
    },
  ],
  "2025-06-28": [
    {
      id: "6",
      title: "강아지 돌보기",
      description: "산책, 사료 주기, 청소",
      label: "반려동물",
      area: "공용",
      priority: "high",
      estimatedTime: 45,
      color: COLORS.common,
    },
  ],
};

// ===== 통계 및 기타 데이터 =====

// 월간 통계 타입
export interface MonthlyStats {
  completedTasks: number;
  incompleteTasks: number;
  completionRate: string;
  consecutiveDays: number;
}

// 월간 통계 데이터
export const MONTHLY_STATS: MonthlyStats = {
  completedTasks: 15,
  incompleteTasks: 8,
  completionRate: "65%",
  consecutiveDays: 5,
};

// 범례 데이터 타입
export interface LegendItem {
  color: string;
  label: string;
}

// 범례 데이터
export const LEGEND_DATA: LegendItem[] = [
  { color: COLORS.livingRoom, label: "거실" },
  { color: COLORS.kitchen, label: "주방" },
  { color: COLORS.bathroom, label: "욕실" },
  { color: COLORS.toilet, label: "화장실" },
  { color: COLORS.bedroom, label: "침실" },
  { color: COLORS.common, label: "공용" },
];

// 필터 옵션
export const FILTER_OPTIONS = {
  ALL: "전체",
  CLEANING: "청소",
  LAUNDRY: "빨래",
  PET: "반려동물",
} as const;

// 통계 카드 데이터
export const STAT_CARDS = [
  {
    id: "total",
    icon: "list" as const,
    color: "primary" as const,
    label: "전체 작업",
  },
  {
    id: "completed",
    icon: "checkmark-circle" as const,
    color: "secondary" as const,
    label: "완료된 작업",
  },
] as const;

// 캘린더 샘플 데이터
export const CALENDAR_MOCK_DATA: CalendarMarkedDates = {};

// ===== 캘린더 관련 타입 =====

export interface CalendarMarkedDate {
  marked: boolean;
  dotColor?: string;
  dots?: Array<{
    key: string;
    color: string;
  }>;
  textColor: string;
  selected?: boolean;
  selectedColor?: string;
  customStyles?: {
    container?: any;
    text?: any;
  };
}

export interface CalendarMarkedDates {
  [date: string]: CalendarMarkedDate;
}

export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  label?: string; // 작업 라벨
  area: string;
  priority: "low" | "medium" | "high";
  estimatedTime: number; // 분 단위
  color: string;
  severity?: "normal" | "urgent" | "critical";
  isCompleted?: boolean;
  category?: "cleaning" | "laundry" | "pet";
  frequency?: any;
}

export interface ScheduledTasksByDate {
  [date: string]: ScheduledTask[];
}

// ===== 유틸리티 함수 =====

// HouseholdTask를 ScheduledTask로 변환하는 함수
export const convertToScheduledTask = (task: HouseholdTask): ScheduledTask => {
  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    label: task.label,
    area: task.space || "공용",
    priority: "medium", // 기본값
    estimatedTime: 30, // 기본값
    color: getColorForSpace(task.space || "공용"),
  };
};

// 공간별 색상 반환 함수
export const getColorForSpace = (space: string): string => {
  const colorMap: Record<string, string> = {
    거실: COLORS.livingRoom,
    주방: COLORS.kitchen,
    욕실: COLORS.bathroom,
    화장실: COLORS.toilet,
    침실: COLORS.bedroom,
    공용: COLORS.common,
  };
  return colorMap[space] || COLORS.common;
};

// 체크리스트 템플릿 가져오기 함수
export const getChecklistTemplate = (
  category: string,
  subType?: string
): string[] => {
  if (category === "cleaning" && subType) {
    return [
      ...(CLEANING_TEMPLATES[subType as keyof typeof CLEANING_TEMPLATES] || []),
    ];
  } else if (category === "laundry" && subType) {
    return [
      ...(LAUNDRY_TEMPLATES[subType as keyof typeof LAUNDRY_TEMPLATES] || []),
    ];
  } else if (category === "pet" && subType) {
    return [...(PET_TEMPLATES[subType as keyof typeof PET_TEMPLATES] || [])];
  }
  return [];
};

// 카테고리별 라벨 생성 함수
export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "cleaning":
      return "청소";
    case "laundry":
      return "빨래";
    case "pet":
      return "반려동물";
    default:
      return "기타";
  }
};
