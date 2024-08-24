import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import Search from "@/components/sharable/search";
import { H2, Muted, P } from "@/components/ui/typography";
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
			<H2 className="text-center max-w-xs border-none">Search healthy water</H2>

			<Muted className="text-center mb-4 max-w-md">
				Discover the best water products based on science.
			</Muted>

			<View className="mb-8 w-[90%] z-40">
				<Search />
			</View>

			<FlatList
				data={CATEGORIES.sort(
					(a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0),
				)}
				numColumns={2}
				contentContainerStyle={{
					width: "100%",
					paddingHorizontal: 8,
					paddingBottom: 24,
				}}
				columnWrapperStyle={{
					justifyContent: "space-between",
				}}
				className="overflow-y-scroll"
				showsVerticalScrollIndicator={false}
				renderItem={({ item: category }) => (
					<View className="mb-10 w-[48%] h-[120px] rounded-xl bg-card">
						<Link
							key={category.id}
							href={`/search/top-rated/${category.id}`}
							className=""
						>
							<View className="relative w-full aspect-[4.5/3] flex items-center justify-center rounded-xl">
								<Image
									source={{ uri: category.image }}
									alt={category.title}
									style={{
										width: "70%",
										height: "80%",
										borderRadius: 4,
									}}
								/>
							</View>
						</Link>
						<P className="text-left text-lg font-medium">{category.title}</P>
					</View>
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}
