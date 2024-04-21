import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Search from "@/components/sharable/search";
import { H1, Muted } from "@/components/ui/typography";

import ItemRow from "@/components/sharable/item-row";
import { getSevenRandomFilters } from "actions/filters";
import { getTenRandomItems } from "actions/items";
import { getFeaturedLocations } from "actions/locations";

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
		const data = await getTenRandomItems();

		setItems(data || []);
	}

	async function getTapWater() {
		const data = await getFeaturedLocations();

		setTapWater(data || []);
	}

	async function getFilters() {
		const data = await getSevenRandomFilters();

		setFilters(data || []);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
				paddingVertical: 20,
			}}
		>
			<View className="flex flex-col items-center justify-center bg-background p-4 mt-24 ">
				<H1 className="text-center max-w-xs">Find your healthiest water</H1>

				<Muted className="text-center mb-8 max-w-md">
					90% of water has microplastics, toxins and contaminants.
				</Muted>

				<View className="mt-2">
					<Search />
				</View>

				<View className="w-full mt-14">
					<ItemRow title="Bottled Water" items={items} />
				</View>

				<View className="w-full mt-10">
					<ItemRow title="Tap Water" items={tapWater} />
				</View>

				<View className="w-full mt-10">
					<ItemRow title="Filters" items={filters} />
				</View>
			</View>
		</ScrollView>
	);
}
