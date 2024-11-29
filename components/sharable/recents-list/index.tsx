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
		<View>
			<View className="flex flex-col w-full gap-y-4">
				<FlatList
					data={limitedData}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item, index) => item.id + item.toString()}
					renderItem={({ item, index }) => (
						<View className="mr-4 w-40">
							<ItemPreviewCard
								item={item}
								isAuthUser={false}
								isGeneralListing
								imageHeight={50}
								variation="square"
								showTime={false}
								showContPreview
							/>
						</View>
					)}
				/>
			</View>
		</View>
	);
};
