import { Stack } from "expo-router";

import { useColorScheme } from "@/lib/useColorScheme";

export default function SearchLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Search",
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
