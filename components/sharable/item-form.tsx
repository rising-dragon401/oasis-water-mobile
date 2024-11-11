"use client";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getItemDetails } from "actions/items";
import * as Linking from "expo-linking";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import BlurredLineItem from "./blurred-line-item";
import ContaminantCard from "./contamintant-card";
import IngredientsCard from "./ingredients-card";
import ItemImage from "./item-image";
import MetaDataCard from "./metadata-card";
import PaywallContent from "./paywall-content";
import Score from "./score";
import Sources from "./sources";
import Typography from "./typography";

import { incrementItemsViewed } from "@/actions/user";
import { H3, Muted } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { FEATURES } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

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

	console.log("item: ", JSON.stringify(item, null, 2));

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
				: "Minimal";

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
					<View className="flex justify-center items-center h-64 w-64 p-4">
						<ItemImage src={item.image} alt={item.name} thing={item} />
					</View>

					<View className="flex flex-row gap-2 w-full">
						<View className="flex flex-col w-2/3">
							{item.affiliate_url ? (
								<TouchableOpacity
									onPress={() => {
										Linking.openURL(item.affiliate_url);
									}}
								>
									<H3 className="pb-1">{item.name}</H3>
								</TouchableOpacity>
							) : (
								<H3 className="pb-1">{item.name}</H3>
							)}

							{/* @ts-ignore */}
							<Link href={`/search/company/${item.company?.id}`}>
								<Muted>{item.company?.name}</Muted>
							</Link>
							{/* <Link href={`/search/company/${item.company?.id}`}>
								<Muted>{item.brand?.name}</Muted>
							</Link> */}
						</View>

						<View className="flex w-1/3 flex-col-reverse justify-end items-end -mt-2">
							<Score score={item.score} size="sm" />
						</View>
					</View>

					<View className="flex flex-col gap-10 gap-y-1 w-full">
						<View className="flex flex-col gap-y-1 w-full">
							<BlurredLineItem
								label="Contaminants"
								icon={
									<MaterialCommunityIcons
										name="virus-outline"
										size={18}
										color={iconColor}
									/>
								}
								value={contaminants.length}
								isPaywalled={false}
								score="bad"
							/>
							<BlurredLineItem
								icon={
									<Ionicons
										name="warning-outline"
										size={18}
										color={iconColor}
									/>
								}
								label="Above guidelines"
								value={contaminantsAboveLimit.length}
								isPaywalled={false}
								score="bad"
							/>
							<BlurredLineItem
								label="PFAS"
								icon={
									<Ionicons name="flame-outline" size={18} color={iconColor} />
								}
								value={item.metadata?.pfas || "N/A"}
								isPaywalled={false}
								score="bad"
							/>

							<BlurredLineItem
								label="Microplastics"
								icon={
									<MaterialCommunityIcons
										name="dots-hexagon"
										size={18}
										color={iconColor}
									/>
								}
								value={nanoPlasticsValue}
								isPaywalled={false}
								score={nanoPlasticsValue === "Yes" ? "bad" : "good"}
							/>

							<BlurredLineItem
								label="Packaging"
								icon={
									<Ionicons name="cube-outline" size={18} color={iconColor} />
								}
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
								icon={
									<Ionicons name="water-outline" size={18} color={iconColor} />
								}
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
								This item was found to not have complete lab reports. Proceed
								with caution as there may be unexpected contaminants inside.
							</Typography>
						</View>
					</View>
				)}

				<>
					{sortedContaminants && sortedContaminants.length > 0 && (
						<View className="flex flex-col gap-4 mt-6">
							<Typography size="2xl" fontWeight="normal">
								Contaminants ☠️
							</Typography>
							<PaywallContent
								label="See the contaminants in this water"
								items={FEATURES.map((item) => item.label)}
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

					<>
						{item?.ingredients?.length > 0 && (
							<View className="flex flex-col gap-4 my-10">
								<Typography size="2xl" fontWeight="normal">
									Minerals
								</Typography>
								<PaywallContent label="View mineral and ingredients breakdowns">
									<IngredientsCard ingredients={item.ingredients} />
								</PaywallContent>
							</View>
						)}
					</>

					{item.type === "bottled_water" && (
						<View className="flex flex-col gap-4">
							<View className="flex flex-row w-full gap-4">
								<MetaDataCard
									title="Water Source"
									description={item.metadata?.source}
									className="flex-1"
								/>
								<MetaDataCard
									title="Filtration Method"
									description={
										Array.isArray(item.filtration_methods) &&
										item.filtration_methods.length > 0
											? item.filtration_methods.join(", ") +
												". " +
												(item.metadata?.treatment_process || "Not specified")
											: item.metadata?.treatment_process || "Not specified"
									}
									className="flex-1"
								/>
							</View>
							<View className="flex flex-row gap-4">
								<MetaDataCard
									title="pH"
									description={item.metadata?.ph_level || "Unknown"}
									className="flex-1"
								/>
								<MetaDataCard
									title="TDS"
									description={item.metadata?.tds || "Unknown"}
									className="flex-1"
								/>
							</View>
						</View>
					)}

					{item && item?.sources?.length > 0 && <Sources data={item.sources} />}
				</>
			</View>
		</ScrollView>
	);
}
