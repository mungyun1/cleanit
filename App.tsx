import React from "react";
import { SafeAreaView, StatusBar as RNStatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

// 화면들
import HomeScreen from "./src/screens/HomeScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import TaskManagementScreen from "./src/screens/TaskManagementScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AddTaskScreen from "./src/screens/AddTaskScreen";
import EditTaskScreen from "./src/screens/EditTaskScreen";

// 타입
import { RootStackParamList } from "./src/types";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { TaskProvider } from "./src/contexts/TaskContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// 탭 네비게이터
function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "TaskManagement") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onBackground + "60",
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.onBackground + "20",
          paddingTop: 5,
          height: 60,
          // iOS Safe Area 대응
          paddingBottom: (RNStatusBar.currentHeight || 0) + 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "홈" }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "캘린더" }}
      />
      <Tab.Screen
        name="TaskManagement"
        component={TaskManagementScreen}
        options={{ title: "작업 관리" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "설정" }}
      />
    </Tab.Navigator>
  );
}

// 메인 앱 컴포넌트
function AppContent() {
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{
              headerShown: true,
              title: "청소 작업 추가",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.onPrimary,
            }}
          />
          <Stack.Screen
            name="EditTask"
            component={EditTaskScreen}
            options={{
              headerShown: true,
              title: "청소 작업 수정",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.onPrimary,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// 메인 앱
export default function App() {
  return (
    <TaskProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </TaskProvider>
  );
}
