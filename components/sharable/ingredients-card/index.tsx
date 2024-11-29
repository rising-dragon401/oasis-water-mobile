import { BlurView } from "expo-blur";
import { useMemo } from "react";
import { View } from "react-native";

import Typography from "../typography";

import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	ingredients: any[];
	subscription: boolean;
};

export default function IngredientsCard({ ingredients, subscription }: Props) {
	const { iconColor } = useColorScheme();

	const nonContaminantIngredients = useMemo(
		() =>
			ingredients
				.filter((ingredient) => !ingredient.is_contaminant)
				.sort((a, b) => b.severity_score - a.severity_score),
		[ingredients],
	);

	const getBgColor = (severityScore: number) => {
		if (severityScore > 0) return "bg-yellow-100";
		if (severityScore > 2) return "bg-red-100";
		return "bg-muted";
	};

	return (
		<>
			{nonContaminantIngredients?.map((ingredient, index) => (
				<View key={index} className="rounded-2xl border bg-card border-border">
					<View className="flex flex-row justify-between items-center w-full rounded-t-md px-4 py-2">
						<Typography size="lg" fontWeight="medium">
							{ingredient.name}
						</Typography>
						<Typography size="base" fontWeight="normal">
							{ingredient.amount} {ingredient.measure}
						</Typography>
					</View>

					<View className="px-4 pb-4 flex md:flex-row flex-col justify-between">
						<View className="flex flex-col w-full md:w-1/2 pr-2">
							<View className="flex flex-row items-center gap-1">
								{/* <Feather name="thumbs-up" size={18} color={iconColor} /> */}
								{/* <P>Benefits:</P> */}
							</View>
							<P className="text-muted-foreground">{ingredient.benefits}</P>
						</View>
						{/* <View className="flex flex-col w-full md:w-1/2 md:pl-4 md:mt-0 mt-2">
							<View className="flex flex-row items-center gap-1">
								<Feather name="thumbs-up" size={18} color={iconColor} />
								<P>Harms:</P>
							</View>
							<P>{ingredient.risks}</P>
						</View> */}
					</View>

					{!subscription && (
						<BlurView
							intensity={32}
							tint="regular"
							style={{
								position: "absolute",
								left: 0,
								top: 0,
								right: 0,
								bottom: 20,
								borderRadius: 16,
								height: "100%",

								overflow: "hidden",
								backgroundColor: "rgba(255, 255, 255, 0.2)",
							}}
						/>
					)}
				</View>
			))}
		</>
	);
}
