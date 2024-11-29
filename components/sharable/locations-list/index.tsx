import { Link, router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import LocationCard from "@/components/cards/location-card";

const FEATURED_LOCATIONS = [
	{
		id: "California",
		name: "California",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/california.jpg?t=2024-10-16T21%3A16%3A45.884Z",
		score: 18,
	},
	{
		id: "New York",
		name: "New York",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/new_york.jpg?t=2024-10-16T21%3A37%3A24.980Z",
		score: 14,
	},
	{
		id: "Florida",
		name: "Florida",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/florida.jpg?t=2024-10-16T21%3A42%3A04.239Z",
		score: 22,
	},
	{
		id: "Washington",
		name: "Washington",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/washington.jpg?t=2024-10-16T21%3A48%3A53.558Z",
		score: 15,
	},
	{
		id: "Texas",
		name: "Texas",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/texas.jpg?t=2024-10-16T21%3A50%3A33.613Z",
		score: 11,
	},
];
export const LocationsList = ({}: object) => {
	return (
		<View>
			<View className="flex flex-col w-full gap-y-4">
				<FlatList
					data={[...FEATURED_LOCATIONS, { id: "see-more", name: "See More" }]}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 8,
						maxHeight: 90,
					}}
					className="overflow-x-scroll"
					renderItem={({ item: location }) => (
						<View className="mr-4 w-44">
							{location.id === "see-more" ? (
								<TouchableOpacity
									onPress={() => router.push("/(protected)/search/locations")}
								>
									<View className="flex items-center justify-center h-full">
										<Text>See More</Text>
									</View>
								</TouchableOpacity>
							) : (
								<Link href={`/search/locations/state/${location.id}`}>
									<LocationCard location={location} size="md" />
								</Link>
							)}
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</View>
	);
};
