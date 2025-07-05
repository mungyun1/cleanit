import React, { useState, useRef } from "react";
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
import { COLORS, TYPOGRAPHY } from "../constants";
import { ScheduledTask } from "../data/mockData";

interface ScheduledTasksModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  tasks: ScheduledTask[];
}

const { width: screenWidth } = Dimensions.get("window");

const ScheduledTasksModal: React.FC<ScheduledTasksModalProps> = ({
  visible,
  onClose,
  date,
  tasks,
}) => {
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
        return COLORS.onBackground;
    }
  };

  const handleStartTask = (task: ScheduledTask) => {
    Alert.alert("작업 시작", `"${task.title}" 작업을 시작하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      { text: "시작", onPress: () => console.log("작업 시작:", task.id) },
    ]);
  };

  const handleCompleteTask = (task: ScheduledTask) => {
    Alert.alert("작업 완료", `"${task.title}" 작업을 완료하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      { text: "완료", onPress: () => console.log("작업 완료:", task.id) },
    ]);
  };

  const renderTaskCard = ({ item }: { item: ScheduledTask }) => (
    <View style={styles.taskCard}>
      {/* 헤더 섹션 */}
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <View style={styles.areaBadge}>
            <View
              style={[styles.areaIndicator, { backgroundColor: item.color }]}
            />
            <Text style={styles.areaText}>{item.area}</Text>
          </View>
          <Text style={styles.taskTitle}>{item.title}</Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>
            {getPriorityText(item.priority)}
          </Text>
        </View>
      </View>

      {/* 설명 섹션 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>작업 내용</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
      </View>

      {/* 정보 섹션 */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>⏱️</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>예상 시간</Text>
            <Text style={styles.infoValue}>{item.estimatedTime}분</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>📍</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>공간</Text>
            <Text style={styles.infoValue}>{item.area}</Text>
          </View>
        </View>
      </View>

      {/* 액션 버튼 섹션 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.startButton]}
          onPress={() => handleStartTask(item)}
        >
          <Text style={styles.startButtonText}>🚀 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.completeButton]}
          onPress={() => handleCompleteTask(item)}
        >
          <Text style={styles.completeButtonText}>✅ 완료하기</Text>
        </TouchableOpacity>
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
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>💫 {formatDate(date)}</Text>
            <Text style={styles.subtitle}>예정된 작업 ({tasks.length}개)</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>예정된 작업이 없습니다.</Text>
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={tasks}
                renderItem={renderTaskCard}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                contentContainerStyle={styles.flatListContent}
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
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    position: "relative",
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onBackground,
    marginBottom: 5,
  },
  subtitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onBackground + "80",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.onBackground,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onBackground + "60",
  },
  flatListContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    width: screenWidth - 40,
    minWidth: screenWidth - 40,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.surface + "20",
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
    backgroundColor: COLORS.surface + "10",
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
    color: COLORS.onBackground,
    fontWeight: "600",
    fontSize: 12,
  },
  taskTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onBackground,
    fontWeight: "700",
    lineHeight: 24,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priorityText: {
    ...TYPOGRAPHY.caption,
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
  },
  descriptionContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
  },
  descriptionLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "60",
    marginBottom: 8,
    fontWeight: "600",
  },
  taskDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground + "90",
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
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
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
    color: COLORS.onBackground + "60",
    marginBottom: 2,
    fontSize: 11,
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onBackground,
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
    shadowColor: COLORS.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  startButton: {
    backgroundColor: COLORS.primary,
  },
  startButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onPrimary,
    fontWeight: "bold",
    fontSize: 15,
  },
  completeButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  completeButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
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
    backgroundColor: COLORS.onBackground + "20",
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ScheduledTasksModal;
