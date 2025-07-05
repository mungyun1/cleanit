import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, TYPOGRAPHY } from "../constants";
import CleaningTaskItem from "../components/CleaningTaskItem";

const HomeScreen: React.FC = () => {
  // 임시 데이터
  const todayTasks = [
    {
      id: "1",
      title: "거실 청소",
      description: "바닥 쓸기, 먼지 털기",
      space: "거실",
      frequency: "daily" as const,
      isCompleted: false,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>오늘의 청소</Text>
          <Text style={styles.subtitle}>2024년 1월 15일</Text>
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
            <CleaningTaskItem key={task.id} task={task} />
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 새 작업 추가</Text>
        </TouchableOpacity>
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
