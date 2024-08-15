import { getFilters } from "@/actions/filters";
import { getItems } from "@/actions/items";
import { Button } from "@/components/ui/button";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import { useUserProvider } from "@/context/user-provider";

import { useEffect, useState } from "react";
import ItemPreviewCard from "./item-preview-card";
import Loader from "./loader";

export default function RankingList({ categoryId }: { categoryId: string }) {
	const { subscription, uid } = useUserProvider();
	const router = useRouter();
	const navigation = useNavigation();

	const [loading, setLoading] = useState(true);
	const [allItems, setAllItems] = useState<any[]>([]);

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

			console.log("indexedItems:", indexedItems);
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
				break;
			case "filter":
				fetchAndSetData("filter", () =>
					getFilters({ limit: 50, sortMethod: "name", type: "filter" }),
				);
				navigation.setOptions({
					title: "Filters",
				});
				break;
			case "shower_filter":
				fetchAndSetData("shower_filter", () =>
					getFilters({ limit: 25, sortMethod: "name", type: "shower_filter" }),
				);
				navigation.setOptions({
					title: "Shower filters",
				});
				break;

			case "energy_drink":
				fetchAndSetData("energy_drink", () =>
					getItems({ limit: 25, sortMethod: "name", type: "energy_drink" }),
				);
				navigation.setOptions({
					title: "Energy drinks",
				});
				break;
			case "flavored_water":
				fetchAndSetData("flavored_water", () =>
					getItems({ limit: 25, sortMethod: "name", type: "flavored_water" }),
				);
				navigation.setOptions({
					title: "Flavored water",
				});
				break;
			case "gallons":
				fetchAndSetData("gallons", () =>
					getItems({ limit: 25, sortMethod: "name", type: "water_gallon" }),
				);
				navigation.setOptions({
					title: "Water gallons",
				});
				break;
			case "bottle_filter":
				fetchAndSetData("bottle_filter", () =>
					getFilters({ limit: 25, sortMethod: "name", type: "bottle_filter" }),
				);
				navigation.setOptions({
					title: "Bottle filters",
				});
				break;
			default:
				break;
		}
	}, [categoryId, subscription, uid]);

	const UnlockTopButton = () => {
		return (
			<Button
				className="w-full"
				variant="default"
				label="Unlock top rated"
				icon={<Octicons name="lock" size={16} color="white" />}
				iconPosition="left"
				onPress={() => {
					router.push("/subscribeModal");
				}}
			/>
		);
	};

	return (
		<View className="md:mt-4 mt-0 w-screen px-8">
			{!subscription && <View className="pb-4">{UnlockTopButton()}</View>}

			<ScrollView
				contentContainerStyle={{ paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex flex-row w-full">
					<View className="flex-1 pr-1 gap-y-4">
						{allItems &&
							allItems
								.filter((item) => !item.is_draft)
								.filter((_, index) => index % 2 === 0)
								.map((item) => <ItemPreviewCard key={item.id} item={item} />)}
						{(loading || !allItems) &&
							Array(5)
								.fill(0)
								.map((_, index) => <Loader key={`loader-left-${index}`} />)}
					</View>
					<View className="flex-1 pl-1 gap-y-4">
						{allItems &&
							allItems
								.filter((item) => !item.is_draft)
								.filter((_, index) => index % 2 !== 0)
								.map((item) => <ItemPreviewCard key={item.id} item={item} />)}
						{(loading || !allItems) &&
							Array(5)
								.fill(0)
								.map((_, index) => <Loader key={`loader-right-${index}`} />)}
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
