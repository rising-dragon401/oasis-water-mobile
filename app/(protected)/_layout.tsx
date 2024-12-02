import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import OasisLogo from "@/assets/oasis-text.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSupabase } from "@/context/supabase-provider";
import { useUserProvider } from "@/context/user-provider";
import { PROFILE_AVATAR } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export function LogoHeader() {
	return (
		<View className="flex items-start justify-start ml-4 w-24 h-5">
			<Image
				source={OasisLogo}
				style={{ width: "100%", height: "100%" }}
				contentFit="contain"
			/>
		</View>
	);
}

function UserProfileHeader() {
	const { userData } = useUserProvider();

	return (
		<View className="mr-6">
			<TouchableOpacity
				onPress={() => {
					// @ts-ignore
					router.push("/profile/settings");
				}}
			>
				<Avatar className="h-8 w-8	" alt="oasis pfp">
					<AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} />
				</Avatar>
			</TouchableOpacity>
		</View>
	);
}

export default function ProtectedLayout() {
	const { backgroundColor, iconColor, foregroundColor } = useColorScheme();
	const { user } = useSupabase();

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
			screenOptions={({ navigation }) => ({
				tabBarStyle: {
					backgroundColor,
				},
				headerStyle: {
					backgroundColor,
				},
				tabBarActiveTintColor: iconColor,
				tabBarInactiveTintColor: foregroundColor,
				tabBarShowLabel: true,
				animation: "slide_from_right",
				headerShadowVisible: false,
			})}
		>
			<Tabs.Screen
				name="search"
				options={{
					headerShown: false,
					title: "Search",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "search" : "search-outline"}
							size={24}
							color={color}
						/>
					),
					headerShadowVisible: false,
					headerLeft: () => <LogoHeader />,
					// headerRight: () => <CommunityHeader />,
				}}
			/>

			<Tabs.Screen
				name="top"
				options={{
					headerShown: true,
					title: "Top rated",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "trophy" : "trophy-outline"}
							size={24}
							color={color}
						/>
					),
					headerShadowVisible: false,
					headerLeft: () => <LogoHeader />,
				}}
			/>

			<Tabs.Screen
				name="research"
				options={{
					title: "Lab",
					headerTitle: "Lab",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "flask" : "flask-outline"}
							size={24}
							color={color}
						/>
					),
					// headerLeft: () => <LogoHeader />,
					// headerLeft: () => <LogoHeader />,
					// headerRight: () => <UserProfileHeader />,
					// tabBarButton: () => null,
					// headerShadowVisible: false,
				}}
			/>

			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerTitle: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={24}
							color={color}
						/>
					),
					headerShown: false,
					headerShadowVisible: false,
					headerLeft: () => <LogoHeader />,
					// headerLeft: () => <LogoHeader />,

					// tabBarButton: () => null,
				}}
			/>

			{/* <Tabs.Screen
				name="prof"
				options={{
					title: "Settings",
					headerShown: pathname !== "/settings/help",
					tabBarButton: () => null,
					headerShadowVisible: false,
					headerLeft: () => (
						<View className="ml-6">
							<HeaderBackButton backPath="" />
						</View>
					),
					headerRight: () => (
						<View className="mr-6">
							<TouchableOpacity
								onPress={() => router.push("/(protected)/settings/help")}
							>
								<Ionicons
									name="help-buoy-outline"
									size={24}
									color={iconColor}
								/>
							</TouchableOpacity>
						</View>
					),
				}}
			/> */}
		</Tabs>
	);
}
