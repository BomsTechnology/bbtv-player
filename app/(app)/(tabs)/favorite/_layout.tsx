import { Colors, Fonts } from '@/constants/theme'
import { Stack } from 'expo-router'
import React from 'react'

const FavoriteLayout = () => {
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
          headerTitle: "Favorites",
        }}
      />
    </Stack>
  )
}

export default FavoriteLayout