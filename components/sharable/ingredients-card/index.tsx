import { useMemo } from "react";
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
				<div key={index}>
					<div className="flex flex-row justify-between items-center w-full">
						<Typography
							size="lg"
							fontWeight="normal"
							className="mb-4 text-secondary"
						>
							{ingredient.name}
						</Typography>
						<Typography
							size="base"
							fontWeight="normal"
							className="mb-4 text-secondary"
						>
							{ingredient.amount} {ingredient.measure}
						</Typography>
					</div>

					<div className="ml-4">
						<Typography
							size="base"
							fontWeight="normal"
							className="text-secondary"
						>
							Benefits: {` `}
							{ingredient.benefits}
						</Typography>

						<Typography
							size="base"
							fontWeight="normal"
							className="text-secondary mt-2"
						>
							Harms: {` `}
							{ingredient.risks}
						</Typography>
					</div>
				</div>
			))}
		</>
	);
}
