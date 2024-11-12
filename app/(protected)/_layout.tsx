import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { useSupabase } from "@/context/supabase-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { backgroundColor, iconColor, textSecondaryColor } = useColorScheme();
	const { user } = useSupabase();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			const timer = setTimeout(() => {
				// router.replace("/welcome");
			}, 1000);

			return () => clearTimeout(timer); // Cleanup the timer on component unmount
		}
	}, [user]);

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
				tabBarActiveTintColor: iconColor,
				tabBarInactiveTintColor: textSecondaryColor,
				tabBarShowLabel: true,
				// tabBarLabelStyle: {
				// 	color: textColor,
				// },
			})}
		>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "search" : "search-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="saved"
				options={{
					title: "Saved",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "bookmark" : "bookmark-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="research"
				options={{
					title: "Research",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "flask" : "flask-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
