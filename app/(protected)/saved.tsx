import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import { FlatList, TouchableOpacity, View } from "react-native";

import LocationCard from "@/components/cards/location-card";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import SectionHeader from "@/components/sharable/section-header";
import StickyHeader from "@/components/sharable/sticky-header";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function SavedScreen() {
	const { iconColor } = useColorScheme();
	const { userFavorites, tapScore } = useUserProvider();
	const router = useRouter();

	return (
		<View className="flex-1 px-8">
			<FlatList
				data={userFavorites}
				renderItem={({ item }) => (
					<View key={item?.id} style={{ width: "100%" }} className="mb-2">
						<ItemPreviewCard
							item={item}
							showFavorite
							isAuthUser
							isGeneralListing
							variation="row"
							imageHeight={80}
						/>
					</View>
				)}
				keyExtractor={(item) => item.id}
				numColumns={1}
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: 44,
					paddingTop: 0,
					gap: 2,
				}}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={
					<View className="flex justify-between w-full">
						<StickyHeader title="Saved" />
						<View style={{ height: 16 }} />
						<SectionHeader
							title="Tap water"
							subtitle="Nearest tested tap water sample to your location"
							iconButton={
								<TouchableOpacity onPress={() => router.push("/locationModal")}>
									<Ionicons name="refresh" size={18} color={iconColor} />
								</TouchableOpacity>
							}
						/>
						<View className="flex h-32 w-full">
							<Link
								href={
									tapScore && tapScore.id
										? `/search/location/${tapScore?.id}?backPath=saved`
										: "/locationModal"
								}
							>
								<LocationCard location={tapScore || {}} size="lg" />
							</Link>
						</View>
						<View style={{ height: 28 }} />
						<SectionHeader
							title="Products"
							subtitle={
								!userFavorites || userFavorites.length === 0
									? "No saved products yet"
									: ""
							}
						/>
					</View>
				}
				ListFooterComponent={<View style={{ height: 1 }} />}
				initialNumToRender={8}
				maxToRenderPerBatch={4}
				windowSize={5}
				removeClippedSubviews
				scrollToOverflowEnabled={false}
			/>
		</View>
	);
}
