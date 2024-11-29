import { Image } from "expo-image";
import { Stack } from "expo-router";
import { View } from "react-native";

import OasisLogo from "@/assets/oasis-text.png";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return (
		<View className="flex items-start justify-start ml-6">
			<Image source={OasisLogo} style={{ width: 85, height: 24 }} />
		</View>
	);
}

export default function OnboardingLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				contentStyle: {
					backgroundColor,
				},
				headerBackVisible: false,
				headerStyle: {
					backgroundColor,
				},
				headerTitleStyle: {
					color: textColor,
				},
				headerTitle: () => <CustomHeader />,
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: () => <CustomHeader />,
					headerBackVisible: false,
				}}
				name="index"
			/>
		</Stack>
	);
}
