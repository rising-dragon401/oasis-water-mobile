import { getIngredient } from "@/actions/ingredients";
import { H1, P } from "@/components/ui/typography";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
export function IngredientForm({ ingredientId }: { ingredientId: string }) {
	const [ingredient, setIngredient] = useState<any>(null);

	useEffect(() => {
		const fetchIngredient = async () => {
			const ingredient = await getIngredient(ingredientId);
			if (ingredient && ingredient.length > 0) {
				setIngredient(ingredient[0]);
			}
		};
		fetchIngredient();
	}, [ingredientId]);

	console.log("ingredient: ", ingredient);

	if (!ingredient) {
		return <H1>Loading...</H1>;
	}

	return (
		<View className="p-5 rounded-lg flex flex-col items-center justify-start px-8">
			<Image
				source={{ uri: ingredient.image }}
				className="w-40 h-40 rounded-lg mb-4 shadow-md"
			/>

			<H1>{ingredient.name}</H1>

			<P>{ingredient.description}</P>

			<View className="flex flex-col w-full bg-card p-2 rounded-lg border-2 border-border mt-4">
				<P className="font-bold text-left">Risks</P>
				<P>{ingredient.risks}</P>
			</View>

			<View className="flex flex-col w-full bg-card p-2 rounded-lg border-2 border-border mt-4">
				<P className="font-bold">Benefits</P>
				<P>{ingredient.benefits}</P>
			</View>

			<View className="flex flex-col w-full bg-card p-2 rounded-lg border-2 border-border mt-4">
				<P className="font-bold">Legal limits</P>
				<P>
					{ingredient?.legal_limit
						? `${ingredient.legal_limit} ${ingredient.measure}`
						: "None"}
				</P>
			</View>

			<View className="flex flex-col w-full bg-card p-2 rounded-lg border-2 border-border mt-4">
				<P className="font-bold">Recommended guideline</P>
				<P>
					{ingredient?.health_guideline
						? `${ingredient.health_guideline} ${ingredient.measure}`
						: "None"}
				</P>
			</View>

			{ingredient.sources && ingredient.sources.length > 0 && (
				<View className="flex flex-col w-full p-2  mt-4">
					<P className="font-bold">Sources</P>
					{ingredient.sources.map((source: any) => (
						<Link href={source.url} key={source.id}>
							<P className="text-sm underline">{source.label}</P>
						</Link>
					))}
				</View>
			)}
		</View>
	);
}
