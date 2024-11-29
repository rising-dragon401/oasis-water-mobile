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

export default function LocationsLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerBackTitle: "Locations",
				contentStyle: {
					backgroundColor,
				},
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
			<Stack.Screen name="index" />
			<Stack.Screen name="state/[id]" />
		</Stack>
	);
}
