import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";

interface SectionHeaderProps {
  title: string;
  onAddPress: () => void;
  showAddButton?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onAddPress,
  showAddButton = true,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
        {title}
      </Text>
      {showAddButton && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary + "20" }]}
          onPress={onAddPress}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
});

export default SectionHeader;
