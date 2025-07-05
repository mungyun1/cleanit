import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import { COLORS, TYPOGRAPHY } from "../constants";
import {
  CALENDAR_MOCK_DATA,
  MONTHLY_STATS_MOCK,
  LEGEND_DATA,
  CalendarMarkedDates,
} from "../data/mockData";

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState<CalendarMarkedDates>({});

  // 목데이터 로드
  useEffect(() => {
    setMarkedDates(CALENDAR_MOCK_DATA);
  }, []);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const getTheme = () => ({
    backgroundColor: COLORS.background,
    calendarBackground: COLORS.surface,
    textSectionTitleColor: COLORS.onBackground,
    selectedDayBackgroundColor: COLORS.primary,
    selectedDayTextColor: COLORS.onPrimary,
    todayTextColor: COLORS.primary,
    dayTextColor: COLORS.onBackground,
    textDisabledColor: COLORS.onBackground + "40",
    dotColor: COLORS.primary,
    selectedDotColor: COLORS.onPrimary,
    arrowColor: COLORS.primary,
    monthTextColor: COLORS.onBackground,
    indicatorColor: COLORS.primary,
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
      <Text style={styles.legendTitle}>범례</Text>
      <View style={styles.legendItems}>
        {LEGEND_DATA.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>캘린더</Text>
          <Text style={styles.subtitle}>청소 기록 및 계획</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>이번 달 청소 현황</Text>
          <View style={styles.calendarWrapper}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: COLORS.primary,
                },
              }}
              theme={getTheme()}
              enableSwipeMonths={true}
              showWeekNumbers={false}
              firstDay={1}
              hideExtraDays={true}
              disableMonthChange={false}
              hideDayNames={false}
            />
          </View>
          {renderLegend()}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>이번 달 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {MONTHLY_STATS_MOCK.completedTasks}
              </Text>
              <Text style={styles.statLabel}>완료된 작업</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {MONTHLY_STATS_MOCK.incompleteTasks}
              </Text>
              <Text style={styles.statLabel}>미완료 작업</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {MONTHLY_STATS_MOCK.completionRate}
              </Text>
              <Text style={styles.statLabel}>완료율</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {MONTHLY_STATS_MOCK.consecutiveDays}
              </Text>
              <Text style={styles.statLabel}>연속 완료일</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.onBackground,
    marginBottom: 5,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
    marginBottom: 15,
  },
  calendarWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  legendContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onBackground,
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "48%",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
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
    backgroundColor: COLORS.surface,
    width: "48%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground + "80",
    textAlign: "center",
  },
});

export default CalendarScreen;
