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
import { COLORS, TYPOGRAPHY } from "../constants";
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.onBackground} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>작업 상세</Text>
            <View style={styles.headerActions}>
              {onDeleteTask && (
                <TouchableOpacity
                  onPress={handleDeleteTask}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={20} color={COLORS.error} />
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
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View
                  style={[
                    styles.categoryTag,
                    {
                      backgroundColor:
                        task.category === "cleaning"
                          ? getSpaceColor(task.space || "")
                          : getLaundryTypeColor(task.laundryType || ""),
                    },
                  ]}
                >
                  <Text style={styles.categoryText}>
                    {task.category === "cleaning"
                      ? task.space
                      : getLaundryTypeText(task.laundryType || "")}
                  </Text>
                </View>
              </View>

              {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>주기</Text>
                <Text style={styles.infoValue}>
                  {getFrequencyText(task.frequency)}
                </Text>
              </View>

              {task.lastCompleted && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>마지막 작업</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(task.lastCompleted)}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>다음 예정일</Text>
                <Text style={styles.infoValue}>
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
                <Text style={styles.checklistTitle}>체크리스트</Text>
                <TouchableOpacity
                  onPress={() => setIsAddingItem(!isAddingItem)}
                  style={styles.addItemButton}
                >
                  <Ionicons
                    name={isAddingItem ? "remove" : "add"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              {isAddingItem && (
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={styles.addItemInput}
                    placeholder="새 체크리스트 항목 추가"
                    value={newChecklistItem}
                    onChangeText={setNewChecklistItem}
                    onSubmitEditing={handleAddChecklistItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddChecklistItem}
                    style={styles.addItemSubmitButton}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {task.checklistItems.length > 0 ? (
                task.checklistItems.map((item) => (
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
                      style={styles.deleteItemButton}
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

          <View style={styles.modalFooter}>
            <View style={styles.footerButtons}>
              {onEdit && (
                <TouchableOpacity
                  onPress={hasChanges ? onEdit : undefined}
                  style={[
                    styles.editButton,
                    !hasChanges && styles.editButtonDisabled,
                  ]}
                  disabled={!hasChanges}
                >
                  <Ionicons
                    name="pencil"
                    size={20}
                    color={
                      hasChanges ? COLORS.primary : COLORS.onBackground + "40"
                    }
                  />
                  <Text
                    style={[
                      styles.editButtonText,
                      !hasChanges && styles.editButtonTextDisabled,
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
                  task.isCompleted && styles.completedButton,
                ]}
              >
                <Ionicons
                  name={
                    task.isCompleted ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={20}
                  color={task.isCompleted ? COLORS.onPrimary : COLORS.primary}
                />
                <Text
                  style={[
                    styles.completeButtonText,
                    task.isCompleted && styles.completedButtonText,
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
    backgroundColor: COLORS.background,
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
    borderBottomColor: COLORS.onBackground + "20",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
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
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    marginLeft: 8,
  },
  editButtonDisabled: {
    opacity: 0.4,
  },
  editButtonTextDisabled: {
    color: COLORS.onBackground + "40",
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
    color: COLORS.onBackground,
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
    color: COLORS.onBackground,
    fontWeight: "600",
  },
  taskDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
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
    color: COLORS.onBackground + "60",
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
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
    color: COLORS.onBackground,
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
    borderColor: COLORS.onBackground + "30",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
  },
  addItemSubmitButton: {
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
  deleteItemButton: {
    padding: 4,
  },
  emptyChecklist: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "60",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.onBackground + "20",
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
    backgroundColor: COLORS.primary + "20",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  completedButton: {
    backgroundColor: COLORS.primary,
  },
  completeButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    marginLeft: 8,
  },
  completedButtonText: {
    color: COLORS.onPrimary,
  },
});

export default TaskDetailModal;
