import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY } from "../constants";
import CleaningTaskItem from "../components/CleaningTaskItem";
import Header from "../components/Header";
import AddTaskModal from "../components/AddTaskModal";
import { HouseholdTask } from "../types";
import { useNavigation } from "@react-navigation/native";
import { useTaskManagement } from "../hooks/useTaskManagement";
import {
  FILTER_OPTIONS,
  SPACES_FOR_FILTER,
  STAT_CARDS,
} from "../data/taskManagementData";

const TaskManagementScreen: React.FC = () => {
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
    console.log("편집할 작업 ID:", taskId);
    // navigation.navigate("EditTask", { taskId });
  };

  const handleAddTaskAndClose = (newTask: HouseholdTask) => {
    handleAddTask(newTask);
    setIsAddModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="📋 작업 관리"
          subtitle="모든 청소 작업을 관리하세요"
          showMenuButton={true}
          onMenuPress={() => console.log("메뉴 버튼 클릭")}
        />
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === FILTER_OPTIONS.ALL && styles.activeFilter,
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.ALL)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === FILTER_OPTIONS.ALL &&
                    styles.activeFilterText,
                ]}
              >
                {FILTER_OPTIONS.ALL}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === FILTER_OPTIONS.CLEANING &&
                  styles.activeFilter,
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.CLEANING)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === FILTER_OPTIONS.CLEANING &&
                    styles.activeFilterText,
                ]}
              >
                {FILTER_OPTIONS.CLEANING}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === FILTER_OPTIONS.LAUNDRY &&
                  styles.activeFilter,
              ]}
              onPress={() => handleFilterChange(FILTER_OPTIONS.LAUNDRY)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === FILTER_OPTIONS.LAUNDRY &&
                    styles.activeFilterText,
                ]}
              >
                {FILTER_OPTIONS.LAUNDRY}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons
              name={STAT_CARDS[0].icon}
              size={24}
              color={COLORS[STAT_CARDS[0].color]}
            />
            <Text style={styles.statNumber}>{stats.totalTasks}</Text>
            <Text style={styles.statLabel}>{STAT_CARDS[0].label}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name={STAT_CARDS[1].icon}
              size={24}
              color={COLORS[STAT_CARDS[1].color]}
            />
            <Text style={styles.statNumber}>{stats.completedTasks}</Text>
            <Text style={styles.statLabel}>{STAT_CARDS[1].label}</Text>
          </View>
        </View>

        <View style={styles.tasksContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>모든 작업</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

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
                  color={COLORS.onBackground + "40"}
                />
              </View>
              <Text style={styles.emptyStateTitle}>아직 작업이 없어요! 📝</Text>
              <View>
                <Text style={styles.emptyStateDescription}>
                  첫 번째 가사 작업을 추가해보세요.
                </Text>
                <Text style={styles.emptyStateDescription}>
                  정기적인 가사 습관을 만들어보세요.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setIsAddModalVisible(true)}
              >
                <Ionicons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.emptyStateButtonText}>
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
    backgroundColor: COLORS.background,
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
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.onBackground,
    marginBottom: 5,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  filterButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
  },
  activeFilterText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 15,
    marginHorizontal: 5,
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
    color: COLORS.onBackground,
    marginTop: 5,
    marginBottom: 5,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground + "80",
  },
  tasksContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
  },
  addButton: {
    backgroundColor: COLORS.primary + "20",
    padding: 8,
    borderRadius: 20,
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
    color: COLORS.onBackground,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "60",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  emptyStateButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TaskManagementScreen;
