import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { View } from "react-native";

import { P } from "@/components/ui/typography";
import Typography from "../typography";

type Props = {
	ingredients: any[];
};

export default function IngredientsCard({ ingredients }: Props) {
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
				<View key={index} className="rounded-md border">
					<View
						className={`flex flex-row justify-between items-center w-full ${getBgColor(
							ingredient.severity_score,
						)} rounded-t-md px-4 py-2`}
					>
						<Typography size="lg" fontWeight="medium">
							{ingredient.name}
						</Typography>
						<Typography size="base" fontWeight="normal">
							{ingredient.amount} {ingredient.measure}
						</Typography>
					</View>

					<View className="px-4 py-2 flex md:flex-row flex-col justify-between">
						<View className="flex flex-col w-full md:w-1/2 pr-2">
							<View className="flex flex-row items-center gap-1">
								<Feather name="thumbs-up" size={18} color="black" />
								<P>Benefits:</P>
							</View>
							<P>{ingredient.benefits}</P>
						</View>
						<View className="flex flex-col w-full md:w-1/2 md:pl-4 md:mt-0 mt-2">
							<View className="flex flex-row items-center gap-1">
								<Feather name="thumbs-up" size={18} color="black" />
								<P>Harms:</P>
							</View>
							<P>{ingredient.risks}</P>
						</View>
					</View>
				</View>
			))}
		</>
	);
}
