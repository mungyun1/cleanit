import React, { useState, useMemo } from "react";
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
import { HouseholdTask, ChecklistItem, FrequencySettings } from "../types";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import { getNextDueDate } from "../utils/dateUtils";
import {
  getSpaceColor,
  getLaundryTypeColor,
  getLaundryTypeText,
  getFrequencyText,
} from "../utils/taskUtils";

interface TaskDetailModalProps {
  task: HouseholdTask | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onUpdateTask?: (updatedTask: HouseholdTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

const { width, height } = Dimensions.get("window");

// formatDate를 한글 요일까지 포함하는 포맷으로 재정의
function formatDate(date: Date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const dayName = dayNames[d.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayName}`;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  visible,
  onClose,
  onEdit,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { colors } = useTheme();
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTask, setOriginalTask] = useState<HouseholdTask | null>(null);
  const [tempTask, setTempTask] = useState<HouseholdTask | null>(null);

  // colors 객체를 메모이제이션하여 불필요한 재렌더링 방지
  const memoizedColors = useMemo(
    () => ({
      background: colors.background,
      onBackground: colors.onBackground,
      surface: colors.surface,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      error: colors.error,
    }),
    [
      colors.background,
      colors.onBackground,
      colors.surface,
      colors.primary,
      colors.onPrimary,
      colors.error,
    ]
  );

  // 완료 버튼 스타일을 메모이제이션
  const completeButtonStyle = useMemo(
    () => [
      styles.completeButtonTop,
      {
        backgroundColor: tempTask?.isCompleted
          ? memoizedColors.primary
          : memoizedColors.primary + "20",
        borderColor: memoizedColors.primary,
      },
    ],
    [tempTask?.isCompleted, memoizedColors.primary]
  );

  // 완료 버튼 텍스트 스타일을 메모이제이션
  const completeButtonTextStyle = useMemo(
    () => [
      styles.completeButtonText,
      {
        color: tempTask?.isCompleted
          ? memoizedColors.onPrimary
          : memoizedColors.primary,
      },
    ],
    [tempTask?.isCompleted, memoizedColors.primary, memoizedColors.onPrimary]
  );

  // 원본 작업 상태 저장 (모달이 열릴 때)
  React.useEffect(() => {
    if (task && visible) {
      // 즉시 상태 설정으로 버벅임 방지
      const taskCopy = JSON.parse(JSON.stringify(task));
      setOriginalTask(taskCopy);
      setTempTask(taskCopy);
    }
  }, [task, visible]);

  // 변경사항 확인
  React.useEffect(() => {
    if (originalTask && tempTask) {
      // updatedAt을 제외하고 체크리스트 항목과 완료 상태 비교
      const normalizeChecklistItems = (items: ChecklistItem[]) =>
        items.map((item) => ({
          id: item.id,
          title: item.title,
          isCompleted: item.isCompleted,
          createdAt: item.createdAt,
        }));

      const originalNormalized = normalizeChecklistItems(
        originalTask.checklistItems
      );
      const currentNormalized = normalizeChecklistItems(
        tempTask.checklistItems
      );

      const checklistChanged =
        JSON.stringify(originalNormalized) !==
        JSON.stringify(currentNormalized);

      const completionChanged =
        originalTask.isCompleted !== tempTask.isCompleted;

      const hasChangesNow = checklistChanged || completionChanged;
      setHasChanges(hasChangesNow);
    }
  }, [tempTask, originalTask]);

  // 모달이 보이지 않으면 렌더링하지 않음
  if (!visible) return null;

  const handleToggleChecklistItem = (itemId: string) => {
    if (!tempTask) return;

    const updatedTask = {
      ...tempTask,
      checklistItems: tempTask.checklistItems.map((item) =>
        item.id === itemId
          ? { ...item, isCompleted: !item.isCompleted, updatedAt: new Date() }
          : item
      ),
      updatedAt: new Date(),
    };

    setTempTask(updatedTask);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim() || !tempTask) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newChecklistItem.trim(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask = {
      ...tempTask,
      checklistItems: [...tempTask.checklistItems, newItem],
      updatedAt: new Date(),
    };

    setTempTask(updatedTask);
    setNewChecklistItem("");
    setIsAddingItem(false);
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    if (!tempTask) return;

    const updatedTask = {
      ...tempTask,
      checklistItems: tempTask.checklistItems.filter(
        (item) => item.id !== itemId
      ),
      updatedAt: new Date(),
    };

    setTempTask(updatedTask);
  };

  const handleDeleteTask = () => {
    Alert.alert("작업 삭제", `"${tempTask?.title}" 작업을 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (onDeleteTask) {
            onDeleteTask(tempTask?.id || "");
            onClose();
          }
        },
      },
    ]);
  };

  const handleClose = () => {
    // 모달을 닫을 때 즉시 상태 초기화
    setTempTask(null);
    setOriginalTask(null);
    setHasChanges(false);
    setNewChecklistItem("");
    setIsAddingItem(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
      hardwareAccelerated={true}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: memoizedColors.background },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: memoizedColors.onBackground + "20" },
            ]}
          >
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={memoizedColors.onBackground}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.modalTitle,
                { color: memoizedColors.onBackground },
              ]}
            >
              작업 상세
            </Text>
            <View style={styles.headerActions} />
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
          >
            <View style={styles.taskHeader}>
              <View style={styles.titleSection}>
                <Text
                  style={[
                    styles.taskTitle,
                    { color: memoizedColors.onBackground },
                  ]}
                >
                  {tempTask?.title || "작업 정보를 불러오는 중..."}
                </Text>
                <View
                  style={[
                    styles.categoryTag,
                    {
                      backgroundColor:
                        tempTask?.category === "cleaning"
                          ? getSpaceColor(tempTask?.space || "", memoizedColors)
                          : getLaundryTypeColor(tempTask?.laundryType || ""),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: memoizedColors.onBackground },
                    ]}
                  >
                    {tempTask?.category === "cleaning"
                      ? tempTask?.space
                      : getLaundryTypeText(tempTask?.laundryType || "")}
                  </Text>
                </View>
              </View>

              {tempTask?.description && (
                <Text
                  style={[
                    styles.taskDescription,
                    { color: memoizedColors.onBackground + "80" },
                  ]}
                >
                  {tempTask.description}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (tempTask) {
                    const updatedTask = {
                      ...tempTask,
                      isCompleted: !tempTask.isCompleted,
                      updatedAt: new Date(),
                    };
                    setTempTask(updatedTask);
                  }
                }}
                activeOpacity={0.7}
                style={completeButtonStyle}
              >
                <Ionicons
                  name={
                    tempTask?.isCompleted
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={20}
                  color={
                    tempTask?.isCompleted
                      ? memoizedColors.onPrimary
                      : memoizedColors.primary
                  }
                />
                <Text style={completeButtonTextStyle}>
                  {tempTask?.isCompleted ? "완료됨" : "완료하기"}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.infoSection,
                { backgroundColor: memoizedColors.surface },
              ]}
            >
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: memoizedColors.onBackground + "60" },
                  ]}
                >
                  주기
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: memoizedColors.onBackground },
                  ]}
                >
                  {getFrequencyText(tempTask?.frequency)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: memoizedColors.onBackground + "60" },
                  ]}
                >
                  마지막 작업
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: memoizedColors.onBackground },
                  ]}
                >
                  {tempTask?.lastCompleted
                    ? formatDate(tempTask.lastCompleted)
                    : "기록 없음"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: memoizedColors.onBackground + "60" },
                  ]}
                >
                  다음 예정일
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: memoizedColors.onBackground },
                  ]}
                >
                  {getNextDueDate(
                    tempTask?.lastCompleted || new Date(),
                    tempTask?.createdAt || new Date(),
                    tempTask?.frequency
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.checklistSection}>
              <View style={styles.checklistHeader}>
                <Text
                  style={[
                    styles.checklistTitle,
                    { color: memoizedColors.onBackground },
                  ]}
                >
                  체크리스트
                </Text>
                <TouchableOpacity
                  onPress={() => setIsAddingItem(!isAddingItem)}
                  style={styles.addItemButton}
                >
                  <Ionicons
                    name={isAddingItem ? "remove" : "add"}
                    size={20}
                    color={memoizedColors.primary}
                  />
                </TouchableOpacity>
              </View>

              {isAddingItem && (
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={[
                      styles.addItemInput,
                      {
                        borderColor: memoizedColors.onBackground + "30",
                        color: memoizedColors.onBackground,
                      },
                    ]}
                    placeholder="새 체크리스트 항목 추가"
                    placeholderTextColor={memoizedColors.onBackground + "60"}
                    value={newChecklistItem}
                    onChangeText={setNewChecklistItem}
                    onSubmitEditing={handleAddChecklistItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddChecklistItem}
                    style={[
                      styles.addItemSubmitButton,
                      { backgroundColor: memoizedColors.primary + "20" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={memoizedColors.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {tempTask?.checklistItems &&
              tempTask.checklistItems.length > 0 ? (
                tempTask.checklistItems.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.checklistItem,
                      { backgroundColor: memoizedColors.surface },
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
                            ? memoizedColors.primary
                            : memoizedColors.onBackground + "60"
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.checklistItemText,
                        { color: memoizedColors.onBackground },
                        item.isCompleted && [
                          styles.completedItemText,
                          { color: memoizedColors.onBackground + "60" },
                        ],
                      ]}
                    >
                      {item.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteChecklistItem(item.id)}
                      style={styles.deleteItemButton}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={memoizedColors.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text
                  style={[
                    styles.emptyChecklist,
                    { color: memoizedColors.onBackground + "60" },
                  ]}
                >
                  체크리스트 항목이 없습니다.
                </Text>
              )}
            </View>
          </ScrollView>

          <View
            style={[
              styles.modalFooter,
              { borderTopColor: memoizedColors.onBackground + "20" },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
              }}
            >
              {onDeleteTask && (
                <TouchableOpacity
                  onPress={handleDeleteTask}
                  style={[
                    styles.deleteFooterButton,
                    {
                      backgroundColor: memoizedColors.error,
                      borderColor: memoizedColors.error,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Ionicons
                    name="trash"
                    size={16}
                    color={memoizedColors.onPrimary}
                  />
                  <Text
                    style={[
                      styles.deleteFooterButtonText,
                      { color: memoizedColors.onPrimary },
                    ]}
                  >
                    삭제
                  </Text>
                </TouchableOpacity>
              )}
              {onEdit && (
                <TouchableOpacity
                  onPress={
                    hasChanges
                      ? () => {
                          if (tempTask && onUpdateTask) {
                            onUpdateTask(tempTask);
                          }
                          onEdit();
                        }
                      : undefined
                  }
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: hasChanges
                        ? memoizedColors.primary + "10"
                        : memoizedColors.surface,
                      borderColor: hasChanges
                        ? memoizedColors.primary + "40"
                        : memoizedColors.onBackground + "10",
                      flex: 1,
                    },
                    !hasChanges && styles.editButtonDisabled,
                  ]}
                  disabled={!hasChanges}
                  activeOpacity={hasChanges ? 0.7 : 1}
                >
                  <Ionicons
                    name="pencil"
                    size={16}
                    color={
                      hasChanges
                        ? memoizedColors.primary
                        : memoizedColors.onBackground + "40"
                    }
                  />
                  <Text
                    style={[
                      styles.editButtonText,
                      {
                        color: hasChanges
                          ? memoizedColors.primary
                          : memoizedColors.onBackground + "40",
                      },
                    ]}
                  >
                    수정
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
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
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "600",
    marginRight: 24,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 14,
    borderRadius: 14,
    alignSelf: "center",
    minWidth: 90,
    minHeight: 48,
    backgroundColor: undefined, // 동적으로 적용
    borderColor: undefined, // 동적으로 적용
    borderWidth: 1,
  },
  editButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "600",
  },
  editButtonDisabled: {
    opacity: 1,
  },
  deleteButton: {
    padding: 8,
  },
  modalContent: {
    // flex: 1, // flex: 1 제거
    padding: 20,
  },
  taskHeader: {
    marginBottom: 24,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  taskTitle: {
    ...TYPOGRAPHY.h2,
    marginRight: 12,
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
  taskDescription: {
    ...TYPOGRAPHY.body2,
    lineHeight: 20,
    marginBottom: 16,
  },
  completeButtonTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    ...TYPOGRAPHY.body2,
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "500",
  },
  checklistSection: {
    marginBottom: 24,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checklistTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "600",
  },
  addItemButton: {
    padding: 8,
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    ...TYPOGRAPHY.body2,
  },
  addItemSubmitButton: {
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
  deleteItemButton: {
    padding: 4,
  },
  emptyChecklist: {
    ...TYPOGRAPHY.body2,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  modalFooter: {
    padding: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  completeButtonText: {
    ...TYPOGRAPHY.button,
    marginLeft: 8,
  },
  deleteFooterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 90,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "transparent",
  },
  deleteFooterButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaskDetailModal;
