import Feather from "@expo/vector-icons/Feather";
import { getContaminants } from "actions/ingredients";
import * as Linking from "expo-linking";
import { Link, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";

import ItemImage from "./item-image";
import Score from "./score";
import Sources from "./sources";
import UntestedRow from "./untested-row";

import { getFilterDetails } from "@/actions/filters";
import ContaminantTable from "@/components/sharable/contaminant-table";
import FilterMetadata from "@/components/sharable/filter-metadata";
import { H3, Muted } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useUserProvider } from "@/context/user-provider";
import { IngredientCategories } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

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
	const { hasActiveSub } = useSubscription();
	const { iconColor } = useColorScheme();
	const { userData } = useUserProvider();
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

	const isTested = filter?.is_indexed !== false;

	const filterDetails = {
		productId: filter.id,
		productType: filter.type,
		productName: filter.name,
	};

	const isItemUnlocked = useMemo(() => {
		return userData?.unlock_history?.some((unlock: any) => {
			return (
				String(unlock.product_id) === String(filter.id) &&
				String(unlock.product_type) === String(filter.type)
			);
		});
	}, [userData, filter.id, filter.type]);

	console.log("isItemUnlocked: ", isItemUnlocked);

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
					<View className="flex justify-center items-center h-64 w-64 p-4">
						{isLoading ? (
							<ActivityIndicator />
						) : (
							<ItemImage
								src={filter.image}
								alt={filter.name}
								thing={filter}
								showFavorite={isTested}
							/>
						)}
					</View>

					<View className="flex flex-row justify-between gap-2 w-full">
						<View className="flex flex-col gap-2 w-2/3">
							{filter.affiliate_url ? (
								<TouchableOpacity
									onPress={() => {
										Linking.openURL(filter.affiliate_url);
									}}
								>
									<H3 className="pb-1 items-start">
										{filter.name}
										{` `}
										<Feather
											name="arrow-up-right"
											size={14}
											color={iconColor}
										/>
									</H3>
								</TouchableOpacity>
							) : (
								<H3 className="pb-1">{filter.name}</H3>
							)}

							{/* <Link href={`/search/company/${filter.company?.name}`}> */}
							<Link href={`/search/company/${filter.company_id}`}>
								<Muted>{filter.brand}</Muted>
							</Link>
						</View>

						<View className="flex w-1/3 flex-col-reverse justify-end items-end -mt-2">
							<Score
								score={filter.score}
								size="sm"
								untested={!isTested}
								itemDetails={filterDetails}
								showScore={isItemUnlocked}
							/>
						</View>
					</View>

					{!isTested && <UntestedRow thing={filter} />}

					<View>
						<FilterMetadata
							filteredContaminants={filteredContaminants}
							contaminantsByCategory={contaminantsByCategory}
							isPaywalled={!hasActiveSub && !isItemUnlocked}
							itemDetails={filterDetails}
						/>
					</View>

					<View className="flex flex-col items-start mx-0 my-2">
						<Muted className="mx-0">{filter.description}</Muted>
					</View>
				</View>

				<View>
					<View className="flex flex-col mt-6">
						<ContaminantTable
							filteredContaminants={filter.contaminants_filtered}
							categories={categoriesFiltered}
							subscription={hasActiveSub || isItemUnlocked}
							itemDetails={filterDetails}
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
