import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HouseholdTask, ChecklistItem, FrequencySettings } from "../types";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import {
  SPACES,
  LAUNDRY_TYPES,
  FREQUENCIES,
  DAYS_OF_WEEK,
} from "../data/taskFormData";
import {
  createChecklistItem,
  getCleaningChecklistTemplate,
  getLaundryChecklistTemplate,
  generateAutoTitle,
  isDefaultTitle,
  toggleDayOfWeek,
  validateTaskForm,
} from "../utils/taskFormUtils";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: HouseholdTask) => void;
}

const { width, height } = Dimensions.get("window");

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
}) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "cleaning" | "laundry"
  >("cleaning");
  const [selectedSpace, setSelectedSpace] = useState("");
  const [selectedLaundryType, setSelectedLaundryType] = useState<
    "whites" | "colors" | "delicates" | "bedding" | "towels" | undefined
  >(undefined);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencySettings>(
    {
      type: undefined,
      daysOfWeek: [],
    }
  );
  const [customSpace, setCustomSpace] = useState("");
  const [isAddingCustomSpace, setIsAddingCustomSpace] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);

  // 카테고리나 공간/빨래 타입 선택 시 기본 체크리스트 템플릿 적용 및 제목 자동 완성
  useEffect(() => {
    if (selectedCategory === "cleaning" && selectedSpace) {
      // 제목 자동 완성 (기존 제목이 비어있거나 기본 제목인 경우에만)
      if (isDefaultTitle(title, "cleaning")) {
        setTitle(generateAutoTitle("cleaning", selectedSpace));
      }

      // 기본 체크리스트 템플릿 적용
      const newChecklistItems = getCleaningChecklistTemplate(selectedSpace);
      setChecklistItems(newChecklistItems);
    } else if (selectedCategory === "laundry" && selectedLaundryType) {
      // 빨래 타입에 따른 제목 자동 완성
      const laundryTypeText = LAUNDRY_TYPES.find(
        (lt) => lt.value === selectedLaundryType
      )?.label;
      if (isDefaultTitle(title, "laundry")) {
        setTitle(
          generateAutoTitle(
            "laundry",
            undefined,
            selectedLaundryType,
            laundryTypeText
          )
        );
      }

      // 빨래 기본 체크리스트 템플릿 적용
      const newChecklistItems =
        getLaundryChecklistTemplate(selectedLaundryType);
      setChecklistItems(newChecklistItems);
    }
  }, [selectedCategory, selectedSpace, selectedLaundryType]);

  const handleAddCustomSpace = () => {
    if (!customSpace.trim()) return;

    if (SPACES.includes(customSpace.trim())) {
      Alert.alert("오류", "이미 존재하는 공간입니다.");
      return;
    }

    setSelectedSpace(customSpace.trim());
    setCustomSpace("");
    setIsAddingCustomSpace(false);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem = createChecklistItem(newChecklistItem);

    setChecklistItems([...checklistItems, newItem]);
    setNewChecklistItem("");
    setIsAddingChecklistItem(false);
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== itemId));
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId
          ? { ...item, isCompleted: !item.isCompleted, updatedAt: new Date() }
          : item
      )
    );
  };

  const handleSaveTask = () => {
    const validation = validateTaskForm(
      title,
      selectedCategory,
      selectedSpace,
      selectedLaundryType,
      selectedFrequency
    );

    if (!validation.isValid) {
      Alert.alert("오류", validation.errorMessage);
      return;
    }

    const newTask: HouseholdTask = {
      id: Date.now().toString(),
      title: title.trim(),
      category: selectedCategory,
      space: selectedCategory === "cleaning" ? selectedSpace : undefined,
      laundryType:
        selectedCategory === "laundry" ? selectedLaundryType : undefined,
      frequency: selectedFrequency,
      isCompleted: false,
      checklistItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddTask(newTask);
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setSelectedCategory("cleaning");
    setSelectedSpace("");
    setSelectedLaundryType(undefined);
    setSelectedFrequency({
      type: undefined,
      daysOfWeek: [],
    });
    setCustomSpace("");
    setIsAddingCustomSpace(false);
    setChecklistItems([]);
    setNewChecklistItem("");
    setIsAddingChecklistItem(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // 모달이 닫힐 때마다 상태 초기화
  useEffect(() => {
    if (!visible) {
      handleReset();
    }
  }, [visible]);

  const isFormValid = () => {
    const validation = validateTaskForm(
      title,
      selectedCategory,
      selectedSpace,
      selectedLaundryType,
      selectedFrequency
    );
    return validation.isValid;
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.onBackground + "20" },
            ]}
          >
            <View style={styles.headerTop}>
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: colors.onBackground + "30" },
                ]}
              />
            </View>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.onBackground} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.onBackground }]}>
                새 작업 추가
              </Text>
              <TouchableOpacity
                onPress={handleSaveTask}
                style={[
                  styles.saveButton,
                  { backgroundColor: colors.primary },
                  !isFormValid() && [
                    styles.saveButtonDisabled,
                    { backgroundColor: colors.onBackground + "30" },
                  ],
                ]}
                disabled={!isFormValid()}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: colors.onPrimary },
                    !isFormValid() && [
                      styles.saveButtonTextDisabled,
                      { color: colors.onBackground + "60" },
                    ],
                  ]}
                >
                  저장
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 카테고리 선택 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                카테고리
              </Text>
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: colors.onBackground + "20",
                      backgroundColor: colors.surface,
                    },
                    selectedCategory === "cleaning" && [
                      styles.categoryButtonSelected,
                      {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary,
                      },
                    ],
                  ]}
                  onPress={() => setSelectedCategory("cleaning")}
                >
                  <Ionicons
                    name="brush"
                    size={20}
                    color={
                      selectedCategory === "cleaning"
                        ? colors.onPrimary
                        : colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.onBackground },
                      selectedCategory === "cleaning" && [
                        styles.categoryButtonTextSelected,
                        { color: colors.onPrimary },
                      ],
                    ]}
                  >
                    청소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: colors.onBackground + "20",
                      backgroundColor: colors.surface,
                    },
                    selectedCategory === "laundry" && [
                      styles.categoryButtonSelected,
                      {
                        borderColor: colors.secondary,
                        backgroundColor: colors.secondary,
                      },
                    ],
                  ]}
                  onPress={() => setSelectedCategory("laundry")}
                >
                  <Ionicons
                    name="shirt"
                    size={20}
                    color={
                      selectedCategory === "laundry"
                        ? colors.onPrimary
                        : colors.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.onBackground },
                      selectedCategory === "laundry" && [
                        styles.categoryButtonTextSelected,
                        { color: colors.onPrimary },
                      ],
                    ]}
                  >
                    빨래
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 제목 입력 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                작업 제목
              </Text>
              <TextInput
                style={[
                  styles.titleInput,
                  {
                    borderColor: colors.onBackground + "30",
                    color: colors.onBackground,
                  },
                ]}
                placeholder="작업 제목을 입력하세요"
                placeholderTextColor={colors.onBackground + "60"}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            {/* 공간/빨래 타입 선택 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                {selectedCategory === "cleaning" ? "공간" : "빨래 타입"}
              </Text>

              {selectedCategory === "cleaning" ? (
                <View style={styles.optionsContainer}>
                  {SPACES.map((space) => (
                    <TouchableOpacity
                      key={space}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: colors.onBackground + "30",
                          backgroundColor: colors.surface,
                        },
                        selectedSpace === space && [
                          styles.optionButtonSelected,
                          {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          },
                        ],
                      ]}
                      onPress={() => setSelectedSpace(space)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          { color: colors.onBackground },
                          selectedSpace === space && [
                            styles.optionButtonTextSelected,
                            { color: colors.onPrimary },
                          ],
                        ]}
                      >
                        {space}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {isAddingCustomSpace ? (
                    <View style={styles.customInputContainer}>
                      <TextInput
                        style={[
                          styles.customInput,
                          {
                            borderColor: colors.onBackground + "30",
                            color: colors.onBackground,
                          },
                        ]}
                        placeholder="공간 이름 입력"
                        placeholderTextColor={colors.onBackground + "60"}
                        value={customSpace}
                        onChangeText={setCustomSpace}
                        onSubmitEditing={handleAddCustomSpace}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={handleAddCustomSpace}
                        style={[
                          styles.customInputButton,
                          { backgroundColor: colors.primary + "20" },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.addCustomButton,
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary + "10",
                        },
                      ]}
                      onPress={() => setIsAddingCustomSpace(true)}
                    >
                      <Ionicons name="add" size={20} color={colors.primary} />
                      <Text
                        style={[
                          styles.addCustomButtonText,
                          { color: colors.primary },
                        ]}
                      >
                        직접 입력
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  {LAUNDRY_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: colors.onBackground + "30",
                          backgroundColor: colors.surface,
                        },
                        selectedLaundryType === type.value && [
                          styles.optionButtonSelected,
                          {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          },
                        ],
                      ]}
                      onPress={() =>
                        setSelectedLaundryType(
                          type.value as
                            | "whites"
                            | "colors"
                            | "delicates"
                            | "bedding"
                            | "towels"
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          { color: colors.onBackground },
                          selectedLaundryType === type.value && [
                            styles.optionButtonTextSelected,
                            { color: colors.onPrimary },
                          ],
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 주기 선택 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                주기
              </Text>
              <View style={styles.optionsContainer}>
                {FREQUENCIES.map((frequency) => (
                  <TouchableOpacity
                    key={frequency.value}
                    style={[
                      styles.optionButton,
                      {
                        borderColor: colors.onBackground + "30",
                        backgroundColor: colors.surface,
                      },
                      selectedFrequency.type === frequency.value && [
                        styles.optionButtonSelected,
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary,
                        },
                      ],
                    ]}
                    onPress={() =>
                      setSelectedFrequency({
                        type: frequency.value,
                        daysOfWeek: [],
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        { color: colors.onBackground },
                        selectedFrequency.type === frequency.value && [
                          styles.optionButtonTextSelected,
                          { color: colors.onPrimary },
                        ],
                      ]}
                    >
                      {frequency.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 요일 선택 (weekly, biweekly일 때) */}
              {(selectedFrequency.type === "weekly" ||
                selectedFrequency.type === "biweekly") && (
                <View style={styles.daysContainer}>
                  <Text
                    style={[styles.daysTitle, { color: colors.onBackground }]}
                  >
                    요일 선택
                  </Text>
                  <View style={styles.daysGrid}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.dayButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedFrequency.daysOfWeek?.includes(day.value) && [
                            styles.dayButtonSelected,
                            {
                              borderColor: colors.primary,
                              backgroundColor: colors.primary,
                            },
                          ],
                        ]}
                        onPress={() => {
                          const currentDays =
                            selectedFrequency.daysOfWeek || [];
                          const newDays = toggleDayOfWeek(
                            currentDays,
                            day.value
                          );
                          setSelectedFrequency({
                            ...selectedFrequency,
                            daysOfWeek: newDays,
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            { color: colors.onBackground },
                            selectedFrequency.daysOfWeek?.includes(
                              day.value
                            ) && [
                              styles.dayButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 사용자 정의 일수 입력 */}
              {selectedFrequency.type === "custom" && (
                <View style={styles.customDaysContainer}>
                  <Text
                    style={[
                      styles.customDaysTitle,
                      { color: colors.onBackground },
                    ]}
                  >
                    일수 입력
                  </Text>
                  <TextInput
                    style={[
                      styles.customDaysInput,
                      {
                        borderColor: colors.onBackground + "30",
                        color: colors.onBackground,
                      },
                    ]}
                    placeholder="예: 3 (3일마다)"
                    placeholderTextColor={colors.onBackground + "60"}
                    keyboardType="numeric"
                    value={selectedFrequency.customDays?.toString() || ""}
                    onChangeText={(text) =>
                      setSelectedFrequency({
                        ...selectedFrequency,
                        customDays: parseInt(text) || undefined,
                      })
                    }
                  />
                </View>
              )}
            </View>

            {/* 체크리스트 */}
            <View style={styles.section}>
              <View style={styles.checklistHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.onBackground }]}
                >
                  체크리스트
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setIsAddingChecklistItem(!isAddingChecklistItem)
                  }
                  style={styles.addChecklistButton}
                >
                  <Ionicons
                    name={isAddingChecklistItem ? "remove" : "add"}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {isAddingChecklistItem && (
                <View style={styles.addChecklistContainer}>
                  <TextInput
                    style={[
                      styles.checklistInput,
                      {
                        borderColor: colors.onBackground + "30",
                        color: colors.onBackground,
                      },
                    ]}
                    placeholder="체크리스트 항목 추가"
                    placeholderTextColor={colors.onBackground + "60"}
                    value={newChecklistItem}
                    onChangeText={setNewChecklistItem}
                    onSubmitEditing={handleAddChecklistItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddChecklistItem}
                    style={[
                      styles.addChecklistConfirmButton,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {checklistItems.length > 0 ? (
                checklistItems.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.checklistItem,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleToggleChecklistItem(item.id)}
                      style={styles.checklistCheckbox}
                    >
                      <Ionicons
                        name={
                          item.isCompleted
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={20}
                        color={
                          item.isCompleted
                            ? colors.primary
                            : colors.onBackground + "60"
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.checklistItemText,
                        { color: colors.onBackground },
                        item.isCompleted && [
                          styles.completedItemText,
                          { color: colors.onBackground + "60" },
                        ],
                      ]}
                    >
                      {item.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteChecklistItem(item.id)}
                      style={styles.deleteChecklistButton}
                    >
                      <Ionicons name="close" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text
                  style={[
                    styles.emptyChecklist,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  체크리스트 항목이 없습니다.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.5,
    flex: 1,
  },
  modalHeader: {
    borderBottomWidth: 1,
  },
  headerTop: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    // backgroundColor는 인라인으로 적용
  },
  saveButtonText: {
    ...TYPOGRAPHY.button,
  },
  saveButtonTextDisabled: {
    // color는 인라인으로 적용
  },
  modalContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: 12,
    fontWeight: "600",
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  categoryButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  categoryButtonText: {
    ...TYPOGRAPHY.body2,
    marginLeft: 8,
    fontWeight: "500",
  },
  categoryButtonTextSelected: {
    // color는 인라인으로 적용
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    ...TYPOGRAPHY.body2,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  optionButtonText: {
    ...TYPOGRAPHY.body2,
  },
  optionButtonTextSelected: {
    fontWeight: "600",
  },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    ...TYPOGRAPHY.body2,
  },
  customInputButton: {
    padding: 8,
    borderRadius: 8,
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
  daysContainer: {
    marginTop: 16,
  },
  daysTitle: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "500",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  dayButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  dayButtonText: {
    ...TYPOGRAPHY.caption,
  },
  dayButtonTextSelected: {
    fontWeight: "600",
  },
  customDaysContainer: {
    marginTop: 16,
  },
  customDaysTitle: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "500",
  },
  customDaysInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    ...TYPOGRAPHY.body2,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addChecklistButton: {
    padding: 8,
  },
  addChecklistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checklistInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    ...TYPOGRAPHY.body2,
  },
  addChecklistConfirmButton: {
    padding: 12,
    borderRadius: 8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checklistCheckbox: {
    marginRight: 12,
  },
  checklistItemText: {
    flex: 1,
    ...TYPOGRAPHY.body2,
  },
  completedItemText: {
    textDecorationLine: "line-through",
  },
  deleteChecklistButton: {
    padding: 4,
  },
  emptyChecklist: {
    ...TYPOGRAPHY.body2,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
});

export default AddTaskModal;
