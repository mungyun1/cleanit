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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HouseholdTask, ChecklistItem, FrequencySettings } from "../types";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import { getNextDueDate } from "../utils/dateUtils";
import { getFrequencyText } from "../utils/taskUtils";

interface TaskDetailModalProps {
  task: HouseholdTask | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onUpdateTask?: (updatedTask: HouseholdTask) => void;
  onDeleteTask?: (taskId: string) => void;
  showCompleteButton?: boolean;
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
  showCompleteButton = true,
}) => {
  const { colors } = useTheme();
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTask, setOriginalTask] = useState<HouseholdTask | null>(null);
  const [tempTask, setTempTask] = useState<HouseholdTask | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] = useState<
    string | null
  >(null);
  const [editingChecklistText, setEditingChecklistText] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>(null);

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

  // 테마별 스타일 객체 생성
  const themedStyles = useMemo(
    () => ({
      modalContainer: { backgroundColor: memoizedColors.background },
      modalHeader: { borderBottomColor: memoizedColors.onBackground + "20" },
      modalTitle: { color: memoizedColors.onBackground },
      taskTitle: { color: memoizedColors.onBackground },
      taskDescription: { color: memoizedColors.onBackground + "80" },
      titleInput: {
        color: memoizedColors.onBackground,
        borderColor: memoizedColors.primary + "40",
        backgroundColor: memoizedColors.surface,
      },
      descriptionInput: {
        color: memoizedColors.onBackground,
        borderColor: memoizedColors.onBackground + "20",
        backgroundColor: memoizedColors.surface,
      },
      infoSection: { backgroundColor: memoizedColors.surface },
      infoLabel: { color: memoizedColors.onBackground + "60" },
      infoValue: { color: memoizedColors.onBackground },
      infoValueEdit: { color: memoizedColors.primary },
      checklistTitle: { color: memoizedColors.onBackground },
      addItemContainer: { backgroundColor: memoizedColors.surface },
      addItemInput: {
        borderColor: memoizedColors.onBackground + "20",
        color: memoizedColors.onBackground,
        backgroundColor: memoizedColors.background,
      },
      checklistItem: { backgroundColor: memoizedColors.surface },
      checklistItemText: { color: memoizedColors.onBackground },
      completedItemText: { color: memoizedColors.onBackground + "60" },
      checkButton: {
        backgroundColor: memoizedColors.primary,
      },
      checkButtonInactive: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
      emptyChecklist: { color: memoizedColors.onBackground + "60" },
      modalFooter: { borderTopColor: memoizedColors.onBackground + "20" },
    }),
    [memoizedColors]
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

      const titleChanged = originalTask.title !== tempTask.title;
      const descriptionChanged =
        originalTask.description !== tempTask.description;

      // 유효성 검사: 제목이 비어있지 않아야 함
      const isTitleValid = tempTask.title && tempTask.title.trim().length > 0;

      // 체크리스트 항목 중 빈 제목이 있는지 확인
      const hasEmptyChecklistItems = tempTask.checklistItems.some(
        (item) => !item.title || item.title.trim().length === 0
      );

      const hasValidChanges =
        checklistChanged ||
        completionChanged ||
        titleChanged ||
        descriptionChanged;

      const hasChangesNow = Boolean(
        hasValidChanges && isTitleValid && !hasEmptyChecklistItems
      );
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

    const trimmedText = newChecklistItem.trim();
    if (trimmedText.length === 0) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: trimmedText,
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
    setIsEditMode(false);
    setEditingChecklistItem(null);
    setEditingChecklistText("");
    setEditingDescription("");
    onClose();
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && tempTask) {
      // 편집 모드로 들어갈 때 현재 description을 편집 상태로 설정
      setEditingDescription(tempTask.description || "");
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (!tempTask) return;
    setTempTask({
      ...tempTask,
      title: newTitle,
      updatedAt: new Date(),
    });
  };

  const handleDescriptionChange = (newDescription: string) => {
    if (!tempTask) return;
    setTempTask({
      ...tempTask,
      description: newDescription,
      updatedAt: new Date(),
    });
  };

  const handleFrequencyChange = (frequency: FrequencySettings) => {
    if (!tempTask) return;
    setTempTask({
      ...tempTask,
      frequency,
      updatedAt: new Date(),
    });
  };

  const handleStartEditChecklistItem = (
    itemId: string,
    currentTitle: string
  ) => {
    setEditingChecklistItem(itemId);
    setEditingChecklistText(currentTitle);
  };

  const handleSaveChecklistItem = () => {
    if (!tempTask || !editingChecklistItem || !editingChecklistText.trim())
      return;

    const trimmedText = editingChecklistText.trim();
    if (trimmedText.length === 0) {
      // 빈 텍스트는 저장하지 않음
      setEditingChecklistItem(null);
      setEditingChecklistText("");
      return;
    }

    const updatedTask = {
      ...tempTask,
      checklistItems: tempTask.checklistItems.map((item) =>
        item.id === editingChecklistItem
          ? {
              ...item,
              title: trimmedText,
              updatedAt: new Date(),
            }
          : item
      ),
      updatedAt: new Date(),
    };

    setTempTask(updatedTask);
    setEditingChecklistItem(null);
    setEditingChecklistText("");
  };

  const handleCancelEditChecklistItem = () => {
    setEditingChecklistItem(null);
    setEditingChecklistText("");
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
      hardwareAccelerated={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        enabled={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, themedStyles.modalContainer]}>
            <View style={[styles.modalHeader, themedStyles.modalHeader]}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={memoizedColors.onBackground}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.modalTitle,
                  themedStyles.modalTitle,
                  styles.fixedModalTitle, // minHeight 적용
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {isEditMode ? "작업 편집" : "작업 상세"}
              </Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={handleToggleEditMode}
                  style={styles.editModeButton}
                >
                  <Ionicons
                    name={isEditMode ? "eye" : "settings-outline"}
                    size={20}
                    color={memoizedColors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              ref={setScrollViewRef}
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
              automaticallyAdjustKeyboardInsets={true}
              keyboardDismissMode="interactive"
            >
              <View>
                <View style={styles.titleSection}>
                  {isEditMode ? (
                    <View style={styles.titleEditContainer}>
                      <TextInput
                        style={[styles.taskTitle, styles.titleInput]}
                        value={tempTask?.title || ""}
                        onChangeText={handleTitleChange}
                        placeholder="작업 제목을 입력하세요"
                        placeholderTextColor={
                          memoizedColors.onBackground + "60"
                        }
                        onFocus={() => {
                          // 제목 입력 필드에 포커스가 있을 때 스크롤 조정
                          setTimeout(() => {
                            scrollViewRef?.scrollTo({ y: 0, animated: true });
                          }, 50);
                        }}
                        onLayout={(event) => {
                          // 레이아웃이 완료된 후 위치 확인
                          const { y } = event.nativeEvent.layout;
                          if (y > 200) {
                            // 제목이 화면 아래쪽에 있으면 위로 스크롤
                            scrollViewRef?.scrollTo({ y: 0, animated: true });
                          }
                        }}
                      />
                      <View style={styles.titleEditIndicator}>
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color={memoizedColors.primary}
                        />
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.taskTitle, themedStyles.taskTitle]}>
                      {tempTask?.title || "작업 정보를 불러오는 중..."}
                    </Text>
                  )}
                </View>

                {(tempTask?.description || isEditMode) && (
                  <View style={styles.descriptionSection}>
                    {isEditMode ? (
                      <TextInput
                        style={[
                          styles.taskDescription,
                          styles.descriptionInput,
                        ]}
                        value={editingDescription}
                        onChangeText={setEditingDescription}
                        onEndEditing={() =>
                          handleDescriptionChange(editingDescription)
                        }
                        onFocus={() => {
                          // description 입력 필드에 포커스가 있을 때 스크롤 조정
                          setTimeout(() => {
                            scrollViewRef?.scrollTo({ y: 100, animated: true });
                          }, 300);
                        }}
                        placeholder="작업 설명을 입력하세요 (선택사항)"
                        placeholderTextColor={
                          memoizedColors.onBackground + "60"
                        }
                        multiline
                        numberOfLines={3}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.taskDescription,
                          themedStyles.taskDescription,
                        ]}
                      >
                        {tempTask?.description}
                      </Text>
                    )}
                  </View>
                )}

                {showCompleteButton && (
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
                )}
              </View>

              <View style={[styles.infoSection, themedStyles.infoSection]}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, themedStyles.infoLabel]}>
                    주기
                  </Text>
                  {isEditMode ? (
                    <TouchableOpacity
                      onPress={() => {
                        // 주기 편집 모달 또는 선택 UI를 여기에 추가할 수 있습니다
                        Alert.alert(
                          "주기 편집",
                          "주기 편집 기능은 추후 구현 예정입니다."
                        );
                      }}
                    >
                      <Text
                        style={[styles.infoValue, themedStyles.infoValueEdit]}
                      >
                        {getFrequencyText(tempTask?.frequency)} (편집)
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.infoValue, themedStyles.infoValue]}>
                      {getFrequencyText(tempTask?.frequency)}
                    </Text>
                  )}
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, themedStyles.infoLabel]}>
                    마지막 작업
                  </Text>
                  <Text style={[styles.infoValue, themedStyles.infoValue]}>
                    {tempTask?.lastCompleted
                      ? formatDate(tempTask.lastCompleted)
                      : "기록 없음"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, themedStyles.infoLabel]}>
                    다음 예정일
                  </Text>
                  <Text style={[styles.infoValue, themedStyles.infoValue]}>
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
                    style={[styles.checklistTitle, themedStyles.checklistTitle]}
                  >
                    ✅ 체크리스트
                  </Text>
                  {isEditMode && (
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
                  )}
                </View>

                {isAddingItem && (
                  <View
                    style={[
                      styles.addItemContainer,
                      themedStyles.addItemContainer,
                    ]}
                  >
                    <TextInput
                      style={[styles.addItemInput, themedStyles.addItemInput]}
                      placeholder="새 체크리스트 항목 추가"
                      placeholderTextColor={memoizedColors.onBackground + "60"}
                      value={newChecklistItem}
                      onChangeText={setNewChecklistItem}
                      onSubmitEditing={handleAddChecklistItem}
                      onFocus={() => {
                        // 체크리스트 입력 필드에 포커스가 있을 때 스크롤 조정
                        setTimeout(() => {
                          scrollViewRef?.scrollToEnd({ animated: true });
                        }, 300);
                      }}
                      returnKeyType="done"
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity
                      onPress={handleAddChecklistItem}
                      style={[
                        styles.addItemSubmitButton,
                        { backgroundColor: memoizedColors.primary },
                      ]}
                      disabled={!newChecklistItem.trim()}
                    >
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={memoizedColors.onPrimary}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {tempTask?.checklistItems &&
                tempTask.checklistItems.length > 0 ? (
                  tempTask.checklistItems.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.checklistItem, themedStyles.checklistItem]}
                    >
                      {isEditMode && editingChecklistItem === item.id ? (
                        <View style={styles.checklistEditContainer}>
                          <TextInput
                            style={[
                              styles.checklistItemText,
                              { color: memoizedColors.onBackground },
                              item.isCompleted && [
                                styles.completedItemText,
                                themedStyles.completedItemText,
                              ],
                              {
                                borderBottomWidth: 1,
                                borderColor: memoizedColors.primary,
                                flex: 1,
                              },
                            ]}
                            value={editingChecklistText}
                            onChangeText={setEditingChecklistText}
                            onSubmitEditing={handleSaveChecklistItem}
                            autoFocus
                          />
                          <View style={styles.checklistIconArea}>
                            <TouchableOpacity
                              onPress={handleSaveChecklistItem}
                              style={[
                                styles.addItemSubmitButton,
                                styles.checklistIconButton,
                              ]}
                            >
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color={memoizedColors.primary}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={handleCancelEditChecklistItem}
                              style={[
                                styles.deleteItemButton,
                                styles.checklistIconButton,
                              ]}
                            >
                              <Ionicons
                                name="close"
                                size={16}
                                color={memoizedColors.error}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              if (isEditMode)
                                handleStartEditChecklistItem(
                                  item.id,
                                  item.title
                                );
                            }}
                            style={styles.checklistContent}
                          >
                            <Text
                              style={[
                                styles.checklistItemText,
                                { color: memoizedColors.onBackground },
                                item.isCompleted && [
                                  styles.completedItemText,
                                  themedStyles.completedItemText,
                                ],
                              ]}
                            >
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                          <View style={styles.checklistIconArea}>
                            <TouchableOpacity
                              onPress={() => handleToggleChecklistItem(item.id)}
                              style={[
                                styles.checkButton,
                                item.isCompleted
                                  ? themedStyles.checkButton
                                  : themedStyles.checkButtonInactive,
                              ]}
                              activeOpacity={0.7}
                            >
                              {item.isCompleted ? (
                                <Ionicons
                                  name="checkmark"
                                  size={18}
                                  color={memoizedColors.onPrimary}
                                />
                              ) : null}
                            </TouchableOpacity>
                            {isEditMode && (
                              <>
                                <TouchableOpacity
                                  onPress={() =>
                                    editingChecklistItem !== item.id &&
                                    handleStartEditChecklistItem(
                                      item.id,
                                      item.title
                                    )
                                  }
                                  style={[
                                    styles.editItemButton,
                                    styles.checklistIconButton,
                                  ]}
                                  activeOpacity={
                                    editingChecklistItem !== item.id ? 0.7 : 1
                                  }
                                  disabled={editingChecklistItem === item.id}
                                >
                                  <Ionicons
                                    name="create-outline"
                                    size={16}
                                    color={memoizedColors.primary}
                                    style={[
                                      styles.editIconOpacity,
                                      {
                                        opacity:
                                          editingChecklistItem !== item.id
                                            ? 1
                                            : 0,
                                      },
                                    ]}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDeleteChecklistItem(item.id)
                                  }
                                  style={[
                                    styles.deleteItemButton,
                                    styles.checklistIconButton,
                                  ]}
                                  activeOpacity={0.7}
                                >
                                  <Ionicons
                                    name="close"
                                    size={16}
                                    color={memoizedColors.error}
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </>
                      )}
                    </View>
                  ))
                ) : (
                  <Text
                    style={[styles.emptyChecklist, themedStyles.emptyChecklist]}
                  >
                    체크리스트 항목이 없습니다.
                  </Text>
                )}
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, themedStyles.modalFooter]}>
              <View style={styles.footerButtonsContainer}>
                {onDeleteTask && (
                  <TouchableOpacity
                    onPress={handleDeleteTask}
                    style={styles.deleteFooterButton}
                  >
                    <Ionicons
                      name="trash"
                      size={16}
                      color={memoizedColors.onPrimary}
                    />
                    <Text style={styles.deleteFooterButtonText}>삭제</Text>
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
                            onClose();
                          }
                        : undefined
                    }
                    style={styles.editButton}
                    disabled={!hasChanges}
                    activeOpacity={hasChanges ? 0.7 : 1}
                  >
                    <Ionicons
                      name="pencil"
                      size={16}
                      color={hasChanges ? "#007AFF" : "#8E8E93"}
                    />
                    <Text
                      style={[
                        styles.editButtonText,
                        { color: hasChanges ? "#007AFF" : "#8E8E93" },
                      ]}
                    >
                      저장
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    minHeight: height * 0.5,
    flex: 1,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "700",
    fontSize: 20,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editModeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 12,
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
  },

  deleteButton: {
    padding: 8,
  },
  modalContent: {
    padding: 24,
    flex: 1,
  },

  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  taskTitle: {
    ...TYPOGRAPHY.h2,
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  infoSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    minHeight: 28,
    paddingVertical: 4,
  },
  infoLabel: {
    ...TYPOGRAPHY.body2,
    fontSize: 15,
    fontWeight: "500",
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    fontSize: 15,
  },

  checklistSection: {
    marginBottom: 24,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 20,
    padding: 18,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  checklistTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "700",
    fontSize: 18,
  },
  addItemButton: {
    padding: 10,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    ...TYPOGRAPHY.body2,
    fontSize: 16,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  addItemSubmitButton: {
    padding: 14,
    borderRadius: 10,
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checklistCheckbox: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
  checklistItemText: {
    flex: 1,
    ...TYPOGRAPHY.body2,
    textAlign: "left",
    paddingLeft: 0,
    lineHeight: 22,
    fontSize: 16,
    fontWeight: "500",
  },
  completedItemText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
    fontStyle: "italic",
  },
  deleteItemButton: {
    padding: 4,
    minHeight: 32, // 고정 높이 적용
    justifyContent: "center",
    alignItems: "center",
  },
  emptyChecklist: {
    ...TYPOGRAPHY.body2,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 32,
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 16,
  },
  modalFooter: {
    padding: 20,
    paddingHorizontal: 24,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#FF3B30",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteFooterButtonText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  fixedModalTitle: {
    minHeight: 28, // 한 줄 기준 높이 고정 (폰트 크기와 패딩에 따라 조정)
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  checklistIconArea: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  checklistIconButton: {
    minWidth: 32,
    minHeight: 32,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkButton: {
    minWidth: 36,
    minHeight: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  editItemButton: {
    minWidth: 32,
    minHeight: 32,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  checklistEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checklistContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minHeight: 32,
  },
  scrollContent: {
    flexGrow: 1,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
  },
  titleEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
    width: "100%",
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    width: "100%",
  },
  titleEditIndicator: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -8 }],
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    zIndex: 1,
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  editIconOpacity: {
    // 기본 스타일 (투명도는 인라인으로 설정)
  },
});

export default TaskDetailModal;
