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
  console.log("isDarkMode:", isDarkMode, "surface:", colors.surface);
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState<CalendarMarkedDates>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState<ScheduledTask[]>(
    []
  );

  useEffect(() => {
    setMarkedDates(CALENDAR_MOCK_DATA);
  }, []);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const tasks = SCHEDULED_TASKS_DATA[day.dateString] || [];
    setSelectedDateTasks(tasks);
    if (tasks.length > 0) {
      setModalVisible(true);
    }
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
    todayTextColor: colors.primary,
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
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
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
          onMenuPress={() => console.log("메뉴 버튼 클릭")}
        />
        <View style={styles.calendarContainer}>
          <View style={styles.calendarWrapper}>
            <Calendar
              key={isDarkMode ? "dark" : "light"}
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: colors.primary,
                },
              }}
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
