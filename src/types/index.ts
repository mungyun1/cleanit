// 청소 항목 타입
export interface CleaningTask {
  id: string;
  title: string;
  description?: string;
  space: string; // 공간 (거실, 주방, 욕실 등)
  frequency: Frequency;
  lastCompleted?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 청소 주기 타입
export type Frequency = "daily" | "weekly" | "biweekly" | "monthly" | "custom";

// 공간 타입
export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
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
export interface CleaningStats {
  totalTasks: number;
  completedThisWeek: number;
  completedThisMonth: number;
  streak: number; // 연속 완료 일수
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
