import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import ItemPreviewCard from "./item-preview-card";

import { supabase } from "@/config/supabase";

export default function ItemRow() {
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		getBottledWater();
	}, []);

	async function getBottledWater() {
		const { data, error } = await supabase.from("items").select().range(0, 10);

		if (error) {
			console.log("error", error);
		}

		console.log("data", data);

		setItems(data || []);
	}

	return (
		<ScrollView
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			style={{ paddingHorizontal: 10 }}
		>
			{items.map((item, index) => (
				<ItemPreviewCard item={item} />
			))}
		</ScrollView>
	);
}
