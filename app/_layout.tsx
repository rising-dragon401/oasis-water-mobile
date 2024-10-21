import * as Sentry from "@sentry/react-native";
import { PortalHost } from "components/primitives/portal";
import { isRunningInExpoGo } from "expo";
import "expo-dev-client";
import { Stack, useNavigationContainerRef } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import React from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";

import { SWRConfig } from "swr";

import { BlogProvider } from "@/context/blogs-provider";
import { RevenueCatProvider } from "@/context/revenue-cat-provider";
import { SupabaseProvider } from "@/context/supabase-provider";
import { ToastProvider } from "@/context/toast-provider";
import UserProvider from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

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
	const { backgroundColor } = useColorScheme();

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
					<BlogProvider>
						<PostHogProvider
							apiKey="phc_ifrEiDLe5q1xE20zwCZkeKANkrOF0dg6RqpmypbFDhZ"
							options={{ host: "https://us.i.posthog.com" }}
							autocapture
						>
							<SWRConfig>
								<RootSiblingParent>
									<ToastProvider>
										<SafeAreaProvider>
											<Stack
												screenOptions={{
													headerShown: false,
													contentStyle: {
														backgroundColor,
													},
												}}
											>
												<Stack.Screen name="(public)" />
												<Stack.Screen name="(protected)" />
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
												<Stack.Screen
													name="scanModal"
													options={{
														presentation: "modal",
													}}
												/>
											</Stack>
										</SafeAreaProvider>
										<PortalHost />
									</ToastProvider>
								</RootSiblingParent>
							</SWRConfig>
						</PostHogProvider>
					</BlogProvider>
				</RevenueCatProvider>
			</UserProvider>
		</SupabaseProvider>
	);
}

export default Sentry.wrap(RootLayout);
