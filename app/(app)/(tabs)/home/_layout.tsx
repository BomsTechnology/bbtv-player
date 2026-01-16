import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";

const HomeLayout = () => {
  const { isDark } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleStyle: {
          fontFamily: Fonts.brandBold,
        },
        headerBackVisible: false,
        contentStyle: {
          backgroundColor: isDark ? Colors.backgroundDark : Colors.gray,
        },
        headerBlurEffect: isDark ? "dark" : "regular",
        headerLargeTitleStyle: {
          fontFamily: Fonts.brandBlack,
          color: isDark ? Colors.primaryDark : Colors.primary,
        },
        headerTitleStyle: {
          fontFamily: Fonts.brandBlack,
          color: isDark ? Colors.primaryDark : Colors.primary,
        },
        headerLargeTitleEnabled: true,
        headerTransparent: false,
        headerStyle: {
          backgroundColor: isDark ? Colors.backgroundDark : Colors.background,
        },
        headerTintColor: isDark ? Colors.textDark : Colors.text
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Playlists",
        }}
      />
      <Stack.Screen
        name="category/channel/[categoryId]"
        options={{
          headerTitle: "Channels",
        }}
      />
      <Stack.Screen
        name="category/[playlistId]"
        options={{
          headerTitle: "Categories",
        }}
      />
      <Stack.Screen
        name="form/[id]"
        options={{
          headerShown: false,
          presentation: "formSheet",
          title: "",
          sheetAllowedDetents: [0.6],
          sheetCornerRadius: 16,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
