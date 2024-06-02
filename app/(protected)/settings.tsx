import { useUserProvider } from "context/user-provider";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import EditNameForm from "@/components/sharable/edit-name-form";
import { OasisSwitch } from "@/components/sharable/oasis-switch";
import Typography from "@/components/sharable/typography";
import UpgradeButton from "@/components/sharable/upgrade-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H1, H3, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TabTwoScreen() {
	const { uid, user, userData, subscription, logout } = useUserProvider();
	const { restorePurchases } = useRevenueCat();
	const { colorScheme } = useColorScheme();
	const router = useRouter();

	const activeSubscription = subscription?.status === "active";

	const handleManageSubscription = () => {
		Linking.openURL(subscription.metadata?.managementURL || "");
	};

	const provider = subscription?.metadata?.provider || "stripe";

	const handleRestorePurchases = async () => {
		await restorePurchases();
		alert("Any applicable purchases have been restored.");
	};

	const handleLoadInviteModal = () => {
		router.push("/inviteModal");
	};

	const handleLoadRedeemModal = () => {
		router.push("/redeemModal");
	};

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<ScrollView
			contentContainerStyle={{
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor,
			}}
		>
			<View className="flex flex-col items-center  gap-y-4 w-full pb-14 px-8">
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
												<View className="flex flex-col gap-4 text-center mt-2">
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
								<View className="mt-4 flex flex-col items-center gap-y-2">
									<UpgradeButton />

									{!userData?.has_redeemed_free_month && (
										<>
											<Separator />

											<Button
												className="w-full bg-blue-500"
												variant="default"
												label="Invite 3 friends, get 1 month free 🤝"
												onPress={handleLoadInviteModal}
											/>

											<Button
												className="w-full"
												variant="outline"
												label="Redeem invite code"
												onPress={handleLoadRedeemModal}
											/>
										</>
									)}
								</View>
							)}

							<View className="flex flex-col items-start mt-14">
								<H3>Edit profile</H3>

								<EditNameForm />

								<View className="mt-8">
									<OasisSwitch
										userData={userData}
										uid={uid}
										subscription={subscription}
									/>
								</View>
							</View>
						</View>

						<View className="flex flex-col mt-10">
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
		</ScrollView>
	);
}
