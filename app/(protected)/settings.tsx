import { useUserProvider } from "context/user-provider";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { View } from "react-native";

import EditNameForm from "@/components/sharable/edit-name-form";
import { OasisSwitch } from "@/components/sharable/oasis-switch";
import Typography from "@/components/sharable/typography";
import UpgradeButton from "@/components/sharable/upgrade-button";
import { Button } from "@/components/ui/button";
import { H1, H3, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TabTwoScreen() {
	const { uid, user, userData, subscription, logout } = useUserProvider();
	const { restorePurchases } = useRevenueCat();
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const activeSubscription = subscription?.status === "active";

	const handleManageSubscription = () => {
		Linking.openURL(subscription.metadata?.managementURL || "");
	};

	const provider = subscription?.metadata?.provider || "stripe";

	const handleRestorePurchases = async () => {
		await restorePurchases();
		alert("Any applicable purchases have been restored.");
	};

	return (
		<View
			className="flex-1 items-center justify-between p-4 py-6"
			style={{ backgroundColor }}
		>
			<View className="flex flex-col items-center p-4 gap-y-4 w-full">
				{userData ? (
					<View className="w-full flex flex-col h-full justify-between">
						<View className="">
							<H1 className="text-center mt-20">Account</H1>

							<Typography
								size="base"
								fontWeight="normal"
								className="text-center mt-4"
							>
								Signed in as {user?.email}
							</Typography>

							{activeSubscription ? (
								<>
									<Typography
										size="base"
										fontWeight="normal"
										className="text-center"
									>
										Subscription: {subscription?.plan || "Free"}{" "}
										{subscription?.plan === "Pro" && "💫"}
									</Typography>

									{subscription.cancel_at_period_end && (
										<Typography
											size="base"
											fontWeight="normal"
											className="text-center"
										>
											Expires on{" "}
											{new Date(
												subscription.current_period_end,
											).toLocaleDateString()}
										</Typography>
									)}

									{activeSubscription && (
										<>
											{provider === "revenue_cat" ? (
												<View className="flex flex-col gap-4 text-center mt-8">
													<Button
														variant="outline"
														label="Manage subscription"
														onPress={handleManageSubscription}
													/>
												</View>
											) : (
												<Typography
													size="base"
													fontWeight="normal"
													className="text-center"
												>
													Manage your subscription online
												</Typography>
											)}
										</>
									)}
								</>
							) : (
								<View className="mt-4">
									<UpgradeButton />
								</View>
							)}

							<View className="flex flex-col gap-2 items-start mt-6">
								<H3>Edit profile</H3>
								<EditNameForm />

								<OasisSwitch
									userData={userData}
									uid={uid}
									subscription={subscription}
								/>
							</View>
						</View>

						<View className="flex flex-col">
							<Button
								className="w-full mt-4"
								variant="outline"
								label="Sign Out"
								onPress={logout}
							/>
							<View className="mt-8">
								<Button
									variant="ghost"
									label="Restore purchases"
									onPress={handleRestorePurchases}
								/>
							</View>
							<Link
								className="w-full mt-2 text-red-500 text-center"
								// @ts-ignore
								href="/deleteAccountModal"
							>
								Delete account
							</Link>
						</View>
					</View>
				) : (
					<View className="w-full justify-center items-center gap-y-2">
						<H1 className="text-center mt-20">Profile</H1>
						<Muted>Not logged in</Muted>

						<Link className="w-full mt-8 text-center" href="/(public)/sign-in">
							<P> Sign in</P>
						</Link>
					</View>
				)}
			</View>
		</View>
	);
}
