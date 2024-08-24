import { useColorScheme } from "@/lib/useColorScheme";
import { Stack } from "expo-router";

export default function PublicLayout() {
	const { backgroundColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor,
				},
			}}
		>
			<Stack.Screen name="welcome" />
			<Stack.Screen name="sign-up" />
			<Stack.Screen name="sign-in" />
		</Stack>
	);
}
