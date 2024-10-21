import { Stack } from "expo-router";

import { useColorScheme } from "@/lib/useColorScheme";

export default function OnboardingLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerBackTitle: "Settings",
				contentStyle: {
					backgroundColor,
				},
				headerStyle: {
					backgroundColor,
				},
				headerTitleStyle: {
					color: textColor,
				},
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />
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
