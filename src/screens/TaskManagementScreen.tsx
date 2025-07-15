import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useTaskContext } from "../contexts/TaskContext";
import { FILTER_OPTIONS, SPACES, STAT_CARDS } from "../data/unifiedData";

const TaskManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    FILTER_OPTIONS.ALL
  );

  const { taskTemplates, setTaskTemplates, setScheduledTasksData } =
    useTaskContext();

  // 필터링된 작업 목록
  const filteredTasks = (taskTemplates || [])
    .filter((task) => {
      if (selectedFilter === FILTER_OPTIONS.ALL) return true;
      if (selectedFilter === FILTER_OPTIONS.CLEANING)
        return task.category === "cleaning";
      if (selectedFilter === FILTER_OPTIONS.LAUNDRY)
        return task.category === "laundry";
      if (selectedFilter === FILTER_OPTIONS.PET) return task.category === "pet";
      return true;
    })
    .sort((a, b) => {
      // 생성일 기준으로 최신 작업이 상단에 오도록 정렬
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // 통계 계산 (작업 관리 페이지는 전체 작업 수만 표시)
  const stats = {
    totalTasks: taskTemplates?.length || 0,
    completedTasks: 0, // 작업 관리 페이지에서는 완료 상태를 고려하지 않음
  };

  const handleFilterChange = (filter: string) => setSelectedFilter(filter);

  const handleToggleTask = (taskId: string) => {
    // 작업 관리 페이지에서는 완료 상태를 변경하지 않음
    // 작업 템플릿은 완료 상태와 무관하게 관리
  };

  const handleUpdateTask = (updatedTask: HouseholdTask) => {
    setTaskTemplates((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskTemplates((prev) => prev.filter((task) => task.id !== taskId));
    setScheduledTasksData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        updated[date] = updated[date].filter((task) => task.id !== taskId);
        if (updated[date].length === 0) delete updated[date];
      });
      return updated;
    });
  };

  const handleEditTask = (taskId: string) => {
    // navigation.navigate("EditTask", { taskId });
  };

  const handleAddTaskAndClose = (newTask: HouseholdTask) => {
    setTaskTemplates((prevTasks) => [newTask, ...prevTasks]);
    setIsAddModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="📋 작업 관리"
          subtitle="모든 청소 작업을 관리하세요"
          showMenuButton={true}
        />
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: colors.primary },
                selectedFilter === FILTER_OPTIONS.ALL && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.ALL)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.onBackground },
                  selectedFilter === FILTER_OPTIONS.ALL && {
                    color: colors.primary,
                    fontWeight: "bold",
                  },
                ]}
              >
                {FILTER_OPTIONS.ALL}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: colors.primary },
                selectedFilter === FILTER_OPTIONS.CLEANING && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.CLEANING)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.onBackground },
                  selectedFilter === FILTER_OPTIONS.CLEANING && {
                    color: colors.primary,
                    fontWeight: "bold",
                  },
                ]}
              >
                {FILTER_OPTIONS.CLEANING}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: colors.primary },
                selectedFilter === FILTER_OPTIONS.LAUNDRY && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.LAUNDRY)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.onBackground },
                  selectedFilter === FILTER_OPTIONS.LAUNDRY && {
                    color: colors.primary,
                    fontWeight: "bold",
                  },
                ]}
              >
                {FILTER_OPTIONS.LAUNDRY}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: colors.primary },
                selectedFilter === FILTER_OPTIONS.PET && {
                  backgroundColor: colors.primary + "20",
                },
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.PET)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.onBackground },
                  selectedFilter === FILTER_OPTIONS.PET && {
                    color: colors.primary,
                    fontWeight: "bold",
                  },
                ]}
              >
                {FILTER_OPTIONS.PET}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.onBackground,
              },
            ]}
          >
            <Ionicons
              name={STAT_CARDS[0].icon}
              size={24}
              color={colors[STAT_CARDS[0].color] || colors.primary}
            />
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.totalTasks}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.onBackground + "80" }]}
            >
              {STAT_CARDS[0].label}
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
            <Ionicons
              name={STAT_CARDS[1].icon}
              size={24}
              color={colors[STAT_CARDS[1].color] || colors.primary}
            />
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {stats.completedTasks}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.onBackground + "80" }]}
            >
              {STAT_CARDS[1].label}
            </Text>
          </View>
        </View>

        <View style={styles.tasksContainer}>
          <SectionHeader
            title="모든 작업"
            onAddPress={() => setIsAddModalVisible(true)}
          />

          {(filteredTasks || []).length > 0 ? (
            (filteredTasks || []).map((task) => (
              <CleaningTaskItem
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                showCompleteButton={false}
                showCheckbox={false}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons
                  name="list-outline"
                  size={48}
                  color={colors.onBackground + "40"}
                />
              </View>
              <Text
                style={[styles.emptyStateTitle, { color: colors.onBackground }]}
              >
                아직 작업이 없어요! 📝
              </Text>
              <View>
                <Text
                  style={[
                    styles.emptyStateDescription,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  첫 번째 가사 작업을 추가해보세요.
                </Text>
                <Text
                  style={[
                    styles.emptyStateDescription,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  정기적인 가사 습관을 만들어보세요.
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.emptyStateButton,
                  {
                    backgroundColor: colors.primary + "20",
                    borderColor: colors.primary + "30",
                  },
                ]}
                onPress={() => setIsAddModalVisible(true)}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
                <Text
                  style={[
                    styles.emptyStateButtonText,
                    { color: colors.primary },
                  ]}
                >
                  첫 번째 작업 추가하기
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddTask={handleAddTaskAndClose}
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginRight: 10,
  },
  filterText: {
    ...TYPOGRAPHY.body2,
    fontSize: 15,
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
  tasksContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    marginBottom: 4,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    marginTop: 16,
  },
  emptyStateButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TaskManagementScreen;
