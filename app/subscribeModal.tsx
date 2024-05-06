import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { H1, H3, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";

const FEATURES = [
	{
		label: "🔓 Unlock all ratings and data",
	},
	{
		label: "💧 Search bottled water, filters and tap water",
	},
	{
		label: "🔬 Most up to date research",
	},
	// {
	// 	label: "🤖 AI search",
	// },
	// {
	// 	label: "🤝 Personalized recommendations",
	// },
	{
		label: "🧬 Supports Oasis to further our research",
	},
	{
		label: "🌐 Private community",
	},
];

export default function SubscribeModal() {
	const { subscription } = useUserProvider();
	const router = useRouter();
	const { packages, purchasePackage } = useRevenueCat();

	useEffect(() => {
		if (subscription?.active) {
			router.back();
		}
	}, [subscription]);

	const handleSubscribe = async () => {
		const pack = packages[0];

		if (!pack) {
			console.log("No package found");
			return;
		}

		const res = await purchasePackage!(pack);

		if (res) {
			router.back();
		}
	};

	return (
		<View className="flex flex-1 items-center justify-between bg-background p-4 gap-y-4 pt-20 pb-10">
			<View></View>

			<View className="w-full ">
				<H1 className="text-center">Unlock your health</H1>
				<H3 className="text-center">Oasis Pro</H3>
				<View className="w-full gap-y-2 mt-14">
					{FEATURES.map((feature, index) => (
						<P key={index} className="text-center">
							{feature.label}
						</P>
					))}
				</View>

				<View className="mt-8 w-full gap-y-6">
					<Button
						className="w-full"
						variant="default"
						label="Subscribe to unlock $7.99 / month"
						onPress={handleSubscribe}
					/>

					<Button
						className="w-full"
						variant="secondary"
						label="Not now"
						onPress={() => {
							router.back();
						}}
					/>
				</View>
			</View>

			<View className="">
				<Button
					label="Terms of Use"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.live-oasis.com/terms");
					}}
				/>

				<Button
					label="Privacy Policy"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.live-oasis.com/privacy-policy");
					}}
				/>
			</View>
		</View>
	);
}
