import Octicons from "@expo/vector-icons/Octicons";
import { ScrollView, View } from "react-native";

import ProfileScores from "../profile-scores";

import { FEATURES } from "@/app/subscribeModal";
import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export const SCORE_FEATURES = [
	{
		icon: "check",
		label: "See top-rated products",
	},
	{
		icon: "check",
		label: "Full contaminant breakdowns",
	},

	{
		icon: "check",
		label: "Real-time updates on new data",
	},
];

export function SubscribeOnboarding({
	setSelectedPlan,
	selectedPlan,
	onPress,
}: {
	setSelectedPlan: (plan: string) => void;
	selectedPlan: string;
	onPress: () => void;
}) {
	const { accentColor } = useColorScheme();
	const { userScores } = useUserProvider();

	const hasScores = userScores && userScores?.allIngredients?.length > 0;

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<View className="w-full items-center flex flex-col mt-4 gap-y-2 ">
				{hasScores && (
					<View className="w-full justify-start">
						<P className="text-left text-lg font-semibold mb-2">
							Your water analysis
						</P>
						<ProfileScores userScores={userScores} hideSubtitle />
					</View>
				)}

				<View className="flex flex-col w-full mt-2 max-w-lg px-2">
					<P className="text-left text-lg font-semibold">Why upgrade?</P>
					<View
						className={`h-full w-full min-h-48 flex-col ${hasScores ? "gap-y-4" : "gap-y-8"} mt-4`}
					>
						{(hasScores ? SCORE_FEATURES : FEATURES).map((feature, index) => (
							<View
								key={index}
								className={`flex flex-row gap-6 w-full items-center `}
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
			</View>
		</ScrollView>
	);
}
