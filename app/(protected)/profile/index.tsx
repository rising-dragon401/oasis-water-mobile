import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";

import LocationCard from "@/components/cards/location-card";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import ProfileScores from "@/components/sharable/profile-scores";
import SectionHeader from "@/components/sharable/section-header";
import { Button } from "@/components/ui/button";
import { Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function SavedScreen() {
	const { iconColor, backgroundColor } = useColorScheme();
	const { userFavorites, tapScore, userScores, refreshUserData } =
		useUserProvider();
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);

	const userHasFavorites = userFavorites && userFavorites.length > 0;

	const onRefresh = async () => {
		setRefreshing(true);
		await refreshUserData("all");
		await refreshUserData("scores");
		setRefreshing(false);
	};

	return (
		<ScrollView
			style={{ backgroundColor }}
			contentContainerStyle={{
				paddingBottom: 100,
				paddingHorizontal: 28,
				paddingTop: 20,
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<View className="flex flex-col gap-4">
				<View className="flex justify-between w-full">
					<SectionHeader title="Your latest water analysis" />
					<View className="flex">
						{userScores && userScores?.allContaminants?.length > 0 ? (
							<ProfileScores userScores={userScores} />
						) : (
							<View className="h-8 w-full">
								<Muted>
									Your scores will appear here once you've added some items
								</Muted>
							</View>
						)}
					</View>
				</View>

				{/* Render Tap water section separately */}
				<View className="flex justify-between w-full mt-4">
					<SectionHeader title="Your tap water" />
					<View className="h-28 w-full">
						<TouchableOpacity
							onPress={() =>
								router.push(
									tapScore && tapScore.id
										? `/search/location/${tapScore?.id}?backPath=saved`
										: "/locationModal",
								)
							}
							className="flex"
						>
							<LocationCard location={tapScore || {}} size="md" />
						</TouchableOpacity>
					</View>
				</View>

				{/* FlatList for Products */}
				<View className="flex flex-col w-full mt-4">
					<SectionHeader title="Saved" />
					{userHasFavorites ? (
						<View className="flex flex-row flex-wrap gap-4">
							{userFavorites.map((item) => (
								<View key={item?.id} style={{ width: "48%" }} className="mb-2">
									<ItemPreviewCard
										item={item}
										isAuthUser
										isGeneralListing
										variation="square"
										imageHeight={80}
										showShadow
									/>
								</View>
							))}
						</View>
					) : (
						<View className="flex flex-col gap-y-2">
							<P className="text-muted-foreground">
								Save your favorites here to track their health scores
							</P>
							<Button
								label="Add some"
								variant="outline"
								icon={<Ionicons name="search" size={18} color={iconColor} />}
								onPress={() => router.push("/(protected)/search")}
							/>
						</View>
					)}
				</View>
			</View>
		</ScrollView>
	);
}
