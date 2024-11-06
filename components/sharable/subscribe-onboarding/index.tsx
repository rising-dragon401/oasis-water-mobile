import Feather from "@expo/vector-icons/Feather";
import { ScrollView, TouchableOpacity, View } from "react-native";

import ScoreCard from "@/components/sharable/score-card";
import { Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

const FEATURES = [
	{
		label: "Access to all scores",
	},
	{
		label: "Unlimited scans and searches",
	},
	// {
	// 	label: "Highest rated waters",
	// },
	{
		label: "Filter recommendations",
	},
	{
		label: "Contaminant breakdowns and analysis",
	},

	// {
	// 	label: "Support further testing",
	// },
];

export function SubscribeOnboarding({
	setSelectedPlan,
	selectedPlan,
}: {
	setSelectedPlan: (plan: string) => void;
	selectedPlan: string;
}) {
	const { accentColor } = useColorScheme();
	const { tapScore } = useUserProvider();

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
				<View className="flex flex-row w-full gap-4 mb-4">
					<ScoreCard
						score={tapScore?.score || 0}
						title="Your water score"
						description="Contaminants, microplastics, and minerals found in your water"
						onPress={() => {}}
						type="small_row"
						scoreLocked
					/>
				</View>
				<View className="gap-y-6 w-full rounded-lg border border-border px-4 py-4">
					{FEATURES.map((feature, index) => (
						<View
							key={index}
							className="flex flex-row gap-5 w-full items-center"
						>
							<Feather name="check" size={32} color={accentColor} />
							<P className="text-center text-lg">{feature.label}</P>
						</View>
					))}
				</View>
			</View>

			<View className="flex flex-row gap-4 w-full p-4 mb-4">
				<TouchableOpacity
					className={`flex-1 flex flex-col justify-between border border-border rounded-lg py-2 px-4 ${selectedPlan === "annual" ? "border-primary border-2" : ""}`}
					onPress={() => setSelectedPlan("annual")}
				>
					<P className="text-left text-lg font-semibold">Yearly access</P>

					<View className="flex flex-row justify-between items-end mt-4">
						<P className="text-xl font-semibold">$47</P>
						<Muted className="">$0.90 /wk</Muted>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					className={`flex-1 flex flex-col justify-between border border-border rounded-lg py-2 px-4 ${selectedPlan === "weekly" ? "border-primary border-2" : ""}`}
					onPress={() => setSelectedPlan("weekly")}
				>
					<P className="text-lg font-semibold">Weekly access</P>
					<View className="flex flex-row justify-between mt-4">
						<P className="text-xl font-semibold">$4.99</P>
						{/* <Muted className="">$0.90 / week</Muted> */}
					</View>
				</TouchableOpacity>
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
