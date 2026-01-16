import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Linking from "expo-linking";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

interface SectionHeaderProps {
  title: string;
}

export default function SettingsScreen() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { userTheme, isDark, setTheme } = useTheme();
  
  const onPressTheme = () => {
    const options = ["Light", "Dark", "System", "Cancel"];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex?: number | undefined) => {
        switch (selectedIndex) {
          case 0:
            setTheme("light");
            break;
          case 1:
            setTheme("dark");
            break;
          case 2:
            setTheme("system");
            break;
          case cancelButtonIndex:
            break;
        }
      }
    );
  };

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    rightComponent,
  }) => (
    <Pressable 
      onPress={onPress} 
      style={[
        styles.settingItem,
        { 
          backgroundColor: isDark ? Colors.darkDark : Colors.background,
          borderBottomColor: isDark ? Colors.lightDark : Colors.light,
        }
      ]}
    >
      <View style={styles.settingContent}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isDark ? Colors.lightDark : Colors.light }
        ]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { color: isDark ? Colors.textDark : Colors.text }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.subtitle,
              { color: isDark ? Colors.mutedDark : "#9ca3af" }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent}
    </Pressable>
  );

  const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <Text style={[
      styles.sectionHeader,
      { 
        color: isDark ? Colors.textDark : Colors.text,
        backgroundColor: isDark ? Colors.backgroundDark : Colors.gray,
        borderColor: isDark ? Colors.lightDark : Colors.gray,
      }
    ]}>
      {title}
    </Text>
  );

  return (
    <ScrollView 
      style={[
        styles.scrollView, 
        { backgroundColor: isDark ? Colors.backgroundDark : Colors.gray }
      ]}
    >
      <SectionHeader title="Theme" />
      <SettingItem
        icon="🎨"
        title="Appearance"
        subtitle={userTheme}
        onPress={() => onPressTheme()}
        rightComponent={
          <Text style={[
            styles.arrow,
            { color: isDark ? Colors.mutedDark : "#9ca3af" }
          ]}>
            ›
          </Text>
        }
      />
      <SectionHeader title="Help" />
      <SettingItem
        icon="❓"
        title="FAQ"
        subtitle="Frequently Asked Questions"
        onPress={() => null}
        rightComponent={
          <Text style={[
            styles.arrow,
            { color: isDark ? Colors.mutedDark : "#9ca3af" }
          ]}>
            ›
          </Text>
        }
      />
      <SettingItem
        icon="🌐"
        title="Support"
        subtitle="Contact us"
        onPress={() => {
          Linking.openURL("https://marcelin-sigha.vercel.app/about");
        }}
        rightComponent={
          <Text style={[
            styles.arrow,
            { color: isDark ? Colors.mutedDark : "#9ca3af" }
          ]}>
            ›
          </Text>
        }
      />
      <SectionHeader title="Other" />
      <SettingItem
        icon="💰"
        title="Donate"
        subtitle="Support the development of this app"
        onPress={() => {
          Linking.openURL(
            "https://buymeacoffee.com/bomstech"
          );
        }}
        rightComponent={
          <Text style={[
            styles.arrow,
            { color: isDark ? Colors.mutedDark : "#9ca3af" }
          ]}>
            ›
          </Text>
        }
      />
      <SettingItem
        icon="🔗"
        title="Policies"
        subtitle="Privacy & Security"
        onPress={() => {
          Linking.openURL(
            "https://www.freeprivacypolicy.com/live/c3775beb-1036-4f0f-af3a-22c9b77ae196"
          );
        }}
        rightComponent={
          <Text style={[
            styles.arrow,
            { color: isDark ? Colors.mutedDark : "#9ca3af" }
          ]}>
            ›
          </Text>
        }
      />
      <SettingItem
        icon="📄"
        title="About"
        subtitle={`Version 1.0.2`}
        onPress={() => {}}
        rightComponent={
          <Text style={[
            styles.arrow,
            { color: isDark ? Colors.mutedDark : "#9ca3af" }
          ]}>
            ›
          </Text>
        }
      />
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    fontFamily: Fonts.brandBlack,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
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
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Fonts.brandBlack,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: Fonts.brand,
    textTransform: "capitalize",
  },
  arrow: {
    fontSize: 20,
  },
  bottomPadding: {
    height: 32,
  },
});