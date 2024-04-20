import { Stack } from "expo-router";

export default function SearchLayout() {
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
			<Stack.Screen name="item" />
		</Stack>
	);
}
