import { ChecklistItem, FrequencySettings, DayOfWeek } from "../types";
import { DEFAULT_CHECKLIST_TEMPLATES } from "../constants";
import { LAUNDRY_TEMPLATES, PET_TEMPLATES } from "../data/taskFormData";

// 체크리스트 아이템 생성 함수
export const createChecklistItem = (title: string): ChecklistItem => ({
  id: Date.now().toString(),
  title: title.trim(),
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// 템플릿에서 체크리스트 아이템 생성 함수
export const createChecklistFromTemplate = (
  templateItems: string[]
): ChecklistItem[] => {
  return templateItems.map((item, index) => ({
    id: `template-${Date.now()}-${index}`,
    title: item,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

// 청소 작업용 체크리스트 템플릿 가져오기
export const getCleaningChecklistTemplate = (
  space: string
): ChecklistItem[] => {
  const templateItems =
    DEFAULT_CHECKLIST_TEMPLATES[
      space as keyof typeof DEFAULT_CHECKLIST_TEMPLATES
    ];
  return templateItems ? createChecklistFromTemplate(templateItems) : [];
};

// 빨래 작업용 체크리스트 템플릿 가져오기
export const getLaundryChecklistTemplate = (
  laundryType: string
): ChecklistItem[] => {
  const templateItems =
    LAUNDRY_TEMPLATES[laundryType as keyof typeof LAUNDRY_TEMPLATES] || [];
  return createChecklistFromTemplate([...templateItems]);
};

// 반려동물 작업용 체크리스트 템플릿 가져오기
export const getPetChecklistTemplate = (petType: string): ChecklistItem[] => {
  const templateItems =
    PET_TEMPLATES[petType as keyof typeof PET_TEMPLATES] || [];
  return createChecklistFromTemplate([...templateItems]);
};

// 제목 자동 완성 함수
export const generateAutoTitle = (
  category: "cleaning" | "laundry" | "pet",
  space?: string,
  laundryType?: string,
  laundryTypeLabel?: string,
  petType?: string,
  petTypeLabel?: string
): string => {
  if (category === "cleaning" && space) {
    return `${space} 청소`;
  } else if (category === "laundry" && laundryTypeLabel) {
    return `${laundryTypeLabel} 빨래`;
  } else if (category === "pet" && petTypeLabel) {
    return `${petTypeLabel} 케어`;
  }
  return "";
};

// 기존 제목이 기본 제목인지 확인하는 함수
export const isDefaultTitle = (
  title: string,
  category: "cleaning" | "laundry" | "pet"
): boolean => {
  if (category === "cleaning") {
    return !title || title === "" || !!title.match(/^.*\s*청소$/);
  } else if (category === "laundry") {
    return !title || title === "" || !!title.match(/^.*\s*빨래$/);
  } else if (category === "pet") {
    return !title || title === "" || !!title.match(/^.*\s*케어$/);
  }
  return false;
};

// 요일 토글 함수
export const toggleDayOfWeek = (
  currentDays: DayOfWeek[],
  day: DayOfWeek
): DayOfWeek[] => {
  return currentDays.includes(day)
    ? currentDays.filter((d) => d !== day)
    : [...currentDays, day];
};

// 폼 유효성 검사 함수
export const validateTaskForm = (
  title: string,
  category: "cleaning" | "laundry" | "pet",
  space: string,
  laundryType: string | undefined,
  petType: string | undefined,
  frequency: FrequencySettings
): { isValid: boolean; errorMessage?: string } => {
  if (!title.trim()) {
    return { isValid: false, errorMessage: "작업 제목을 입력해주세요." };
  }

  if (category === "cleaning" && !space) {
    return { isValid: false, errorMessage: "공간을 선택해주세요." };
  }

  if (category === "laundry" && !laundryType) {
    return { isValid: false, errorMessage: "빨래 타입을 선택해주세요." };
  }

  if (category === "pet" && !petType) {
    return { isValid: false, errorMessage: "반려동물 타입을 선택해주세요." };
  }

  if (!frequency.type) {
    return { isValid: false, errorMessage: "주기를 선택해주세요." };
  }

  // 월간 주기일 때 몇째주와 요일 선택 검증
  if (frequency.type === "monthly") {
    if (!frequency.monthlyWeek) {
      return { isValid: false, errorMessage: "몇째주를 선택해주세요." };
    }
    if (!frequency.monthlyDay) {
      return { isValid: false, errorMessage: "요일을 선택해주세요." };
    }
  }

  return { isValid: true };
};
