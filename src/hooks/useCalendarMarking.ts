import { useMemo } from "react";
import { CalendarMarkedDates } from "../data/unifiedData";
import { HouseholdTask } from "../types";
import { getTodayString } from "../utils/calendarUtils";

interface UseCalendarMarkingProps {
  taskTemplates: HouseholdTask[];
  todayTasks: HouseholdTask[];
  completedTasksMockData: HouseholdTask[];
  colors: any;
  isDarkMode: boolean;
}

export const useCalendarMarking = ({
  taskTemplates,
  todayTasks,
  completedTasksMockData,
  colors,
  isDarkMode,
}: UseCalendarMarkingProps): CalendarMarkedDates => {
  return useMemo(() => {
    const markedDates: CalendarMarkedDates = {};
    const today = getTodayString();

    // 오늘 날짜 마킹 (오늘 예정된 작업이 있는 경우)
    if (todayTasks && todayTasks.length > 0) {
      markedDates[today] = {
        marked: true,
        dotColor: colors.primary,
        textColor: colors.primary,
      };
    }

    // 완료된 작업들 마킹
    const allCompletedTasks = [
      ...taskTemplates.filter((task) => task.isCompleted),
      ...completedTasksMockData,
    ];

    allCompletedTasks.forEach((task) => {
      if (task.lastCompleted) {
        const completedDate = new Date(task.lastCompleted);
        const dateString = completedDate.toISOString().split("T")[0];

        if (markedDates[dateString]) {
          // 이미 마킹이 있는 경우, 완료 표시 추가
          markedDates[dateString] = {
            ...markedDates[dateString],
            marked: true,
            dots: [
              ...(markedDates[dateString].dots || []),
              {
                key: `completed-${task.id}`,
                color: colors.secondary,
              },
            ],
          };
        } else {
          // 새로운 마킹 생성
          markedDates[dateString] = {
            marked: true,
            dotColor: colors.secondary,
            textColor: colors.secondary,
            dots: [
              {
                key: `completed-${task.id}`,
                color: colors.secondary,
              },
            ],
          };
        }
      }
    });

    return markedDates;
  }, [taskTemplates, todayTasks, completedTasksMockData, colors, isDarkMode]);
};
