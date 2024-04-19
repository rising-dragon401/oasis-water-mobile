"use client";

import { getItemDetails } from "actions/items";

import { Octicons } from "@expo/vector-icons";
import ContaminantCard from "./contamintant-card";

import Sources from "./sources";

import { Button } from "@/components/ui/button";
import { Link } from "expo-router";
import BlurredLineItem from "./blurred-line-item";
import ItemImage from "./item-image";
import PaywallContent from "./paywall-content";
import Score from "./score";
import Typography from "./typography";

import { useEffect, useState } from "react";

import IngredientsCard from "./ingredients-card";
import MetaDataCard from "./metadata-card";

type Props = {
	id: string;
};

export default function ItemForm({ id }: Props) {
	const [item, setItem] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);

	const fetchItem = async (id: string) => {
		console.log("get item details");
		const item = await getItemDetails(id);

		if (item) {
			setItem(item);
		}

		setIsLoading(false);
		return item;
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
		<div className="flex-col flex w-full">
			<div className="md:py-10 pt-2 pb-6 md:px-0 px-4">
				<div className="flex md:flex-row flex-col gap-6">
					<div className="flex justify-center w-full md:w-1/2">
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
					</div>

					<div className="flex flex-row gap-2 w-full">
						<div className="flex flex-col md:gap-2 md:w-3/5">
							<Typography size="3xl" fontWeight="normal">
								{item.name}
							</Typography>
							{/* @ts-ignore */}
							<Link href={`/search/company/${item.company?.name}`}>
								{" "}
								<Typography
									size="base"
									fontWeight="normal"
									className="text-secondary-foreground"
								>
									{item.company?.name}
								</Typography>
							</Link>

							<>
								{item.is_indexed !== false ? (
									<div className="flex flex-col">
										<BlurredLineItem
											label="Contaminants found"
											value={contaminants.length}
											labelClassName="text-red-500"
										/>

										<BlurredLineItem
											label="Toxins above health guidelines"
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

										<div className="flex flex-col md:w-40 w-full md:mt-6 mt-2 gap-2">
											{item.affiliate_url && (
												<Button
													variant={item.score > 70 ? "outline" : "outline"}
													onPress={() => {
														window.open(item.affiliate_url, "_blank");
													}}
												>
													Buy Now
													<Octicons
														name="arrow-right"
														size={24}
														color="black"
													/>
												</Button>
											)}
										</div>
									</div>
								) : (
									<>
										<Typography
											size="base"
											fontWeight="normal"
											className="text-secondary"
										>
											⚠️ NO REPORTS LOCATED – PROCEED WITH CAUTION.
										</Typography>
										<div className="flex flex-col gap-6 mt-6">
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
										</div>
									</>
								)}
							</>
						</div>

						<div className="flex md:flex-row md:justify-start md:gap-10 md:items-start flex-col-reverse justify-end items-end">
							{item.is_indexed !== false && (
								<Score score={item.score} size="lg" />
							)}
						</div>
					</div>
				</div>

				{item.is_indexed !== false && (
					<PaywallContent className="mt-6" label="Unlock All Data & Reports">
						{sortedContaminants && sortedContaminants.length > 0 && (
							<div className="flex flex-col gap-6 mt-6">
								<Typography size="2xl" fontWeight="normal">
									Contaminants ☠️
								</Typography>
								<div className="grid md:grid-cols-2 grid-cols-1 gap-6">
									{sortedContaminants.map((contaminant: any, index: number) => (
										<ContaminantCard
											key={contaminant.id || index}
											data={contaminant}
										/>
									))}
								</div>
							</div>
						)}

						<div className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6">
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
						</div>

						<>
							{item?.ingredients?.length > 0 && (
								<div className="flex flex-col gap-6 my-10">
									<Typography size="2xl" fontWeight="normal">
										Other Ingredients
									</Typography>

									<IngredientsCard ingredients={item.ingredients} />
								</div>
							)}
						</>

						{item && item?.sources?.length > 0 && (
							<Sources data={item.sources} />
						)}
					</PaywallContent>
				)}
			</div>
		</div>
	);
}
