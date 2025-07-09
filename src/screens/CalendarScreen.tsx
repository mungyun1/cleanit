import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";
import ScheduledTasksModal from "../components/ScheduledTasksModal";
import {
  CALENDAR_MOCK_DATA,
  MONTHLY_STATS_MOCK,
  LEGEND_DATA,
  CalendarMarkedDates,
  SCHEDULED_TASKS_DATA,
  ScheduledTask,
} from "../data/mockData";

const CalendarScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState<CalendarMarkedDates>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState<ScheduledTask[]>(
    []
  );

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // SCHEDULED_TASKS_DATA를 기반으로 캘린더 마킹 데이터 생성
    const generateMarkedDates = () => {
      const marked: CalendarMarkedDates = {};
      const today = getTodayString();

      Object.keys(SCHEDULED_TASKS_DATA).forEach((date) => {
        const tasks = SCHEDULED_TASKS_DATA[date];
        if (tasks && tasks.length > 0) {
          // 해당 날짜의 첫 번째 작업 색상을 사용
          marked[date] = {
            marked: true,
            dotColor: tasks[0].color,
            textColor: colors.onBackground,
            customStyles: {
              container: {
                backgroundColor: tasks[0].color + "20", // 20% 투명도
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
      });

      // 오늘 날짜 스타일 추가
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
  }, [colors.onBackground, colors.primary, isDarkMode]);

  const onDayPress = (day: DateData) => {
    const tasks = SCHEDULED_TASKS_DATA[day.dateString] || [];
    // 일정이 없는 날짜는 클릭하지 않음
    if (tasks.length === 0) {
      return;
    }

    setSelectedDate(day.dateString);
    setSelectedDateTasks(tasks);
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

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      <Text style={[styles.legendTitle, { color: colors.onBackground + "80" }]}>
        범례
      </Text>
      <View style={styles.legendItems}>
        {LEGEND_DATA.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor: item.color + "20",
                  borderWidth: 1,
                  borderColor: item.color,
                },
              ]}
            />
            <Text
              style={[styles.legendText, { color: colors.onBackground + "80" }]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="📅 캘린더"
          subtitle="청소 기록 및 계획"
          showMenuButton={true}
        />
        <View style={styles.calendarContainer}>
          <View style={styles.calendarWrapper}>
            <Calendar
              key={isDarkMode ? "dark" : "light"}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={getTheme()}
              enableSwipeMonths={true}
              showWeekNumbers={false}
              firstDay={1}
              hideExtraDays={true}
              disableMonthChange={false}
              hideDayNames={false}
              markingType="custom"
            />
          </View>
          {renderLegend()}
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
                {MONTHLY_STATS_MOCK.completedTasks}
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
                {MONTHLY_STATS_MOCK.incompleteTasks}
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
                {MONTHLY_STATS_MOCK.completionRate}
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
                {MONTHLY_STATS_MOCK.consecutiveDays}
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
