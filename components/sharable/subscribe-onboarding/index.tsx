import Feather from "@expo/vector-icons/Feather";
import * as Linking from "expo-linking";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

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
		label: "Supports testing more products",
	},
];

export function SubscribeOnboarding() {
	const { accentColor } = useColorScheme();

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<View className="w-full items-center flex flex-col">
				<View className="gap-y-6 w-full rounded-lg border border-border px-4 py-4">
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

			<View className="flex flex-row gap-x-4 px-8 mt-2 justify-center">
				<Button
					label="Terms of Use"
					size="sm"
					variant="ghost"
					className="!text-muted"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/terms");
					}}
				/>

				<Button
					label="Privacy Policy"
					size="sm"
					variant="ghost"
					className="!text-muted"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/privacy-policy");
					}}
				/>

				<Button
					label="Refund Policy"
					size="sm"
					variant="ghost"
					className="!text-muted"
					onPress={() => {
						Linking.openURL("https://www.oasiswater.app/refund-policy");
					}}
				/>
			</View>
		</ScrollView>
	);
}
