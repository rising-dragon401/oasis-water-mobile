import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { getFilterDetails } from "@/actions/filters";
import { IngredientCategories } from "@/lib/constants";
import { getContaminants } from "actions/ingredients";
import * as Linking from "expo-linking";
import { Button } from "../ui/button";
import ContaminantTable from "./contaminant-table";
import ItemImage from "./item-image";
import Score from "./score";
import ShowerFilterMetadata from "./shower-filter-metadata";
import Sources from "./sources";
import Typography from "./typography";
import WaterFilterMetadata from "./water-filter-metadata";

import { P } from "@/components/ui/typography";

type Props = {
	id: string;
};

interface ContaminantsByCategory {
	[key: string]: {
		percentageFiltered: number;
		contaminants: any[];
	};
}

export function FilterForm({ id }: Props) {
	const navigation = useNavigation();

	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<any>({});
	const [contaminants, setContaminants] = useState<any[]>([]);

	useEffect(() => {
		fetchContaminants();
		fetchFilter(id);
	}, [id]);

	const fetchContaminants = async () => {
		const data = await getContaminants();
		setContaminants(data);
	};

	const fetchFilter = async (id: string) => {
		const filter = await getFilterDetails(id);

		if (filter) {
			setFilter(filter);

			navigation.setOptions({
				title: filter?.name || "Filter",
			});
		}

		setIsLoading(false);

		return filter;
	};

	// get categories filtred (if any)
	const categoriesFiltered = useMemo(
		() => filter.filtered_contaminant_categories ?? [],
		[filter.filtered_contaminant_categories],
	);

	const filteredContaminants = filter.contaminants_filtered;
	const categories = filter.filtered_contaminant_categories;

	// Some filters only list the categories
	const categoryNames = categories?.map((item: any) => item.category);

	const contaminantsByCategory = useMemo(() => {
		return IngredientCategories.reduce((acc, category) => {
			const contaminantsInCategory = contaminants?.filter(
				(contaminant) => contaminant.category === category,
			);

			let filteredInCategory = [];
			let percentageFiltered = 0;

			// Check for case where filter simply lists category and % filtered
			if (categories && categoryNames?.includes(category)) {
				filteredInCategory = (contaminantsInCategory ?? []).map(
					(contaminant) => {
						return {
							id: contaminant.id,
							name: contaminant.name,
							is_common: contaminant.is_common,
							// isFiltered: filteredContaminants.some((fc) => fc.id === contaminant.id) || 'unknown',
						};
					},
				);
				percentageFiltered = categories.find(
					(item: any) => item.category === category,
				)?.percentage;
			} else {
				filteredInCategory = (contaminantsInCategory ?? []).map(
					(contaminant) => {
						return {
							id: contaminant?.id,
							name: contaminant?.name,
							is_common: contaminant?.is_common,
							isFiltered: filteredContaminants?.some(
								(fc: any) => fc?.id === contaminant?.id,
							),
						};
					},
				);

				const totalFiltered =
					filteredInCategory?.filter((contaminant) => contaminant.isFiltered)
						.length ?? 0;
				const totalInCategory = contaminantsInCategory?.length;

				percentageFiltered = Math.round(
					totalInCategory ? (totalFiltered / totalInCategory) * 100 : 0,
				);
			}

			acc[category] = {
				percentageFiltered,
				contaminants: filteredInCategory,
			};

			return acc;
		}, {} as ContaminantsByCategory);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contaminants, filteredContaminants]);

	const contaminantCategories = Object.fromEntries(
		filter?.filtered_contaminant_categories?.map((category: any) => [
			category.category,
			category.percentage,
		]) ?? [],
	);

	if (filter.is_draft) {
		return (
			<View>This filter has not been rated yet. Please check back later.</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="w-full items-center justify-center px-8">
				<View className="flex flex-col gap-2 justify-center items-center w-full">
					<View className="flex justify-center items-center h-80 w-80 p-4">
						{isLoading ? (
							<ActivityIndicator />
						) : (
							<ItemImage src={filter.image} alt={filter.name} thing={filter} />
						)}
					</View>

					<View className="flex flex-row justify-between gap-2 w-full">
						<View className="flex flex-col gap-2 w-2/3">
							<Typography size="3xl" fontWeight="normal">
								{filter.name}
							</Typography>
							{/* <Link href={`/search/company/${filter.company?.name}`}> */}
							<P>
								{filter.brand} - {filter.company}
							</P>
							{/* </Link> */}

							{/* <P className="text-left">
								Certifications: {filter.certifications || "None"}
							</P> */}

							{filter.affiliate_url && (
								<Button
									variant={filter.score > 70 ? "default" : "secondary"}
									onPress={() => {
										Linking.openURL(filter.affiliate_url);
									}}
									className="w-56 !h-10 !py-0"
									label="Learn more"
								/>
							)}
						</View>

						<View className="w-1/3">
							<Score score={filter.score} size="md" />
						</View>
					</View>

					<View>
						{filter.type === "shower_filter" && (
							<ShowerFilterMetadata
								filteredContaminants={filteredContaminants}
								contaminantsByCategory={contaminantsByCategory}
							/>
						)}

						{(filter.type === "filter" || filter.type === "bottle_filter") && (
							<WaterFilterMetadata
								contaminantCategories={contaminantCategories}
							/>
						)}
					</View>

					<View className="flex flex-col items-start">
						<P>{filter.description}</P>
					</View>
				</View>

				<View>
					<View className="flex flex-col mt-6">
						<ContaminantTable
							filteredContaminants={filter.contaminants_filtered}
							categories={categoriesFiltered}
						/>
					</View>

					{filter?.sources && filter?.sources?.length > 0 && (
						<Sources data={filter.sources} />
					)}
				</View>
			</View>
		</ScrollView>
	);
}
