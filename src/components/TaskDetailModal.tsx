import React, { useState } from "react";
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
import { formatDate, getNextDueDate } from "../utils/dateUtils";
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
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onUpdateTask?: (updatedTask: HouseholdTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

const { width, height } = Dimensions.get("window");

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  visible,
  onClose,
  onToggleComplete,
  onEdit,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { colors } = useTheme();
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTask, setOriginalTask] = useState<HouseholdTask | null>(null);

  if (!task) return null;

  // 원본 작업 상태 저장
  React.useEffect(() => {
    if (task && !originalTask) {
      setOriginalTask(JSON.parse(JSON.stringify(task)));
    }
  }, [task, originalTask]);

  // 변경사항 확인
  React.useEffect(() => {
    if (originalTask && task) {
      // updatedAt을 제외하고 체크리스트 항목 비교
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
      const currentNormalized = normalizeChecklistItems(task.checklistItems);

      const hasChangesNow =
        JSON.stringify(originalNormalized) !==
        JSON.stringify(currentNormalized);
      setHasChanges(hasChangesNow);
    }
  }, [task, originalTask]);

  const handleToggleChecklistItem = (itemId: string) => {
    if (!onUpdateTask) return;

    const updatedTask = {
      ...task,
      checklistItems: task.checklistItems.map((item) =>
        item.id === itemId
          ? { ...item, isCompleted: !item.isCompleted, updatedAt: new Date() }
          : item
      ),
      updatedAt: new Date(),
    };

    onUpdateTask(updatedTask);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim() || !onUpdateTask) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newChecklistItem.trim(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask = {
      ...task,
      checklistItems: [...task.checklistItems, newItem],
      updatedAt: new Date(),
    };

    onUpdateTask(updatedTask);
    setNewChecklistItem("");
    setIsAddingItem(false);
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    if (!onUpdateTask) return;

    const updatedTask = {
      ...task,
      checklistItems: task.checklistItems.filter((item) => item.id !== itemId),
      updatedAt: new Date(),
    };

    onUpdateTask(updatedTask);
  };

  const handleDeleteTask = () => {
    Alert.alert("작업 삭제", `"${task.title}" 작업을 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (onDeleteTask) {
            onDeleteTask(task.id);
            onClose();
          }
        },
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
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
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.onBackground} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.onBackground }]}>
              작업 상세
            </Text>
            <View style={styles.headerActions}>
              {onDeleteTask && (
                <TouchableOpacity
                  onPress={handleDeleteTask}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.taskHeader}>
              <View style={styles.titleSection}>
                <Text
                  style={[styles.taskTitle, { color: colors.onBackground }]}
                >
                  {task.title}
                </Text>
                <View
                  style={[
                    styles.categoryTag,
                    {
                      backgroundColor:
                        task.category === "cleaning"
                          ? getSpaceColor(task.space || "", colors)
                          : getLaundryTypeColor(task.laundryType || ""),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.onBackground },
                    ]}
                  >
                    {task.category === "cleaning"
                      ? task.space
                      : getLaundryTypeText(task.laundryType || "")}
                  </Text>
                </View>
              </View>

              {task.description && (
                <Text
                  style={[
                    styles.taskDescription,
                    { color: colors.onBackground + "80" },
                  ]}
                >
                  {task.description}
                </Text>
              )}
            </View>

            <View
              style={[styles.infoSection, { backgroundColor: colors.surface }]}
            >
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  주기
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.onBackground }]}
                >
                  {getFrequencyText(task.frequency)}
                </Text>
              </View>

              {task.lastCompleted && (
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: colors.onBackground + "60" },
                    ]}
                  >
                    마지막 작업
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.onBackground }]}
                  >
                    {formatDate(task.lastCompleted)}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  다음 예정일
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.onBackground }]}
                >
                  {getNextDueDate(
                    task.lastCompleted,
                    task.createdAt,
                    task.frequency
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.checklistSection}>
              <View style={styles.checklistHeader}>
                <Text
                  style={[
                    styles.checklistTitle,
                    { color: colors.onBackground },
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
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {isAddingItem && (
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={[
                      styles.addItemInput,
                      {
                        borderColor: colors.onBackground + "30",
                        color: colors.onBackground,
                      },
                    ]}
                    placeholder="새 체크리스트 항목 추가"
                    placeholderTextColor={colors.onBackground + "60"}
                    value={newChecklistItem}
                    onChangeText={setNewChecklistItem}
                    onSubmitEditing={handleAddChecklistItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddChecklistItem}
                    style={[
                      styles.addItemSubmitButton,
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

              {task.checklistItems.length > 0 ? (
                task.checklistItems.map((item) => (
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
                      style={styles.deleteItemButton}
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

          <View
            style={[
              styles.modalFooter,
              { borderTopColor: colors.onBackground + "20" },
            ]}
          >
            <View style={styles.footerButtons}>
              {onEdit && (
                <TouchableOpacity
                  onPress={hasChanges ? onEdit : undefined}
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.primary,
                    },
                    !hasChanges && [
                      styles.editButtonDisabled,
                      { opacity: 0.4 },
                    ],
                  ]}
                  disabled={!hasChanges}
                >
                  <Ionicons
                    name="pencil"
                    size={20}
                    color={
                      hasChanges ? colors.primary : colors.onBackground + "40"
                    }
                  />
                  <Text
                    style={[
                      styles.editButtonText,
                      { color: colors.primary },
                      !hasChanges && [
                        styles.editButtonTextDisabled,
                        { color: colors.onBackground + "40" },
                      ],
                    ]}
                  >
                    수정하기
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  onToggleComplete?.();
                  if (!task.isCompleted) {
                    onClose();
                  }
                }}
                style={[
                  styles.completeButton,
                  {
                    backgroundColor: colors.primary + "20",
                    borderColor: colors.primary,
                  },
                  task.isCompleted && [
                    styles.completedButton,
                    { backgroundColor: colors.primary },
                  ],
                ]}
              >
                <Ionicons
                  name={
                    task.isCompleted ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={20}
                  color={task.isCompleted ? colors.onPrimary : colors.primary}
                />
                <Text
                  style={[
                    styles.completeButtonText,
                    { color: colors.primary },
                    task.isCompleted && [
                      styles.completedButtonText,
                      { color: colors.onPrimary },
                    ],
                  ]}
                >
                  {task.isCompleted ? "완료됨" : "완료하기"}
                </Text>
              </TouchableOpacity>
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
    maxHeight: height * 0.9, // 0.98 → 0.9로 변경
    overflow: "hidden", // 추가
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
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  editButtonText: {
    ...TYPOGRAPHY.button,
    marginLeft: 8,
  },
  editButtonDisabled: {
    // opacity는 인라인으로 적용
  },
  editButtonTextDisabled: {
    // color는 인라인으로 적용
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
    padding: 20,
    borderTopWidth: 1,
  },
  footerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  completeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  completedButton: {
    // backgroundColor는 인라인으로 적용
  },
  completeButtonText: {
    ...TYPOGRAPHY.button,
    marginLeft: 8,
  },
  completedButtonText: {
    // color는 인라인으로 적용
  },
});

export default TaskDetailModal;
