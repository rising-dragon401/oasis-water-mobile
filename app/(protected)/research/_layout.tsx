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
				headerTitle: () => <CustomHeader />,
				headerTitleStyle: { color: textColor },
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />

			<Stack.Screen name="view-all/index" options={{ headerShown: true }} />
		</Stack>
	);
}
