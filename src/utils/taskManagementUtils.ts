import { HouseholdTask } from "../types";

// 작업 필터링 함수들
export const filterTasksByCategory = (
  tasks: HouseholdTask[],
  category: "cleaning" | "laundry" | "all"
): HouseholdTask[] => {
  if (category === "all") return tasks;
  return tasks.filter((task) => task.category === category);
};

export const filterTasksBySpace = (
  tasks: HouseholdTask[],
  space: string
): HouseholdTask[] => {
  return tasks.filter((task) => task.space === space);
};

export const filterTasksByStatus = (
  tasks: HouseholdTask[],
  isCompleted: boolean
): HouseholdTask[] => {
  return tasks.filter((task) => task.isCompleted === isCompleted);
};

// 작업 통계 계산 함수들
export const calculateTaskStats = (tasks: HouseholdTask[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const cleaningTasks = tasks.filter(
    (task) => task.category === "cleaning"
  ).length;
  const laundryTasks = tasks.filter(
    (task) => task.category === "laundry"
  ).length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedTasks,
    cleaningTasks,
    laundryTasks,
    completionRate,
  };
};

// 작업 정렬 함수들
export const sortTasksByDate = (
  tasks: HouseholdTask[],
  order: "asc" | "desc" = "desc"
): HouseholdTask[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

export const sortTasksByCompletion = (
  tasks: HouseholdTask[]
): HouseholdTask[] => {
  return [...tasks].sort((a, b) => {
    // 완료되지 않은 작업을 먼저 표시
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    // 완료 상태가 같으면 생성일 기준으로 정렬
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// 작업 상태 변경 함수들
export const toggleTaskCompletion = (
  tasks: HouseholdTask[],
  taskId: string
): HouseholdTask[] => {
  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          isCompleted: !task.isCompleted,
          lastCompleted: !task.isCompleted ? new Date() : undefined,
          updatedAt: new Date(),
        }
      : task
  );
};

export const updateTask = (
  tasks: HouseholdTask[],
  updatedTask: HouseholdTask
): HouseholdTask[] => {
  return tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
};

export const deleteTask = (
  tasks: HouseholdTask[],
  taskId: string
): HouseholdTask[] => {
  return tasks.filter((task) => task.id !== taskId);
};

export const addTask = (
  tasks: HouseholdTask[],
  newTask: HouseholdTask
): HouseholdTask[] => {
  return [...tasks, newTask];
};

// 작업 검색 함수
export const searchTasks = (
  tasks: HouseholdTask[],
  searchTerm: string
): HouseholdTask[] => {
  if (!searchTerm.trim()) return tasks;

  const term = searchTerm.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      task.space?.toLowerCase().includes(term) ||
      task.laundryType?.toLowerCase().includes(term)
  );
};
