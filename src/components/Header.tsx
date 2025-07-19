import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  title: string;
  showMenuButton?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.onBackground }]}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: 16,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
});

export default Header;
