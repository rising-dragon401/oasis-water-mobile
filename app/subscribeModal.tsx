import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import Logo from "@/components/sharable/logo";
import { Button } from "@/components/ui/button";
import { H2, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

const FEATURES = [
	{
		label: "Access to all scores and ratings",
	},
	{
		label: "Unlimited scans and searches",
	},
	{
		label: "Full contaminant breakdowns",
	},
	{
		label: "Personalized filter recommendations",
	},
	{
		label: "Oasis Research AI",
	},
	{
		label: "Support further testing",
	},
];

export default function SubscribeModal() {
	const { subscription, user } = useUserProvider();
	const router = useRouter();
	const { packages, purchasePackage } = useRevenueCat();
	const { accentColor, backgroundColor } = useColorScheme();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (subscription?.active) {
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

			console.log(packages);

			const pack = packages[0];

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
			<View className="flex-1 justify-between p-4 py-16 h-full">
				{/* Content Section */}
				<View className="items-center flex-1">
					<Logo />
					<H2 className="text-center pt-4">Unlock healthy hydration</H2>
					<Muted className="text-center max-w-sm">
						Your membership funds independent lab testing (which is expensive!)
						and helps keep Oasis unbiased.
					</Muted>
					{/* Features */}
					<View className="w-full items-center flex flex-col mt-14">
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
				</View>

				{/* Subscribe Button Section */}
				<View className="w-full flex-col items-center mt-auto justify-center">
					{/* mt-auto pushes this section to the bottom */}
					<Button
						className="w-full !max-w-sm !h-20 mb-4"
						textClassName="!text-lg"
						variant="default"
						label="Try it free"
						loading={loading}
						onPress={handleSubscribe}
					/>
					<View className="flex flex-col gap-y-2 w-full">
						<Muted className="text-center">
							Free access for 3 days then $4 /mo ($47 billed annually)
						</Muted>
					</View>
					<View className="mt-14 px-8 flex flex-row gap-x-4">
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
			</View>
		</ScrollView>
	);
}
