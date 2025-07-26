import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import { getLegendColor } from "../utils/taskUtils";
import { getLaundryTypeText } from "../utils/taskItemUtils";

interface TaskTagProps {
  task: {
    category: string;
    space?: string;
    label?: string;
    laundryType?: string;
  };
}

const TaskTag: React.FC<TaskTagProps> = ({ task }) => {
  const { colors } = useTheme();

  const getTagText = () => {
    return (
      task.label ||
      (task.category === "cleaning"
        ? task.space
        : getLaundryTypeText(task.laundryType || ""))
    );
  };

  const getTagColor = () => {
    return getLegendColor(
      task.space || (task.category === "laundry" ? "빨래" : "기타")
    );
  };

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: getTagColor(),
        },
      ]}
    >
      <Text style={[styles.tagText, { color: colors.onBackground }]}>
        {getTagText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
});

export default TaskTag;
