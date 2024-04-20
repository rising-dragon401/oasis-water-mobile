import React from "react";
import { ScrollView, View } from "react-native";
import ItemPreviewCard from "./item-preview-card";
import Typography from "./typography";

type Props = {
	title: string;
	items: any[];
};

export default function ItemRow({ title, items }: Props) {
	return (
		<View className="flex flex-col gap-y-2">
			<Typography size="lg" fontWeight="bold" className="mb-4">
				{title}
			</Typography>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{items.map((item, index) => (
					<View
						style={{ marginRight: index === items.length - 1 ? 0 : 20 }}
						key={item.id}
					>
						<ItemPreviewCard item={item} />
					</View>
				))}
			</ScrollView>
		</View>
	);
}
