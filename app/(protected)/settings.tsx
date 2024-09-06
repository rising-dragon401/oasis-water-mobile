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
import { H1, Large, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TabTwoScreen() {
	const { uid, user, userData, subscription, logout } = useUserProvider();
	const { restorePurchases } = useRevenueCat();
	const { backgroundColor } = useColorScheme();
	const router = useRouter();

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

	return (
		<ScrollView
			contentContainerStyle={{
				display: "flex",
				// alignItems: "center",
				// justifyContent: "space-between",
				backgroundColor,
				// height: "100%",
				paddingBottom: 64,
			}}
			className="overflow-y-scroll"
		>
			{userData ? (
				<View className="w-full flex flex-col h-full justify-between pb-14 px-8">
					<H1 className="mt-24">Acount</H1>

					<View>
						<Typography size="base" fontWeight="normal" className="mt-2">
							Signed in as {user?.email}
						</Typography>

						{subscription ? (
							<>
								<Typography size="base" fontWeight="normal">
									Subscription: Pro
									{subscription?.plan === "Pro" && "💫"}
								</Typography>

								{subscription.cancel_at_period_end && (
									<Typography size="base" fontWeight="normal">
										Expires on{" "}
										{new Date(
											subscription.current_period_end,
										).toLocaleDateString()}
									</Typography>
								)}

								{provider === "revenue_cat" ? (
									<View className="flex flex-col gap-4 text-center mt-2">
										<Button
											variant="outline"
											label="Manage subscription"
											onPress={handleManageSubscription}
										/>
									</View>
								) : (
									<Typography size="base" fontWeight="normal">
										Manage your subscription online
									</Typography>
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

						<View className="flex flex-col items-start mt-8">
							<Large>Edit profile</Large>

							<EditNameForm />

							<View className="mt-4">
								<OasisSwitch
									userData={userData}
									uid={uid}
									subscription={subscription}
								/>
							</View>
						</View>
					</View>

					<View className="flex flex-col mt-10 pb-20">
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
				<View
					className="w-full min-h-screen justify-start gap-y-2 px-8 mt-2"
					style={{ backgroundColor }}
				>
					<H1 className="mt-24">Acount</H1>
					<Muted>Looks like you're not logged in</Muted>

					<Link className="w-full  mt-4" href="/(public)/sign-in">
						<P>Sign in</P>
					</Link>
				</View>
			)}
		</ScrollView>
	);
}
