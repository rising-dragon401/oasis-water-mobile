import { FlatList, View } from "react-native";

import ItemPreviewCard from "@/components/sharable/item-preview-card";
import StickyHeader from "@/components/sharable/sticky-header";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function SavedScreen() {
	const { backgroundColor } = useColorScheme();
	const { userFavorites } = useUserProvider();

	return (
		<View className="flex-1 justify-between px-8" style={{ backgroundColor }}>
			<StickyHeader title="Saved" />

			<View style={{ height: 16 }} />
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
				contentContainerStyle={{ paddingTop: 0, paddingBottom: 0, gap: 2 }}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={null}
				ListHeaderComponent={<View style={{ height: 1 }} />}
				initialNumToRender={8}
				maxToRenderPerBatch={4}
				windowSize={5}
				removeClippedSubviews
				scrollToOverflowEnabled={false}
			/>
		</View>
	);
}
