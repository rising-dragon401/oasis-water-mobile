import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

import { redeemUnlock } from "@/actions/user";
import OasisIcon from "@/assets/oasis-icon.png";
import { Button } from "@/components/ui/button";
import { H2, Muted, P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export const FEATURES = [
	{
		icon: "check",
		label: "Unlock all scores and ratings",
	},
	{
		icon: "check",
		label: "Eliminate toxins with the right filters",
	},
	{
		icon: "check",
		label: "View full contaminant breakdowns",
	},
	{
		icon: "check",
		label: "Get notified of new findings",
	},
	{
		icon: "check",
		label: "Join 10,000+ healthier members",
	},
	{
		icon: "check",
		label: "Directly support new product testing",
	},
];

export default function SubscribeModal() {
	const { user, userData, refreshUserData } = useUserProvider();
	const router = useRouter();
	const { packages, purchasePackage, hasActiveSub } = useSubscription();
	const { accentColor, backgroundColor } = useColorScheme();
	const showToast = useToast();
	const [loading, setLoading] = useState(false);

	const params = useGlobalSearchParams();

	console.log("params: ", params);

	const { productId, productType } = params as {
		productId: string;
		productType: string;
	};

	useEffect(() => {
		if (hasActiveSub) {
			router.back();
		}
	}, [hasActiveSub]);

	const unlocksLeft = useCallback(() => {
		return userData?.unlocks_remaining || 0;
	}, [userData]);

	const handleSubscribe = async () => {
		setLoading(true);

		try {
			if (!user) {
				Alert.alert(
					"Sign in first",
					"You must be signed in to subscribe and start a trial.",
					[
						{
							text: "Cancel",
							style: "cancel",
						},
						{
							text: "OK, Sign in",
							onPress: () => {
								router.back();
								router.push("/(public)/sign-in");
							},
						},
					],
				);
				throw new Error("User not found");
			}

			const annualPackage = packages.annual;
			const weeklyPackage = packages.weekly;

			const pack = annualPackage;

			if (!pack) {
				console.log("No package found");
				throw new Error("No package found");
			}

			const res = await purchasePackage!(pack);

			if (res) {
				router.back();
			}
		} catch (e) {
			throw new Error(e as string);
		}

		setLoading(false);
	};

	const handleUnlock = async () => {
		if (unlocksLeft() > 0) {
			// Logic to unlock
			const res = await redeemUnlock(user?.id, productId, productType);

			if (res) {
				await refreshUserData("userData");
				showToast("Item unlocked!");
				router.back();
			} else {
				showToast("Unable to unlock item");
			}
		} else {
			// Open an alert to inform the user
			Alert.alert(
				"Share to Unlock 🔓",
				`Earn a free unlock instantly when a friend joins using your code: ${userData?.username}`,
				[
					{
						text: "Copy code",
						onPress: () => {
							const referralCode = userData?.username; // Assuming referralCode is part of userData
							if (referralCode) {
								showToast("Copied to clipboard");
								Clipboard.setString(referralCode);
								console.log("Referral code copied to clipboard");
							} else {
								console.log("No referral code available");
							}
						},
					},
				],
			);
		}
	};

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor }}>
			<View className="flex flex-col justify-between p-4 py-16 h-full items-center">
				{/* Unlock Section */}
				{productId && productType && (
					<TouchableOpacity
						style={{
							position: "absolute",
							top: 16,
							right: 16,
							padding: 8,
							borderRadius: 16,
						}}
						className="bg-muted px-4 py-2 rounded-lg"
						onPress={handleUnlock}
					>
						<P className="">
							{unlocksLeft() > 0
								? `Use unlock (${unlocksLeft()})`
								: "0 unlocks left"}
						</P>
					</TouchableOpacity>
				)}

				{/* Content Section */}
				<View className="items-center max-w-lg gap-y-8 flex flex-col flex-grow">
					<View className="flex flex-col items-center">
						<View className="relative w-24 h-24 overflow-hidden object-contain">
							<Image
								source={OasisIcon}
								style={{ width: "100%", height: "100%" }}
								contentFit="contain"
							/>
						</View>
						<H2 className="text-center pt-2">Oasis Member</H2>
						<Muted className="text-center max-w-sm mt-2 text-base">
							Join 10,000+ members improving their water health and supporting
							unbiased lab testing.
						</Muted>
					</View>

					{/* Features */}
					<View className="flex flex-col w-full mt-4 px-8 bg-card p-4 gap-y-6 rounded-lg border border-border">
						{FEATURES.map((feature, index) => (
							<View
								key={index}
								className={`flex flex-row gap-4 w-full  items-center pb-2 ${
									index !== FEATURES.length - 1 ? "border-b border-border" : ""
								}`}
							>
								<Feather name="check" size={20} color={accentColor} />

								<P className="text-center text-base font-semibold">
									{feature.label}
								</P>
							</View>
						))}
					</View>
				</View>

				{/* Subscribe Button Section */}
				<View className="w-full flex-col items-center mt-auto justify-center max-w-md px-4">
					<View className="flex flex-col w-full items-center">
						<Button
							className="w-full !max-w-sm !h-20 mb-2"
							textClassName="!text-lg"
							variant="default"
							label="Try for free"
							loading={loading}
							onPress={() => handleSubscribe()}
						/>

						<Muted className="text-center">
							3-day free trial then $0.90/week (billed annually)
						</Muted>
					</View>
					<View className="mt-8 px-8 flex flex-row gap-x-4">
						<Button
							label="Terms of Use"
							size="sm"
							variant="ghost"
							textClassName="!text-muted-foreground "
							onPress={() => {
								Linking.openURL("https://www.oasiswater.app/terms");
							}}
						/>

						<Button
							label="Privacy Policy"
							size="sm"
							variant="ghost"
							textClassName="!text-muted-foreground"
							onPress={() => {
								Linking.openURL("https://www.oasiswater.app/privacy-policy");
							}}
						/>

						<Button
							label="Refund Policy"
							size="sm"
							variant="ghost"
							textClassName="!text-muted-foreground"
							onPress={() => {
								Linking.openURL("https://www.oasiswater.app/refund-policy");
							}}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
