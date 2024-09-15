import { getFilters } from "@/actions/filters";
import { getItems } from "@/actions/items";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { FlatList, View } from "react-native";

import { Button } from "@/components/ui/button";
import { H2, Muted } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

import { useEffect, useState } from "react";
import ItemPreviewCard from "./item-preview-card";
import Loader from "./loader";

export default function RankingList({ categoryId }: { categoryId: string }) {
	const { subscription, uid } = useUserProvider();
	const router = useRouter();
	const navigation = useNavigation();
	const { backgroundColor } = useColorScheme();

	const [loading, setLoading] = useState(true);
	const [allItems, setAllItems] = useState<any[]>([]);
	const [title, setTitle] = useState<string>("");

	const fetchAndSetData = async (
		key: string,
		fetchFunction: () => Promise<any>,
	) => {
		// const cachedData = localStorage.getItem(key)
		// if (cachedData && cachedData.length > 5) {
		//   const parsedData = JSON.parse(cachedData)
		//   setState(parsedData)
		//   if (tabValue === tabKey) {
		//     console.log(' setAllItems cachedData', parsedData)
		//     setAllItems(parsedData)
		//   }
		//   setLoading((prev) => ({ ...prev, [key]: false }))
		// } else {
		//   const data = await fetchFunction()
		//   setState(data)
		//   localStorage.setItem(key, JSON.stringify(data))
		//   setLoading((prev) => ({ ...prev, [key]: false }))
		//   if (tabValue === tabKey) {
		//     setAllItems(data)
		//   }
		// }
		const data = await fetchFunction();

		// Sort the data if the user has a subscription
		if (subscription && uid) {
			console.log("sorting");

			const items = data;
			const indexedItems = data.filter(
				(item: any) => item.is_indexed !== false,
			);
			const nonIndexedItems = data.filter(
				(item: any) => item.is_indexed === false,
			);

			indexedItems.sort((a: any, b: any) => b.score - a.score);
			nonIndexedItems.sort((a: any, b: any) => b.score - a.score);
			items.sort((a: any, b: any) => b.score - a.score);

			setAllItems(items);
		} else {
			setAllItems(data);
		}

		setLoading(false);
	};

	useEffect(() => {
		switch (categoryId) {
			case "bottled_water":
				fetchAndSetData("bottled_water", () =>
					getItems({ limit: 500, sortMethod: "name", type: "bottled_water" }),
				);
				navigation.setOptions({
					title: "Bottled water",
				});
				setTitle("Bottled water");
				break;
			case "filter":
				fetchAndSetData("filter", () =>
					getFilters({ limit: 250, sortMethod: "name", type: "filter" }),
				);
				navigation.setOptions({
					title: "Filters",
				});
				setTitle("Filters");
				break;
			case "shower_filter":
				fetchAndSetData("shower_filter", () =>
					getFilters({ limit: 100, sortMethod: "name", type: "shower_filter" }),
				);
				navigation.setOptions({
					title: "Shower filters",
				});
				setTitle("Shower filters");
				break;

			case "energy_drink":
				fetchAndSetData("energy_drink", () =>
					getItems({ limit: 100, sortMethod: "name", type: "energy_drink" }),
				);
				navigation.setOptions({
					title: "Energy drinks",
				});
				setTitle("Energy drinks");
				break;
			case "flavored_water":
				fetchAndSetData("flavored_water", () =>
					getItems({ limit: 100, sortMethod: "name", type: "flavored_water" }),
				);
				navigation.setOptions({
					title: "Flavored water",
				});
				setTitle("Flavored water");
				break;
			case "gallons":
				fetchAndSetData("gallons", () =>
					getItems({ limit: 100, sortMethod: "name", type: "water_gallon" }),
				);
				navigation.setOptions({
					title: "Water gallons",
				});
				setTitle("Water gallons");
				break;
			case "bottle_filter":
				fetchAndSetData("bottle_filter", () =>
					getFilters({ limit: 100, sortMethod: "name", type: "bottle_filter" }),
				);
				navigation.setOptions({
					title: "Bottle filters",
				});
				setTitle("Bottle filters");
				break;
			case "coconut_water":
				fetchAndSetData("coconut_water", () =>
					getItems({ limit: 100, sortMethod: "name", type: "coconut_water" }),
				);
				navigation.setOptions({
					title: "Coconut waters",
				});
				setTitle("Coconut waters");
				break;
			default:
				break;
		}
	}, [categoryId, subscription, uid]);

	const renderItem = ({ item }: { item: any }) => (
		<ItemPreviewCard key={item.id} item={item} />
	);

	const renderLoader = () => (
		<>
			{Array(10)
				.fill(0)
				.map((_, index) => (
					<Loader key={`loader-${index}`} />
				))}
		</>
	);

	return (
		<View className="flex-1 md:mt-4 mt-0 w-screen px-4">
			{!subscription ? (
				<View className="pb-4 px-4">
					<H2>All {title.charAt(0).toLowerCase() + title.slice(1)}</H2>
					<Muted>
						Want to know the best{" "}
						{title.charAt(0).toLowerCase() + title.slice(1)} based on science?
					</Muted>
					<Button
						className="w-56 mt-2"
						variant="default"
						label="Show me the ratings"
						icon={<Octicons name="lock" size={16} color={backgroundColor} />}
						iconPosition="left"
						onPress={() => {
							router.push("/subscribeModal");
						}}
					/>
				</View>
			) : (
				<View className="pb-4">
					<H2>Top {title.charAt(0).toLowerCase() + title.slice(1)}</H2>
					<Muted>
						Best {title.charAt(0).toLowerCase() + title.slice(1)} based on
						science and lab reports sorted by score{" "}
					</Muted>
				</View>
			)}
			<FlatList
				data={allItems?.filter((item) => !item.is_draft) || []}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={{ justifyContent: "space-around", gap: 8 }}
				contentContainerStyle={{ paddingTop: 0, paddingBottom: 0, gap: 16 }}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={loading ? renderLoader() : null}
				ListHeaderComponent={<View style={{ height: 1 }} />}
				initialNumToRender={8}
				maxToRenderPerBatch={4}
				windowSize={5}
				removeClippedSubviews={true}
				scrollToOverflowEnabled={false}
			/>
		</View>
	);
}
