import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Stack } from "expo-router";

export default function PublicLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor:
						colorScheme === "dark"
							? theme.dark.background
							: theme.light.background,
				},
			}}
		>
			<Stack.Screen name="welcome" />
			<Stack.Screen name="sign-up" />
			<Stack.Screen name="sign-in" />
		</Stack>
	);
}
