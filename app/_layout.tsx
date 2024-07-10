import "expo-dev-client";

import * as Sentry from "@sentry/react-native";
import { Stack, useNavigationContainerRef } from "expo-router";
import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { RevenueCatProvider } from "@/context/revenue-cat-provider";
import { SupabaseProvider } from "@/context/supabase-provider";
import UserProvider from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { PortalHost } from "components/primitives/portal";
import { isRunningInExpoGo } from "expo";
import { SWRConfig } from "swr";

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
	dsn: "https://7ebff0e9678f504c4a2fb71623d6ff85@o4507189223817216.ingest.us.sentry.io/4507189225062400",
	debug: true,
	integrations: [
		new Sentry.ReactNativeTracing({
			routingInstrumentation,
			enableNativeFramesTracking: !isRunningInExpoGo(),
		}),
	],
});

function RootLayout() {
	const { colorScheme } = useColorScheme();

	const ref = useNavigationContainerRef();

	React.useEffect(() => {
		if (ref) {
			routingInstrumentation.registerNavigationContainer(ref);
		}
	}, [ref]);

	return (
		<SupabaseProvider>
			<UserProvider>
				<RevenueCatProvider>
					<SWRConfig>
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
								<Stack.Screen
									name="deleteAccountModal"
									options={{
										presentation: "modal",
									}}
								/>
								<Stack.Screen
									name="chatModal"
									options={{
										presentation: "modal",
									}}
								/>
								<Stack.Screen
									name="inviteModal"
									options={{
										presentation: "modal",
									}}
								/>
								<Stack.Screen
									name="redeemModal"
									options={{
										presentation: "modal",
									}}
								/>
								<Stack.Screen
									name="reviewModal"
									options={{
										presentation: "modal",
									}}
								/>
							</Stack>
						</SafeAreaProvider>
						<PortalHost />
					</SWRConfig>
				</RevenueCatProvider>
			</UserProvider>
		</SupabaseProvider>
	);
}

export default Sentry.wrap(RootLayout);
