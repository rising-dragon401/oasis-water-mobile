import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "components/ui/accordion";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import useSWR from "swr";

import Typography from "./typography";

import { getContaminants } from "@/actions/ingredients";
import { H3, P } from "@/components/ui/typography";
import { IngredientCategories } from "@/lib/constants";

type Props = {
	filteredContaminants: any[];
	categories?: any[];
	subscription: boolean;
	itemDetails?: {
		productId: string;
		productType: string;
		productName: string;
	};
};

export default function ContaminantTable({
	filteredContaminants,
	categories,
	subscription,
	itemDetails,
}: Props) {
	const router = useRouter();

	const { data: allContaminants } = useSWR(
		"water-contaminants",
		getContaminants,
	);

	// Some filters only list the categories
	const categoryNames = categories?.map((item) => item.category);

	const contaminantsByCategory = useMemo(() => {
		return IngredientCategories.map((category) => {
			const contaminantsInCategory = allContaminants?.filter(
				(contaminant: any) => contaminant.category === category,
			);

			let filteredInCategory = [];
			let percentageFiltered = 0;
			let name = "";

			// Check for case where filter simply lists category and % filtered
			if (categories && categoryNames?.includes(category)) {
				filteredInCategory = (contaminantsInCategory ?? []).map(
					(contaminant: any) => {
						return {
							id: contaminant.id,
							name: contaminant.name,
							is_common: contaminant.is_common,
							isFiltered: "unknown",
						};
					},
				);
				percentageFiltered = categories.find(
					(item) => item.category === category,
				)?.percentage;
				name = categories.find((item) => item.category === category)?.name;
			} else {
				filteredInCategory = (contaminantsInCategory ?? []).map(
					(contaminant: any) => {
						return {
							id: contaminant.id,
							name: contaminant.name,
							is_common: contaminant.is_common,
							isFiltered: filteredContaminants?.some(
								(fc) => fc?.id === contaminant?.id,
							),
						};
					},
				);

				const totalFiltered =
					filteredInCategory?.filter(
						(contaminant: any) => contaminant.isFiltered,
					).length ?? 0;
				const totalInCategory = contaminantsInCategory?.length;

				percentageFiltered = Math.round(
					totalInCategory ? (totalFiltered / totalInCategory) * 100 : 0,
				);
			}

			return {
				category,
				percentageFiltered,
				contaminants: filteredInCategory,
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allContaminants, filteredContaminants]);

	return (
		<>
			<H3>Contaminants filtered</H3>

			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: "/subscribeModal",
						params: {
							...itemDetails,
							path: "search/filter",
							feature: "item-analysis",
							component: "contaminant-table",
						},
					});
				}}
				disabled={subscription}
			>
				{contaminantsByCategory.map((item) => (
					<Accordion
						key={item.category}
						type="single"
						collapsible
						className="w-[90vw]"
					>
						<AccordionItem value="item-1">
							<AccordionTrigger>
								<View className="flex w-full flex-row gap-6 justify-between items-center">
									<Typography size="lg" fontWeight="normal">
										{item.category}
									</Typography>
									<Typography size="base" fontWeight="bold">
										{item.percentageFiltered}%
									</Typography>
								</View>
							</AccordionTrigger>
							<AccordionContent>
								<P>
									{item.contaminants
										?.map(
											(contaminant: any, index: number) =>
												`${contaminant.name}${contaminant?.is_common ? " (c)" : ""}${index < item.contaminants.length - 1 ? ", " : ""}`,
										)
										.join("")}
								</P>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				))}

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
			</TouchableOpacity>
		</>
	);
}
