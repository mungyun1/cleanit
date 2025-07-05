import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../constants";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showMenuButton?: boolean;
  showBackButton?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingTop: 16,
    paddingBottom: 12,
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
    color: COLORS.onBackground,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "70",
    marginTop: 4,
    fontSize: 16,
    fontWeight: "400",
  },
});

export default Header;
