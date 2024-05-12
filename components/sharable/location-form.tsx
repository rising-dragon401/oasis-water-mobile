"use client";

import { getLocationDetails } from "actions/locations";

import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { incrementItemsViewed } from "@/actions/user";
import { useUserProvider } from "@/context/user-provider";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "components/ui/accordion";
import BlurredLineItem from "./blurred-line-item";
import ContaminantCard from "./contamintant-card";
import ItemImage from "./item-image";
import PaywallContent from "./paywall-content";
import RecommendedFilterRow from "./recommended-filter-row";
import Score from "./score";
import Sources from "./sources";
import Typography from "./typography";

type Props = {
	id: string;
};

export function LocationForm({ id }: Props) {
	const navigation = useNavigation();
	const { uid } = useUserProvider();

	const [location, setLocation] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);
	const [openUtility, setOpenUtility] = useState<string>("0");

	useEffect(() => {
		incrementItemsViewed(uid);
	}, [uid]);

	const fetchLocation = async (id: string) => {
		const location = await getLocationDetails(id);
		if (!location) return;

		setLocation(location);

		navigation.setOptions({
			title: location.name,
		});

		setIsLoading(false);

		return location;
	};

	useEffect(() => {
		fetchLocation(id);
	}, [id]);

	const contaminants =
		location?.utilities?.length > 0
			? location?.utilities[0]?.contaminants || []
			: [];
	const contaminantsAboveLimit = contaminants.filter(
		(contaminant: any) => contaminant.exceedingLimit > 0,
	);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="flex-col flex w-full px-8">
				<View className="md:py-10 py-6 px-2">
					<View className="flex flex-col items-center gap-6 w-full">
						<View className="flex justify-center items-center h-80 w-80 p-4">
							<ItemImage
								src={location.image}
								alt={location.name}
								thing={location}
							/>
						</View>

						<View className="flex flex-row w-full justify-between">
							<View className="flex flex-col w-2/3">
								<Typography size="3xl" fontWeight="normal" className="w-2/3">
									{location.name} Tap Water
								</Typography>

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
							</View>

							<View className="flex w-1/3">
								<Score
									score={
										location.utilities?.length > 0
											? location?.utilities[0]?.score
											: 0
									}
									size="md"
								/>
							</View>
						</View>
					</View>

					{location?.utilities && (
						<View className="flex flex-col mt-4">
							<Typography size="2xl" fontWeight="normal">
								Water Utilities
							</Typography>
							<Accordion type="single" collapsible defaultValue={openUtility}>
								{location.utilities.map((utility: any, index: number) => (
									<AccordionItem key={index} value={index.toString()}>
										<AccordionTrigger className="w-full flex flex-row justify-start">
											<View className="w-full">
												<Typography
													size="base"
													fontWeight="normal"
													className="text-left"
												>
													{utility.name}
												</Typography>
											</View>
										</AccordionTrigger>
										<AccordionContent>
											<PaywallContent
												className="mt-8"
												label="View contaminants"
											>
												<View className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full">
													{utility.contaminants.map((contaminant: any) => (
														<ContaminantCard
															key={contaminant.id}
															data={contaminant}
														/>
													))}
												</View>
											</PaywallContent>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</View>
					)}

					{location?.sources && (
						<View className="flex flex-col gap-6 my-10">
							<Typography size="2xl" fontWeight="normal">
								Sources
							</Typography>
							{location && location?.sources?.length > 0 && (
								<Sources data={location.sources} />
							)}
						</View>
					)}
				</View>

				{/* Recommended filter based on contaminants */}
				{location?.utilities?.[0]?.contaminants ? (
					<RecommendedFilterRow
						contaminants={location.utilities[0].contaminants || []}
					/>
				) : null}
			</View>
		</ScrollView>
	);
}
