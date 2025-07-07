import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TYPOGRAPHY } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";

const SettingsScreen: React.FC = () => {
  const { colors, isDarkMode, setDarkMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const settingsItems = [
    {
      id: "notifications",
      title: "알림 설정",
      subtitle: "청소 알림을 받으시겠습니까?",
      type: "switch",
      value: notifications,
      onValueChange: setNotifications,
      icon: "notifications",
    },
    {
      id: "darkMode",
      title: "다크 모드",
      subtitle: "어두운 테마를 사용하시겠습니까?",
      type: "switch",
      value: isDarkMode,
      onValueChange: setDarkMode,
      icon: "moon",
    },
    {
      id: "language",
      title: "언어 설정",
      subtitle: "한국어",
      type: "navigate",
      icon: "language",
    },
    {
      id: "backup",
      title: "데이터 백업",
      subtitle: "데이터를 클라우드에 백업",
      type: "navigate",
      icon: "cloud-upload",
    },
    {
      id: "about",
      title: "앱 정보",
      subtitle: "버전 1.0.0",
      type: "navigate",
      icon: "information-circle",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="⚙️ 설정"
          subtitle="앱 설정을 관리하세요"
          showMenuButton={true}
          onMenuPress={() => console.log("메뉴 버튼 클릭")}
        />
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: colors.onBackground + "80" }]}
          >
            일반
          </Text>
          {settingsItems.slice(0, 2).map((item) => (
            <View
              key={item.id}
              style={[
                styles.settingItem,
                {
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.onBackground + "10",
                },
              ]}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.onBackground },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.onBackground + "60" },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              {item.type === "switch" && (
                <Switch
                  value={item.value}
                  onValueChange={item.onValueChange}
                  trackColor={{
                    false: colors.onBackground + "30",
                    true: colors.primary + "50",
                  }}
                  thumbColor={
                    item.value ? colors.primary : colors.onBackground + "60"
                  }
                />
              )}
              {item.type === "navigate" && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.onBackground + "60"}
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: colors.onBackground + "80" }]}
          >
            데이터
          </Text>
          {settingsItems.slice(2, 4).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingItem,
                {
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.onBackground + "10",
                },
              ]}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: colors.onBackground },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.onBackground + "60" },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.onBackground + "60"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: colors.onBackground + "80" }]}
          >
            정보
          </Text>
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.onBackground + "10",
              },
            ]}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.settingText}>
                <Text
                  style={[styles.settingTitle, { color: colors.onBackground }]}
                >
                  앱 정보
                </Text>
                <Text
                  style={[
                    styles.settingSubtitle,
                    { color: colors.onBackground + "60" },
                  ]}
                >
                  버전 1.0.0
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.onBackground + "60"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text
            style={[styles.footerText, { color: colors.onBackground + "60" }]}
          >
            CleanIt v1.0.0
          </Text>
          <Text
            style={[
              styles.footerSubtext,
              { color: colors.onBackground + "40" },
            ]}
          >
            개인 청소 관리 도우미
          </Text>
        </View>
      </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: 5,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 1,
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...TYPOGRAPHY.body1,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...TYPOGRAPHY.body2,
  },
  footer: {
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    ...TYPOGRAPHY.body2,
    marginBottom: 5,
  },
  footerSubtext: {
    ...TYPOGRAPHY.caption,
  },
});

export default SettingsScreen;
