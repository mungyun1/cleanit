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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  CleaningTask,
  ChecklistItem,
  FrequencySettings,
  DayOfWeek,
} from "../types";
import { COLORS, TYPOGRAPHY, DEFAULT_CHECKLIST_TEMPLATES } from "../constants";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: CleaningTask) => void;
}

const { width, height } = Dimensions.get("window");

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");
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

  const spaces = ["거실", "주방", "침실", "욕실", "화장실", "공용"];
  const frequencies = [
    { label: "매일", value: "daily" as const },
    { label: "매주", value: "weekly" as const },
    { label: "격주", value: "biweekly" as const },
    { label: "월 1회", value: "monthly" as const },
    { label: "사용자 정의", value: "custom" as const },
  ];

  const daysOfWeek = [
    { label: "월요일", value: "monday" as DayOfWeek },
    { label: "화요일", value: "tuesday" as DayOfWeek },
    { label: "수요일", value: "wednesday" as DayOfWeek },
    { label: "목요일", value: "thursday" as DayOfWeek },
    { label: "금요일", value: "friday" as DayOfWeek },
    { label: "토요일", value: "saturday" as DayOfWeek },
    { label: "일요일", value: "sunday" as DayOfWeek },
  ];

  // 공간 선택 시 기본 체크리스트 템플릿 적용 및 제목 자동 완성
  useEffect(() => {
    if (selectedSpace) {
      // 제목 자동 완성 (기존 제목이 비어있거나 기본 제목인 경우에만)
      if (
        !title ||
        title === "" ||
        title.match(/^(거실|주방|방|욕실|공용)\s*청소$/)
      ) {
        setTitle(`${selectedSpace} 청소`);
      }

      // 기본 체크리스트 템플릿 적용
      if (
        DEFAULT_CHECKLIST_TEMPLATES[
          selectedSpace as keyof typeof DEFAULT_CHECKLIST_TEMPLATES
        ]
      ) {
        const templateItems =
          DEFAULT_CHECKLIST_TEMPLATES[
            selectedSpace as keyof typeof DEFAULT_CHECKLIST_TEMPLATES
          ];
        const newChecklistItems: ChecklistItem[] = templateItems.map(
          (item, index) => ({
            id: `template-${Date.now()}-${index}`,
            title: item,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );
        setChecklistItems(newChecklistItems);
      } else {
        setChecklistItems([]);
      }
    }
  }, [selectedSpace]);

  const handleAddCustomSpace = () => {
    if (!customSpace.trim()) return;

    if (spaces.includes(customSpace.trim())) {
      Alert.alert("오류", "이미 존재하는 공간입니다.");
      return;
    }

    setSelectedSpace(customSpace.trim());
    setCustomSpace("");
    setIsAddingCustomSpace(false);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newChecklistItem.trim(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
    if (!title.trim()) {
      Alert.alert("오류", "작업 제목을 입력해주세요.");
      return;
    }

    if (!selectedSpace) {
      Alert.alert("오류", "공간을 선택해주세요.");
      return;
    }

    if (!selectedFrequency.type) {
      Alert.alert("오류", "청소 주기를 선택해주세요.");
      return;
    }

    const newTask: CleaningTask = {
      id: Date.now().toString(),
      title: title.trim(),
      space: selectedSpace,
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
    setSelectedSpace("");
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

  // 저장 버튼 활성화 상태 확인
  const isFormValid = () => {
    const hasTitle = title.trim().length > 0;
    const hasSpace = selectedSpace.length > 0;
    const hasValidFrequency =
      selectedFrequency.type &&
      (selectedFrequency.type === "daily" ||
        selectedFrequency.type === "monthly" ||
        (selectedFrequency.daysOfWeek &&
          selectedFrequency.daysOfWeek.length > 0));

    return hasTitle && hasSpace && hasValidFrequency;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>새 작업 추가</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.onBackground} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 작업 제목 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>작업 제목 *</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="예: 거실 청소, 주방 정리"
                placeholderTextColor="#666666"
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            {/* 공간 선택 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>공간 *</Text>
              <View style={styles.spaceContainer}>
                {spaces.map((space) => (
                  <TouchableOpacity
                    key={space}
                    style={[
                      styles.spaceButton,
                      selectedSpace === space && styles.selectedSpaceButton,
                    ]}
                    onPress={() => setSelectedSpace(space)}
                  >
                    <Text
                      style={[
                        styles.spaceButtonText,
                        selectedSpace === space &&
                          styles.selectedSpaceButtonText,
                      ]}
                    >
                      {space}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 사용자 정의 공간 */}
              <TouchableOpacity
                style={styles.addCustomSpaceButton}
                onPress={() => setIsAddingCustomSpace(!isAddingCustomSpace)}
              >
                <Ionicons
                  name={isAddingCustomSpace ? "remove" : "add"}
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.addCustomSpaceText}>
                  {isAddingCustomSpace ? "취소" : "공간 추가"}
                </Text>
              </TouchableOpacity>

              {isAddingCustomSpace && (
                <View style={styles.customSpaceContainer}>
                  <TextInput
                    style={styles.customSpaceInput}
                    placeholder="새 공간 이름을 입력하세요"
                    placeholderTextColor="#666666"
                    value={customSpace}
                    onChangeText={setCustomSpace}
                    onSubmitEditing={handleAddCustomSpace}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddCustomSpace}
                    style={styles.addCustomSpaceConfirmButton}
                    disabled={!customSpace.trim()}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={
                        customSpace.trim()
                          ? COLORS.primary
                          : COLORS.onBackground + "40"
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 청소 주기 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>청소 주기 *</Text>
              <View style={styles.frequencyContainer}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq.value}
                    style={[
                      styles.frequencyButton,
                      selectedFrequency.type === freq.value &&
                        styles.selectedFrequencyButton,
                    ]}
                    onPress={() =>
                      setSelectedFrequency({
                        ...selectedFrequency,
                        type: freq.value,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        selectedFrequency.type === freq.value &&
                          styles.selectedFrequencyButtonText,
                      ]}
                    >
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 요일 선택 (매주, 격주일 때만 표시) */}
              {(selectedFrequency.type === "weekly" ||
                selectedFrequency.type === "biweekly") && (
                <View style={styles.daySelectionContainer}>
                  <Text style={styles.daySelectionTitle}>
                    요일 선택 (여러 개 선택 가능)
                  </Text>
                  <View style={styles.dayContainer}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.dayButton,
                          selectedFrequency.daysOfWeek?.includes(day.value) &&
                            styles.selectedDayButton,
                        ]}
                        onPress={() => {
                          const currentDays =
                            selectedFrequency.daysOfWeek || [];
                          const newDays = currentDays.includes(day.value)
                            ? currentDays.filter((d) => d !== day.value)
                            : [...currentDays, day.value];

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
                              styles.selectedDayButtonText,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* 체크리스트 */}
            {selectedSpace && (
              <View style={styles.section}>
                <View style={styles.checklistHeader}>
                  <Text style={styles.sectionTitle}>세부 체크리스트</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setIsAddingChecklistItem(!isAddingChecklistItem)
                    }
                    style={styles.addChecklistButton}
                  >
                    <Ionicons
                      name={isAddingChecklistItem ? "close" : "add"}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* 새 체크리스트 항목 추가 */}
                {isAddingChecklistItem && (
                  <View style={styles.addChecklistContainer}>
                    <TextInput
                      style={styles.checklistInput}
                      placeholder="새 체크리스트 항목을 입력하세요"
                      placeholderTextColor="#666666"
                      value={newChecklistItem}
                      onChangeText={setNewChecklistItem}
                      onSubmitEditing={handleAddChecklistItem}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      onPress={handleAddChecklistItem}
                      style={styles.addChecklistConfirmButton}
                      disabled={!newChecklistItem.trim()}
                    >
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={
                          newChecklistItem.trim()
                            ? COLORS.primary
                            : COLORS.onBackground + "40"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* 체크리스트 항목들 */}
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
                          item.isCompleted && styles.completedText,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteChecklistItem(item.id)}
                        style={styles.deleteChecklistButton}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={COLORS.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyChecklistContainer}>
                    <Ionicons
                      name="list-outline"
                      size={32}
                      color={COLORS.onBackground + "40"}
                    />
                    <Text style={styles.emptyChecklistText}>
                      공간을 선택하면 기본 체크리스트가 추가됩니다.{"\n"}+
                      버튼으로 추가 항목을 만들 수 있습니다!
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* 하단 액션 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.6,
    width: width * 0.9,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.onBackground + "15",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onBackground,
    marginBottom: 12,
  },
  titleInput: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onBackground,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    height: 48,
    textAlignVertical: "center",
  },
  spaceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  spaceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
    backgroundColor: COLORS.surface,
  },
  selectedSpaceButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  spaceButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  selectedSpaceButtonText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  addCustomSpaceButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  addCustomSpaceText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    marginLeft: 8,
  },
  customSpaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 8,
  },
  customSpaceInput: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addCustomSpaceConfirmButton: {
    padding: 8,
    marginLeft: 4,
  },
  frequencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
    backgroundColor: COLORS.surface,
  },
  selectedFrequencyButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  frequencyButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  selectedFrequencyButtonText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  daySelectionContainer: {
    marginTop: 16,
  },
  daySelectionTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
    marginBottom: 8,
    fontWeight: "500",
  },
  dayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
    backgroundColor: COLORS.surface,
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onBackground,
  },
  selectedDayButtonText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  selectedDaysText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    marginTop: 8,
    fontStyle: "italic",
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addChecklistButton: {
    backgroundColor: COLORS.primary + "20",
    padding: 6,
    borderRadius: 16,
  },
  addChecklistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 8,
  },
  checklistInput: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addChecklistConfirmButton: {
    padding: 8,
    marginLeft: 4,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  checklistCheckbox: {
    marginRight: 12,
    padding: 2,
  },
  checklistItemText: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: COLORS.onBackground + "60",
  },
  deleteChecklistButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyChecklistContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyChecklistText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "60",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.onBackground + "15",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  cancelButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onBackground,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.primary + "40",
    opacity: 0.6,
  },
  saveButtonTextDisabled: {
    color: COLORS.onPrimary + "80",
  },
});

export default AddTaskModal;
