import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "components/ui/accordion";
import { useMemo } from "react";
import { View } from "react-native";
import useSWR from "swr";

import PaywallContent from "./paywall-content";
import Typography from "./typography";

import { getContaminants } from "@/actions/ingredients";
import { H3, P } from "@/components/ui/typography";
import { FEATURES, IngredientCategories } from "@/lib/constants";

type Props = {
	filteredContaminants: any[];
	categories?: any[];
};

export default function ContaminantTable({
	filteredContaminants,
	categories,
}: Props) {
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

			<PaywallContent
				label="See what this filter removes"
				items={FEATURES.map((item) => item.label)}
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
									<Typography size="base" fontWeight="normal">
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
			</PaywallContent>
		</>
	);
}
