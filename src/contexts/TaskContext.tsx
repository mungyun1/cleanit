import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  UNIFIED_TASKS as initialUnifiedTasks,
  SCHEDULED_TASKS_DATA as initialScheduledTasksData,
} from "../data/unifiedData";
import { HouseholdTask } from "../types";
import { ScheduledTasksByDate } from "../data/unifiedData";
import { filterTodayTasks } from "../utils/taskUtils";

interface TaskContextType {
  // 작업 관리 페이지용 데이터 (모든 작업 템플릿)
  taskTemplates: HouseholdTask[];
  setTaskTemplates: React.Dispatch<React.SetStateAction<HouseholdTask[]>>;

  // 오늘의 가사 데이터 (오늘 수행할 작업들)
  todayTasks: HouseholdTask[];
  setTodayTasks: React.Dispatch<React.SetStateAction<HouseholdTask[]>>;

  // 캘린더 데이터
  scheduledTasksData: ScheduledTasksByDate;
  setScheduledTasksData: React.Dispatch<
    React.SetStateAction<ScheduledTasksByDate>
  >;

  // 작업 템플릿에서 오늘의 작업 생성
  generateTodayTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // 작업 관리 페이지용 데이터 (모든 작업 템플릿)
  const [taskTemplates, setTaskTemplates] =
    useState<HouseholdTask[]>(initialUnifiedTasks);

  // 오늘의 가사 데이터 (오늘 수행할 작업들)
  const [todayTasks, setTodayTasks] = useState<HouseholdTask[]>([]);

  // 캘린더 데이터
  const [scheduledTasksData, setScheduledTasksData] =
    useState<ScheduledTasksByDate>(initialScheduledTasksData);

  // 작업 템플릿에서 오늘의 작업 생성
  const generateTodayTasks = React.useCallback(() => {
    if (taskTemplates && Array.isArray(taskTemplates)) {
      const todayTasksFromTemplates = filterTodayTasks(taskTemplates);
      // 기존 오늘의 작업의 완료 상태를 유지하면서 새로운 작업 추가
      setTodayTasks((prevTodayTasks) => {
        const existingTaskIds = new Set(prevTodayTasks.map((task) => task.id));
        const newTasks = todayTasksFromTemplates.filter(
          (task) => !existingTaskIds.has(task.id)
        );

        // 기존 작업의 완료 상태 유지
        const updatedExistingTasks = prevTodayTasks.map((existingTask) => {
          const templateTask = todayTasksFromTemplates.find(
            (t) => t.id === existingTask.id
          );
          return templateTask
            ? { ...templateTask, isCompleted: existingTask.isCompleted }
            : existingTask;
        });

        return [...updatedExistingTasks, ...newTasks];
      });
    }
  }, [taskTemplates]);

  // 초기 로드 시 오늘의 작업 생성
  React.useEffect(() => {
    if (taskTemplates && taskTemplates.length > 0) {
      generateTodayTasks();
    }
  }, [taskTemplates]);

  return (
    <TaskContext.Provider
      value={{
        taskTemplates,
        setTaskTemplates,
        todayTasks,
        setTodayTasks,
        scheduledTasksData,
        setScheduledTasksData,
        generateTodayTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};
