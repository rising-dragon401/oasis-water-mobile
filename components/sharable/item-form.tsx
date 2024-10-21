"use client";

import { Octicons } from "@expo/vector-icons";
import { getItemDetails } from "actions/items";
import * as Linking from "expo-linking";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import BlurredLineItem from "./blurred-line-item";
import ContaminantCard from "./contamintant-card";
import IngredientsCard from "./ingredients-card";
import ItemImage from "./item-image";
import MetaDataCard from "./metadata-card";
import PaywallContent from "./paywall-content";
import Score from "./score";
import Typography from "./typography";

import { incrementItemsViewed } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { H2, Muted } from "@/components/ui/typography";

import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

import Sources from "./sources";

type Props = {
	id: string;
};

export function ItemForm({ id }: Props) {
	const navigation = useNavigation();

	const { uid } = useUserProvider();
	const { iconColor } = useColorScheme();

	const [item, setItem] = useState<any>({});
	const [, setIsLoading] = useState(true);

	useEffect(() => {
		incrementItemsViewed(uid);
	}, [uid]);

	const fetchItem = async (id: string) => {
		const item = await getItemDetails(id);

		if (item) {
			setItem(item);
			navigation.setOptions({
				title: item.name,
			});
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchItem(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const contaminants = item?.contaminants || [];

	const contaminantsAboveLimit = contaminants.filter(
		(contaminant: any) => contaminant.exceedingLimit > 0,
	);

	const fluorideContaminant = item.contaminants?.find(
		(contaminant: { name: string }) =>
			contaminant.name.toLowerCase() === "fluoride",
	);
	const fluorideValue = fluorideContaminant
		? `${fluorideContaminant.amount} ppm`
		: "Not Detected";

	const sortedContaminants = contaminants.sort(
		(a: { exceedingLimit: number }, b: { exceedingLimit: number }) => {
			return b.exceedingLimit - a.exceedingLimit;
		},
	);

	const nanoPlasticsValue =
		item.packaging === "plastic"
			? "Yes"
			: item.packaging === "aluminum" ||
				  item.packaging === "aluminum (can)" ||
				  item.packaging === "cardboard"
				? "Some"
				: "No";

	const harmfulIngredients = item.ingredients?.filter(
		(ingredient: any) => ingredient.severity_score > 0,
	);

	const waterSource = (() => {
		switch (item.water_source) {
			case "municipal_supply":
				return "Tap water";
			case "mountain_spring":
				return "Mountain Spring";
			case "aquifer":
				return "Aquifer";
			case "iceberg":
				return "Iceberg";
			case "spring":
				return "Spring";
			case "well":
				return "Well";
			case "rain":
				return "Rain";
			default:
				return "Unknown";
		}
	})();

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="w-full items-center justify-center px-8">
				<View className="flex flex-col gap-2 justify-center items-center w-full">
					<View className="flex justify-center items-center h-80 w-80 p-4">
						<ItemImage src={item.image} alt={item.name} thing={item} />
					</View>

					<View className="flex flex-row gap-2 w-full">
						<View className="flex flex-col w-2/3">
							<H2 className="pb-1">{item.name}</H2>

							{/* @ts-ignore */}
							<Link href={`/search/company/${item.company?.name}`}>
								<Muted>{item.company?.name}</Muted>
							</Link>
						</View>

						<View className="flex w-1/3 flex-col-reverse justify-end items-end -mt-2">
							<Score score={item.score} size="md" />
						</View>
					</View>

					<View className="flex flex-col gap-10 gap-y-1 w-full mt-2 ">
						{item.is_indexed && (
							<View className="flex flex-col gap-y-1 w-full">
								<BlurredLineItem
									label="Contaminants"
									value={contaminants.length}
									isPaywalled={false}
									score={contaminants.length > 0 ? "bad" : "good"}
								/>

								<BlurredLineItem
									label="Above guidelines"
									value={contaminantsAboveLimit.length}
									isPaywalled={false}
									score={contaminantsAboveLimit.length > 0 ? "bad" : "good"}
								/>

								<BlurredLineItem
									label="pH"
									value={
										item.metadata?.ph_level === 0 ||
										item.metadata?.ph_level == null
											? "Unknown"
											: item.metadata.ph_level
									}
									isPaywalled={false}
									score={
										parseFloat(item.metadata?.ph_level) > 7 ? "good" : "neutral"
									}
								/>

								<BlurredLineItem
									label="TDS"
									value={item.metadata?.tds || "N/A"}
									isPaywalled={false}
									score="neutral"
								/>

								<BlurredLineItem
									label="PFAS"
									value={item.metadata?.pfas || "N/A"}
									isPaywalled={false}
									score={item.metadata?.pfas === "Yes" ? "bad" : "good"}
								/>

								<BlurredLineItem
									label="Fluoride"
									value={fluorideValue}
									isPaywalled={false}
									score={parseFloat(fluorideValue) > 0 ? "bad" : "good"}
								/>
							</View>
						)}

						<View className="flex flex-col gap-y-1 w-full">
							<BlurredLineItem
								label="Harmful ingredients"
								value={harmfulIngredients?.length}
								isPaywalled={false}
								score={harmfulIngredients?.length > 0 ? "bad" : "good"}
							/>

							<BlurredLineItem
								label="Microplastics"
								value={nanoPlasticsValue}
								isPaywalled={false}
								score={nanoPlasticsValue === "Yes" ? "bad" : "good"}
							/>

							<BlurredLineItem
								label="Packaging"
								value={
									item?.packaging
										? item.packaging.charAt(0).toUpperCase() +
											item.packaging.slice(1)
										: "Unknown"
								}
								isPaywalled={false}
								score={item.packaging === "glass" ? "good" : "bad"}
							/>

							<BlurredLineItem
								label="Source"
								value={waterSource ? waterSource : "Unknown"}
								isPaywalled={false}
								score={
									item.water_source === "spring" ||
									item.water_source === "aquifer" ||
									item.water_source === "mountain_spring"
										? "good"
										: "bad"
								}
							/>
						</View>
					</View>

					<View className="flex flex-col md:w-40 w-full md:mt-6 mt-2 gap-2">
						{item.affiliate_url && (
							<Button
								variant={item.score > 70 ? "outline" : "outline"}
								onPress={() => {
									Linking.openURL(item.affiliate_url);
								}}
								label="Learn more"
								icon={
									<Octicons name="arrow-right" size={12} color={iconColor} />
								}
								iconPosition="right"
							/>
						)}
					</View>
				</View>

				{!item.is_indexed && (
					<View className="w-full mt-4">
						<Typography
							size="base"
							fontWeight="normal"
							className="text-primary"
						>
							⚠️ No lab reports
						</Typography>
						<View className="flex flex-col gap-6 mt-6">
							<Typography
								size="base"
								fontWeight="normal"
								className="text-primary"
							>
								This item has not been tested. Proceed with caution as there may
								be unexpected contaminants inside. Score is subject to change
							</Typography>
						</View>
					</View>
				)}

				<>
					{sortedContaminants && sortedContaminants.length > 0 && (
						<View className="flex flex-col gap-6 mt-6">
							<Typography size="2xl" fontWeight="normal">
								Contaminants ☠️
							</Typography>
							<PaywallContent
								label="See what contaminants this filter removes"
								items={[
									"Rating and scores 🌟",
									"Research reports and data 🔬",
									"Latest lab results 💧",
									"Request new products 🌿",
								]}
							>
								<View className="grid md:grid-cols-2 grid-cols-1 gap-6">
									{sortedContaminants.map((contaminant: any, index: number) => (
										<ContaminantCard
											key={contaminant.id || index}
											data={contaminant}
										/>
									))}
								</View>
							</PaywallContent>
						</View>
					)}

					{item.type === "bottled_water" && (
						<View className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6 w-full">
							<MetaDataCard
								title="Source"
								description={item.metadata?.source}
							/>
							<MetaDataCard
								title="Treatment Process"
								description={
									Array.isArray(item.filtration_methods) &&
									item.filtration_methods.length > 0
										? item.filtration_methods.join(", ") +
											". " +
											item.metadata?.treatment_process
										: item.metadata?.treatment_process
								}
							/>
						</View>
					)}

					<>
						{item?.ingredients?.length > 0 && (
							<View className="flex flex-col gap-6 my-10">
								<Typography size="2xl" fontWeight="normal">
									Other Ingredients
								</Typography>
								<PaywallContent label="View all minerals and ingredients">
									<IngredientsCard ingredients={item.ingredients} />
								</PaywallContent>
							</View>
						)}
					</>

					{item && item?.sources?.length > 0 && <Sources data={item.sources} />}
				</>
			</View>
		</ScrollView>
	);
}
