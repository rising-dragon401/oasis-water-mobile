import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { H1, H3, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";

const FEATURES = [
	{
		label: "🔓 Unlock all ratings and data",
	},
	{
		label: "💧 Bottled water, filters and tap water",
	},
	{
		label: "🤖 Oasis AI",
	},
	// {
	// 	label: "🤖 AI search",
	// },

	{
		label: "🔬 Most up to date research",
	},
	{
		label: "📥 Request new tests",
	},
	{
		label: "🧬 Supports Oasis to further our research",
	},
	{
		label: "🌐 Private community",
	},
];

export default function SubscribeModal() {
	const { subscription, user, userData } = useUserProvider();
	const router = useRouter();
	const { packages, purchasePackage } = useRevenueCat();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (subscription?.active) {
			router.back();
		}
	}, [subscription]);

	const handleSubscribe = async () => {
		setLoading(true);

		try {
			if (!user || !userData) {
				router.back();
				router.push("/(public)/sign-in");
				throw new Error("User not found");
			}

			const pack = packages[1];

			if (!pack) {
				console.log("No package found");
				return;
			}

			const res = await purchasePackage!(pack);

			if (res) {
				router.back();
			}
		} catch (e) {
			console.log(e);
		}

		setLoading(false);
	};

	const handleInviteFriends = () => {
		router.push("/inviteModal");
	};

	return (
		<View className="flex flex-1 items-center justify-between bg-background p-4 gap-y-4 pt-20 pb-10">
			<View />

			<View className="w-full items-center flex flex-col">
				<H1 className="text-center">Unlock what's actually healthy for you</H1>
				<H3 className="text-center my-4">Oasis Pro</H3>
				<Muted>Free access for 3 days, then</Muted>
				<Muted className="mb-4">$47 per year, ($4 /month)</Muted>

				<View className="w-full gap-y-2 bg-secondary py-6 max-w-sm rounded-lg">
					{FEATURES.map((feature, index) => (
						<P key={index} className="text-center">
							{feature.label}
						</P>
					))}
				</View>

				<View className="mt-8 w-full gap-y-4">
					<Button
						className="w-full"
						variant="default"
						label="Start your 3 day free trial"
						loading={loading}
						onPress={handleSubscribe}
					/>

					{!userData?.has_redeemed_free_month && (
						<Button
							className="w-full bg-blue-500"
							variant="default"
							label="Invite 3 friends, get 1 month free 🤝"
							onPress={handleInviteFriends}
						/>
					)}
				</View>
			</View>

			<View className="">
				<Button
					label="Terms of Use"
					size="sm"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.live-oasis.com/terms");
					}}
				/>

				<Button
					label="Privacy Policy"
					size="sm"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.live-oasis.com/privacy-policy");
					}}
				/>
			</View>
		</View>
	);
}
