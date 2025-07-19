import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";
import ScheduledTasksModal from "../components/ScheduledTasksModal";
import CalendarStats from "../components/CalendarStats";
import { ScheduledTask } from "../data/unifiedData";
import { COMPLETED_TASKS_MOCK_DATA } from "../data/calendarMockData";
import { useTaskContext } from "../contexts/TaskContext";
import { useCalendarMarking } from "../hooks/useCalendarMarking";
import {
  getTodayString,
  convertToScheduledTask,
  createCalendarTheme,
} from "../utils/calendarUtils";

const CalendarScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState<ScheduledTask[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { taskTemplates, todayTasks } = useTaskContext();

  const markedDates = useCalendarMarking({
    taskTemplates: taskTemplates || [],
    todayTasks: todayTasks || [],
    completedTasksMockData: COMPLETED_TASKS_MOCK_DATA as any,
    colors,
    isDarkMode,
  });

  const onDayPress = (day: DateData) => {
    const today = getTodayString();
    const isToday = day.dateString === today;

    let tasksForDate: any[] = [];

    if (isToday) {
      const allCompletedTasks = [
        ...(taskTemplates || []).filter((task) => task.isCompleted),
        ...COMPLETED_TASKS_MOCK_DATA,
      ];

      const completedTasksForToday = allCompletedTasks.filter((task) => {
        if (!task.lastCompleted) return false;

        const completedDate = new Date(task.lastCompleted);
        const completedDateString = completedDate.toISOString().split("T")[0];

        return completedDateString === day.dateString;
      });

      const todayScheduledTasks = todayTasks || [];

      tasksForDate = [...completedTasksForToday, ...todayScheduledTasks];
    } else {
      const allCompletedTasks = [
        ...(taskTemplates || []).filter((task) => task.isCompleted),
        ...COMPLETED_TASKS_MOCK_DATA,
      ];

      const completedTasksForDate = allCompletedTasks.filter((task) => {
        if (!task.lastCompleted) return false;

        const completedDate = new Date(task.lastCompleted);
        const completedDateString = completedDate.toISOString().split("T")[0];

        return completedDateString === day.dateString;
      });

      tasksForDate = completedTasksForDate;
    }

    if (tasksForDate.length === 0) {
      return;
    }

    const convertedTasks: ScheduledTask[] = tasksForDate.map((task) =>
      convertToScheduledTask(task, colors)
    );

    setSelectedDate(day.dateString);
    setSelectedDateTasks(convertedTasks);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onMonthChange = (month: any) => {
    setCurrentMonth(new Date(month.timestamp));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="📅 캘린더" showMenuButton={true} />
        <View style={styles.calendarContainer}>
          <View style={styles.calendarWrapper}>
            <Calendar
              key={isDarkMode ? "dark" : "light"}
              onDayPress={onDayPress}
              onMonthChange={onMonthChange}
              markedDates={markedDates}
              theme={createCalendarTheme(colors, isDarkMode)}
              enableSwipeMonths={false}
              showWeekNumbers={false}
              firstDay={1}
              hideExtraDays={true}
              disableMonthChange={false}
              hideDayNames={false}
              markingType="dot"
              style={styles.calendar}
            />
          </View>
        </View>

        <CalendarStats selectedMonth={currentMonth} />
      </ScrollView>

      <ScheduledTasksModal
        visible={modalVisible}
        onClose={closeModal}
        date={selectedDate}
        tasks={selectedDateTasks}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  calendarWrapper: {
    borderRadius: 12,
  },
  calendar: {
    height: 350,
  },
});

export default CalendarScreen;
