import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CleaningTask, Space } from "../types";
import { COLORS } from "../constants";

interface TaskItemProps {
  task: CleaningTask;
  space: Space;
  onToggleComplete: (taskId: string) => void;
  onPress: (task: CleaningTask) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  space,
  onToggleComplete,
  onPress,
}) => (
  <TouchableOpacity style={styles.container} onPress={() => onPress(task)}>
    <View style={[styles.spaceIndicator, { backgroundColor: space.color }]}>
      <Ionicons name={space.icon as any} size={16} color="white" />
    </View>
    <View style={styles.info}>
      <Text style={styles.title}>{task.title}</Text>
      {task.description && <Text style={styles.desc}>{task.description}</Text>}
    </View>
    <TouchableOpacity onPress={() => onToggleComplete(task.id)}>
      <Ionicons
        name={task.isCompleted ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={COLORS.primary}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginVertical: 4,
  },
  spaceIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", color: COLORS.onSurface },
  desc: { fontSize: 13, color: COLORS.onSurface, opacity: 0.7 },
});

export default TaskItem;
