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
import { CleaningTask } from "../types";
import { useNavigation } from "@react-navigation/native";

const TaskManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 임시 데이터
  const [allTasks, setAllTasks] = useState<CleaningTask[]>([
    {
      id: "1",
      title: "거실 청소",
      description: "바닥 쓸기, 먼지 털기",
      space: "거실",
      frequency: { type: "daily" },
      isCompleted: false,
      checklistItems: [
        {
          id: "1-1",
          title: "바닥 쓸기",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "1-2",
          title: "먼지 털기",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "1-3",
          title: "가구 정리",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "주방 정리",
      description: "설거지, 주방 정리",
      space: "주방",
      frequency: { type: "daily" },
      isCompleted: true,
      checklistItems: [
        {
          id: "2-1",
          title: "설거지",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2-2",
          title: "주방 카운터 정리",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "욕실 청소",
      description: "변기, 세면대, 샤워기 청소",
      space: "욕실",
      frequency: { type: "weekly", daysOfWeek: ["monday"] },
      isCompleted: false,
      checklistItems: [
        {
          id: "3-1",
          title: "변기 청소",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3-2",
          title: "세면대 청소",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3-3",
          title: "샤워기 청소",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const getTasksBySpace = (space: string) => {
    return allTasks.filter((task) => task.space === space);
  };

  const spaces = ["거실", "주방", "욕실", "화장실", "침실"];

  const handleToggleTask = (taskId: string) => {
    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              lastCompleted: !task.isCompleted ? new Date() : undefined,
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  const handleEditTask = (taskId: string) => {
    console.log("편집할 작업 ID:", taskId);
    // navigation.navigate("EditTask", { taskId });
  };

  const handleUpdateTask = (updatedTask: CleaningTask) => {
    setAllTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleAddTask = (newTask: CleaningTask) => {
    setAllTasks((prevTasks) => [...prevTasks, newTask]);
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
              style={[styles.filterButton, styles.activeFilter]}
            >
              <Text style={[styles.filterText, styles.activeFilterText]}>
                전체
              </Text>
            </TouchableOpacity>
            {spaces.map((space) => (
              <TouchableOpacity key={space} style={styles.filterButton}>
                <Text style={styles.filterText}>{space}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="list" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{allTasks.length}</Text>
            <Text style={styles.statLabel}>전체 작업</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.secondary}
            />
            <Text style={styles.statNumber}>
              {allTasks.filter((task) => task.isCompleted).length}
            </Text>
            <Text style={styles.statLabel}>완료된 작업</Text>
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

          {allTasks.length > 0 ? (
            allTasks.map((task) => (
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
              <Text style={styles.emptyStateTitle}>
                아직 청소 작업이 없어요! 📝
              </Text>
              <Text style={styles.emptyStateDescription}>
                첫 번째 청소 작업을 추가해보세요.{"\n"}
                정기적인 청소 습관을 만들어보세요.
              </Text>
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
        onAddTask={handleAddTask}
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
