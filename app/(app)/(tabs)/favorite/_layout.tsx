import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';
import React from 'react';

const FavoriteLayout = () => {
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
          headerTitle: "Favorites",
        }}
      />
    </Stack>
  )
}

export default FavoriteLayout