import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Search from "@/components/sharable/search";
import { H1, Muted } from "@/components/ui/typography";

import ItemRow from "@/components/sharable/item-row";
import { getRandomFilters } from "actions/filters";
import { getRandomItems } from "actions/items";
import { getRandomLocations } from "actions/locations";

export default function TabOneScreen() {
	const [items, setItems] = useState<any[]>([]);
	const [tapWater, setTapWater] = useState<any[]>([]);
	const [filters, setFilters] = useState<any[]>([]);

	useEffect(() => {
		getBottledWater();
		getTapWater();
		getFilters();
	}, []);

	async function getBottledWater() {
		const data = await getRandomItems();

		setItems(data || []);
	}

	async function getTapWater() {
		const data = await getRandomLocations();

		setTapWater(data || []);
	}

	async function getFilters() {
		const data = await getRandomFilters();

		setFilters(data || []);
	}

	return (
		<View className="flex flex-col h-full items-center justify-center p-4 mt-24 ">
			<H1 className="text-center max-w-xs">Find your healthiest water</H1>

			<Muted className="text-center mb-8 max-w-md mt-2">
				90% of water has microplastics, toxins and contaminants.
			</Muted>

			<View className="mt-2 mb-10 w-[90%] z-40">
				<Search />
			</View>

			<ScrollView
				contentContainerStyle={{
					paddingBottom: 120,
					paddingVertical: 0,
					paddingHorizontal: 10,
					zIndex: 0,
				}}
				nestedScrollEnabled
				showsVerticalScrollIndicator={false}
			>
				<View className="w-full mt-6">
					<ItemRow title="Bottled Water" items={items} type="item" />
				</View>

				<View className="w-full mt-10">
					<ItemRow title="Tap Water" items={tapWater} type="location" />
				</View>

				<View className="w-full mt-10">
					<ItemRow title="Filters" items={filters} type="filter" />
				</View>
			</ScrollView>
		</View>
	);
}
