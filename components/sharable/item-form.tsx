"use client";

import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getItemDetails } from "actions/items";
import { BlurView } from "expo-blur";
import * as Linking from "expo-linking";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import BlurredLineItem from "./blurred-line-item";
import ContaminantCard from "./contamintant-card";
import IngredientsCard from "./ingredients-card";
import ItemImage from "./item-image";
import MetaDataCard from "./metadata-card";
import Score from "./score";
import Sources from "./sources";
import Typography from "./typography";
import UntestedRow from "./untested-row";

import { incrementItemsViewed } from "@/actions/user";
import { H3, Muted } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";
type Props = {
	id: string;
};

export function ItemForm({ id }: Props) {
	const navigation = useNavigation();
	const router = useRouter();
	const { uid, userData } = useUserProvider();
	const { hasActiveSub } = useSubscription();
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

	const sortedContaminants = contaminants.sort(
		(a: { exceedingLimit: number }, b: { exceedingLimit: number }) => {
			return b.exceedingLimit - a.exceedingLimit;
		},
	);

	const totalHealthRisks = contaminants.reduce(
		(acc: number, contaminant: any) => {
			const risks = contaminant.risks || "";
			const riskCount = risks
				.split(",")
				.filter((risk: string) => risk.trim() !== "").length;
			return acc + riskCount;
		},
		0,
	);

	const nanoPlasticsValue =
		item.packaging === "plastic"
			? "Yes"
			: item.packaging === "aluminum" ||
				  item.packaging === "aluminum (can)" ||
				  item.packaging === "cardboard"
				? "Some"
				: "Minimal";

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

	const blurredLineItems = [
		{
			label: "Contaminants",
			icon: (
				<MaterialCommunityIcons
					name="virus-outline"
					size={18}
					color={iconColor}
				/>
			),
			value: contaminants.length,
			score: contaminants.length > 0 ? "bad" : "good",
		},
		{
			label: "Above guidelines",
			icon: <Ionicons name="warning-outline" size={18} color={iconColor} />,
			value: contaminantsAboveLimit.length,
			score: contaminantsAboveLimit.length > 0 ? "bad" : "good",
		},
		{
			label: "Health risks",
			icon: <Ionicons name="bandage-outline" size={18} color={iconColor} />,
			value: totalHealthRisks,
			score: totalHealthRisks > 0 ? "bad" : "good",
		},
		{
			label: "PFAS",
			icon: <Ionicons name="flame-outline" size={18} color={iconColor} />,
			value: item.metadata?.pfas || "N/A",
			score: item.metadata?.pfas !== "No" ? "bad" : "good",
		},
		{
			label: "Microplastics",
			icon: (
				<MaterialCommunityIcons
					name="dots-hexagon"
					size={18}
					color={iconColor}
				/>
			),
			value: nanoPlasticsValue,
			score: nanoPlasticsValue === "Yes" ? "bad" : "good",
		},
		{
			label: "Packaging",
			icon: <Ionicons name="cube-outline" size={18} color={iconColor} />,
			value: item?.packaging
				? item.packaging.charAt(0).toUpperCase() + item.packaging.slice(1)
				: "Unknown",
			score: item.packaging === "glass" ? "good" : "bad",
		},
		{
			label: "Source",
			icon: <Ionicons name="water-outline" size={18} color={iconColor} />,
			value: waterSource ? waterSource : "Unknown",
			score:
				item.water_source === "spring" ||
				item.water_source === "aquifer" ||
				item.water_source === "mountain_spring"
					? "good"
					: "bad",
		},
	];

	const sortedBlurredLineItems = blurredLineItems.sort((a, b) => {
		return a.score === "bad" && b.score !== "bad" ? -1 : 1;
	});

	const nonContaminantIngredients = useMemo(
		() =>
			item?.ingredients
				?.filter((ingredient: any) => !ingredient.is_contaminant)
				.sort((a: any, b: any) => b.severity_score - a.severity_score),
		[item?.ingredients],
	);

	const isTested = item?.is_indexed;

	const itemDetails = {
		productId: String(item.id),
		productType: item.type,
	};

	// determine if this item is in the user's unlock history
	const isItemUnlocked = useMemo(() => {
		return userData?.unlock_history?.some((unlock: any) => {
			return (
				String(unlock.product_id) === String(id) &&
				String(unlock.product_type) === String(item.type)
			);
		});
	}, [userData, id, item.type]);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="w-full items-center justify-center px-8">
				<View className="flex flex-col gap-2 justify-center items-center w-full">
					<View className="flex justify-center items-center h-64 w-64 p-4">
						<ItemImage
							src={item.image}
							alt={item.name}
							thing={item}
							showFavorite={isTested}
						/>
					</View>

					<View className="flex flex-row gap-2 w-full">
						<View className="flex flex-col w-2/3">
							{item.affiliate_url ? (
								<TouchableOpacity
									onPress={() => {
										Linking.openURL(item.affiliate_url);
									}}
								>
									<H3 className="pb-1 items-start">
										{item.name}
										{` `}
										<Feather
											name="arrow-up-right"
											size={14}
											color={iconColor}
										/>
									</H3>
								</TouchableOpacity>
							) : (
								<H3 className="pb-1">{item.name}</H3>
							)}

							{/* @ts-ignore */}
							<Link href={`/search/brand/${item.brand?.id}`}>
								<Muted>{item.brand?.name}</Muted>
							</Link>
						</View>

						<View className="flex w-1/3 flex-col-reverse justify-end items-end -mt-2">
							<Score
								score={item.score}
								size="sm"
								untested={!isTested}
								itemDetails={itemDetails}
								showScore={isItemUnlocked}
							/>
						</View>
					</View>

					{!isTested && <UntestedRow thing={item} />}

					<View className="flex flex-col gap-10 gap-y-1 w-full">
						<View className="flex flex-col gap-y-1 w-full">
							{sortedBlurredLineItems.map((item, index) => (
								<BlurredLineItem
									key={index}
									label={item.label}
									icon={item.icon}
									value={item.value}
									isPaywalled={false}
									score={
										item.score === "bad" ||
										item.score === "good" ||
										item.score === "neutral"
											? item.score
											: undefined
									}
									untested={!isTested}
									itemDetails={itemDetails}
								/>
							))}
						</View>
					</View>
				</View>

				<>
					{sortedContaminants && sortedContaminants.length > 0 && (
						<View className="flex flex-col gap-4 mt-8 ">
							<View className="flex flex-row items-center gap-x-2">
								{/* <MaterialCommunityIcons
									name="virus-outline"
									size={18}
									color={iconColor}
								/> */}

								<Typography size="2xl" fontWeight="normal">
									Contaminant detected
								</Typography>
							</View>

							<View className="grid md:grid-cols-2 grid-cols-1 gap-6">
								{sortedContaminants.map((contaminant: any, index: number) => (
									<TouchableOpacity
										key={contaminant.id || index}
										disabled={hasActiveSub || isItemUnlocked}
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
									>
										<ContaminantCard
											key={contaminant.id || index}
											data={contaminant}
										/>

										{!hasActiveSub && !isItemUnlocked && (
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
								))}
							</View>
						</View>
					)}

					<>
						{nonContaminantIngredients &&
							nonContaminantIngredients.length > 0 && (
								<View className="flex flex-col gap-4 my-10">
									<View className="flex flex-row items-center gap-x-2">
										{/* <Ionicons
											name="heart-outline"
											size={20}
											color={iconColor}
										/> */}

										<Typography size="2xl" fontWeight="normal">
											Minerals found
										</Typography>
									</View>
									<IngredientsCard
										ingredients={item.ingredients}
										subscription={hasActiveSub || isItemUnlocked}
									/>
								</View>
							)}
					</>

					{item.type === "bottled_water" && (
						<View className="flex flex-col gap-4 w-full mt-6">
							<View className="flex flex-col w-full gap-4">
								<MetaDataCard
									title="Water Source"
									description={item.metadata?.source || "Not specified"}
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
