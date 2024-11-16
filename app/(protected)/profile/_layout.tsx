import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import HeaderBackButton from "@/components/sharable/header-back-button";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileLayout() {
	const { backgroundColor, textColor } = useColorScheme();
	const router = useRouter();

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
			}}
		>
			{/* Profile index screen */}
			<Stack.Screen name="index" options={{ headerShown: false }} />

			{/* Settings screen */}
			<Stack.Screen
				name="settings/index"
				options={{
					headerTitle: "Settings",
					headerRight: () => (
						<TouchableOpacity
							onPress={() => router.push("/(protected)/profile/help")}
						>
							<Ionicons
								name="help-circle-outline"
								size={24}
								color={textColor}
							/>
						</TouchableOpacity>
					),
				}}
			/>

			{/* Help screen */}
			<Stack.Screen
				name="help/index"
				options={{ headerShown: true, headerTitle: "Help" }}
			/>

			{/* <Stack.Screen name="score/[id]" options={{ headerShown: true }} /> */}
		</Stack>
	);
}
