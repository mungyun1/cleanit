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
import {
  HouseholdTask,
  ChecklistItem,
  FrequencySettings,
  MonthlyWeek,
} from "../types";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import {
  SPACES,
  LAUNDRY_TYPES,
  PET_TYPES,
  FREQUENCIES,
  DAYS_OF_WEEK,
  MONTHLY_WEEKS,
  BIWEEKLY_WEEKS,
} from "../data/unifiedData";
import {
  createChecklistItem,
  getCleaningChecklistTemplate,
  getLaundryChecklistTemplate,
  getPetChecklistTemplate,
  generateAutoTitle,
  isDefaultTitle,
  toggleDayOfWeek,
  validateTaskForm,
} from "../utils/taskFormUtils";
import CustomInputField from "./CustomInputField";

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
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "cleaning" | "laundry" | "pet"
  >("cleaning");
  const [selectedSpace, setSelectedSpace] = useState("");
  const [selectedLaundryType, setSelectedLaundryType] = useState<
    "whites" | "colors" | "delicates" | "bedding" | "towels" | undefined
  >(undefined);
  const [selectedPetType, setSelectedPetType] = useState<
    "dog" | "cat" | "bird" | "fish" | "hamster" | undefined
  >(undefined);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencySettings>(
    {
      type: undefined,
      daysOfWeek: [],
    }
  );
  const [customSpaces, setCustomSpaces] = useState<string[]>([]);
  const [customLaundryTypes, setCustomLaundryTypes] = useState<string[]>([]);
  const [customPetTypes, setCustomPetTypes] = useState<string[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);

  // 카테고리나 공간/빨래 타입/반려동물 타입 선택 시 기본 체크리스트 템플릿 적용 및 제목 자동 완성
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
    } else if (selectedCategory === "pet" && selectedPetType) {
      // 반려동물 타입에 따른 제목 자동 완성
      const petTypeText = PET_TYPES.find(
        (pt) => pt.value === selectedPetType
      )?.label;
      if (isDefaultTitle(title, "pet")) {
        setTitle(
          generateAutoTitle(
            "pet",
            undefined,
            undefined,
            undefined,
            selectedPetType,
            petTypeText
          )
        );
      }

      // 반려동물 기본 체크리스트 템플릿 적용
      const newChecklistItems = getPetChecklistTemplate(selectedPetType);
      setChecklistItems(newChecklistItems);
    }
  }, [selectedCategory, selectedSpace, selectedLaundryType, selectedPetType]);

  const handleAddCustomSpace = (value: string) => {
    if (SPACES.includes(value) || customSpaces.includes(value)) {
      Alert.alert("오류", "이미 존재하는 공간입니다.");
      return;
    }
    setCustomSpaces([...customSpaces, value]);
    setSelectedSpace(value);
  };

  const handleAddCustomLaundryType = (value: string) => {
    const existingTypes = LAUNDRY_TYPES.map((type) => type.label);
    if (existingTypes.includes(value) || customLaundryTypes.includes(value)) {
      Alert.alert("오류", "이미 존재하는 빨래 타입입니다.");
      return;
    }
    setCustomLaundryTypes([...customLaundryTypes, value]);
    setSelectedLaundryType(value as any);
  };

  const handleAddCustomPetType = (value: string) => {
    const existingTypes = PET_TYPES.map((type) => type.label);
    if (existingTypes.includes(value) || customPetTypes.includes(value)) {
      Alert.alert("오류", "이미 존재하는 반려동물 타입입니다.");
      return;
    }
    setCustomPetTypes([...customPetTypes, value]);
    setSelectedPetType(value as any);
  };

  const handleDeleteCustomSpace = (space: string) => {
    setCustomSpaces(customSpaces.filter((s) => s !== space));
    if (selectedSpace === space) {
      setSelectedSpace("");
    }
  };

  const handleDeleteCustomLaundryType = (type: string) => {
    setCustomLaundryTypes(customLaundryTypes.filter((t) => t !== type));
    if (selectedLaundryType === type) {
      setSelectedLaundryType(undefined);
    }
  };

  const handleDeleteCustomPetType = (type: string) => {
    setCustomPetTypes(customPetTypes.filter((t) => t !== type));
    if (selectedPetType === type) {
      setSelectedPetType(undefined);
    }
  };

  const handleCategoryChange = (category: "cleaning" | "laundry" | "pet") => {
    setSelectedCategory(category);
    // 카테고리 변경 시 관련 상태들 초기화
    setSelectedSpace("");
    setSelectedLaundryType(undefined);
    setSelectedPetType(undefined);
    setSelectedFrequency({
      type: undefined,
      daysOfWeek: [],
      biweeklyWeek: undefined,
    });
    setChecklistItems([]);
    // 제목도 초기화 (기본 제목인 경우에만)
    if (isDefaultTitle(title, category)) {
      setTitle("");
    }
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
      selectedPetType,
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
      petType: selectedCategory === "pet" ? selectedPetType : undefined,
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
    setSelectedPetType(undefined);
    setSelectedFrequency({
      type: undefined,
      daysOfWeek: [],
      biweeklyWeek: undefined,
    });
    setCustomSpaces([]);
    setCustomLaundryTypes([]);
    setCustomPetTypes([]);
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
      selectedPetType,
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
            <View style={styles.headerTop}>
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: colors.onBackground + "30" },
                ]}
              />
            </View>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.onBackground} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.onBackground }]}>
                새 작업 추가
              </Text>
              <TouchableOpacity
                onPress={handleSaveTask}
                style={[
                  styles.saveButton,
                  { backgroundColor: colors.primary },
                  !isFormValid() && [
                    { backgroundColor: colors.onBackground + "30" },
                  ],
                ]}
                disabled={!isFormValid()}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: colors.onPrimary },
                    !isFormValid() && [{ color: colors.onBackground + "60" }],
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
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                카테고리
              </Text>
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: colors.onBackground + "20",
                      backgroundColor: colors.surface,
                    },
                    selectedCategory === "cleaning" && [
                      styles.categoryButtonSelected,
                      {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary,
                      },
                    ],
                  ]}
                  onPress={() => handleCategoryChange("cleaning")}
                >
                  <Ionicons
                    name="brush"
                    size={20}
                    color={
                      selectedCategory === "cleaning"
                        ? colors.onPrimary
                        : colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.onBackground },
                      selectedCategory === "cleaning" && [
                        styles.categoryButtonTextSelected,
                        { color: colors.onPrimary },
                      ],
                    ]}
                  >
                    청소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: colors.onBackground + "20",
                      backgroundColor: colors.surface,
                    },
                    selectedCategory === "laundry" && [
                      styles.categoryButtonSelected,
                      {
                        borderColor: colors.secondary,
                        backgroundColor: colors.secondary,
                      },
                    ],
                  ]}
                  onPress={() => handleCategoryChange("laundry")}
                >
                  <Ionicons
                    name="shirt"
                    size={20}
                    color={
                      selectedCategory === "laundry"
                        ? colors.onPrimary
                        : colors.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.onBackground },
                      selectedCategory === "laundry" && [
                        styles.categoryButtonTextSelected,
                        { color: colors.onPrimary },
                      ],
                    ]}
                  >
                    빨래
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    {
                      borderColor: colors.onBackground + "20",
                      backgroundColor: colors.surface,
                    },
                    selectedCategory === "pet" && [
                      styles.categoryButtonSelected,
                      {
                        borderColor: colors.secondary,
                        backgroundColor: colors.secondary,
                      },
                    ],
                  ]}
                  onPress={() => handleCategoryChange("pet")}
                >
                  <Ionicons
                    name="paw"
                    size={20}
                    color={
                      selectedCategory === "pet"
                        ? colors.onPrimary
                        : colors.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      { color: colors.onBackground },
                      selectedCategory === "pet" && [
                        styles.categoryButtonTextSelected,
                        { color: colors.onPrimary },
                      ],
                    ]}
                  >
                    반려동물
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 제목 입력 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                작업 제목
              </Text>
              <TextInput
                style={[
                  styles.titleInput,
                  {
                    borderColor: colors.onBackground + "30",
                    color: colors.onBackground,
                  },
                ]}
                placeholder="작업 제목을 입력하세요"
                placeholderTextColor={colors.onBackground + "60"}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            {/* 공간/빨래 타입/반려동물 타입 선택 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                {selectedCategory === "cleaning"
                  ? "공간"
                  : selectedCategory === "laundry"
                    ? "빨래 타입"
                    : "반려동물 타입"}
              </Text>

              {selectedCategory === "cleaning" ? (
                <View style={styles.optionsContainer}>
                  {SPACES.map((space) => (
                    <TouchableOpacity
                      key={space}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: colors.onBackground + "30",
                          backgroundColor: colors.surface,
                        },
                        selectedSpace === space && [
                          styles.optionButtonSelected,
                          {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          },
                        ],
                      ]}
                      onPress={() => setSelectedSpace(space)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          { color: colors.onBackground },
                          selectedSpace === space && [
                            styles.optionButtonTextSelected,
                            { color: colors.onPrimary },
                          ],
                        ]}
                      >
                        {space}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {customSpaces.map((space) => (
                    <View key={space} style={styles.customOptionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedSpace === space && [
                            styles.optionButtonSelected,
                            {
                              borderColor: colors.primary,
                              backgroundColor: colors.primary,
                            },
                          ],
                        ]}
                        onPress={() => setSelectedSpace(space)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            { color: colors.onBackground },
                            selectedSpace === space && [
                              styles.optionButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {space}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteCustomButton}
                        onPress={() => handleDeleteCustomSpace(space)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <CustomInputField
                    placeholder="예: 서재, 다용도실, 베란다..."
                    onAdd={handleAddCustomSpace}
                    existingValues={[...SPACES, ...customSpaces]}
                    errorMessage="이미 존재하는 공간입니다."
                  />
                </View>
              ) : selectedCategory === "laundry" ? (
                <View style={styles.optionsContainer}>
                  {LAUNDRY_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: colors.onBackground + "30",
                          backgroundColor: colors.surface,
                        },
                        selectedLaundryType === type.value && [
                          styles.optionButtonSelected,
                          {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          },
                        ],
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
                          { color: colors.onBackground },
                          selectedLaundryType === type.value && [
                            styles.optionButtonTextSelected,
                            { color: colors.onPrimary },
                          ],
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {customLaundryTypes.map((type) => (
                    <View key={type} style={styles.customOptionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedLaundryType === type && [
                            styles.optionButtonSelected,
                            {
                              borderColor: colors.primary,
                              backgroundColor: colors.primary,
                            },
                          ],
                        ]}
                        onPress={() => setSelectedLaundryType(type as any)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            { color: colors.onBackground },
                            selectedLaundryType === type && [
                              styles.optionButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteCustomButton}
                        onPress={() => handleDeleteCustomLaundryType(type)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <CustomInputField
                    placeholder="예: 운동복, 양말, 속옷..."
                    onAdd={handleAddCustomLaundryType}
                    existingValues={[
                      ...LAUNDRY_TYPES.map((type) => type.label),
                      ...customLaundryTypes,
                    ]}
                    errorMessage="이미 존재하는 빨래 타입입니다."
                  />
                </View>
              ) : selectedCategory === "pet" ? (
                <View style={styles.optionsContainer}>
                  {PET_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: colors.onBackground + "30",
                          backgroundColor: colors.surface,
                        },
                        selectedPetType === type.value && [
                          styles.optionButtonSelected,
                          {
                            borderColor: colors.secondary,
                            backgroundColor: colors.secondary,
                          },
                        ],
                      ]}
                      onPress={() =>
                        setSelectedPetType(
                          type.value as
                            | "dog"
                            | "cat"
                            | "bird"
                            | "fish"
                            | "hamster"
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          { color: colors.onBackground },
                          selectedPetType === type.value && [
                            styles.optionButtonTextSelected,
                            { color: colors.onPrimary },
                          ],
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {customPetTypes.map((type) => (
                    <View key={type} style={styles.customOptionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedPetType === type && [
                            styles.optionButtonSelected,
                            {
                              borderColor: colors.secondary,
                              backgroundColor: colors.secondary,
                            },
                          ],
                        ]}
                        onPress={() => setSelectedPetType(type as any)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            { color: colors.onBackground },
                            selectedPetType === type && [
                              styles.optionButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteCustomButton}
                        onPress={() => handleDeleteCustomPetType(type)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <CustomInputField
                    placeholder="예: 토끼, 거북이, 앵무새..."
                    onAdd={handleAddCustomPetType}
                    existingValues={[
                      ...PET_TYPES.map((type) => type.label),
                      ...customPetTypes,
                    ]}
                    errorMessage="이미 존재하는 반려동물 타입입니다."
                  />
                </View>
              ) : null}
            </View>

            {/* 주기 선택 */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.onBackground }]}
              >
                주기
              </Text>
              <View style={styles.optionsContainer}>
                {FREQUENCIES.map((frequency) => (
                  <TouchableOpacity
                    key={frequency.value}
                    style={[
                      styles.optionButton,
                      {
                        borderColor: colors.onBackground + "30",
                        backgroundColor: colors.surface,
                      },
                      selectedFrequency.type === frequency.value && [
                        styles.optionButtonSelected,
                        {
                          borderColor: colors.primary,
                          backgroundColor: colors.primary,
                        },
                      ],
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
                        { color: colors.onBackground },
                        selectedFrequency.type === frequency.value && [
                          styles.optionButtonTextSelected,
                          { color: colors.onPrimary },
                        ],
                      ]}
                    >
                      {frequency.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 요일 선택 (weekly일 때) */}
              {selectedFrequency.type === "weekly" && (
                <View style={styles.daysContainer}>
                  <Text
                    style={[styles.daysTitle, { color: colors.onBackground }]}
                  >
                    요일 선택
                  </Text>
                  <View style={styles.daysGrid}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.dayButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedFrequency.daysOfWeek?.includes(day.value) && [
                            styles.dayButtonSelected,
                            {
                              borderColor: colors.primary,
                              backgroundColor: colors.primary,
                            },
                          ],
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
                            { color: colors.onBackground },
                            selectedFrequency.daysOfWeek?.includes(
                              day.value
                            ) && [
                              styles.dayButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 격주 주기 선택 (biweekly일 때) */}
              {selectedFrequency.type === "biweekly" && (
                <View style={styles.biweeklyContainer}>
                  <Text
                    style={[
                      styles.biweeklyTitle,
                      { color: colors.onBackground },
                    ]}
                  >
                    주 선택
                  </Text>
                  <View style={styles.biweeklyWeekGrid}>
                    {BIWEEKLY_WEEKS.map((week) => (
                      <TouchableOpacity
                        key={week.value}
                        style={[
                          styles.biweeklyWeekButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedFrequency.biweeklyWeek === week.value && [
                            styles.biweeklyWeekButtonSelected,
                            {
                              borderColor: colors.primary,
                              backgroundColor: colors.primary,
                            },
                          ],
                        ]}
                        onPress={() => {
                          setSelectedFrequency({
                            ...selectedFrequency,
                            biweeklyWeek: week.value,
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.biweeklyWeekButtonText,
                            { color: colors.onBackground },
                            selectedFrequency.biweeklyWeek === week.value && [
                              styles.biweeklyWeekButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {week.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {selectedFrequency.biweeklyWeek && (
                    <View style={styles.biweeklyDayContainer}>
                      <Text
                        style={[
                          styles.biweeklyDayTitle,
                          { color: colors.onBackground },
                        ]}
                      >
                        요일 선택
                      </Text>
                      <View style={styles.biweeklyDayGrid}>
                        {DAYS_OF_WEEK.map((day) => (
                          <TouchableOpacity
                            key={day.value}
                            style={[
                              styles.biweeklyDayButton,
                              {
                                borderColor: colors.onBackground + "30",
                                backgroundColor: colors.surface,
                              },
                              selectedFrequency.daysOfWeek?.includes(
                                day.value
                              ) && [
                                styles.biweeklyDayButtonSelected,
                                {
                                  borderColor: colors.primary,
                                  backgroundColor: colors.primary,
                                },
                              ],
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
                                styles.biweeklyDayButtonText,
                                { color: colors.onBackground },
                                selectedFrequency.daysOfWeek?.includes(
                                  day.value
                                ) && [
                                  styles.biweeklyDayButtonTextSelected,
                                  { color: colors.onPrimary },
                                ],
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
              )}

              {/* 월간 주기 선택 (monthly일 때) */}
              {selectedFrequency.type === "monthly" && (
                <View style={styles.monthlyContainer}>
                  <Text
                    style={[
                      styles.monthlyTitle,
                      { color: colors.onBackground },
                    ]}
                  >
                    주 선택
                  </Text>
                  <View style={styles.monthlyWeekGrid}>
                    {MONTHLY_WEEKS.map((week) => (
                      <TouchableOpacity
                        key={week.value}
                        style={[
                          styles.monthlyWeekButton,
                          {
                            borderColor: colors.onBackground + "30",
                            backgroundColor: colors.surface,
                          },
                          selectedFrequency.monthlyWeek === week.value && [
                            styles.monthlyWeekButtonSelected,
                            {
                              borderColor: colors.primary,
                              backgroundColor: colors.primary,
                            },
                          ],
                        ]}
                        onPress={() => {
                          setSelectedFrequency({
                            ...selectedFrequency,
                            monthlyWeek: week.value,
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.monthlyWeekButtonText,
                            { color: colors.onBackground },
                            selectedFrequency.monthlyWeek === week.value && [
                              styles.monthlyWeekButtonTextSelected,
                              { color: colors.onPrimary },
                            ],
                          ]}
                        >
                          {week.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {selectedFrequency.monthlyWeek && (
                    <View style={styles.monthlyDayContainer}>
                      <Text
                        style={[
                          styles.monthlyDayTitle,
                          { color: colors.onBackground },
                        ]}
                      >
                        요일 선택
                      </Text>
                      <View style={styles.monthlyDayGrid}>
                        {DAYS_OF_WEEK.map((day) => (
                          <TouchableOpacity
                            key={day.value}
                            style={[
                              styles.monthlyDayButton,
                              {
                                borderColor: colors.onBackground + "30",
                                backgroundColor: colors.surface,
                              },
                              selectedFrequency.monthlyDay === day.value && [
                                styles.monthlyDayButtonSelected,
                                {
                                  borderColor: colors.primary,
                                  backgroundColor: colors.primary,
                                },
                              ],
                            ]}
                            onPress={() => {
                              setSelectedFrequency({
                                ...selectedFrequency,
                                monthlyDay: day.value,
                              });
                            }}
                          >
                            <Text
                              style={[
                                styles.monthlyDayButtonText,
                                { color: colors.onBackground },
                                selectedFrequency.monthlyDay === day.value && [
                                  styles.monthlyDayButtonTextSelected,
                                  { color: colors.onPrimary },
                                ],
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
              )}
            </View>

            {/* 체크리스트 */}
            <View style={styles.section}>
              <View style={styles.checklistHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.onBackground }]}
                >
                  체크리스트
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setIsAddingChecklistItem(!isAddingChecklistItem)
                  }
                  style={styles.addChecklistButton}
                >
                  <Ionicons
                    name={isAddingChecklistItem ? "remove" : "add"}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {isAddingChecklistItem && (
                <View style={styles.addChecklistContainer}>
                  <TextInput
                    style={[
                      styles.checklistInput,
                      {
                        borderColor: colors.onBackground + "30",
                        color: colors.onBackground,
                      },
                    ]}
                    placeholder="체크리스트 항목 추가"
                    placeholderTextColor={colors.onBackground + "60"}
                    value={newChecklistItem}
                    onChangeText={setNewChecklistItem}
                    onSubmitEditing={handleAddChecklistItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={handleAddChecklistItem}
                    style={[
                      styles.addChecklistConfirmButton,
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

              {checklistItems.length > 0 ? (
                checklistItems.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.checklistItem,
                      { backgroundColor: colors.surface },
                    ]}
                  >
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
                      style={styles.deleteChecklistButton}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.5,
    flex: 1,
  },
  modalHeader: {
    borderBottomWidth: 1,
  },
  headerTop: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
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
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  saveButtonText: {
    ...TYPOGRAPHY.button,
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
    marginBottom: 12,
    fontWeight: "600",
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },

  categoryButtonText: {
    ...TYPOGRAPHY.body2,
    marginLeft: 8,
    fontWeight: "500",
  },
  categoryButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  categoryButtonTextSelected: {
    // color는 인라인으로 적용
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    ...TYPOGRAPHY.body2,
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
  },
  optionButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  optionButtonText: {
    ...TYPOGRAPHY.body2,
  },
  optionButtonTextSelected: {
    fontWeight: "600",
  },
  customOptionContainer: {
    position: "relative",
  },
  deleteCustomButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  daysContainer: {
    marginTop: 16,
  },
  daysTitle: {
    ...TYPOGRAPHY.body2,
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
  },
  dayButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  dayButtonText: {
    ...TYPOGRAPHY.caption,
  },
  dayButtonTextSelected: {
    fontWeight: "600",
  },
  monthlyContainer: {
    marginTop: 16,
  },
  monthlyTitle: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "500",
  },
  monthlyWeekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  monthlyWeekButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  monthlyWeekButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  monthlyWeekButtonText: {
    ...TYPOGRAPHY.caption,
  },
  monthlyWeekButtonTextSelected: {
    fontWeight: "600",
  },
  monthlyDayContainer: {
    marginTop: 12,
  },
  monthlyDayTitle: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "500",
  },
  monthlyDayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monthlyDayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  monthlyDayButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  monthlyDayButtonText: {
    ...TYPOGRAPHY.caption,
  },
  monthlyDayButtonTextSelected: {
    fontWeight: "600",
  },

  biweeklyContainer: {
    marginTop: 16,
  },
  biweeklyTitle: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "500",
  },
  biweeklyWeekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  biweeklyWeekButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  biweeklyWeekButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  biweeklyWeekButtonText: {
    ...TYPOGRAPHY.caption,
  },
  biweeklyWeekButtonTextSelected: {
    fontWeight: "600",
  },
  biweeklyDayContainer: {
    marginTop: 12,
  },
  biweeklyDayTitle: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
    fontWeight: "500",
  },
  biweeklyDayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  biweeklyDayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  biweeklyDayButtonSelected: {
    // borderColor와 backgroundColor는 인라인으로 적용
  },
  biweeklyDayButtonText: {
    ...TYPOGRAPHY.caption,
  },
  biweeklyDayButtonTextSelected: {
    fontWeight: "600",
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
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    ...TYPOGRAPHY.body2,
  },
  addChecklistConfirmButton: {
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
  deleteChecklistButton: {
    padding: 4,
  },
  emptyChecklist: {
    ...TYPOGRAPHY.body2,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
});

export default AddTaskModal;
