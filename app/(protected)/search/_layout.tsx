import { Stack } from "expo-router";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function SearchLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Search",
				contentStyle: {
					backgroundColor:
						colorScheme === "dark"
							? theme.dark.background
							: theme.light.background,
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen name="item/[id]" />
			<Stack.Screen name="location/[id]" />
			<Stack.Screen name="filter/[id]" />
			<Stack.Screen name="bottled-waters/index" />
			<Stack.Screen name="tap-water/index" />
			<Stack.Screen name="filters/index" />
		</Stack>
	);
}
