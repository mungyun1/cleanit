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
  Animated,
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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

const ScheduledTasksModal: React.FC<ScheduledTasksModalProps> = ({
  visible,
  onClose,
  date,
  tasks,
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [listWidth, setListWidth] = useState(screenWidth);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

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
        return "#FF4757";
      case "medium":
        return "#FFA502";
      case "low":
        return "#2ED573";
      default:
        return colors.onBackground;
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case "high":
        return ["#FF4757", "#FF3742"];
      case "medium":
        return ["#FFA502", "#FF9500"];
      case "low":
        return ["#2ED573", "#1ED760"];
      default:
        return [colors.primary, colors.primary];
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

  const renderTaskCard = ({
    item,
    index,
  }: {
    item: ScheduledTask;
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.taskCard,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.onBackground,
          borderColor: colors.surface + "15",
          opacity: item.isCompleted ? 0.7 : 1,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <View
            style={[
              styles.areaBadge,
              {
                backgroundColor: item.color + "15",
                borderColor: item.color + "30",
              },
            ]}
          >
            <View
              style={[styles.areaIndicator, { backgroundColor: item.color }]}
            />
            <Text style={[styles.areaText, { color: item.color }]}>
              {item.area}
            </Text>
          </View>
          <Text style={[styles.taskTitle, { color: colors.onBackground }]}>
            {item.title}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor: getPriorityColor(item.priority),
                shadowColor: getPriorityColor(item.priority),
              },
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityText(item.priority)}
            </Text>
          </View>
          {item.isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#2ED573" />
              <Text style={styles.completedText}>완료됨</Text>
            </View>
          )}
        </View>
      </View>

      <View
        style={[
          styles.descriptionContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.surface + "20",
          },
        ]}
      >
        <Text
          style={[
            styles.descriptionLabel,
            { color: colors.onBackground + "70" },
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
              borderColor: colors.surface + "15",
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
              borderColor: colors.surface + "15",
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
            <Ionicons name="checkmark-circle" size={20} color="#2ED573" />
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
                  shadowColor: colors.primary,
                },
              ]}
              onPress={() => handleStartTask(item)}
              activeOpacity={0.8}
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
              activeOpacity={0.8}
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
    </Animated.View>
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

  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

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
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.background,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.surface + "20" },
            ]}
          >
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.onBackground }]}>
                {formatDate(date)}
              </Text>
              <Text
                style={[styles.subtitle, { color: colors.onBackground + "70" }]}
              >
                예정된 작업 ({tasks.length}개)
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.onBackground} />
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[styles.emptyIcon, { backgroundColor: colors.surface }]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={40}
                  color={colors.onBackground + "40"}
                />
              </View>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.onBackground + "60" },
                ]}
              >
                예정된 작업이 없습니다.
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: colors.onBackground + "40" },
                ]}
              >
                새로운 계획을 추가해보세요!
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                style={{ width: "100%" }}
                onLayout={(e) => setListWidth(e.nativeEvent.layout.width)}
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
                  paddingHorizontal: (listWidth - CARD_WIDTH) / 2,
                  alignItems: "center",
                  paddingVertical: 16,
                }}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate={"fast"}
                snapToAlignment="center"
                getItemLayout={(data, index) => ({
                  length: SNAP_INTERVAL,
                  offset: SNAP_INTERVAL * index,
                  index,
                })}
              />
              {renderPaginationDots()}
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: 6,
    fontWeight: "700",
  },
  subtitle: {
    ...TYPOGRAPHY.h4,
    fontWeight: "500",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    ...TYPOGRAPHY.h3,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    ...TYPOGRAPHY.body1,
    textAlign: "center",
  },
  taskCard: {
    borderRadius: 24,
    padding: 18,
    marginHorizontal: CARD_MARGIN,
    width: CARD_WIDTH,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    minHeight: 70,
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 16,
    justifyContent: "flex-start",
  },
  areaBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
  },
  areaIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  areaText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "700",
    fontSize: 13,
  },
  taskTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "700",
    lineHeight: 26,
  },
  badgeContainer: {
    alignItems: "flex-start",
    gap: 8,
    justifyContent: "flex-start",
    flexShrink: 0,
    minWidth: 80,
  },
  priorityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityText: {
    ...TYPOGRAPHY.caption,
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  descriptionContainer: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  descriptionLabel: {
    ...TYPOGRAPHY.body2,
    marginBottom: 10,
    fontWeight: "600",
  },
  taskDescription: {
    ...TYPOGRAPHY.body2,
    lineHeight: 24,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  infoIconContainer: {
    marginRight: 14,
  },
  infoIcon: {
    fontSize: 22,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: 4,
    fontSize: 12,
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "700",
    fontSize: 15,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  startButton: {
    // backgroundColor는 인라인으로 적용
  },
  startButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "700",
    fontSize: 16,
  },
  completeButton: {
    borderWidth: 2,
    // backgroundColor와 borderColor는 인라인으로 적용
  },
  completeButtonText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "700",
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paginationDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2ED573",
  },
  completedText: {
    color: "#2ED573",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 13,
  },
  completedMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#E8F5E8",
    borderWidth: 2,
    borderColor: "#2ED573",
    flex: 1,
  },
  completedMessageText: {
    color: "#2ED573",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ScheduledTasksModal;
