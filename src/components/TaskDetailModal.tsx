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
import { CleaningTask, ChecklistItem, FrequencySettings } from "../types";
import { COLORS, TYPOGRAPHY } from "../constants";

interface TaskDetailModalProps {
  task: CleaningTask | null;
  visible: boolean;
  onClose: () => void;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onUpdateTask?: (updatedTask: CleaningTask) => void;
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
  if (!task) return null;

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
    Alert.alert(
      "작업 삭제",
      `"${task.title}" 작업을 삭제하시겠습니까?\n\n이 작업과 관련된 모든 체크리스트도 함께 삭제됩니다.`,
      [
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
      ]
    );
  };

  const getFrequencyText = (frequency: FrequencySettings) => {
    const dayNames = {
      monday: "월요일",
      tuesday: "화요일",
      wednesday: "수요일",
      thursday: "목요일",
      friday: "금요일",
      saturday: "토요일",
      sunday: "일요일",
    };

    switch (frequency.type) {
      case "daily":
        return "매일";
      case "weekly":
        if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
          const dayLabels = frequency.daysOfWeek
            .map((day) => dayNames[day])
            .join(", ");
          return `매주 ${dayLabels}`;
        }
        return "매주";
      case "biweekly":
        if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
          const dayLabels = frequency.daysOfWeek
            .map((day) => dayNames[day])
            .join(", ");
          return `격주 ${dayLabels}`;
        }
        return "격주";
      case "monthly":
        return "월 1회";
      case "custom":
        return frequency.customDays
          ? `${frequency.customDays}일마다`
          : "사용자 정의";
      default:
        return "알 수 없음";
    }
  };

  const getSpaceColor = (space: string) => {
    switch (space) {
      case "거실":
        return COLORS.livingRoom;
      case "주방":
        return COLORS.kitchen;
      case "욕실":
        return COLORS.bathroom;
      case "화장실":
        return COLORS.toilet;
      case "침실":
        return COLORS.bedroom;
      default:
        return COLORS.common;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const getNextDueDate = () => {
    if (!task.lastCompleted) return "아직 완료하지 않음";

    const lastCompleted = new Date(task.lastCompleted);
    const now = new Date();
    let nextDue = new Date(lastCompleted);

    switch (task.frequency.type) {
      case "daily":
        nextDue.setDate(lastCompleted.getDate() + 1);
        break;
      case "weekly":
        nextDue.setDate(lastCompleted.getDate() + 7);
        break;
      case "biweekly":
        nextDue.setDate(lastCompleted.getDate() + 14);
        break;
      case "monthly":
        nextDue.setMonth(lastCompleted.getMonth() + 1);
        break;
      case "custom":
        if (task.frequency.customDays) {
          nextDue.setDate(lastCompleted.getDate() + task.frequency.customDays);
        } else {
          return "사용자 정의";
        }
        break;
      default:
        return "알 수 없음";
    }

    if (nextDue <= now) {
      return "지연됨";
    }

    return formatDate(nextDue);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View
                style={[
                  styles.spaceTag,
                  { backgroundColor: getSpaceColor(task.space) },
                ]}
              >
                <Text style={styles.spaceText}>{task.space}</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={handleDeleteTask}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={COLORS.error}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={COLORS.onBackground}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 제목과 완료 상태 */}
            <View style={styles.titleSection}>
              <Text
                style={[styles.title, task.isCompleted && styles.completedText]}
              >
                {task.title}
              </Text>
              <TouchableOpacity
                onPress={onToggleComplete}
                style={styles.completeButton}
              >
                <Ionicons
                  name={
                    task.isCompleted ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={32}
                  color={
                    task.isCompleted
                      ? COLORS.primary
                      : COLORS.onBackground + "60"
                  }
                />
                <Text style={styles.completeButtonText}>
                  {task.isCompleted ? "완료됨" : "완료하기"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 체크리스트 */}
            <View style={styles.section}>
              <View style={styles.checklistHeader}>
                <Text style={styles.sectionTitle}>세부 체크리스트</Text>
                <TouchableOpacity
                  onPress={() => setIsAddingItem(!isAddingItem)}
                  style={styles.addChecklistButton}
                >
                  <Ionicons
                    name={isAddingItem ? "close" : "add"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* 새 체크리스트 항목 추가 */}
              {isAddingItem && (
                <View style={styles.addChecklistContainer}>
                  <TextInput
                    style={styles.checklistInput}
                    placeholder="새 체크리스트 항목을 입력하세요"
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
                <View>
                  <Text style={styles.emptyChecklistText}>
                    체크리스트가 없습니다.
                  </Text>
                  <Text style={styles.emptyChecklistText}>
                    + 버튼을 눌러 추가해 보세요!
                  </Text>
                </View>
              )}
            </View>

            {/* 주기 정보 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>청소 주기</Text>
              <View style={styles.infoRow}>
                <Ionicons name="repeat" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  {getFrequencyText(task.frequency)}
                </Text>
              </View>
            </View>

            {/* 마지막 완료일 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>마지막 완료일</Text>
              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  {task.lastCompleted
                    ? formatDate(task.lastCompleted)
                    : "아직 완료하지 않음"}
                </Text>
              </View>
            </View>

            {/* 다음 예정일 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>다음 예정일</Text>
              <View style={styles.infoRow}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>{getNextDueDate()}</Text>
              </View>
            </View>

            {/* 생성일 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>작성일</Text>
              <View style={styles.infoRow}>
                <Ionicons name="create" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  {formatDate(task.createdAt)}
                </Text>
              </View>
            </View>

            {/* 수정일 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>수정일</Text>
              <View style={styles.infoRow}>
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  {formatDate(task.updatedAt)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* 하단 액션 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Ionicons name="pencil" size={20} color={COLORS.primary} />
              <Text style={styles.editButtonText}>수정하기</Text>
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 4,
    marginRight: 8,
  },
  spaceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  spaceText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onBackground,
    marginBottom: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: COLORS.onBackground + "60",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.onBackground + "20",
  },
  completeButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
    marginLeft: 8,
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onBackground,
    marginBottom: 8,
  },
  description: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onBackground + "80",
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "80",
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.onBackground + "15",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
    marginLeft: 8,
  },
  // 체크리스트 스타일
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
  deleteChecklistButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyChecklistText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "60",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
});

export default TaskDetailModal;
