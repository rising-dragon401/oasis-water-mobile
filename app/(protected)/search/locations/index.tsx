import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";

import { getLocationStates } from "@/actions/locations";
import { Circle } from "@/components/sharable/circle";
import Skeleton from "@/components/sharable/skeleton";
import { Input } from "@/components/ui/input";
import { H1, Large, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function LocationsScreen() {
	const { backgroundColor } = useColorScheme();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [states, setStates] = useState<any[]>([]);
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		getLocationStates()
			.then((states) => {
				setStates(states || []);
			})
			.catch((error) => {
				console.error("Failed to fetch states", error);
				throw new Error("Failed to fetch states");
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const filteredStates = search?.trim()
		? states.filter((state) =>
				state.state.toLowerCase().includes(search?.toLowerCase()?.trim()),
			)
		: states;

	return (
		<View className="flex-1 px-2" style={{ backgroundColor }}>
			<H1 className="mt-4 px-4">Tap water ratings</H1>
			<Muted className="px-4">
				Discover the quality of tap water in your state.
			</Muted>
			<View className="px-4 mt-4">
				<Input
					placeholder="Enter your state"
					className="border border-gray-300 p-3 pl-5 mb-0 rounded-full w-full"
					value={search}
					onChangeText={setSearch}
				/>
			</View>

			{loading ? (
				<FlatList
					data={Array(10).fill(null)}
					keyExtractor={(_, index) => index.toString()}
					renderItem={() => (
						<View className="flex px-4 gap-2 mt-2 w-full">
							<Skeleton height={64} width="100%" />
						</View>
					)}
					contentContainerStyle={{ marginTop: 10 }}
				/>
			) : (
				<ScrollView
					className="flex-1 mt-4 px-4"
					contentContainerStyle={{ gap: 16 }}
				>
					{filteredStates &&
						filteredStates?.map((state) => (
							<Pressable
								key={state.id}
								onPress={() =>
									router.push(
										`/(protected)/search/locations/state/${state.state}`,
									)
								}
								className="flex-row items-center justify-between p-4 bg-card border border-border rounded-lg"
							>
								<View className="flex-1">
									<Large className="font-semibold">{state.state}</Large>
									<Muted className="mt-1">{state.numberOfCities} cities</Muted>
								</View>
								<View className="ml-4">
									<Circle
										value={state.averageScore}
										size={50}
										strokeWidth={4}
									/>
								</View>
							</Pressable>
						))}
				</ScrollView>
			)}
		</View>
	);
}
