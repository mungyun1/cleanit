import { useState, useCallback } from "react";
import { HouseholdTask } from "../types";
import { MOCK_TASKS } from "../data/taskManagementData";
import {
  filterTasksByCategory,
  filterTasksBySpace,
  calculateTaskStats,
  sortTasksByCompletion,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
  addTask,
  searchTasks,
} from "../utils/taskManagementUtils";

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<HouseholdTask[]>(MOCK_TASKS);
  const [selectedFilter, setSelectedFilter] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 필터링된 작업 목록
  const filteredTasks = useCallback(() => {
    let filtered = tasks;

    // 카테고리별 필터링
    if (selectedFilter === "청소") {
      filtered = filterTasksByCategory(filtered, "cleaning");
    } else if (selectedFilter === "빨래") {
      filtered = filterTasksByCategory(filtered, "laundry");
    }

    // 검색어 필터링
    if (searchTerm.trim()) {
      filtered = searchTasks(filtered, searchTerm);
    }

    // 완료 상태별 정렬 (미완료 작업을 먼저 표시)
    return sortTasksByCompletion(filtered);
  }, [tasks, selectedFilter, searchTerm]);

  // 통계 계산
  const stats = useCallback(() => {
    return calculateTaskStats(tasks);
  }, [tasks]);

  // 작업 토글
  const handleToggleTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => toggleTaskCompletion(prevTasks, taskId));
  }, []);

  // 작업 업데이트
  const handleUpdateTask = useCallback((updatedTask: HouseholdTask) => {
    setTasks((prevTasks) => updateTask(prevTasks, updatedTask));
  }, []);

  // 작업 삭제
  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => deleteTask(prevTasks, taskId));
  }, []);

  // 작업 추가
  const handleAddTask = useCallback((newTask: HouseholdTask) => {
    setTasks((prevTasks) => addTask(prevTasks, newTask));
  }, []);

  // 필터 변경
  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  // 검색어 변경
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // 검색어 초기화
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    tasks: filteredTasks(),
    stats: stats(),
    selectedFilter,
    searchTerm,
    handleToggleTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAddTask,
    handleFilterChange,
    handleSearchChange,
    clearSearch,
  };
};
