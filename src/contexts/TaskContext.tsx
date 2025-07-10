import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  UNIFIED_TASKS as initialUnifiedTasks,
  SCHEDULED_TASKS_DATA as initialScheduledTasksData,
} from "../data/unifiedData";
import { HouseholdTask } from "../types";
import { ScheduledTasksByDate } from "../data/unifiedData";

interface TaskContextType {
  unifiedTasks: HouseholdTask[];
  setUnifiedTasks: React.Dispatch<React.SetStateAction<HouseholdTask[]>>;
  scheduledTasksData: ScheduledTasksByDate;
  setScheduledTasksData: React.Dispatch<
    React.SetStateAction<ScheduledTasksByDate>
  >;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [unifiedTasks, setUnifiedTasks] =
    useState<HouseholdTask[]>(initialUnifiedTasks);
  const [scheduledTasksData, setScheduledTasksData] =
    useState<ScheduledTasksByDate>(initialScheduledTasksData);

  return (
    <TaskContext.Provider
      value={{
        unifiedTasks,
        setUnifiedTasks,
        scheduledTasksData,
        setScheduledTasksData,
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
