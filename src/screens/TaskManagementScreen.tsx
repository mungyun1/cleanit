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
import { useTaskManagement } from "../hooks/useTaskManagement";
import {
  FILTER_OPTIONS,
  SPACES_FOR_FILTER,
  STAT_CARDS,
} from "../data/taskManagementData";

const TaskManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const {
    tasks,
    stats,
    selectedFilter,
    handleToggleTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAddTask,
    handleFilterChange,
  } = useTaskManagement();

  const handleEditTask = (taskId: string) => {
    // navigation.navigate("EditTask", { taskId });
  };

  const handleAddTaskAndClose = (newTask: HouseholdTask) => {
    handleAddTask(newTask);
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

          {tasks.length > 0 ? (
            tasks.map((task) => (
              <CleaningTaskItem
                key={task.id}
                task={task}
                onToggle={() => handleToggleTask(task.id)}
                onEdit={handleEditTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
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
    backgroundColor: undefined,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: undefined,
    marginTop: 16,
  },
  emptyStateButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TaskManagementScreen;
