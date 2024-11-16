import { Image } from "expo-image";
import { Stack } from "expo-router";

import OasisLogo from "@/assets/oasis-word.png";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
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
