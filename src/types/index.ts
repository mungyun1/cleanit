// 세부 체크리스트 항목 타입
export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 가사 작업 타입 (청소 + 빨래 + 반려동물)
export interface HouseholdTask {
  id: string;
  title: string;
  description?: string;
  label?: string; // 작업 라벨 (카테고리별 한글 표시)
  category: "cleaning" | "laundry" | "pet"; // 청소, 빨래, 또는 반려동물
  space?: string; // 청소용 공간 (거실, 주방, 욕실 등)
  laundryType?: "whites" | "colors" | "delicates" | "bedding" | "towels"; // 빨래용 타입
  petType?: "dog" | "cat" | "bird" | "fish" | "hamster"; // 반려동물 타입
  frequency: FrequencySettings;
  lastCompleted?: Date;
  isCompleted: boolean;
  checklistItems: ChecklistItem[]; // 세부 체크리스트
  createdAt: Date;
  updatedAt: Date;
}

// 기존 CleaningTask는 호환성을 위해 유지
export interface CleaningTask extends HouseholdTask {
  category: "cleaning";
  space: string;
}

// 빨래 작업 타입
export interface LaundryTask extends HouseholdTask {
  category: "laundry";
  laundryType: "whites" | "colors" | "delicates" | "bedding" | "towels";
}

// 반려동물 작업 타입
export interface PetTask extends HouseholdTask {
  category: "pet";
  petType: "dog" | "cat" | "bird" | "fish" | "hamster";
}

// 청소 주기 타입
export type Frequency = "daily" | "weekly" | "biweekly" | "monthly" | "custom";

// 요일 타입
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// 월간 주기 타입
export type MonthlyWeek = "first" | "second" | "third" | "fourth" | "last";

// 청소 주기 설정 타입
export interface FrequencySettings {
  type?: Frequency; // 선택되지 않은 상태를 허용
  daysOfWeek?: DayOfWeek[]; // weekly, biweekly일 때 사용 (여러 요일 선택 가능)
  customDays?: number; // custom일 때 사용 (예: 3일마다)
  monthlyWeek?: MonthlyWeek; // monthly일 때 사용 (몇째주)
  monthlyDay?: DayOfWeek; // monthly일 때 사용 (무슨 요일)
}

// 공간 타입
export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// 빨래 타입 설정
export interface LaundryType {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

// 완료 기록 타입
export interface CompletionRecord {
  id: string;
  taskId: string;
  completedAt: Date;
  notes?: string;
}

// 사용자 설정 타입
export interface UserSettings {
  notifications: boolean;
  notificationTime?: string; // "09:00" 형식
  darkMode: boolean;
  language: "ko" | "en";
}

// 통계 타입
export interface HouseholdStats {
  totalTasks: number;
  completedThisWeek: number;
  completedThisMonth: number;
  streak: number; // 연속 완료 일수
  cleaningTasks: number;
  laundryTasks: number;
}

// 네비게이션 타입
export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Calendar: undefined;
  TaskManagement: undefined;
  Settings: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
};
