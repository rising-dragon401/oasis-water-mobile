import { Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? theme.dark.background
							: theme.light.background,
				},
				headerStyle: {
					backgroundColor:
						colorScheme === "dark"
							? theme.dark.background
							: theme.light.background,
				},
				tabBarShowLabel: false,
				tabBarIcon: ({ color }) => {
					if (route.name === "search") {
						return <Octicons name="search" size={24} color={color} />;
					} else if (route.name === "settings") {
						return <Octicons name="person" size={24} color={color} />;
					} else if (route.name === "oasis") {
						return <Ionicons name="water-outline" size={24} color={color} />;
					}
				},
			})}
		>
			<Tabs.Screen name="search" />
			<Tabs.Screen name="oasis" />
			<Tabs.Screen name="settings" />
		</Tabs>
	);
}
