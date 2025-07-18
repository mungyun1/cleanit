import { CalendarMarkedDates } from "../data/unifiedData";
import { HouseholdTask } from "../types";
import { ScheduledTask } from "../data/unifiedData";
import { DateData } from "react-native-calendars";

// 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 작업을 ScheduledTask 형식으로 변환
export const convertToScheduledTask = (
  task: HouseholdTask,
  colors: any
): ScheduledTask => ({
  id: task.id,
  title: task.title,
  description: task.description || "",
  area: task.category === "cleaning" ? task.space || "기타" : "빨래",
  priority: "medium",
  estimatedTime: 30,
  color: task.category === "cleaning" ? colors.primary : colors.secondary,
  severity: "normal",
  isCompleted: task.isCompleted,
  category: task.category,
  frequency: task.frequency,
  label: (task as any).label || "",
});

// 캘린더 테마 생성
export const createCalendarTheme = (colors: any, isDarkMode: boolean) => ({
  calendarBackground: isDarkMode ? "#000000" : "#FFFFFF",
  textSectionTitleColor: colors.onBackground,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.onPrimary,
  todayTextColor: isDarkMode ? "#FFFFFF" : colors.primary,
  dayTextColor: colors.onBackground,
  textDisabledColor: colors.onBackground + "40",
  dotColor: colors.primary,
  selectedDotColor: colors.onPrimary,
  arrowColor: colors.primary,
  monthTextColor: colors.onBackground,
  indicatorColor: colors.primary,
  textDayFontFamily: "System",
  textMonthFontFamily: "System",
  textDayHeaderFontFamily: "System",
  textDayFontWeight: "300" as const,
  textMonthFontWeight: "bold" as const,
  textDayHeaderFontWeight: "600" as const,
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
});

// 월간 통계 계산
export const calculateMonthlyStats = (
  taskTemplates: HouseholdTask[],
  completedTasksMockData: HouseholdTask[],
  selectedMonth: Date = new Date()
) => {
  const currentYear = selectedMonth.getFullYear();
  const currentMonth = selectedMonth.getMonth() + 1;

  // 이번 달에 완료된 작업들 필터링 (현재 년도와 월만)
  const thisMonthCompletedTasks = [
    ...taskTemplates.filter((task) => {
      if (!task.isCompleted || !task.lastCompleted) return false;
      const completedDate = new Date(task.lastCompleted);
      return (
        completedDate.getFullYear() === currentYear &&
        completedDate.getMonth() + 1 === currentMonth
      );
    }),
    ...completedTasksMockData.filter((task) => {
      if (!task.lastCompleted) return false;
      const completedDate = new Date(task.lastCompleted);
      return (
        completedDate.getFullYear() === currentYear &&
        completedDate.getMonth() + 1 === currentMonth
      );
    }),
  ];

  // 통계 계산 로직 수정
  // 1. 완료된 작업 수: 선택된 월에 완료된 작업들만
  const completedTasks = thisMonthCompletedTasks.length;

  // 2. 미완료 작업 수: 선택된 월에 완료되지 않은 작업들
  const incompleteTasks = taskTemplates.filter((task) => {
    // 작업이 미완료 상태인지 확인
    if (task.isCompleted) return false;

    // 선택된 월에 완료된 작업인지 확인
    const isCompletedThisMonth = thisMonthCompletedTasks.some(
      (completedTask) => completedTask.id === task.id
    );

    // 이번 달에 완료되지 않은 작업들
    return !isCompletedThisMonth;
  }).length;

  // 4. 전체 작업 수: 완료된 작업 + 미완료 작업
  const totalTasks = completedTasks + incompleteTasks;

  // 5. 완료율 계산: (완료된 작업 / 전체 작업) * 100
  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100) + "%"
      : "0%";

  // 6. 선택된 월의 연속 완료일 계산
  const selectedMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const selectedMonthEnd = new Date(currentYear, currentMonth, 0);

  const selectedMonthCompletedTasks = [
    ...taskTemplates.filter((task) => {
      if (!task.isCompleted || !task.lastCompleted) return false;
      const completedDate = new Date(task.lastCompleted);
      return (
        completedDate >= selectedMonthStart && completedDate <= selectedMonthEnd
      );
    }),
    ...completedTasksMockData.filter((task) => {
      if (!task.lastCompleted) return false;
      const completedDate = new Date(task.lastCompleted);
      return (
        completedDate >= selectedMonthStart && completedDate <= selectedMonthEnd
      );
    }),
  ];

  // 선택된 월의 완료된 날짜들
  const selectedMonthCompletedDates = new Set(
    selectedMonthCompletedTasks.map((task) => {
      const date = new Date(task.lastCompleted!);
      return date.toISOString().split("T")[0];
    })
  );

  let consecutiveDays = 0;
  let currentConsecutive = 0;

  // 선택된 월의 각 날짜를 확인하여 연속일 계산
  for (let day = 1; day <= selectedMonthEnd.getDate(); day++) {
    const checkDate = new Date(currentYear, currentMonth - 1, day);
    const dateString = checkDate.toISOString().split("T")[0];

    if (selectedMonthCompletedDates.has(dateString)) {
      currentConsecutive++;
      consecutiveDays = Math.max(consecutiveDays, currentConsecutive);
    } else {
      currentConsecutive = 0;
    }
  }

  return {
    completedTasks,
    incompleteTasks,
    completionRate,
    consecutiveDays,
  };
};
