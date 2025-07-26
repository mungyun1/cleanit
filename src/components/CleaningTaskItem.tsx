import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HouseholdTask } from "../types";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import TaskDetailModal from "./TaskDetailModal";
import TaskCategoryIcon from "./TaskCategoryIcon";
import TaskTag from "./TaskTag";
import {
  getFrequencyText,
  generateDescriptionFromChecklist,
} from "../utils/taskItemUtils";

interface CleaningTaskItemProps {
  task: HouseholdTask;
  onPress?: () => void;
  onToggle?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onUpdateTask?: (updatedTask: HouseholdTask) => void;
  onDeleteTask?: (taskId: string) => void;
  showCompleteButton?: boolean;
  showCheckbox?: boolean;
}

const CleaningTaskItem: React.FC<CleaningTaskItemProps> = ({
  task,
  onPress,
  onToggle,
  onEdit,
  onUpdateTask,
  onDeleteTask,
  showCompleteButton = true,
  showCheckbox = true,
}) => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleItemPress = () => {
    setIsModalVisible(true);
    if (onPress) onPress();
  };

  const handleToggleComplete = () => {
    if (onToggle) {
      onToggle(task.id);
    }
  };

  const handleEdit = () => {
    setIsModalVisible(false);
    if (onEdit) onEdit(task.id);
  };

  // 체크리스트 description 생성
  const displayDescription =
    task.description || generateDescriptionFromChecklist(task.checklistItems);

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
                <TaskCategoryIcon category={task.category} />
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
              <TaskTag task={task} />
            </View>
          </View>

          {displayDescription && (
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
              {displayDescription}
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
        onEdit={handleEdit}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        showCompleteButton={showCompleteButton}
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
