import OasisLogo from "@/assets/oasis-word.png";
import { Image } from "expo-image";
import { Stack } from "expo-router";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
}

export default function SearchLayout() {
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;
	const textColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Search",
				contentStyle: {
					backgroundColor,
				},
				headerStyle: {
					backgroundColor,
				},
				headerTitleStyle: {
					color: textColor,
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: () => <CustomHeader />,
					headerTitleAlign: "center",
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: theme.light.background,
					},
				}}
			/>
			<Stack.Screen name="item/[id]" />
			<Stack.Screen name="location/[id]" />
			<Stack.Screen name="filter/[id]" />
			<Stack.Screen name="bottled-waters/index" />
			<Stack.Screen name="tap-water/index" />
			<Stack.Screen name="filters/index" />
			<Stack.Screen name="oasis/[id]" />
			<Stack.Screen name="top-rated/[id]" />
		</Stack>
	);
}
