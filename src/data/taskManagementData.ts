import { HouseholdTask } from "../types";

// 작업 관리 화면용 목데이터
export const MOCK_TASKS: HouseholdTask[] = [
  {
    id: "1",
    title: "거실 청소",
    description: "바닥 쓸기, 먼지 털기",
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
    description: "설거지, 주방 정리",
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
    category: "laundry",
    laundryType: "whites",
    frequency: { type: "weekly", daysOfWeek: ["saturday"] },
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
    title: "침구 세탁",
    description: "침대 시트, 베개커버 세탁",
    category: "laundry",
    laundryType: "bedding",
    frequency: { type: "biweekly", daysOfWeek: ["sunday"] },
    isCompleted: true,
    checklistItems: [
      {
        id: "5-1",
        title: "침구 분리하기",
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5-2",
        title: "세탁 및 건조",
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 필터 옵션
export const FILTER_OPTIONS = {
  ALL: "전체",
  CLEANING: "청소",
  LAUNDRY: "빨래",
} as const;

// 공간 목록
export const SPACES_FOR_FILTER = ["거실", "주방", "욕실", "화장실", "침실"];

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
