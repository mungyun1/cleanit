import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS, TYPOGRAPHY } from "../constants";
import CleaningTaskItem from "../components/CleaningTaskItem";
import Header from "../components/Header";
import { CleaningTask } from "../types";

const HomeScreen: React.FC = () => {
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

  const handleUpdateTask = (updatedTask: CleaningTask) => {
    setTodayTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTodayTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  // 임시 데이터
  const [todayTasks, setTodayTasks] = useState<CleaningTask[]>([
    {
      id: "1",
      title: "거실 청소",
      description: "바닥 쓸기, 먼지 털기",
      space: "거실",
      frequency: "daily" as const,
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
      space: "주방",
      frequency: "daily" as const,
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
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="🏠 청소 체크리스트" subtitle="체크리스트를 확인하세요" />

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
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>오늘 할 일</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>완료</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>남은 일</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 작업</Text>
          {todayTasks.map((task) => (
            <CleaningTaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleTask(task.id)}
              onEdit={handleEditTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 새 작업 추가</Text>
        </TouchableOpacity>
      </ScrollView>
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
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
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
});

export default HomeScreen;
