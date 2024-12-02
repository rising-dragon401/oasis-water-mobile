import { Image } from "expo-image";
import { Stack, useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

import OasisLogo from "@/assets/oasis-text.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return (
		<View className="flex items-start justify-start ml-6">
			<Image source={OasisLogo} style={{ width: 85, height: 24 }} />
		</View>
	);
}

export function LogoHeader() {
	return (
		<View className="flex items-start justify-start w-24 h-5">
			<Image
				source={OasisLogo}
				style={{ width: "100%", height: "100%" }}
				contentFit="contain"
			/>
		</View>
	);
}

export default function ResearchLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	const globalParams = useGlobalSearchParams();

	// Determine back path
	const backPath = Array.isArray(globalParams?.backPath)
		? globalParams.backPath[0]
		: globalParams?.backPath || "";

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerLeft: ({ canGoBack }) =>
					canGoBack && <HeaderBackButton backPath={backPath} />,
				contentStyle: { backgroundColor },
				headerStyle: { backgroundColor },
				// headerTitle: () => <CustomHeader />,
				headerTitleStyle: { color: textColor },
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: true,
					headerTitle: "Lab",
					headerLeft: () => <LogoHeader />,
				}}
			/>

			<Stack.Screen name="articles/index" />

			<Stack.Screen name="article/[id]" options={{ headerShown: true }} />
		</Stack>
	);
}
