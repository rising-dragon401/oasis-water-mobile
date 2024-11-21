import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { FEATURES } from "@/app/subscribeModal";
import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export const SCORE_FEATURES = [
	{
		icon: "check",
		label: "Discover the best waters for you",
	},
	{
		icon: "check",
		label: "Eliminate toxins with the right filters",
	},
	{
		icon: "check",
		label: "View full contaminant breakdowns",
	},
	// {
	// 	icon: "check",
	// 	label: "Stay informed with real-time ratings",
	// },
	{
		icon: "check",
		label: "Join 10,000+ healthier members",
	},
	{
		icon: "check",
		label: "Directly support new product testing",
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
	const { accentColor, redColor, greenColor, iconColor } = useColorScheme();
	const { userScores } = useUserProvider();

	const hasScores = userScores && userScores?.allIngredients?.length > 0;

	const generateScoreText = useMemo(() => {
		if (hasScores) {
			const contaminants = userScores.allIngredients?.length;
			const healthRisks = userScores.allHarms?.length;

			return (
				<P className="text-left">
					Looks like you are exposed to
					<Text className="font-semibold text-lg" style={{ color: redColor }}>
						{` `}
						{contaminants} contaminants
					</Text>
					{` `}and
					<Text className="font-semibold text-lg" style={{ color: redColor }}>
						{` `}
						{healthRisks} health risks{` `}
					</Text>
					{` `}based on your tap water and products.
				</P>
			);
		} else {
			return (
				<P className="text-left">
					<Text className="font-semibold text-lg" style={{ color: redColor }}>
						90% of water samples
					</Text>
					{` `}
					have microplastics, heavy metals and other toxic chemicals that can
					enter your body while drinking or bathing, posing
					<Text className="font-semibold text-lg" style={{ color: redColor }}>
						{` `}
						hidden health risks
					</Text>
					{` `}— often without you even knowing.
				</P>
			);
		}
	}, [userScores, hasScores]);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 100,
			}}
		>
			<P className="text-center text-4xl mb-4">😳💧</P>
			<View className="w-full items-left flex flex-col gap-y-2 ">
				{hasScores && (
					<View
						className="w-full justify-start bg-card p-4 rounded-lg border"
						style={{ borderColor: redColor }}
					>
						{generateScoreText}
						{/* <WaterScores userScores={userScores} hideSubtitle /> */}
					</View>
				)}

				<View className="flex flex-col w-full mt-4 px-4 bg-card p-4 rounded-lg border border-border">
					<P className="text-left text-base mb-4">Why upgrade?</P>
					<View className="flex flex-col gap-y-3">
						{(hasScores ? SCORE_FEATURES : FEATURES).map(
							(feature, index, array) => (
								<View
									key={index}
									className={`flex flex-row gap-4 w-full items-center py-2 ${
										index !== array.length - 1 ? "border-b border-gray-200" : ""
									}`}
								>
									<Feather name="check" size={20} color={accentColor} />

									<P className="text-left text-base text-wrap font-bold">
										{feature.label}
									</P>
								</View>
							),
						)}
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
