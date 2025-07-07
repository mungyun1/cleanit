import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HouseholdTask, FrequencySettings } from "../types";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import TaskDetailModal from "./TaskDetailModal";

interface CleaningTaskItemProps {
  task: HouseholdTask;
  onPress?: () => void;
  onToggle?: () => void;
  onEdit?: (taskId: string) => void;
  onUpdateTask?: (updatedTask: HouseholdTask) => void;
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
  const { colors } = useTheme();
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
        return colors.livingRoom;
      case "주방":
        return colors.kitchen;
      case "욕실":
        return colors.bathroom;
      case "화장실":
        return colors.toilet;
      case "침실":
        return colors.bedroom;
      default:
        return colors.common;
    }
  };

  const getLaundryTypeColor = (laundryType: string) => {
    switch (laundryType) {
      case "whites":
        return "#E3F2FD"; // 연한 파란색
      case "colors":
        return "#F3E5F5"; // 연한 보라색
      case "delicates":
        return "#FFF3E0"; // 연한 주황색
      case "bedding":
        return "#E8F5E8"; // 연한 초록색
      case "towels":
        return "#FCE4EC"; // 연한 분홍색
      default:
        return colors.common;
    }
  };

  const getLaundryTypeText = (laundryType: string) => {
    switch (laundryType) {
      case "whites":
        return "흰 옷";
      case "colors":
        return "색 옷";
      case "delicates":
        return "섬세한 옷";
      case "bedding":
        return "침구";
      case "towels":
        return "수건";
      default:
        return laundryType;
    }
  };

  const getCategoryIcon = () => {
    if (task.category === "laundry") {
      return <Ionicons name="shirt" size={16} color={colors.secondary} />;
    }
    return <Ionicons name="brush" size={16} color={colors.primary} />;
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
        style={[
          styles.container,
          { backgroundColor: colors.surface, shadowColor: colors.onBackground },
          task.isCompleted && styles.completed,
        ]}
        onPress={handleItemPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                {getCategoryIcon()}
                <Text
                  style={[
                    styles.title,
                    { color: colors.onBackground },
                    task.isCompleted && [
                      styles.completedText,
                      { color: colors.onBackground + "60" },
                    ],
                  ]}
                >
                  {task.title}
                </Text>
              </View>
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor:
                      task.category === "cleaning"
                        ? getSpaceColor(task.space || "")
                        : getLaundryTypeColor(task.laundryType || ""),
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.onBackground }]}>
                  {task.category === "cleaning"
                    ? task.space
                    : getLaundryTypeText(task.laundryType || "")}
                </Text>
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
                  task.isCompleted ? colors.primary : colors.onBackground + "60"
                }
              />
            </TouchableOpacity>
          </View>

          {task.description && (
            <Text
              style={[
                styles.description,
                { color: colors.onBackground + "80" },
                task.isCompleted && [
                  styles.completedText,
                  { color: colors.onBackground + "60" },
                ],
              ]}
            >
              {task.description}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.frequency, { color: colors.primary }]}>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h4,
    marginLeft: 6,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
  checkbox: {
    padding: 4,
  },
  description: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frequency: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
  lastCompleted: {
    ...TYPOGRAPHY.caption,
  },
});

export default CleaningTaskItem;
