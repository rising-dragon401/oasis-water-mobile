import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, Stack, useGlobalSearchParams } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { default as OasisTextLogo } from "@/assets/oasis-text.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserProvider } from "@/context/user-provider";
import { PROFILE_AVATAR } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

function SupportButton() {
	const { iconColor } = useColorScheme();

	return (
		<View className="mr-6">
			{/* @ts-ignore */}
			<TouchableOpacity onPress={() => router.push("/profile/help")}>
				<Ionicons name="help-buoy-outline" size={24} color={iconColor} />
			</TouchableOpacity>
		</View>
	);
}

function LogoHeader() {
	return (
		<View className="flex items-start justify-start w-16 h-5">
			<Image
				source={OasisTextLogo}
				style={{
					width: "100%",
					height: "100%",
				}}
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

export default function ProfileLayout() {
	const { backgroundColor, textColor, iconColor } = useColorScheme();

	const globalParams = useGlobalSearchParams();

	// Determine back path
	const backPath = Array.isArray(globalParams?.backPath)
		? globalParams.backPath[0]
		: globalParams?.backPath || "";

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Profile",
				headerLeft: ({ canGoBack }) =>
					canGoBack && <HeaderBackButton backPath={backPath} />,
				contentStyle: { backgroundColor },
				headerStyle: { backgroundColor },
				headerTitleStyle: { color: textColor },
				headerTitleAlign: "center",
				headerShadowVisible: false,
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: true,
					headerTitle: "Profile",
					headerLeft: () => <LogoHeader />,
					headerRight: () => <UserProfileHeader />,
				}}
			/>

			<Stack.Screen
				name="settings/index"
				options={{
					headerShown: true,
					headerTitle: "Settings",
					headerRight: () => <SupportButton />,
				}}
			/>

			<Stack.Screen
				name="help/index"
				options={{
					headerShown: true,
					headerTitle: "Help",
				}}
			/>
		</Stack>
	);
}
