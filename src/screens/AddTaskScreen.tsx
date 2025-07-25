import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../constants";

const AddTaskScreen = () => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.placeholderText}>청소 항목 추가 화면</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onBackground + "60",
  },
});

export default AddTaskScreen;
