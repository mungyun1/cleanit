import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CleaningTask, FrequencySettings } from "../types";
import { COLORS, TYPOGRAPHY } from "../constants";
import TaskDetailModal from "./TaskDetailModal";

interface CleaningTaskItemProps {
  task: CleaningTask;
  onPress?: () => void;
  onToggle?: () => void;
  onEdit?: (taskId: string) => void;
  onUpdateTask?: (updatedTask: CleaningTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

const CleaningTaskItem: React.FC<CleaningTaskItemProps> = ({
  task,
  onPress,
  onToggle,
  onEdit,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const getFrequencyText = (frequency: FrequencySettings) => {
    const dayNames = {
      monday: "월요일",
      tuesday: "화요일",
      wednesday: "수요일",
      thursday: "목요일",
      friday: "금요일",
      saturday: "토요일",
      sunday: "일요일",
    };

    switch (frequency.type) {
      case "daily":
        return "매일";
      case "weekly":
        if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
          const dayLabels = frequency.daysOfWeek
            .map((day) => dayNames[day])
            .join(", ");
          return `매주 ${dayLabels}`;
        }
        return "매주";
      case "biweekly":
        if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
          const dayLabels = frequency.daysOfWeek
            .map((day) => dayNames[day])
            .join(", ");
          return `격주 ${dayLabels}`;
        }
        return "격주";
      case "monthly":
        return "월 1회";
      case "custom":
        return frequency.customDays
          ? `${frequency.customDays}일마다`
          : "사용자 정의";
      default:
        return "알 수 없음";
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
      case "화장실":
        return COLORS.toilet;
      case "침실":
        return COLORS.bedroom;
      default:
        return COLORS.common;
    }
  };

  const handleItemPress = () => {
    setIsModalVisible(true);
    if (onPress) onPress();
  };

  const handleToggleComplete = () => {
    if (onToggle) onToggle();
  };

  const handleEdit = () => {
    setIsModalVisible(false);
    if (onEdit) onEdit(task.id);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, task.isCompleted && styles.completed]}
        onPress={handleItemPress}
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
            <TouchableOpacity
              onPress={handleToggleComplete}
              style={styles.checkbox}
            >
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
          </View>
        </View>
      </TouchableOpacity>

      <TaskDetailModal
        task={task}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </>
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
