import { getItems } from "@/actions/items";
import { useNavigation } from "expo-router";

import RankingList from "@/components/sharable/ranking-list";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

export default function Page() {
	const navigation = useNavigation();

	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			navigation.setOptions({
				title: "Bottled waters",
			});

			const items = await getItems();
			if (items) {
				setItems(items);
			}

			setLoading(false);
		};

		fetch();
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
				paddingVertical: 20,
				paddingHorizontal: 20,
			}}
		>
			<RankingList title="Bottled waters" items={items} loading={loading} />
		</ScrollView>
	);
}
