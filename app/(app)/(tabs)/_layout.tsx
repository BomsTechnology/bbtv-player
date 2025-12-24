import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "600",
          color: Colors.primary,
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
              color={Colors.primary}
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
              color={Colors.primary}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
