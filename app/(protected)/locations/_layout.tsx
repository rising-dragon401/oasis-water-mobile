import OasisLogo from "@/assets/oasis-word.png";
import { Image } from "expo-image";
import { Stack } from "expo-router";

import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
}

export default function LocationsLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
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
			<Stack.Screen name="state/index" />
		</Stack>
	);
}
