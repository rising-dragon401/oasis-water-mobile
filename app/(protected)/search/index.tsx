import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Search from "@/components/sharable/search";
import { H1, Muted } from "@/components/ui/typography";

import ItemRow from "@/components/sharable/item-row";
import { getTenRandomItems } from "actions/items";
import { getFeaturedLocations } from "actions/locations";

export default function TabOneScreen() {
	const [items, setItems] = useState<any[]>([]);
	const [tapWater, setTapWater] = useState<any[]>([]);

	useEffect(() => {
		getBottledWater();
		getTapWater();
	}, []);

	async function getBottledWater() {
		const data = await getTenRandomItems();

		setItems(data || []);
	}

	async function getTapWater() {
		const data = await getFeaturedLocations();

		console.log("getTapWater data", data);

		setTapWater(data || []);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
				paddingVertical: 20,
			}}
		>
			<View className="flex flex-col items-center justify-center bg-background p-4 mt-14 h-screen">
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

				{/* <Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted> */}
				{/* <Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => {
					router.push("/modal");
				}}
			>
				<Text>Open Modal</Text>
			</Button> */}
			</View>
		</ScrollView>
	);
}
