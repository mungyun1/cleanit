import { COLORS } from "../constants";

// 캘린더 목데이터 타입 정의
export interface CalendarMarkedDate {
  marked: boolean;
  dotColor: string;
  textColor: string;
  selected?: boolean;
  selectedColor?: string;
}

export interface CalendarMarkedDates {
  [date: string]: CalendarMarkedDate;
}

// 캘린더 샘플 데이터
export const CALENDAR_MOCK_DATA: CalendarMarkedDates = {
  "2024-01-15": {
    marked: true,
    dotColor: COLORS.livingRoom,
    textColor: COLORS.onBackground,
  },
  "2024-01-18": {
    marked: true,
    dotColor: COLORS.kitchen,
    textColor: COLORS.onBackground,
  },
  "2024-01-20": {
    marked: true,
    dotColor: COLORS.bathroom,
    textColor: COLORS.onBackground,
  },
  "2024-01-22": {
    marked: true,
    dotColor: COLORS.bedroom,
    textColor: COLORS.onBackground,
  },
  "2024-01-25": {
    marked: true,
    dotColor: COLORS.common,
    textColor: COLORS.onBackground,
  },
  "2024-01-28": {
    marked: true,
    dotColor: COLORS.livingRoom,
    textColor: COLORS.onBackground,
  },
  "2024-01-30": {
    marked: true,
    dotColor: COLORS.kitchen,
    textColor: COLORS.onBackground,
  },
  "2024-02-02": {
    marked: true,
    dotColor: COLORS.bathroom,
    textColor: COLORS.onBackground,
  },
  "2024-02-05": {
    marked: true,
    dotColor: COLORS.bedroom,
    textColor: COLORS.onBackground,
  },
  "2024-02-08": {
    marked: true,
    dotColor: COLORS.common,
    textColor: COLORS.onBackground,
  },
};

// 통계 목데이터
export interface MonthlyStats {
  completedTasks: number;
  incompleteTasks: number;
  completionRate: string;
  consecutiveDays: number;
}

export const MONTHLY_STATS_MOCK: MonthlyStats = {
  completedTasks: 15,
  incompleteTasks: 8,
  completionRate: "65%",
  consecutiveDays: 5,
};

// 공간별 범례 데이터
export interface LegendItem {
  color: string;
  label: string;
}

export const LEGEND_DATA: LegendItem[] = [
  { color: COLORS.livingRoom, label: "거실" },
  { color: COLORS.kitchen, label: "주방" },
  { color: COLORS.bathroom, label: "욕실" },
  { color: COLORS.bedroom, label: "방" },
  { color: COLORS.common, label: "공용" },
];
