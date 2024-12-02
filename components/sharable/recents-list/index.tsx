import { FlatList, View } from "react-native";

import ItemPreviewCard from "../item-preview-card";

export const RecentsList = ({
	data,
	limitItems,
}: {
	data: any;
	limitItems?: number;
}) => {
	// Limit the data array if limitItems is provided
	const limitedData = Array.isArray(data)
		? limitItems
			? data.slice(0, limitItems)
			: data
		: [];

	return (
		<View className="flex-1">
			<FlatList
				data={limitedData}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					gap: 12,
					marginTop: 0,
				}}
				keyExtractor={(item, index) => item.id + item.toString() + index}
				renderItem={({ item, index }) => (
					<View className="mr-2 w-44 py-3 overflow-visible !h-36">
						<ItemPreviewCard
							item={item}
							isAuthUser={false}
							isGeneralListing
							imageHeight={60}
							variation="square"
							showTime={false}
							showContPreview
							titleLines={1}
							showShadow
						/>
					</View>
				)}
			/>
		</View>
	);
};
