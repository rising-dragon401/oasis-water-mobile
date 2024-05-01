import "expo-dev-client";

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { RevenueCatProvider } from "@/context/revenue-cat-provider";
import { SupabaseProvider } from "@/context/supabase-provider";
import UserProvider from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { PortalHost } from "components/primitives/portal";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<SupabaseProvider>
			<UserProvider>
				<RevenueCatProvider>
					<SafeAreaProvider>
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
							<Stack.Screen name="(protected)" />
							<Stack.Screen name="(public)" />
							<Stack.Screen
								name="subscribeModal"
								options={{
									presentation: "modal",
								}}
							/>
						</Stack>
					</SafeAreaProvider>
					<PortalHost />
				</RevenueCatProvider>
			</UserProvider>
		</SupabaseProvider>
	);
}
