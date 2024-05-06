import * as Linking from "expo-linking";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { getContaminants } from "actions/ingredients";

import PaywallContent from "./paywall-content";

import { getFilterDetails } from "@/actions/filters";
import { Button } from "../ui/button";
import BlurredLineItem from "./blurred-line-item";
import ContaminantTable from "./contaminant-table";
import ItemImage from "./item-image";
import Score from "./score";
import Sources from "./sources";
import Typography from "./typography";

type Props = {
	id: string;
};

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

	const commonContaminants = useMemo(
		() =>
			contaminants?.filter(
				(contaminant: any) => contaminant.is_common === true,
			),
		[contaminants],
	);

	const uncommonContaminants = useMemo(
		() => contaminants?.filter((contaminant) => contaminant.is_common !== true),
		[contaminants],
	);

	const commonContaminantsFiltered = useMemo(
		() =>
			contaminants?.filter(
				(contaminant) =>
					contaminant.is_common === true &&
					filter.contaminants_filtered?.some(
						(filtered: any) => filtered.id === contaminant.id,
					),
			),
		[contaminants, filter.contaminants_filtered],
	);

	const uncommonContaminantsFiltered = useMemo(
		() =>
			contaminants?.filter(
				(contaminant) =>
					contaminant.is_common !== true &&
					filter.contaminants_filtered?.some(
						(filtered: any) => filtered.id === contaminant.id,
					),
			),
		[contaminants, filter.contaminants_filtered],
	);

	const percentCommonFiltered = useMemo(
		() =>
			Math.round(
				((commonContaminantsFiltered?.length ?? 0) /
					(commonContaminants?.length ?? 1)) *
					100,
			),
		[commonContaminantsFiltered, commonContaminants],
	);

	const percentUncommonFiltered = useMemo(
		() =>
			Math.round(
				((uncommonContaminantsFiltered?.length ?? 0) /
					(uncommonContaminants?.length ?? 1)) *
					100,
			),
		[uncommonContaminantsFiltered, uncommonContaminants],
	);

	// get categories filtred (if any)
	const categoriesFiltered = useMemo(
		() => filter.filtered_contaminant_categories ?? [],
		[filter.filtered_contaminant_categories],
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
				<View className="flex flex-col gap-6 justify-center items-center w-full">
					<View className="flex justify-center items-center h-80 w-80 p-4">
						{isLoading ? (
							<ActivityIndicator />
						) : (
							<ItemImage src={filter.image} alt={filter.name} thing={filter} />
						)}
					</View>

					<View className="flex flex-row justify-between gap-2">
						<View className="flex flex-col gap-2 w-2/3">
							<Typography size="3xl" fontWeight="normal">
								{filter.name}
							</Typography>
							{/* <Link href={`/search/company/${filter.company?.name}`}> */}
							<Typography
								size="base"
								fontWeight="normal"
								className="text-secondary-foreground"
							>
								{filter.brand} - {filter.company}
							</Typography>
							{/* </Link> */}

							<BlurredLineItem
								label="Common contaminants filtered"
								value={
									`${commonContaminantsFiltered?.length.toString()} (${percentCommonFiltered}%)` ||
									"0"
								}
								labelClassName="text-red-500"
							/>
							<BlurredLineItem
								label="Uncommon contaminants filtered"
								value={
									`${uncommonContaminantsFiltered?.length.toString()} (${percentUncommonFiltered}%)` ||
									"0"
								}
								labelClassName="text-red-500"
							/>

							{filter.affiliate_url && (
								<Button
									variant={filter.score > 70 ? "default" : "outline"}
									onPress={() => {
										Linking.openURL(filter.affiliate_url);
									}}
									className="w-40"
									label="Buy Now"
								/>
							)}
						</View>

						<View className="w-1/3">
							<Score score={filter.score} size="md" />
						</View>
					</View>
				</View>

				<PaywallContent
					className="mt-8"
					label="Unlock all data and reports"
					items={[
						"Contaminants not filtered levels ☠️",
						"Other filters for each toxin 🧪",
						"Contaminants filtered levels 🧼",
						"Lab reports and data 🔬",
					]}
				>
					<View className="flex flex-col gap-6 mt-10">
						<ContaminantTable
							filteredContaminants={filter.contaminants_filtered}
							categories={categoriesFiltered}
						/>
					</View>

					{filter?.sources && filter?.sources?.length > 0 && (
						<Sources data={filter.sources} />
					)}
				</PaywallContent>
			</View>
		</ScrollView>
	);
}
