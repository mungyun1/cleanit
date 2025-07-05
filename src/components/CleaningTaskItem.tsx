import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CleaningTask } from "../types";
import { COLORS, TYPOGRAPHY } from "../constants";

interface CleaningTaskItemProps {
  task: CleaningTask;
  onPress?: () => void;
  onToggle?: () => void;
}

const CleaningTaskItem: React.FC<CleaningTaskItemProps> = ({
  task,
  onPress,
  onToggle,
}) => {
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "매일";
      case "weekly":
        return "매주";
      case "biweekly":
        return "격주";
      case "monthly":
        return "월 1회";
      case "custom":
        return "사용자 정의";
      default:
        return frequency;
    }
  };

  const getSpaceColor = (space: string) => {
    switch (space) {
      case "거실":
        return COLORS.livingRoom;
      case "주방":
        return COLORS.kitchen;
      case "욕실":
        return COLORS.bathroom;
      case "방":
        return COLORS.bedroom;
      default:
        return COLORS.common;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, task.isCompleted && styles.completed]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, task.isCompleted && styles.completedText]}
            >
              {task.title}
            </Text>
            <View
              style={[
                styles.spaceTag,
                { backgroundColor: getSpaceColor(task.space) },
              ]}
            >
              <Text style={styles.spaceText}>{task.space}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
            <Ionicons
              name={task.isCompleted ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={
                task.isCompleted ? COLORS.primary : COLORS.onBackground + "60"
              }
            />
          </TouchableOpacity>
        </View>

        {task.description && (
          <Text
            style={[
              styles.description,
              task.isCompleted && styles.completedText,
            ]}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.frequency}>
            {getFrequencyText(task.frequency)}
          </Text>
          {task.lastCompleted && (
            <Text style={styles.lastCompleted}>
              마지막 완료: {task.lastCompleted.toLocaleDateString("ko-KR")}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completed: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onBackground,
    marginRight: 8,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: COLORS.onBackground + "60",
  },
  spaceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spaceText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  checkbox: {
    padding: 4,
  },
  description: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frequency: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },
  lastCompleted: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground + "60",
  },
});

export default CleaningTaskItem;
