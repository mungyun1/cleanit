import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import { ScheduledTask } from "../data/unifiedData";
import { Ionicons } from "@expo/vector-icons";

interface ScheduledTasksModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  tasks: ScheduledTask[];
}

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.9;
const SIDE_PADDING = (screenWidth - CARD_WIDTH) / 2;

const ScheduledTasksModal: React.FC<ScheduledTasksModalProps> = ({
  visible,
  onClose,
  date,
  tasks,
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "높음";
      case "medium":
        return "보통";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF6B6B";
      case "medium":
        return "#FFA726";
      case "low":
        return "#66BB6A";
      default:
        return colors.onBackground;
    }
  };

  const handleStartTask = (task: ScheduledTask) => {
    Alert.alert("작업 시작", `"${task.title}" 작업을 시작하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      { text: "시작", onPress: () => {} },
    ]);
  };

  const handleCompleteTask = (task: ScheduledTask) => {
    Alert.alert("작업 완료", `"${task.title}" 작업을 완료하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      { text: "완료", onPress: () => {} },
    ]);
  };

  const renderTaskCard = ({ item }: { item: ScheduledTask }) => (
    <View
      style={[
        styles.taskCard,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.onBackground,
          borderColor: colors.surface + "20",
          opacity: item.isCompleted ? 0.5 : 1, // 완료된 작업은 흐리게
        },
      ]}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <View
            style={[
              styles.areaBadge,
              { backgroundColor: colors.surface + "10" },
            ]}
          >
            <View
              style={[styles.areaIndicator, { backgroundColor: item.color }]}
            />
            <Text style={[styles.areaText, { color: colors.onBackground }]}>
              {item.area}
            </Text>
          </View>
          <Text style={[styles.taskTitle, { color: colors.onBackground }]}>
            {item.title}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor: getPriorityColor(item.priority),
                shadowColor: colors.onBackground,
              },
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityText(item.priority)}
            </Text>
          </View>
          {item.isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#66BB6A" />
              <Text style={styles.completedText}>완료됨</Text>
            </View>
          )}
        </View>
      </View>

      <View
        style={[
          styles.descriptionContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text
          style={[
            styles.descriptionLabel,
            { color: colors.onBackground + "60" },
          ]}
        >
          작업 내용
        </Text>
        <Text
          style={[
            styles.taskDescription,
            { color: colors.onBackground + "90" },
          ]}
        >
          {item.description}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.background,
              shadowColor: colors.onBackground,
            },
          ]}
        >
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>⏱️</Text>
          </View>
          <View style={styles.infoContent}>
            <Text
              style={[styles.infoLabel, { color: colors.onBackground + "60" }]}
            >
              예상 시간
            </Text>
            <Text style={[styles.infoValue, { color: colors.onBackground }]}>
              {item.estimatedTime}분
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.background,
              shadowColor: colors.onBackground,
            },
          ]}
        >
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>📍</Text>
          </View>
          <View style={styles.infoContent}>
            <Text
              style={[styles.infoLabel, { color: colors.onBackground + "60" }]}
            >
              공간
            </Text>
            <Text style={[styles.infoValue, { color: colors.onBackground }]}>
              {item.area}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {item.isCompleted ? (
          <View style={styles.completedMessageContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#66BB6A" />
            <Text style={styles.completedMessageText}>
              작업이 완료되었습니다
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.startButton,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.onBackground,
                },
              ]}
              onPress={() => handleStartTask(item)}
            >
              <Text
                style={[styles.startButtonText, { color: colors.onPrimary }]}
              >
                🚀 시작하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.completeButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                  shadowColor: colors.onBackground,
                },
              ]}
              onPress={() => handleCompleteTask(item)}
            >
              <Text
                style={[styles.completeButtonText, { color: colors.primary }]}
              >
                ✅ 완료하기
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderPaginationDots = () => {
    if (tasks.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {tasks.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: colors.onBackground + "20" },
              index === currentIndex && [
                styles.paginationDotActive,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ],
            ]}
          />
        ))}
      </View>
    );
  };

  // useCallback으로 고정
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  // useMemo로 고정
  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    []
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.onBackground }]}>
              {formatDate(date)}
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.onBackground + "80" }]}
            >
              완료한 작업 ({tasks.length}개)
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={onClose}
            >
              <Text
                style={[styles.closeButtonText, { color: colors.onBackground }]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.onBackground + "60" },
                ]}
              >
                예정된 작업이 없습니다.
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={tasks}
                renderItem={renderTaskCard}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                contentContainerStyle={{
                  paddingHorizontal: SIDE_PADDING,
                  alignItems: "center",
                }}
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"
                snapToAlignment="start"
                getItemLayout={(data, index) => ({
                  length: CARD_WIDTH,
                  offset: CARD_WIDTH * index,
                  index,
                })}
              />
              {renderPaginationDots()}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    position: "relative",
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: 5,
  },
  subtitle: {
    ...TYPOGRAPHY.h4,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
  },
  flatListContent: {
    alignItems: "center",
  },
  taskCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    width: CARD_WIDTH,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  areaBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  areaIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  areaText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
    fontSize: 12,
  },
  taskTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "700",
    lineHeight: 24,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  priorityText: {
    ...TYPOGRAPHY.caption,
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
  },
  descriptionContainer: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
  },
  descriptionLabel: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "600",
  },
  taskDescription: {
    ...TYPOGRAPHY.body2,
    lineHeight: 22,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  infoIconContainer: {
    marginRight: 10,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: 2,
    fontSize: 11,
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  startButton: {
    // backgroundColor는 인라인으로 적용
  },
  startButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "bold",
    fontSize: 15,
  },
  completeButton: {
    borderWidth: 2,
    // backgroundColor와 borderColor는 인라인으로 적용
  },
  completeButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "bold",
    fontSize: 15,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paginationDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F7E9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  completedText: {
    color: "#388E3C",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 13,
  },
  completedMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#E0F7E9",
    borderWidth: 2,
    borderColor: "#66BB6A",
    flex: 1,
  },
  completedMessageText: {
    color: "#388E3C",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
});

export default ScheduledTasksModal;
