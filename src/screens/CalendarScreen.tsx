import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";
import ScheduledTasksModal from "../components/ScheduledTasksModal";
import {
  CALENDAR_MOCK_DATA,
  MONTHLY_STATS,
  LEGEND_DATA,
  CalendarMarkedDates,
  SCHEDULED_TASKS_DATA as initialScheduledTasksData,
  ScheduledTask,
  UNIFIED_TASKS as initialUnifiedTasks,
} from "../data/unifiedData";
import { getLegendColor } from "../utils/taskUtils";
import { COMPLETED_TASKS_MOCK_DATA } from "../data/calendarMockData";
import { useTaskContext } from "../contexts/TaskContext";

const CalendarScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState<CalendarMarkedDates>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState<ScheduledTask[]>(
    []
  );
  const {
    unifiedTasks,
    setUnifiedTasks,
    scheduledTasksData,
    setScheduledTasksData,
  } = useTaskContext();

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 작업 삭제 함수
  const deleteTask = (taskId: string) => {
    setUnifiedTasks((prev) => prev.filter((task) => task.id !== taskId));
    setScheduledTasksData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        updated[date] = updated[date].filter((task) => task.id !== taskId);
        if (updated[date].length === 0) delete updated[date];
      });
      return updated;
    });
  };

  useEffect(() => {
    // 완료된 작업들과 오늘 예정된 작업들을 캘린더 마킹 데이터 생성
    const generateMarkedDates = () => {
      const marked: CalendarMarkedDates = {};
      const today = getTodayString();

      // LEGEND_DATA에서 공간명(label)로 색상 찾기
      const getLegendColor = (spaceOrLabel: string) => {
        const found = LEGEND_DATA.find((item) => item.label === spaceOrLabel);
        return found ? found.color : colors.primary;
      };

      // 실제 완료된 작업들과 목데이터를 합침
      const allCompletedTasks = [
        ...unifiedTasks.filter((task) => task.isCompleted),
        ...COMPLETED_TASKS_MOCK_DATA,
      ];

      // 완료된 작업들의 날짜를 마킹
      allCompletedTasks.forEach((task) => {
        if (task.lastCompleted) {
          const completedDate = new Date(task.lastCompleted);
          const dateString = completedDate.toISOString().split("T")[0];

          // 과거부터 오늘까지만 표시
          if (dateString <= today) {
            const taskColor = getLegendColor(
              task.space || (task.category === "laundry" ? "빨래" : "기타")
            );

            // 같은 날짜에 여러 작업이 있는 경우 기존 스타일 유지하면서 추가
            if (marked[dateString]) {
              // 기존 마킹이 있으면 dotColor만 업데이트 (첫 번째 작업의 색상 유지)
              marked[dateString] = {
                ...marked[dateString],
                marked: true,
              };
            } else {
              marked[dateString] = {
                marked: true,
                dotColor: taskColor,
                textColor: colors.onBackground,
                customStyles: {
                  container: {
                    backgroundColor: taskColor + "20", // 20% 투명도
                    borderRadius: 20,
                    width: 36,
                    height: 36,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  text: {
                    color: colors.onBackground,
                    fontWeight: "600",
                  },
                },
              };
            }
          }
        }
      });

      // 오늘 예정된 작업들 마킹 (HomeScreen과 동일한 로직)
      const todayDate = new Date();
      const todayTasks = unifiedTasks.filter((task) => {
        // daily 작업은 항상 포함
        if (task.frequency.type === "daily") return true;

        // weekly 작업은 오늘이 해당 요일인지 확인
        if (task.frequency.type === "weekly" && task.frequency.daysOfWeek) {
          const dayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const todayDayName = dayNames[todayDate.getDay()];
          return task.frequency.daysOfWeek.includes(todayDayName as any);
        }

        // biweekly 작업은 간단히 매주 포함
        if (task.frequency.type === "biweekly") {
          const dayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const todayDayName = dayNames[todayDate.getDay()];
          return task.frequency.daysOfWeek?.includes(todayDayName as any);
        }

        return false;
      });

      // 오늘 예정된 작업이 있으면 오늘 날짜에 특별한 마킹 추가
      if (todayTasks.length > 0) {
        const todayColor = colors.secondary; // 오늘 예정된 작업은 다른 색상 사용

        if (marked[today]) {
          // 완료된 작업과 예정된 작업이 모두 있는 경우
          marked[today] = {
            ...marked[today],
            marked: true,
            // 완료된 작업과 예정된 작업을 구분하기 위해 다른 스타일 적용
            customStyles: {
              container: {
                backgroundColor: todayColor + "30", // 30% 투명도
                borderRadius: 20,
                width: 36,
                height: 36,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: todayColor,
              },
              text: {
                color: colors.onBackground,
                fontWeight: "bold",
                fontSize: 16,
              },
            },
          };
        } else {
          // 오늘 예정된 작업만 있는 경우
          marked[today] = {
            marked: true,
            dotColor: todayColor,
            textColor: colors.onBackground,
            customStyles: {
              container: {
                backgroundColor: todayColor + "30", // 30% 투명도
                borderRadius: 20,
                width: 36,
                height: 36,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: todayColor,
              },
              text: {
                color: colors.onBackground,
                fontWeight: "bold",
                fontSize: 16,
              },
            },
          };
        }
      }

      // 오늘 날짜 스타일 추가 (완료된 작업이 있든 없든)
      marked[today] = {
        ...marked[today],
        customStyles: {
          container: {
            backgroundColor: colors.primary + "40",
            borderRadius: 20,
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.primary,
          },
          text: {
            color: isDarkMode ? "#FFFFFF" : colors.onPrimary,
            fontWeight: "bold",
            fontSize: 16,
          },
        },
      };

      return marked;
    };

    setMarkedDates(generateMarkedDates());
  }, [
    colors.onBackground,
    colors.primary,
    colors.secondary,
    isDarkMode,
    unifiedTasks,
  ]);

  const onDayPress = (day: DateData) => {
    const today = getTodayString();
    const isToday = day.dateString === today;

    let tasksForDate: any[] = [];

    if (isToday) {
      // 오늘인 경우: 완료된 작업 + 예정된 작업 모두 표시
      const allCompletedTasks = [
        ...unifiedTasks.filter((task) => task.isCompleted),
        ...COMPLETED_TASKS_MOCK_DATA,
      ];

      const completedTasksForToday = allCompletedTasks.filter((task) => {
        if (!task.lastCompleted) return false;

        const completedDate = new Date(task.lastCompleted);
        const completedDateString = completedDate.toISOString().split("T")[0];

        return completedDateString === day.dateString;
      });

      // 오늘 예정된 작업들 (HomeScreen과 동일한 로직)
      const todayDate = new Date();
      const todayTasks = unifiedTasks.filter((task) => {
        // daily 작업은 항상 포함
        if (task.frequency.type === "daily") return true;

        // weekly 작업은 오늘이 해당 요일인지 확인
        if (task.frequency.type === "weekly" && task.frequency.daysOfWeek) {
          const dayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const todayDayName = dayNames[todayDate.getDay()];
          return task.frequency.daysOfWeek.includes(todayDayName as any);
        }

        // biweekly 작업은 간단히 매주 포함
        if (task.frequency.type === "biweekly") {
          const dayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const todayDayName = dayNames[todayDate.getDay()];
          return task.frequency.daysOfWeek?.includes(todayDayName as any);
        }

        return false;
      });

      tasksForDate = [...completedTasksForToday, ...todayTasks];
    } else {
      // 과거 날짜인 경우: 완료된 작업만 표시
      const allCompletedTasks = [
        ...unifiedTasks.filter((task) => task.isCompleted),
        ...COMPLETED_TASKS_MOCK_DATA,
      ];

      const completedTasksForDate = allCompletedTasks.filter((task) => {
        if (!task.lastCompleted) return false;

        const completedDate = new Date(task.lastCompleted);
        const completedDateString = completedDate.toISOString().split("T")[0];

        return completedDateString === day.dateString;
      });

      tasksForDate = completedTasksForDate;
    }

    // 작업이 없는 날짜는 클릭하지 않음
    if (tasksForDate.length === 0) {
      return;
    }

    // 작업들을 ScheduledTask 형식으로 변환
    const convertedTasks: ScheduledTask[] = tasksForDate.map((task) => ({
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
    }));

    setSelectedDate(day.dateString);
    setSelectedDateTasks(convertedTasks);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // 강제 다크/라이트 모드 배경색 테스트
  const getTheme = () => ({
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="📅 캘린더"
          subtitle="완료된 작업 기록을 확인하세요"
          showMenuButton={true}
        />
        <View style={styles.calendarContainer}>
          <View style={styles.calendarWrapper}>
            <Calendar
              key={isDarkMode ? "dark" : "light"}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={getTheme()}
              enableSwipeMonths={false}
              showWeekNumbers={false}
              firstDay={1}
              hideExtraDays={true}
              disableMonthChange={true}
              hideDayNames={false}
              markingType="custom"
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            이번 달 통계
          </Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  shadowColor: colors.onBackground,
                },
              ]}
            >
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {MONTHLY_STATS.completedTasks}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.onBackground + "80" },
                ]}
              >
                완료된 작업
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  shadowColor: colors.onBackground,
                },
              ]}
            >
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {MONTHLY_STATS.incompleteTasks}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.onBackground + "80" },
                ]}
              >
                미완료 작업
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  shadowColor: colors.onBackground,
                },
              ]}
            >
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {MONTHLY_STATS.completionRate}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.onBackground + "80" },
                ]}
              >
                완료율
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  shadowColor: colors.onBackground,
                },
              ]}
            >
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {MONTHLY_STATS.consecutiveDays}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.onBackground + "80" },
                ]}
              >
                연속 완료일
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ScheduledTasksModal
        visible={modalVisible}
        onClose={closeModal}
        date={selectedDate}
        tasks={selectedDateTasks}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 15,
  },
  calendarWrapper: {
    borderRadius: 12,
    padding: 10,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    marginBottom: 5,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  legendContainer: {
    marginTop: 18,
    marginBottom: 10,
  },
  legendTitle: {
    ...TYPOGRAPHY.body2,
    fontWeight: "bold",
    marginBottom: 6,
  },
  legendItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    ...TYPOGRAPHY.caption,
  },
});

export default CalendarScreen;
