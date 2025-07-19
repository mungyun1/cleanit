import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import { useTaskContext } from "../contexts/TaskContext";
import { calculateMonthlyStats } from "../utils/calendarUtils";

interface CalendarStatsProps {
  selectedMonth: Date;
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ selectedMonth }) => {
  const { colors } = useTheme();
  const { taskTemplates } = useTaskContext();

  // 선택된 월의 데이터만 사용하여 월간 통계 계산
  const monthlyStats = calculateMonthlyStats(
    taskTemplates || [],
    [], // 빈 배열로 목데이터 제외
    selectedMonth
  );

  return (
    <View style={styles.statsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
        📊 {selectedMonth.getMonth() + 1}월 통계
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
            {monthlyStats.completedTasks}
          </Text>
          <Text
            style={[styles.statLabel, { color: colors.onBackground + "80" }]}
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
            {monthlyStats.incompleteTasks}
          </Text>
          <Text
            style={[styles.statLabel, { color: colors.onBackground + "80" }]}
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
            {monthlyStats.completionRate}
          </Text>
          <Text
            style={[styles.statLabel, { color: colors.onBackground + "80" }]}
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
            {monthlyStats.consecutiveDays}
          </Text>
          <Text
            style={[styles.statLabel, { color: colors.onBackground + "80" }]}
          >
            연속 완료일
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 15,
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
});

export default CalendarStats;
