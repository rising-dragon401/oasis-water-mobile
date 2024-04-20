"use client";

import { getItemDetails } from "actions/items";
import { ScrollView, View } from "react-native";

import { Octicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Link } from "expo-router";
import BlurredLineItem from "./blurred-line-item";
import ItemImage from "./item-image";
import Score from "./score";
import Typography from "./typography";

import { useEffect, useState } from "react";
import ContaminantCard from "./contamintant-card";
import IngredientsCard from "./ingredients-card";
import MetaDataCard from "./metadata-card";
import PaywallContent from "./paywall-content";
import Sources from "./sources";

type Props = {
	id: string;
};

export function ItemForm({ id }: Props) {
	const [item, setItem] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);

	const fetchItem = async (id: string) => {
		const item = await getItemDetails(id);

		console.log("ItemForm -> item", item);

		if (item) {
			setItem(item);
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
			<View className="w-full items-center justify-center px-4">
				<View className="flex flex-col gap-6 justify-center w-full">
					<View className="flex justify-center w-full p-2">
						{item.affiliate_url ? (
							<Link
								href={item.affiliate_url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ItemImage src={item.image} alt={item.name} />
							</Link>
						) : (
							<ItemImage src={item.image} alt={item.name} />
						)}
					</View>

					<View className="flex flex-row gap-2 w-full">
						<View className="flex flex-col w-2/3">
							<Typography size="xl" fontWeight="normal">
								{item.name}
							</Typography>
							{/* @ts-ignore */}
							<Link href={`/search/company/${item.company?.name}`}>
								<Typography
									size="base"
									fontWeight="normal"
									className="text-secondary-foreground"
								>
									{item.company?.name}
								</Typography>
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
														window.open(item.affiliate_url, "_blank");
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
								) : (
									<View>
										<Typography
											size="base"
											fontWeight="normal"
											className="text-secondary"
										>
											⚠️ NO REPORTS LOCATED – PROCEED WITH CAUTION.
										</Typography>
										<View className="flex flex-col gap-6 mt-6">
											<Typography
												size="base"
												fontWeight="normal"
												className="text-secondary"
											>
												This item has not been tested or rated yet. This usally
												means the company has not publicized or refuses to share
												their lab reports so we cannot recommend or provide a
												score for this item.
											</Typography>
										</View>
									</View>
								)}
							</View>
						</View>

						<View className="flex w-1/3 flex-col-reverse justify-end items-end">
							{item.is_indexed !== false && (
								<Score score={item.score} size="lg" />
							)}
						</View>
					</View>
				</View>

				{item.is_indexed !== false && (
					<>
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
										{sortedContaminants.map(
											(contaminant: any, index: number) => (
												<ContaminantCard
													key={contaminant.id || index}
													data={contaminant}
												/>
											),
										)}
									</View>
								</View>
							)}

							<View className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6">
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
					</>
				)}
			</View>
		</ScrollView>
	);
}
