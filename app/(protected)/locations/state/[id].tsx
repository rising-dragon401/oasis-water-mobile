import { getAllCitiesInState } from "@/actions/locations";
import { Circle } from "@/components/sharable/circle";
import { H1, H3, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import {
	useGlobalSearchParams,
	useLocalSearchParams,
	useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

export default function StateScreen() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();
	const { backgroundColor } = useColorScheme();
	const router = useRouter();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"1";

	const [cities, setCities] = useState<any[]>([]);

	useEffect(() => {
		const fetchCities = async () => {
			const cities = await getAllCitiesInState(id);
			setCities(cities || []);
		};
		fetchCities();
	}, [id]);

	// Render individual city card
	const renderCityCard = ({ item }: { item: any }) => {
		return (
			<TouchableOpacity
				className="flex-row mb-8 bg-card rounded-lg border border-border"
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
				<View className="pl-4 py-2">
					<H3>{item.name}</H3>
					<Muted>{item.state}</Muted>
				</View>

				<View className="flex-1 items-end justify-center pr-4">
					<Circle value={item.score} size={40} strokeWidth={4} />
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View className="flex-1 px-4 " style={{ backgroundColor }}>
			<H1 className="mt-4">{id} tap water</H1>

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
