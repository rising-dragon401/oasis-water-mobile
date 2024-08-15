import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Search from "@/components/sharable/search";
import { H2, Large, Muted } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { CATEGORIES } from "@/lib/constants/categories";

import { getFeaturedUsers } from "actions/admin";
import { getRandomFilters } from "actions/filters";
import { getRandomItems } from "actions/items";
import { getRandomLocations } from "actions/locations";

export default function TabOneScreen() {
	const { userData, subscription, uid } = useUserProvider();
	const router = useRouter();
	const pathname = usePathname();

	const [items, setItems] = useState<any[]>([]);
	const [tapWater, setTapWater] = useState<any[]>([]);
	const [filters, setFilters] = useState<any[]>([]);
	const [people, setPeople] = useState<any[]>([]);

	useEffect(() => {
		getBottledWater();
		getTapWater();
		getFilters();
		getPeople();
	}, []);

	useEffect(() => {
		if (
			userData &&
			uid &&
			subscription &&
			!userData?.has_reviewed_app &&
			pathname !== "/reviewModal"
		) {
			router.push("/reviewModal");
		}
	}, [userData, subscription, uid]);

	async function getBottledWater() {
		const data = await getRandomItems();

		setItems(data || []);
	}

	async function getTapWater() {
		const data = await getRandomLocations();

		setTapWater(data || []);
	}

	async function getFilters() {
		const data = await getRandomFilters();

		setFilters(data || []);
	}

	async function getPeople() {
		const data = await getFeaturedUsers();

		setPeople(data || []);
	}

	return (
		<View className="flex flex-col h-full items-center my-6 p-4">
			<H2 className="text-center max-w-xs">What are you drinking?</H2>

			<Muted className="text-center mb-4 max-w-md ">
				Find the best water brands based on science
			</Muted>

			<View className="mb-8 w-[90%] z-40">
				<Search />
			</View>

			<ScrollView
				contentContainerStyle={{
					width: "100%",
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "space-between",
					gap: 8,
					paddingHorizontal: 8,
					paddingBottom: 24, // Add padding to the bottom
					rowGap: 16,
				}}
				className="overflow-y-scroll"
				showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner look
			>
				{CATEGORIES.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0)).map(
					(category) => (
						<Link
							key={category.id}
							href={`/search/top-rated/${category.id}`}
							className="bg-card border-input border h-48 rounded-lg mb-4" // Add margin-bottom
						>
							<View className="flex flex-col items-center justify-center w-[42vw] gap-2 pt-4">
								<Image
									source={{ uri: category.image }}
									alt={category.title}
									style={{
										width: "80%",
										height: "70%",
										resizeMode: "contain",
									}}
									className="mb-2 w-54 h-48 "
								/>
								<Large className="text-center text-md mt-4">
									{category.title}
								</Large>
							</View>
						</Link>
					),
				)}
			</ScrollView>
		</View>
	);
}
