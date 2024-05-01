import { Link } from "expo-router";
import React from "react";

import { ScrollView, View } from "react-native";
import ItemPreviewCard from "./item-preview-card";
import Typography from "./typography";

type Props = {
	title: string;
	items: any[];
	type: "location" | "filter" | "item";
};

export default function ItemRow({ title, items, type }: Props) {
	const getSearchPath = (type: string) => {
		switch (type) {
			case "location":
				return `/search/tap-water`;
			case "filter":
				return `/search/filters`;
			case "item":
				return `/search/bottled-waters`;
			default:
				return `/search/bottled-waters`;
		}
	};

	return (
		<View className="flex flex-col gap-y-2">
			<View className="flex flex-row items-center justify-between">
				<Typography size="lg" fontWeight="bold" className="mb-4">
					{title}
				</Typography>
				{/* @ts-ignore */}
				<Link href={getSearchPath(type)}>
					<Typography size="sm" fontWeight="normal" className="mb-4 italic">
						See all
					</Typography>
				</Link>
			</View>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{items.map((item, index) => (
					<View key={item.id} className="mr-5">
						<ItemPreviewCard item={item} size="md" />
					</View>
				))}
			</ScrollView>
		</View>
	);
}
