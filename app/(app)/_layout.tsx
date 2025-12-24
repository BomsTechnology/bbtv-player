import { Stack } from "expo-router";
import React from "react";

const AppLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="player/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AppLayout;
