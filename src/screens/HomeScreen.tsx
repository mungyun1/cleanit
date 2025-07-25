import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import CleaningTaskItem from "../components/CleaningTaskItem";
import Header from "../components/Header";
import AddTaskModal from "../components/AddTaskModal";
import SectionHeader from "../components/SectionHeader";
import { HouseholdTask } from "../types";
import { useTaskContext } from "../contexts/TaskContext";
import { getTodayDate } from "../utils/dateUtils";
import { calculateTaskStats } from "../utils/taskUtils";

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const {
    todayTasks,
    setTodayTasks,
    taskTemplates,
    setTaskTemplates,
    setScheduledTasksData,
    generateTodayTasks,
  } = useTaskContext();

  const todayInfo = getTodayDate();

  // 테마별 스타일 객체 생성
  const themedStyles = {
    container: { backgroundColor: colors.background },
    dateCard: {
      backgroundColor: colors.surface,
      borderColor: colors.onBackground + "10",
      shadowColor: colors.onBackground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    statCard: {
      backgroundColor: colors.surface,
      shadowColor: colors.onBackground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    categoryStatCard: {
      backgroundColor: colors.surface,
      shadowColor: colors.onBackground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    dayText: { color: colors.onBackground + "60" },
    dateNumber: { color: colors.onBackground },
    statNumber: { color: colors.primary },
    statLabel: { color: colors.onBackground + "80" },
    categoryStatNumber: { color: colors.primary },
    categoryStatLabel: { color: colors.onBackground + "80" },
    emptyStateTitle: { color: colors.onBackground },
    emptyStateDescription: { color: colors.onBackground + "60" },
  };

  const handleToggleTask = useCallback(
    (taskId: string) => {
      setTodayTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
            : task
        );
        return updatedTasks;
      });
    },
    [setTodayTasks]
  );

  const handleEditTask = (taskId: string) => {
    // navigation.navigate("EditTask", { taskId });
  };

  const handleUpdateTask = (updatedTask: HouseholdTask) => {
    // 오늘의 작업만 업데이트 (작업 템플릿에는 영향 없음)
    setTodayTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return updatedTasks;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    // 오늘의 작업에서만 삭제 (작업 템플릿에는 영향 없음)
    setTodayTasks((prevTasks) =>
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
    // 작업 템플릿에 추가
    setTaskTemplates((prevTasks) => [newTask, ...prevTasks]);
    // 오늘의 작업에 추가
    setTodayTasks((prevTasks) => [newTask, ...prevTasks]);
    setIsAddModalVisible(false);
  };

  // 통계 계산
  const stats = useMemo(() => {
    return calculateTaskStats(todayTasks || []);
  }, [todayTasks]);

  return (
    <View style={[styles.container, themedStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.dateContainer}>
          <View style={[styles.dateCard, themedStyles.dateCard]}>
            <View style={styles.calendarBody}>
              <View style={styles.dateInfo}>
                <Text style={[styles.dayText, themedStyles.dayText]}>
                  {todayInfo.dayName}요일
                </Text>
                <Text style={[styles.dateNumber, themedStyles.dateNumber]}>
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
          <View style={[styles.statCard, themedStyles.statCard]}>
            <Text style={[styles.statNumber, themedStyles.statNumber]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, themedStyles.statLabel]}>전체</Text>
          </View>
          <View style={[styles.statCard, themedStyles.statCard]}>
            <Text style={[styles.statNumber, themedStyles.statNumber]}>
              {stats.completed}
            </Text>
            <Text style={[styles.statLabel, themedStyles.statLabel]}>완료</Text>
          </View>
          <View style={[styles.statCard, themedStyles.statCard]}>
            <Text style={[styles.statNumber, themedStyles.statNumber]}>
              {stats.remaining}
            </Text>
            <Text style={[styles.statLabel, themedStyles.statLabel]}>
              남은 일
            </Text>
          </View>
        </View>

        <View style={styles.categoryStatsContainer}>
          <View
            style={[styles.categoryStatCard, themedStyles.categoryStatCard]}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <Text
              style={[
                styles.categoryStatNumber,
                themedStyles.categoryStatNumber,
              ]}
            >
              {stats.cleaning}
            </Text>
            <Text
              style={[styles.categoryStatLabel, themedStyles.categoryStatLabel]}
            >
              청소
            </Text>
          </View>
          <View
            style={[styles.categoryStatCard, themedStyles.categoryStatCard]}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name="shirt" size={20} color={colors.secondary} />
            </View>
            <Text
              style={[
                styles.categoryStatNumber,
                themedStyles.categoryStatNumber,
              ]}
            >
              {stats.laundry}
            </Text>
            <Text
              style={[styles.categoryStatLabel, themedStyles.categoryStatLabel]}
            >
              빨래
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="🫧 오늘 할 일"
            showAddButton={false}
            onAddPress={() => setIsAddModalVisible(true)}
          />
          {(todayTasks || []).length > 0 ? (
            (todayTasks || []).map((task) => (
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
                style={[styles.emptyStateTitle, themedStyles.emptyStateTitle]}
              >
                예정된 작업이 없습니다🧹
              </Text>
              <Text
                style={[
                  styles.emptyStateDescription,
                  themedStyles.emptyStateDescription,
                ]}
              >
                새로운 청소나 빨래 계획을 추가해보세요!
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
