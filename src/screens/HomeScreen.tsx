import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import CleaningTaskItem from "../components/CleaningTaskItem";
import Header from "../components/Header";
import AddTaskModal from "../components/AddTaskModal";
import SectionHeader from "../components/SectionHeader";
import { HouseholdTask } from "../types";
import { UNIFIED_TASKS, convertToScheduledTask } from "../data/unifiedData";
import { useTaskContext } from "../contexts/TaskContext";

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const {
    unifiedTasks,
    setUnifiedTasks,
    scheduledTasksData,
    setScheduledTasksData,
  } = useTaskContext();
  // 오늘 날짜 포맷팅
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayOfWeek = today.getDay();

    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = dayNames[dayOfWeek];

    return {
      fullDate: `${year}년 ${month}월 ${date}일`,
      dayName: dayName,
      date: date,
      month: month,
      year: year,
    };
  };

  const todayInfo = getTodayDate();

  // 오늘 날짜에 해당하는 작업 필터링
  const todayTasks = useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    // unifiedTasks에서 오늘 날짜에 해당하는 작업만 필터링
    const filteredTasks = unifiedTasks.filter((task) => {
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
        const todayDayName = dayNames[today.getDay()];
        return task.frequency.daysOfWeek.includes(todayDayName as any);
      }

      // biweekly 작업은 간단히 매주 포함 (실제로는 더 복잡한 로직 필요)
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
        const todayDayName = dayNames[today.getDay()];
        return task.frequency.daysOfWeek?.includes(todayDayName as any);
      }

      return false;
    });

    return filteredTasks;
  }, [unifiedTasks]);

  const handleToggleTask = useCallback(
    (taskId: string) => {
      setUnifiedTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
            : task
        );
        return updatedTasks;
      });
    },
    [setUnifiedTasks]
  );

  const handleEditTask = (taskId: string) => {
    // navigation.navigate("EditTask", { taskId });
  };

  const handleUpdateTask = (updatedTask: HouseholdTask) => {
    setUnifiedTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return updatedTasks;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setUnifiedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
    setScheduledTasksData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        updated[date] = updated[date].filter((task) => task.id !== taskId);
        if (updated[date].length === 0) delete updated[date];
      });
      return updated;
    });
  };

  const handleAddTask = (newTask: HouseholdTask) => {
    setUnifiedTasks((prevTasks) => [...prevTasks, newTask]);
    setIsAddModalVisible(false);
  };

  // 통계 계산
  const stats = useMemo(() => {
    const totalTasks = todayTasks.length;
    const completedTasks = todayTasks.filter((task) => task.isCompleted).length;
    const remainingTasks = totalTasks - completedTasks;
    const cleaningTasks = todayTasks.filter(
      (task) => task.category === "cleaning"
    ).length;
    const laundryTasks = todayTasks.filter(
      (task) => task.category === "laundry"
    ).length;

    return {
      total: totalTasks,
      completed: completedTasks,
      remaining: remainingTasks,
      cleaning: cleaningTasks,
      laundry: laundryTasks,
    };
  }, [todayTasks]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="🏠 가사 관리"
          subtitle="오늘 할 청소와 빨래를 확인하세요"
        />

        <View style={styles.dateContainer}>
          <View
            style={[
              styles.dateCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.onBackground + "10",
                shadowColor: colors.onBackground,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}
          >
            <View style={styles.calendarBody}>
              <View style={styles.dateInfo}>
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  {todayInfo.dayName}요일
                </Text>
                <Text
                  style={[styles.dateNumber, { color: colors.onBackground }]}
                >
                  {todayInfo.year}년 {todayInfo.month}월 {todayInfo.date}일
                </Text>
              </View>
              <View style={styles.dateIcon}>
                <Ionicons name="calendar" size={24} color={colors.primary} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.onBackground,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.total}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.onBackground + "80" }]}
            >
              전체
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.onBackground,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.completed}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.onBackground + "80" }]}
            >
              완료
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.onBackground,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.remaining}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.onBackground + "80" }]}
            >
              남은 일
            </Text>
          </View>
        </View>

        <View style={styles.categoryStatsContainer}>
          <View
            style={[
              styles.categoryStatCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.onBackground,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <Text
              style={[styles.categoryStatNumber, { color: colors.primary }]}
            >
              {stats.cleaning}
            </Text>
            <Text
              style={[
                styles.categoryStatLabel,
                { color: colors.onBackground + "80" },
              ]}
            >
              청소
            </Text>
          </View>
          <View
            style={[
              styles.categoryStatCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.onBackground,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name="shirt" size={20} color={colors.secondary} />
            </View>
            <Text
              style={[styles.categoryStatNumber, { color: colors.primary }]}
            >
              {stats.laundry}
            </Text>
            <Text
              style={[
                styles.categoryStatLabel,
                { color: colors.onBackground + "80" },
              ]}
            >
              빨래
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="오늘의 가사"
            onAddPress={() => setIsAddModalVisible(true)}
          />
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <CleaningTaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={48}
                  color={colors.onBackground + "40"}
                />
              </View>
              <Text
                style={[styles.emptyStateTitle, { color: colors.onBackground }]}
              >
                예정된 작업이 없습니다🧹
              </Text>
              <Text
                style={[
                  styles.emptyStateDescription,
                  { color: colors.onBackground + "60" },
                ]}
              >
                새로운 청소나 빨래 작업을 추가해보세요.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddTask={handleAddTask}
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
  dateContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  dateCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  monthText: {
    ...TYPOGRAPHY.h2,
    fontWeight: "700",
  },
  yearText: {
    ...TYPOGRAPHY.h3,
    fontWeight: "500",
  },
  calendarBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dateCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  dateNumber: {
    ...TYPOGRAPHY.h3,
    fontWeight: "600",
    fontSize: 18,
  },
  dayText: {
    ...TYPOGRAPHY.body2,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  dateInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  dateIcon: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  fullDate: {
    ...TYPOGRAPHY.h3,
    marginBottom: 5,
    fontWeight: "600",
  },

  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    marginBottom: 5,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  categoryStatsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryStatCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryStatNumber: {
    ...TYPOGRAPHY.h3,
    marginBottom: 3,
    fontWeight: "600",
  },
  categoryStatLabel: {
    ...TYPOGRAPHY.caption,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 15,
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    ...TYPOGRAPHY.button,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateDescription: {
    ...TYPOGRAPHY.body2,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  emptyStateButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default HomeScreen;
