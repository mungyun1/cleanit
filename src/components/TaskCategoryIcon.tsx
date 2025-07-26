import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface TaskCategoryIconProps {
  category: string;
  size?: number;
}

const TaskCategoryIcon: React.FC<TaskCategoryIconProps> = ({
  category,
  size = 16,
}) => {
  const { colors } = useTheme();

  const getCategoryIcon = () => {
    if (category === "laundry") {
      return <Ionicons name="shirt" size={size} color={colors.secondary} />;
    }
    return <Ionicons name="brush" size={size} color={colors.primary} />;
  };

  return getCategoryIcon();
};

export default TaskCategoryIcon;
