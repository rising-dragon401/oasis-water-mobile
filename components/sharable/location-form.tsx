import { getLocationDetails, updateLocationScore } from "actions/locations";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "components/ui/accordion";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import BlurredLineItem from "./blurred-line-item";
import HorizontalContaminantCard from "./contamintant-card-hz";
import ItemImage from "./item-image";
import RecommendedFilterRow from "./recommended-filter-row";
import Score from "./score";
import Sources from "./sources";
import Typography from "./typography";

import { incrementItemsViewed } from "@/actions/user";
import Skeleton from "@/components/sharable/skeleton";
import { H2, Large, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";

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

		// manually update score if not already set
		if (!location.score) {
			const score =
				location.utilities?.length > 0 ? location.utilities[0].score : null;

			if (score) updateLocationScore(id, score);
		}

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

	if (isLoading)
		return (
			<View className="flex-1 px-4 py-4">
				<View className="pb pt-2 -6 px-2">
					<View className="flex flex-col items-center gap-6 w-full">
						<View className="flex justify-center items-center h-48 w-48">
							<Skeleton height={192} width={192} />
						</View>

						<View className="flex flex-row w-full justify-between gap-6">
							<View className="flex flex-col !w-3/5 gap-2">
								<Skeleton height={36} width="100%" />
								<Skeleton height={24} width="100%" />
								<Skeleton height={24} width="100%" />
							</View>

							<View className="flex !w-2/5 justify-center items-center">
								<Skeleton
									height={72}
									width={72}
									style={{ borderRadius: 100 }}
								/>
							</View>
						</View>

						<View className="flex flex-col w-full gap-4">
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
							<Skeleton height={64} width="100%" />
						</View>
					</View>
				</View>
			</View>
		);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="flex-col flex w-full px-4">
				<View className="pb pt-2 -6 px-2">
					<View className="flex flex-col items-center gap-6 w-full">
						<View className="flex justify-center items-center h-48 w-48">
							<ItemImage
								src={location.image}
								alt={location.name}
								thing={location}
							/>
						</View>

						<View className="flex flex-row w-full justify-between gap-6">
							<View className="flex flex-col !w-3/5">
								<H2>{location.name}</H2>

								<BlurredLineItem
									label="Contaminants"
									value={contaminants.length}
									score={contaminants.length > 2 ? "bad" : "good"}
								/>

								<BlurredLineItem
									label="Above guidelines"
									value={contaminantsAboveLimit.length}
									score={contaminantsAboveLimit.length > 1 ? "bad" : "good"}
								/>
							</View>

							<View className="flex !w-2/5 justify-center items-center">
								<Score
									score={
										location.utilities?.length > 0
											? location?.utilities[0]?.score
											: 0
									}
									size="md"
									showScore
								/>
							</View>
						</View>
					</View>

					{location?.utilities && (
						<View className="flex flex-col mt-4">
							<Large className="mb-0 pb-0">Contaminants found</Large>
							<Accordion
								type="single"
								collapsible
								defaultValue={openUtility}
								className="mt-0 pt-0"
							>
								{location.utilities.map((utility: any, index: number) => (
									<AccordionItem key={index} value={index.toString()}>
										<AccordionTrigger className="w-full flex flex-row justify-start pb-0 mt-0 py-0">
											<View className="w-full">
												<P className="text-left">{utility.name} utility</P>
											</View>
										</AccordionTrigger>
										<AccordionContent>
											<View className="flex flex-wrap gap-4 w-full pt-2">
												{utility.contaminants.map((contaminant: any) => (
													<HorizontalContaminantCard
														key={contaminant.id}
														data={contaminant}
													/>
												))}
											</View>
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
