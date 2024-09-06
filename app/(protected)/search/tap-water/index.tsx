import { getLocations } from "@/actions/locations";
import { useNavigation } from "expo-router";

import RankingList from "@/components/sharable/ranking-list";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

export default function Page() {
	const navigation = useNavigation();

	const [locations, setLocations] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			navigation.setOptions({
				title: "Tap water",
			});

			const locations = await getLocations();

			if (locations) {
				setLocations(locations);
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
			<RankingList categoryId="tap_water" />
		</ScrollView>
	);
}
