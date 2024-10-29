import Feather from "@expo/vector-icons/Feather";
import { ScrollView, View } from "react-native";

import { P } from "@/components/ui/typography";
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
			<View className="w-full items-center flex flex-co mt-6">
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

			{/* <View className="flex flex-row gap-x-4 px-8 mt-2 justify-center">
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
			</View> */}
		</ScrollView>
	);
}
