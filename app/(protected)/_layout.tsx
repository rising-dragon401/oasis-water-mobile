import { Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor,
				},
				headerStyle: {
					backgroundColor,
				},
				tabBarShowLabel: false,
				tabBarLabelStyle: {
					color: textColor,
				},
				tabBarIcon: ({ focused, color }) => {
					const iconColor = focused ? textColor : "rgba(128, 128, 128, 0.5)"; // Faded color for inactive tabs
					if (route.name === "search") {
						return <Octicons name="search" size={24} color={iconColor} />;
					} else if (route.name === "settings") {
						return <Ionicons name="cog" size={24} color={iconColor} />;
					} else if (route.name === "research") {
						return (
							<Ionicons name="flask-outline" size={24} color={iconColor} />
						);
					} else if (route.name === "oasis") {
						return <Octicons name="person" size={24} color={iconColor} />;
					}

					// else if (route.name === "locations") {
					// 	return (
					// 		<Ionicons name="location-outline" size={24} color={iconColor} />
					// 	);
					// }
				},
			})}
		>
			<Tabs.Screen name="search" />

			{/* Required for hiding the research tab from the bottom tab bar */}
			<Tabs.Screen
				name="research"
				options={{
					href: null,
				}}
			/>
			<Tabs.Screen name="oasis" />
			<Tabs.Screen name="settings" />
		</Tabs>
	);
}
