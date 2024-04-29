import { getFilters } from "@/actions/filters";
import { useNavigation } from "expo-router";

import RankingList from "@/components/sharable/ranking-list";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

export default function Page() {
	const navigation = useNavigation();

	const [filters, setFilters] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			navigation.setOptions({
				title: "Filters",
			});

			const filters = await getFilters();
			if (filters) {
				setFilters(filters);
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
			<RankingList title="Filters" items={filters} loading={loading} />
		</ScrollView>
	);
}
