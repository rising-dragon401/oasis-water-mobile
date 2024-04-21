import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { SupabaseProvider } from "@/context/supabase-provider";
import UserProvider from "@/context/user-provider";
import { PortalHost } from "components/primitives/portal";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	return (
		<SupabaseProvider>
			<UserProvider>
				<SafeAreaProvider>
					<Stack
						screenOptions={{
							headerShown: false,
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
			</UserProvider>
		</SupabaseProvider>
	);
}
