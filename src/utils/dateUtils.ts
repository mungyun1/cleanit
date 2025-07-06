import { Frequency } from "../types";

export const shouldCleanToday = (
  frequency: Frequency,
  lastCompleted?: Date
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!lastCompleted) return true;
  const last = new Date(lastCompleted);
  last.setHours(0, 0, 0, 0);
  const diff = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );
  switch (frequency) {
    case "daily":
      return diff >= 1;
    case "weekly":
      return diff >= 7;
    case "biweekly":
      return diff >= 14;
    case "monthly":
      return diff >= 30;
    default:
      return false;
  }
};

export const formatDate = (date: Date): string => {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 주차 계산
export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// 이번 주의 시작일과 끝일
export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - day);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return { start, end };
};

// 이번 달의 시작일과 끝일
export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { start, end };
};

// 날짜가 특정 기간 내에 있는지 확인
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  return targetDate >= startDate && targetDate <= endDate;
};

// 시간을 HH:MM 형식으로 포맷
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

// 날짜가 특정 주기 설정에 따라 다음 예정일을 반환
export const getNextDueDate = (
  lastCompleted: Date | undefined,
  createdAt: Date,
  frequency: any // FrequencySettings 타입 import 루프 방지, 실제 사용처에서 타입 지정
): string => {
  const baseDate = lastCompleted
    ? new Date(lastCompleted)
    : new Date(createdAt);
  let nextDue = new Date(baseDate);

  switch (frequency.type) {
    case "daily":
      nextDue.setDate(baseDate.getDate() + 1);
      break;
    case "weekly":
      nextDue.setDate(baseDate.getDate() + 7);
      break;
    case "biweekly":
      nextDue.setDate(baseDate.getDate() + 14);
      break;
    case "monthly":
      nextDue.setMonth(baseDate.getMonth() + 1);
      break;
    case "custom":
      if (frequency.customDays) {
        nextDue.setDate(baseDate.getDate() + frequency.customDays);
      }
      break;
  }

  return nextDue.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};
