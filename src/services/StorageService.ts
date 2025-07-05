import AsyncStorage from "@react-native-async-storage/async-storage";
import { CleaningTask, CompletionRecord, UserSettings, Space } from "../types";
import { STORAGE_KEYS, DEFAULT_SPACES } from "../constants";

class StorageService {
  async saveTasks(tasks: CleaningTask[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }
  async loadTasks(): Promise<CleaningTask[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  }
  async saveCompletions(completions: CompletionRecord[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.COMPLETIONS,
      JSON.stringify(completions)
    );
  }
  async loadCompletions(): Promise<CompletionRecord[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    return data ? JSON.parse(data) : [];
  }
  async saveSettings(settings: UserSettings): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
  async loadSettings(): Promise<UserSettings> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          notifications: true,
          notificationTime: "09:00",
          darkMode: false,
          language: "ko",
        };
  }
  async saveSpaces(spaces: Space[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces));
  }
  async loadSpaces(): Promise<Space[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SPACES);
    return data ? JSON.parse(data) : DEFAULT_SPACES;
  }
  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TASKS,
      STORAGE_KEYS.COMPLETIONS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.SPACES,
    ]);
  }
}
export default new StorageService();
