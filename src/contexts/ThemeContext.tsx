import React, { createContext, useContext, useState, useEffect } from "react";
import { LIGHT_COLORS, DARK_COLORS } from "../constants";
import StorageService from "../services/StorageService";

interface ThemeContextType {
  isDarkMode: boolean;
  colors: typeof LIGHT_COLORS;
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 앱 시작 시 저장된 테마 설정 로드
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const settings = await StorageService.loadSettings();
      setIsDarkMode(settings.darkMode);
    } catch (error) {
      // 테마 설정 로드 실패 시 기본값 사용
    }
  };

  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    try {
      const settings = await StorageService.loadSettings();
      await StorageService.saveSettings({
        ...settings,
        darkMode: newDarkMode,
      });
    } catch (error) {
      // 테마 설정 저장 실패 시 무시
    }
  };

  const setDarkMode = async (enabled: boolean) => {
    setIsDarkMode(enabled);

    try {
      const settings = await StorageService.loadSettings();
      await StorageService.saveSettings({
        ...settings,
        darkMode: enabled,
      });
    } catch (error) {
      // 테마 설정 저장 실패 시 무시
    }
  };

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const value: ThemeContextType = {
    isDarkMode,
    colors,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
