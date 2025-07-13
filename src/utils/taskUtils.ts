import { COLORS } from "../constants";
import { DayOfWeek } from "../types";
import { LEGEND_DATA } from "../data/unifiedData";

export const getSpaceColor = (space: string, colors?: any) => {
  const colorPalette = colors || COLORS;
  switch (space) {
    case "거실":
      return colorPalette.livingRoom;
    case "주방":
      return colorPalette.kitchen;
    case "욕실":
      return colorPalette.bathroom;
    case "화장실":
      return colorPalette.toilet;
    case "침실":
      return colorPalette.bedroom;
    default:
      return colorPalette.common;
  }
};

export const getLaundryTypeColor = (laundryType: string) => {
  switch (laundryType) {
    case "whites":
      return "#E3F2FD";
    case "colors":
      return "#F3E5F5";
    case "delicates":
      return "#FFF3E0";
    case "bedding":
      return "#E8F5E8";
    case "towels":
      return "#FCE4EC";
    default:
      return COLORS.common;
  }
};

export const getLaundryTypeText = (laundryType: string) => {
  switch (laundryType) {
    case "whites":
      return "흰 옷";
    case "colors":
      return "색 옷";
    case "delicates":
      return "섬세한 옷";
    case "bedding":
      return "침구";
    case "towels":
      return "수건";
    default:
      return laundryType;
  }
};

export const getFrequencyText = (frequency: any) => {
  // frequency가 undefined이거나 null인 경우 처리
  if (!frequency) {
    return "알 수 없음";
  }

  const dayNames: Record<DayOfWeek, string> = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",
  };

  switch (frequency.type) {
    case "daily":
      return "매일";
    case "weekly":
      if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
        const dayLabels = frequency.daysOfWeek
          .map((day: DayOfWeek) => dayNames[day])
          .join(", ");
        return `매주 ${dayLabels}`;
      }
      return "매주";
    case "biweekly":
      if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
        const dayLabels = frequency.daysOfWeek
          .map((day: DayOfWeek) => dayNames[day])
          .join(", ");
        return `격주 ${dayLabels}`;
      }
      return "격주";
    case "monthly":
      return "월 1회";
    case "custom":
      return frequency.customDays
        ? `${frequency.customDays}일마다`
        : "사용자 정의";
    default:
      return "알 수 없음";
  }
};

export function getLegendColor(label: string) {
  const found = LEGEND_DATA.find((item) => item.label === label);
  return found ? found.color : "#BDBDBD";
}

// 오늘 날짜에 해당하는 작업 필터링
export const filterTodayTasks = (tasks: any[]) => {
  const today = new Date();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const todayDayName = dayNames[today.getDay()];

  const filteredTasks = tasks.filter((task) => {
    // daily 작업은 항상 포함
    if (task.frequency.type === "daily") return true;

    // weekly 작업은 오늘이 해당 요일인지 확인
    if (task.frequency.type === "weekly" && task.frequency.daysOfWeek) {
      return task.frequency.daysOfWeek.includes(todayDayName);
    }

    // biweekly 작업은 선택된 주에 따라 포함
    if (task.frequency.type === "biweekly") {
      if (!task.frequency.daysOfWeek?.includes(todayDayName)) {
        return false;
      }

      // 현재 주가 몇째주인지 계산
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const dayOfWeek = firstDayOfMonth.getDay();
      const firstWeekStart = new Date(firstDayOfMonth);
      firstWeekStart.setDate(1 - dayOfWeek);

      const weekNumber =
        Math.floor(
          (today.getTime() - firstWeekStart.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ) + 1;

      // biweeklyWeek에 따라 필터링
      if (task.frequency.biweeklyWeek === "first_third") {
        return weekNumber === 1 || weekNumber === 3;
      } else if (task.frequency.biweeklyWeek === "second_fourth") {
        return weekNumber === 2 || weekNumber === 4;
      }

      return false;
    }

    return false;
  });

  // 생성일 기준으로 최신 작업이 상단에 오도록 정렬
  return filteredTasks.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// 작업 통계 계산
export const calculateTaskStats = (tasks: any[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const remainingTasks = totalTasks - completedTasks;
  const cleaningTasks = tasks.filter(
    (task) => task.category === "cleaning"
  ).length;
  const laundryTasks = tasks.filter(
    (task) => task.category === "laundry"
  ).length;

  return {
    total: totalTasks,
    completed: completedTasks,
    remaining: remainingTasks,
    cleaning: cleaningTasks,
    laundry: laundryTasks,
  };
};
