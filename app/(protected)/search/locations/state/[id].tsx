import {
	useGlobalSearchParams,
	useLocalSearchParams,
	useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

import { getAllCitiesInState } from "@/actions/locations";
import { Circle } from "@/components/sharable/circle";
import { H1, H3, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function StateScreen() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();
	const { backgroundColor } = useColorScheme();
	const router = useRouter();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"California";

	const [cities, setCities] = useState<any[]>([]);
	const [score, setScore] = useState<number | null>(null);

	useEffect(() => {
		const fetchCities = async () => {
			const cities = await getAllCitiesInState(id);
			setScore(cities.score ?? null);
			setCities(cities.cities || []);
		};
		fetchCities();
	}, [id]);

	// Render individual city card
	const renderCityCard = ({ item }: { item: any }) => {
		return (
			<TouchableOpacity
				className="flex-row mb-8 bg-card rounded-lg items-center justify-between gap-y-4 border border-border"
				onPress={() => router.push(`/search/location/${item.id}`)}
			>
				<Image
					source={{ uri: item.image }}
					style={{
						width: 80,
						height: 80,
						borderTopLeftRadius: 8,
						borderBottomLeftRadius: 8,
					}}
				/>
				<View className="pl-4 py-2 gap-y-2">
					<H3 className="text-lg">{item.name}</H3>
					<Muted>{item.state}</Muted>
				</View>

				<View className="flex-1 items-end justify-center pr-4">
					<Circle
						value={Math.max(
							Math.round(item.score || item.utilities[0]?.score || 0),
							1,
						)}
						size={40}
						strokeWidth={4}
					/>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View className="flex-1 px-4" style={{ backgroundColor }}>
			<View className="flex flex-row items-center justify-between pr-4 pb-2">
				<H1 className="mt-4 w-3/4">{id} tap water</H1>

				{score && <Circle value={score} size={56} strokeWidth={4} />}
			</View>

			<FlatList
				data={cities}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderCityCard}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: 16 }}
			/>
		</View>
	);
}
