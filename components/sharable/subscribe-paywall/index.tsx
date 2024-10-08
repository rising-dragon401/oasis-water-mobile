import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import Logo from "@/components/sharable/logo";
import { Button } from "@/components/ui/button";
import { H2, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";

const FEATURES = [
	{
		label: "🔓 Unlock all scores and ratings",
	},
	{
		label: "🌿 Personal AI nutritionist",
	},
	{
		label: "🔬 Latest scientific research",
	},
	{
		label: "🌐 Private community",
	},
	{
		label: "🧬 Supports new lab tests",
	},
];

export function SubscribePaywall() {
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
				throw new Error("No package found");
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
		<View className="flex flex-1 items-center justify-between p-4 gap-y-4 pt-20 pb-10 h-full">
			<View />

			<View className="w-full items-center flex flex-col">
				<Logo />
				<H2 className="text-center pt-4">Oasis Member</H2>

				<Muted>Free access for 3 days, then</Muted>
				<Muted className="mb-4">$47 per year, ($4 /month)</Muted>

				<View className="w-full gap-y-3 bg-card py-4 max-w-sm rounded-lg">
					{FEATURES.map((feature, index) => (
						<P key={index} className="text-center">
							{feature.label}
						</P>
					))}
				</View>

				<View className="mt-8 w-full max-w-sm gap-y-4">
					<Button
						className="w-full"
						variant="default"
						label="Start 3 day free trial"
						loading={loading}
						onPress={handleSubscribe}
					/>
					{!userData?.has_redeemed_free_month && (
						<Button
							className="w-full bg-transparent"
							variant="outline"
							label="Invite 3 friends, get 1 month free 🤝"
							onPress={handleInviteFriends}
						/>
					)}
					<Link className="w-full text-center mt-4" href="/(public)/sign-in">
						<P>Already a member? Sign in</P>
					</Link>
				</View>
			</View>

			<View className="mt-14 px-8">
				<Button
					label="Terms of Use"
					size="sm"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/terms");
					}}
				/>

				<Button
					label="Privacy Policy"
					size="sm"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/privacy-policy");
					}}
				/>

				<Button
					label="Refund Policy"
					size="sm"
					variant="ghost"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/refund-policy");
					}}
				/>
			</View>
		</View>
	);
}
