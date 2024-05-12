"use client";

import { getItemDetails } from "actions/items";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { Octicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { H2, H4 } from "@/components/ui/typography";
import { Link, useNavigation } from "expo-router";
import BlurredLineItem from "./blurred-line-item";
import ItemImage from "./item-image";
import Score from "./score";
import Typography from "./typography";

import { incrementItemsViewed } from "@/actions/user";
import { useUserProvider } from "@/context/user-provider";
import ContaminantCard from "./contamintant-card";
import IngredientsCard from "./ingredients-card";
import MetaDataCard from "./metadata-card";
import PaywallContent from "./paywall-content";
import Sources from "./sources";

type Props = {
	id: string;
};

export function ItemForm({ id }: Props) {
	const navigation = useNavigation();
	const { uid } = useUserProvider();

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

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="w-full items-center justify-center px-8">
				<View className="flex flex-col gap-6 justify-center items-center w-full">
					<View className="flex justify-center items-center h-80 w-80 p-4">
						<ItemImage src={item.image} alt={item.name} thing={item} />
					</View>

					<View className="flex flex-row gap-2 w-full">
						<View className="flex flex-col w-2/3">
							<H2>{item.name}</H2>

							{/* @ts-ignore */}
							<Link href={`/search/company/${item.company?.name}`}>
								<H4>{item.company?.name}</H4>
							</Link>

							<View>
								{item.is_indexed !== false ? (
									<View className="flex flex-col">
										<BlurredLineItem
											label="Contaminants found"
											value={contaminants.length}
											labelClassName="text-red-500"
										/>

										<BlurredLineItem
											label="Toxins above guidelines"
											value={contaminantsAboveLimit.length}
											labelClassName="text-red-500"
										/>

										<BlurredLineItem
											label="Microplastics"
											value={nanoPlasticsValue}
										/>

										<BlurredLineItem label="Fluoride" value={fluorideValue} />

										<BlurredLineItem
											label="pH"
											value={item.metadata?.ph_level}
										/>

										<BlurredLineItem
											label="TDS"
											value={item.metadata?.tds ?? "Unknown"}
										/>

										<BlurredLineItem
											label="PFAS"
											value={item.metadata?.pfas || "Unknown"}
										/>

										<View className="flex flex-col md:w-40 w-full md:mt-6 mt-2 gap-2">
											{item.affiliate_url && (
												<Button
													variant={item.score > 70 ? "outline" : "outline"}
													onPress={() => {
														Linking.openURL(item.affiliate_url);
													}}
													label="Buy Now"
													icon={
														<Octicons
															name="arrow-right"
															size={12}
															color="black"
														/>
													}
													iconPosition="right"
												/>
											)}
										</View>
									</View>
								) : null}
							</View>
						</View>

						<View className="flex w-1/3 flex-col-reverse justify-end items-end">
							<Score score={item.is_indexed ? item.score : 0} size="md" />
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
							⚠️ NO REPORTS LOCATED – PROCEED WITH CAUTION.
						</Typography>
						<View className="flex flex-col gap-6 mt-6">
							<Typography
								size="base"
								fontWeight="normal"
								className="text-primary"
							>
								This item has not been tested or rated yet. This usally means
								the company has not publicized or refuses to share their lab
								reports so we cannot recommend or provide a score for this item.
							</Typography>
						</View>
					</View>
				)}

				{item.is_indexed !== false && (
					<PaywallContent
						className="mt-6"
						title="Full data & reports"
						label="See what's in this water"
						items={[
							"Contaminants ☠️",
							"Source and Treatment Process 💧",
							"Other ingredients & minerals 🌿",
							"Lab reports and data 🔬",
						]}
					>
						{sortedContaminants && sortedContaminants.length > 0 && (
							<View className="flex flex-col gap-6 mt-6">
								<Typography size="2xl" fontWeight="normal">
									Contaminants ☠️
								</Typography>
								<View className="grid md:grid-cols-2 grid-cols-1 gap-6">
									{sortedContaminants.map((contaminant: any, index: number) => (
										<ContaminantCard
											key={contaminant.id || index}
											data={contaminant}
										/>
									))}
								</View>
							</View>
						)}

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

						<>
							{item?.ingredients?.length > 0 && (
								<View className="flex flex-col gap-6 my-10">
									<Typography size="2xl" fontWeight="normal">
										Other Ingredients
									</Typography>
									<IngredientsCard ingredients={item.ingredients} />
								</View>
							)}
						</>

						{item && item?.sources?.length > 0 && (
							<Sources data={item.sources} />
						)}
					</PaywallContent>
				)}
			</View>
		</ScrollView>
	);
}
