import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Search from "@/components/sharable/search";
import { H1, Muted } from "@/components/ui/typography";

import ItemRow from "@/components/sharable/item-row";
import { getTenRandomItems } from "actions/items";

export default function TabOneScreen() {
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		getBottledWater();
	}, []);

	async function getBottledWater() {
		const data = await getTenRandomItems();

		setItems(data || []);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
			}}
		>
			<View className="flex flex-col items-center justify-center bg-background p-4 gap-y-4 h-screen">
				<H1 className="text-center max-w-xs">Find your healthiest water</H1>

				<Muted className="text-center mb-8 max-w-md">
					90% of water has microplastics, toxins and contaminants.
				</Muted>

				<View>
					<Search />
				</View>

				<View className="w-full mt-14">
					<ItemRow title="Bottled Water" items={items} />
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
