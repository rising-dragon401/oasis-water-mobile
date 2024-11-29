import Ionicons from "@expo/vector-icons/Ionicons";
import { getRecommendedFilter } from "actions/filters";
import { H3, Muted } from "components/ui/typography";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import ItemPreviewCard from "./item-preview-card";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/subscription-provider";
import { RANDOM_BLUR_IMAGES } from "@/lib/constants/images";

type RecommendedFilterRowProps = {
	contaminants: any[];
	locationId: string;
};

// recommended filter based on contaminants
export default function RecommendedFilterRow({
	contaminants,
	locationId,
}: RecommendedFilterRowProps) {
	const { hasActiveSub } = useSubscription();
	const router = useRouter();
	const [recommended, setRecommended] = useState<any>([]);

	const fetchRecommendedFilter = async () => {
		if (!hasActiveSub) return;
		const recommendedFilters = await getRecommendedFilter(contaminants);

		setRecommended(recommendedFilters);
	};

	useEffect(() => {
		fetchRecommendedFilter();
	}, [hasActiveSub]);

	const randomBlurs = useMemo(() => {
		return Array.from(
			{ length: 5 },
			() =>
				RANDOM_BLUR_IMAGES[
					Math.floor(Math.random() * RANDOM_BLUR_IMAGES.length)
				],
		);
	}, []);

	return (
		<View className="mb-10 mt-6 ml-2">
			<View className="flex flex-row justify-between items-center mb-2">
				<H3>Recommended filters for this area</H3>

				{hasActiveSub && (
					<Link href="/(protected)/search/top">
						<Muted className="text-center m-0 p-0">see all</Muted>
					</Link>
				)}
			</View>

			{!hasActiveSub ? (
				<View className="mb-2">
					<Button
						label="Unlock filters"
						className="mb-2 w-56"
						icon={<Ionicons name="lock-closed" size={16} color="white" />}
						onPress={() => {
							router.push({
								pathname: "/subscribeModal",
								params: {
									path: "search/tap-water",
									feature: "recommended-filters",
									productType: "tap_water",
									productId: locationId,
								},
							});
						}}
					/>
					<FlatList
						data={Array(5).fill(null)} // Assuming 5 placeholders
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 2,
							height: "100%",
						}}
						className="overflow-x-scroll w-full"
						renderItem={({ item, index }) => (
							<TouchableOpacity
								className="mr-4  w-44 h-44 "
								onPress={() => {
									router.push("/subscribeModal");
								}}
							>
								<Image
									source={randomBlurs[index]}
									style={{
										borderRadius: 14,
										width: "100%",
										height: "100%",
									}}
									contentFit="contain"
									transition={1000}
								/>
							</TouchableOpacity>
						)}
						keyExtractor={(_, index) => index.toString()}
					/>
				</View>
			) : (
				<FlatList
					data={recommended}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 8,
						height: "100%",
					}}
					className="overflow-x-scroll flex"
					renderItem={({ item }: { item: any }) => (
						<View className="mr-4 flex-1 max-w-44 h-full">
							<ItemPreviewCard
								item={item}
								isAuthUser={false}
								isGeneralListing={false}
								variation="square"
							/>
						</View>
					)}
					keyExtractor={(item: any) => item.id}
				/>
			)}
		</View>
	);
}
