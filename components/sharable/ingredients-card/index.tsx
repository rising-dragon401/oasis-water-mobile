import { useMemo } from "react";
import { View } from "react-native";
import Typography from "../typography";

type Props = {
	ingredients: any[];
};

export default function IngredientsCard({ ingredients }: Props) {
	const nonContaminantIngredients = useMemo(
		() => ingredients.filter((ingredient) => !ingredient.is_contaminant),
		[ingredients],
	);

	return (
		<>
			{nonContaminantIngredients?.map((ingredient, index) => (
				<View key={index}>
					<View className="flex flex-row justify-between items-center w-full">
						<Typography size="lg" fontWeight="normal" className="mb-4">
							{ingredient.name}
						</Typography>
						<Typography size="base" fontWeight="normal" className="mb-4">
							{ingredient.amount} {ingredient.measure}
						</Typography>
					</View>

					<View className="ml-4">
						<Typography size="base" fontWeight="normal" className=" mt-2">
							Benefits: {` `}
							{ingredient.benefits}
						</Typography>

						<Typography size="base" fontWeight="normal" className="mt-2">
							Harms: {` `}
							{ingredient.risks}
						</Typography>
					</View>
				</View>
			))}
		</>
	);
}
