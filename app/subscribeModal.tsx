import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import OasisIcon from "@/assets/oasis-icon.png";
import { Button } from "@/components/ui/button";
import { H2, Large, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

const FEATURES = [
	{
		icon: "check",
		label: "Access all scores and ratings",
	},
	{
		icon: "check",
		label: "Full contaminant breakdowns",
	},
	{
		icon: "check",
		label: "Top rated products",
	},
	{
		icon: "check",
		label: "Get notified of new data",
	},

	{
		icon: "check",
		label: "Support unbiased lab testing",
	},
];

export default function SubscribeModal() {
	const { subscription, user } = useUserProvider();
	const router = useRouter();
	const { packages, purchasePackage, restorePurchases } = useRevenueCat();
	const { accentColor, backgroundColor } = useColorScheme();

	const [loading, setLoading] = useState(false);
	const [loadingRestore, setLoadingRestore] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<"annual">("annual");

	useEffect(() => {
		if (subscription) {
			router.back();
		}
	}, [subscription]);

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

			const annualPackage = packages.find((p) => p.packageType === "ANNUAL");
			const weeklyPackage = packages.find((p) => p.packageType === "WEEKLY");

			const pack = selectedPlan === "annual" ? annualPackage : weeklyPackage;

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

	return (
		<ScrollView contentContainerStyle={{ backgroundColor, height: "100%" }}>
			<View className="flex-1 justify-between p-4 py-16 h-full items-center ">
				{/* Content Section */}
				<View className="items-center  max-w-lg">
					<View className="relative w-24 h-24 overflow-hidden object-contain">
						<Image
							source={OasisIcon}
							style={{ width: "100%", height: "100%" }}
							contentFit="contain"
						/>
					</View>
					<H2 className="text-center pt-2">Oasis Member</H2>
					<Muted className="text-center max-w-sm mt-2 text-base">
						Join 10,000+ members transforming their water habits and supporting
						unbiased ratings.
					</Muted>

					{/* Features */}
					<View className="flex flex-col h-full min-h-48 gap-8 pt-8 mt-4">
						{FEATURES.map((feature, index) => (
							<View
								key={index}
								className="flex flex-row gap-5 w-full items-center"
							>
								<Octicons
									name="check-circle-fill"
									size={24}
									color={accentColor}
								/>
								<P className="text-center text-xl">{feature.label}</P>
							</View>
						))}
					</View>
				</View>

				{/* Subscribe Button Section */}
				<View className="w-full flex-col items-center mt-auto justify-center max-w-md px-4">
					<View className="flex flex-col w-full items-center">
						<Large className="text-center font-semibold mb-6">
							No payment due now
						</Large>
						{/* mt-auto pushes this section to the bottom */}
						<Button
							className="w-full !max-w-sm !h-20 mb-2 0"
							textClassName="!text-lg"
							variant="default"
							label="Try for free 💧"
							loading={loading}
							onPress={() => handleSubscribe()}
						/>

						<Muted className="text-center">
							3 Day free trial then $0.90 a week (billed annually)
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
