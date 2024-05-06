import { useUserProvider } from "context/user-provider";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { View } from "react-native";

import Typography from "@/components/sharable/typography";
import UpgradeButton from "@/components/sharable/upgrade-button";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";

import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useSupabase } from "@/context/supabase-provider";

export default function TabTwoScreen() {
	const { signOut } = useSupabase();
	const { user, userData, subscription } = useUserProvider();
	const { restorePurchases } = useRevenueCat();

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
		<View className="flex-1 items-center justify-between p-4 py-10">
			<View className="flex flex-col items-center p-4 gap-y-4 w-full">
				{userData ? (
					<View>
						<H1 className="text-center mt-20">Profile</H1>

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
												<Typography size="xs" fontWeight="normal">
													(You can also manage your subscription in your phone
													settings.)
												</Typography>
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
							<UpgradeButton />
						)}
						<Button
							className="w-full"
							variant="secondary"
							label="Sign Out"
							onPress={() => {
								signOut();
							}}
						/>
						<Button
							variant="ghost"
							label="Restore purchases"
							onPress={handleRestorePurchases}
						/>
					</View>
				) : (
					<View className="w-full justify-center items-center gap-y-2">
						<H1 className="text-center mt-20">Profile</H1>
						<Muted>Not logged in</Muted>

						<Link className="w-full mt-8 text-center" href="/(public)/sign-in">
							Sign in
						</Link>
					</View>
				)}
			</View>
		</View>
	);
}
