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
			<Stack.Screen name="item" />
			<Stack.Screen name="location" />
			<Stack.Screen name="filter" />
		</Stack>
	);
}
