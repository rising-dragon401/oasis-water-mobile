import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { H1, Muted, P } from "@/components/ui/typography";
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
		if (subscription.active) {
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
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Unlock your health</H1>
			<Muted className="text-center">$7.99 / month</Muted>

			<View className="w-full gap-y-2">
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
					label="Subscribe to unlock"
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
	);
}
