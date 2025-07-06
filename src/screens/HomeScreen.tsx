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

const HomeScreen: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
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

  const handleToggleTask = (taskId: string) => {
    setTodayTasks((prevTasks) =>
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

  const handleUpdateTask = (updatedTask: HouseholdTask) => {
    setTodayTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTodayTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  const handleAddTask = (newTask: HouseholdTask) => {
    setTodayTasks((prevTasks) => [...prevTasks, newTask]);
    setIsAddModalVisible(false);
  };

  // 임시 데이터 (청소 + 빨래)
  const [todayTasks, setTodayTasks] = useState<HouseholdTask[]>([
    {
      id: "1",
      title: "거실 청소",
      description: "바닥 쓸기, 먼지 털기",
      category: "cleaning",
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
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "주방 정리",
      description: "설거지, 주방 정리",
      category: "cleaning",
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
      title: "흰 옷 빨래",
      description: "흰색 옷들 세탁하기",
      category: "laundry",
      laundryType: "whites",
      frequency: { type: "weekly" },
      isCompleted: false,
      checklistItems: [
        {
          id: "3-1",
          title: "흰 옷 분류하기",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3-2",
          title: "세제 넣고 세탁",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3-3",
          title: "건조기 돌리기",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "침구 세탁",
      description: "침대 시트, 이불 세탁",
      category: "laundry",
      laundryType: "bedding",
      frequency: { type: "biweekly" },
      isCompleted: true,
      checklistItems: [
        {
          id: "4-1",
          title: "침구 분리하기",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "4-2",
          title: "세탁 및 건조",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // 통계 계산
  const getStats = () => {
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
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="🏠 가사 관리" subtitle="청소와 빨래를 체크하세요" />

        {/* 오늘 날짜 표시 */}
        <View style={styles.dateContainer}>
          <View style={styles.dateCard}>
            <View style={styles.calendarBody}>
              <View style={styles.dateCircle}>
                <Text style={styles.dateNumber}>{todayInfo.date}</Text>
                <Text style={styles.dayText}>{todayInfo.dayName}</Text>
              </View>
              <View style={styles.dateInfo}>
                <Text style={styles.fullDate}>{todayInfo.fullDate}</Text>
                <Text style={styles.todayLabel}>오늘</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>전체</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>완료</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.remaining}</Text>
            <Text style={styles.statLabel}>남은 일</Text>
          </View>
        </View>

        <View style={styles.categoryStatsContainer}>
          <View style={styles.categoryStatCard}>
            <View style={styles.categoryIcon}>
              <Ionicons name="brush" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.categoryStatNumber}>{stats.cleaning}</Text>
            <Text style={styles.categoryStatLabel}>청소</Text>
          </View>
          <View style={styles.categoryStatCard}>
            <View style={styles.categoryIcon}>
              <Ionicons name="shirt" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.categoryStatNumber}>{stats.laundry}</Text>
            <Text style={styles.categoryStatLabel}>빨래</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 가사</Text>
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
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
                  name="checkmark-circle-outline"
                  size={48}
                  color={COLORS.onBackground + "40"}
                />
              </View>
              <Text style={styles.emptyStateTitle}>
                예정된 작업이 없습니다🧹
              </Text>
              <Text style={styles.emptyStateDescription}>
                새로운 청소나 빨래 작업을 추가해보세요.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ 새 작업 추가</Text>
        </TouchableOpacity>
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
  dateContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  dateCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "10",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.onBackground + "20",
  },
  monthText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    fontWeight: "700",
  },
  yearText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground + "70",
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
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dateNumber: {
    ...TYPOGRAPHY.h1,
    color: COLORS.onPrimary,
    fontWeight: "700",
    fontSize: 28,
  },
  dayText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary + "90",
    fontSize: 12,
    fontWeight: "500",
    marginTop: -2,
  },
  dateInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  fullDate: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
    marginBottom: 5,
    fontWeight: "600",
  },
  todayLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
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
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground + "80",
  },
  categoryStatsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryStatCard: {
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
  categoryIcon: {
    marginBottom: 8,
  },
  categoryStatNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
    marginBottom: 3,
    fontWeight: "600",
  },
  categoryStatLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground + "80",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
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

export default HomeScreen;
