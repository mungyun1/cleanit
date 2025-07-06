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
import { COLORS, TYPOGRAPHY } from "../constants";
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTop}>
              <View style={styles.dragHandle} />
            </View>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.onBackground} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>새 작업 추가</Text>
              <TouchableOpacity
                onPress={handleSaveTask}
                style={[
                  styles.saveButton,
                  !isFormValid() && styles.saveButtonDisabled,
                ]}
                disabled={!isFormValid()}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    !isFormValid() && styles.saveButtonTextDisabled,
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
              <Text style={styles.sectionTitle}>카테고리</Text>
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "cleaning" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("cleaning")}
                >
                  <Ionicons
                    name="brush"
                    size={20}
                    color={
                      selectedCategory === "cleaning"
                        ? COLORS.onPrimary
                        : COLORS.primary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "cleaning" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    청소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === "laundry" &&
                      styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory("laundry")}
                >
                  <Ionicons
                    name="shirt"
                    size={20}
                    color={
                      selectedCategory === "laundry"
                        ? COLORS.onPrimary
                        : COLORS.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === "laundry" &&
                        styles.categoryButtonTextSelected,
                    ]}
                  >
                    빨래
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 제목 입력 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>작업 제목</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="작업 제목을 입력하세요"
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            {/* 공간/빨래 타입 선택 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === "cleaning" ? "공간" : "빨래 타입"}
              </Text>

              {selectedCategory === "cleaning" ? (
                <View style={styles.optionsContainer}>
                  {SPACES.map((space) => (
                    <TouchableOpacity
                      key={space}
                      style={[
                        styles.optionButton,
                        selectedSpace === space && styles.optionButtonSelected,
                      ]}
                      onPress={() => setSelectedSpace(space)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedSpace === space &&
                            styles.optionButtonTextSelected,
                        ]}
                      >
                        {space}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {isAddingCustomSpace ? (
                    <View style={styles.customInputContainer}>
                      <TextInput
                        style={styles.customInput}
                        placeholder="공간 이름 입력"
                        value={customSpace}
                        onChangeText={setCustomSpace}
                        onSubmitEditing={handleAddCustomSpace}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={handleAddCustomSpace}
                        style={styles.customInputButton}
                      >
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addCustomButton}
                      onPress={() => setIsAddingCustomSpace(true)}
                    >
                      <Ionicons name="add" size={20} color={COLORS.primary} />
                      <Text style={styles.addCustomButtonText}>직접 입력</Text>
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
                        selectedLaundryType === type.value &&
                          styles.optionButtonSelected,
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
                          selectedLaundryType === type.value &&
                            styles.optionButtonTextSelected,
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
              <Text style={styles.sectionTitle}>주기</Text>
              <View style={styles.optionsContainer}>
                {FREQUENCIES.map((frequency) => (
                  <TouchableOpacity
                    key={frequency.value}
                    style={[
                      styles.optionButton,
                      selectedFrequency.type === frequency.value &&
                        styles.optionButtonSelected,
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
                        selectedFrequency.type === frequency.value &&
                          styles.optionButtonTextSelected,
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
                  <Text style={styles.daysTitle}>요일 선택</Text>
                  <View style={styles.daysGrid}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.dayButton,
                          selectedFrequency.daysOfWeek?.includes(day.value) &&
                            styles.dayButtonSelected,
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
                            selectedFrequency.daysOfWeek?.includes(day.value) &&
                              styles.dayButtonTextSelected,
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
                  <Text style={styles.customDaysTitle}>일수 입력</Text>
                  <TextInput
                    style={styles.customDaysInput}
                    placeholder="예: 3 (3일마다)"
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
                <Text style={styles.sectionTitle}>체크리스트</Text>
                <TouchableOpacity
                  onPress={() =>
                    setIsAddingChecklistItem(!isAddingChecklistItem)
                  }
                  style={styles.addChecklistButton}
                >
                  <Ionicons
                    name={isAddingChecklistItem ? "remove" : "add"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              {isAddingChecklistItem && (
                <View style={styles.addChecklistContainer}>
                  <TextInput
                    style={styles.checklistInput}
                    placeholder="체크리스트 항목 추가"
                    value={newChecklistItem}
                    onChangeText={setNewChecklistItem}
                    onSubmitEditing={handleAddChecklistItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddChecklistItem}
                    style={styles.addChecklistConfirmButton}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {checklistItems.length > 0 ? (
                checklistItems.map((item) => (
                  <View key={item.id} style={styles.checklistItem}>
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
                            ? COLORS.primary
                            : COLORS.onBackground + "60"
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.checklistItemText,
                        item.isCompleted && styles.completedItemText,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteChecklistItem(item.id)}
                      style={styles.deleteChecklistButton}
                    >
                      <Ionicons name="close" size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyChecklist}>
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
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.5,
    flex: 1,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.onBackground + "20",
  },
  headerTop: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.onBackground + "30",
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
    color: COLORS.onBackground,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.onBackground + "30",
  },
  saveButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
  },
  saveButtonTextDisabled: {
    color: COLORS.onBackground + "60",
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
    color: COLORS.onBackground,
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
    borderColor: COLORS.onBackground + "20",
    backgroundColor: COLORS.surface,
  },
  categoryButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
    marginLeft: 8,
    fontWeight: "500",
  },
  categoryButtonTextSelected: {
    color: COLORS.onPrimary,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: COLORS.onBackground + "30",
    borderRadius: 8,
    padding: 12,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
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
    borderColor: COLORS.onBackground + "30",
    backgroundColor: COLORS.surface,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  optionButtonTextSelected: {
    color: COLORS.onPrimary,
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
    borderColor: COLORS.onBackground + "30",
    borderRadius: 8,
    padding: 8,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  customInputButton: {
    padding: 8,
    backgroundColor: COLORS.primary + "20",
    borderRadius: 8,
  },
  addCustomButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  addCustomButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: "500",
  },
  daysContainer: {
    marginTop: 16,
  },
  daysTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
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
    borderColor: COLORS.onBackground + "30",
    backgroundColor: COLORS.surface,
  },
  dayButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground,
  },
  dayButtonTextSelected: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  customDaysContainer: {
    marginTop: 16,
  },
  customDaysTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
    marginBottom: 8,
    fontWeight: "500",
  },
  customDaysInput: {
    borderWidth: 1,
    borderColor: COLORS.onBackground + "30",
    borderRadius: 8,
    padding: 12,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
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
    borderColor: COLORS.onBackground + "30",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  addChecklistConfirmButton: {
    padding: 12,
    backgroundColor: COLORS.primary + "20",
    borderRadius: 8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  checklistCheckbox: {
    marginRight: 12,
  },
  checklistItemText: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  completedItemText: {
    textDecorationLine: "line-through",
    color: COLORS.onBackground + "60",
  },
  deleteChecklistButton: {
    padding: 4,
  },
  emptyChecklist: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "60",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
});

export default AddTaskModal;
