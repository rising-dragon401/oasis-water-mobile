import Logo from "@/components/sharable/logo";
import { Button } from "@/components/ui/button";
import { H2, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const FEATURES = [
	{
		label: "Unlock all scores",
	},
	{
		label: "Unlimited searches and scans",
	},
	{
		label: "Full contaminant breakdowns",
	},
	{
		label: "Recommended filters",
	},
	{
		label: "Supports further testing & research",
	},
];

export function SubscribePaywall() {
	const { subscription, user, userData } = useUserProvider();
	const router = useRouter();
	const { packages, purchasePackage } = useRevenueCat();
	const { accentColor } = useColorScheme();

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
			<View className="w-full items-center flex flex-col flex-1">
				<Logo />
				<H2 className="text-center pt-4">Oasis Member</H2>

				<Muted>Free access for 3 days, then</Muted>
				<Muted className="mb-4">$47 per year, ($4 /month)</Muted>

				<View className="w-full items-center flex flex-col mt-4">
					<View className="gap-y-6 w-full rounded-lg border border-border px-4 py-4 max-w-sm">
						{FEATURES.map((feature, index) => (
							<View
								key={index}
								className="flex flex-row gap-5 w-full items-center"
							>
								<Feather name="check" size={28} color={accentColor} />
								<P className="text-center text-lg">{feature.label}</P>
							</View>
						))}
					</View>
				</View>

				<View className="mt-14 w-full max-w-sm gap-y-4 ">
					<Button
						className="w-full !h-20 mb-4"
						textClassName="!text-lg"
						variant="default"
						label="Try it free"
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
					{/* <Link className="w-full text-center mt-4" href="/(public)/sign-in">
						<P>Already a member? Sign in</P>
					</Link> */}
				</View>
			</View>

			<View className="mt-4 px-8 flex flex-row gap-x-4">
				<Button
					label="Terms of Use"
					size="sm"
					variant="ghost"
					textClassName="!text-muted-foreground"
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
	);
}
