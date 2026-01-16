import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";


const TabLayout = () => {
  const { isDark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? Colors.backgroundDark : Colors.background,
          borderTopWidth:0,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "600",
          color: isDark ? Colors.primaryDark : Colors.primary,
          fontFamily: Fonts.brand,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={isDark ? Colors.primaryDark : Colors.primary}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorite",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "star" : "star-outline"}
              color={isDark ? Colors.primaryDark : Colors.primary}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={isDark ? Colors.primaryDark : Colors.primary}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
