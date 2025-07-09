import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";

interface CustomInputFieldProps {
  placeholder: string;
  onAdd: (value: string) => void;
  existingValues?: string[];
  errorMessage?: string;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  placeholder,
  onAdd,
  existingValues = [],
  errorMessage = "이미 존재하는 항목입니다.",
}) => {
  const { colors } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;

    if (existingValues.includes(inputValue.trim())) {
      // 에러 처리는 부모 컴포넌트에서 Alert로 처리
      return;
    }

    onAdd(inputValue.trim());
    setInputValue("");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setInputValue("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <View style={styles.customInputContainer}>
        <TextInput
          style={[
            styles.customInput,
            {
              borderColor: colors.onBackground + "30",
              color: colors.onBackground,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.onBackground + "60"}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          autoFocus
        />
        <TouchableOpacity
          onPress={handleAdd}
          style={[
            styles.customInputButton,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Ionicons name="checkmark" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          style={[
            styles.customInputButton,
            { backgroundColor: colors.error + "20" },
          ]}
        >
          <Ionicons name="close" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.addCustomButton,
        {
          borderColor: colors.primary,
          backgroundColor: colors.primary + "10",
        },
      ]}
      onPress={() => setIsAdding(true)}
    >
      <Ionicons name="add" size={20} color={colors.primary} />
      <Text style={[styles.addCustomButtonText, { color: colors.primary }]}>
        직접 입력
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    ...TYPOGRAPHY.body2,
  },
  customInputButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  addCustomButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  addCustomButtonText: {
    ...TYPOGRAPHY.body2,
    marginLeft: 4,
    fontWeight: "500",
  },
});

export default CustomInputField;
