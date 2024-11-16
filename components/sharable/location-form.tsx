import Ionicons from "@expo/vector-icons/Ionicons";
import { getLocationDetails, updateLocationScore } from "actions/locations";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import BlurredLineItem from "./blurred-line-item";
import HorizontalContaminantCard from "./contamintant-card-hz";
import ItemImage from "./item-image";
import RecommendedFilterRow from "./recommended-filter-row";
import Score from "./score";

import { incrementItemsViewed } from "@/actions/user";
import Skeleton from "@/components/sharable/skeleton";
import UntestedRow from "@/components/sharable/untested-row";
import { Button } from "@/components/ui/button";
import { H2, Large } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	id: string;
};

export function LocationForm({ id }: Props) {
	const recommendedFilterRowRef = useRef<View>(null);

	const navigation = useNavigation();
	const { uid } = useUserProvider();
	const { iconColor } = useColorScheme();
	const scrollViewRef = useRef<ScrollView>(null);

	const [location, setLocation] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);

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
		if (!location.score || location.score > 45) {
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

	const lowestScoringUtility = useMemo(() => {
		return location?.utilities?.length > 0 ? location?.utilities[0] : null;
	}, [location?.utilities]);

	const handleRecommendedFilterPress = () => {
		if (recommendedFilterRowRef.current) {
			recommendedFilterRowRef.current.measure(
				(fx, fy, width, height, px, py) => {
					scrollViewRef.current?.scrollTo({
						y: py,
						animated: true,
					});
				},
			);
		}
	};

	const isTested = location?.is_indexed !== false;

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
			ref={scrollViewRef}
		>
			<View className="flex-col flex w-full px-4">
				<View className="pb pt-2 -6 px-2">
					<View className="flex flex-col items-center justify-center gap-6 w-full">
						<View className="flex justify-center items-center h-48 w-48">
							<ItemImage
								src={location.image}
								alt={location.name}
								thing={location}
								showFavorite={isTested}
							/>
						</View>

						<View className="flex flex-row w-full justify-between items-start gap-6">
							<View className="flex flex-col !w-3/5">
								<H2>{location.name}</H2>

								<BlurredLineItem
									label="Total contaminants"
									value={contaminants.length}
									score={contaminants.length > 0 ? "bad" : "good"}
									untested={!isTested}
								/>

								<BlurredLineItem
									label="Above guidelines"
									value={contaminantsAboveLimit.length}
									score={contaminantsAboveLimit.length > 0 ? "bad" : "good"}
									untested={!isTested}
								/>

								{isTested && (
									<Button
										variant="outline"
										onPress={handleRecommendedFilterPress}
										className="w-56 !h-10 !py-0 my-4"
										icon={
											<Ionicons name="arrow-down" size={16} color={iconColor} />
										}
										label="Recommended filter"
									/>
								)}
							</View>

							<View className="flex !w-2/5 justify-center items-center">
								<Score
									score={
										location.utilities?.length > 0
											? location?.utilities[0]?.score
											: 0
									}
									size="sm"
									showScore
									untested={!isTested}
								/>
							</View>
						</View>
					</View>

					{isTested ? (
						<View className="flex flex-col mt-2">
							<View className="flex flex-row items-center gap-2 mb-2">
								<Ionicons name="skull-outline" size={16} color={iconColor} />
								<Large className="mb-0 pb-0">Contaminants detected</Large>
							</View>

							<View className="flex flex-wrap gap-4 w-full pt-2">
								{lowestScoringUtility?.contaminants.map((contaminant: any) => (
									<HorizontalContaminantCard
										key={contaminant.id}
										data={contaminant}
									/>
								))}
							</View>
						</View>
					) : (
						<UntestedRow thing={location} />
					)}
				</View>

				{/* Recommended filter based on contaminants */}
				<View ref={recommendedFilterRowRef}>
					{location?.utilities?.[0]?.contaminants ? (
						<RecommendedFilterRow
							contaminants={location.utilities[0].contaminants || []}
						/>
					) : null}
				</View>
			</View>
		</ScrollView>
	);
}
