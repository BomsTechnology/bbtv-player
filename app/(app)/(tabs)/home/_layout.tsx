import { Colors, Fonts } from "@/constants/theme";
import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleStyle: {
          fontFamily: Fonts.brandBold,
        },
        headerBackVisible: false,
        contentStyle: {
          backgroundColor: Colors.gray,
        },
        headerBlurEffect: "regular",
        headerLargeTitleStyle: {
          fontFamily: Fonts.brandBlack,
          color: Colors.primary,
        },
        headerTitleStyle: {
          fontFamily: Fonts.brandBlack,
          color: Colors.primary,
        },
        headerLargeTitleEnabled: true,
        headerTransparent: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Playlists",
        }}
      />
      <Stack.Screen
        name="category/index"
        options={{
          headerTitle: "Categories",
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          headerTitle: "Channels",
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
