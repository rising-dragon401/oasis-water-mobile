import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, View } from "react-native";

import ItemPreviewCard from "./item-preview-card";
import Typography from "./typography";

import { getFilters } from "@/actions/filters";
import { getFlavoredWater, getItems, getWaterGallons } from "@/actions/items";
import { getLocations } from "@/actions/locations";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProvider } from "@/context/user-provider";
import { P } from "../ui/typography";

type TabKeys =
	| "bottled_water"
	| "tap_water"
	| "filter"
	| "flavored_water"
	| "water_gallons";

type CategoryType = {
	id: TabKeys;
	title: string;
	href?: string;
	logo: React.ReactElement;
};

const CATEGORIES: CategoryType[] = [
	{
		id: "bottled_water",
		title: "Bottled water",
		href: "/search/bottled-water",
		logo: (
			<MaterialCommunityIcons
				name="bottle-soda-classic-outline"
				size={16}
				color="black"
			/>
		),
	},
	{
		id: "filter",
		title: "Water Filters",
		logo: (
			<MaterialCommunityIcons name="filter-outline" size={16} color="black" />
		),
	},
	{
		id: "flavored_water",
		title: "Flavored water",
		logo: (
			<MaterialCommunityIcons
				name="bottle-soda-outline"
				size={14}
				color="black"
			/>
		),
	},
	{
		id: "water_gallons",
		title: "5 Gallons",
		logo: <Feather name="droplet" size={14} color="black" />,
	},
	{
		id: "tap_water",
		title: "Tap water",
		logo: <MaterialIcons name="waves" size={24} color="black" />,
	},
];

type SortMethod = "name" | "score";

type Props = {
	title?: string;
	items?: any[];
};

export default function RankingList({ title, items }: Props) {
	const { subscription, uid } = useUserProvider();
	const router = useRouter();

	const [loading, setLoading] = useState({
		bottled_water: true,
		tap_water: true,
		filter: true,
		flavored_water: true,
		water_gallons: true,
	});
	const [tabValue, setTabValue] = useState<TabKeys>("bottled_water");
	const [sortMethod, setSortMethod] = useState("name");
	const [allItems, setAllItems] = useState<any[]>([]);
	const [filteredItems, setFilteredItems] = useState<any[]>([]);
	const [bottledWater, setBottledWater] = useState<any[]>([]);
	const [waterGallons, setWaterGallons] = useState<any[]>([]);
	const [tapWater, setTapWater] = useState<any[]>([]);
	const [filters, setFilters] = useState<any[]>([]);
	const [flavoredWater, setFlavoredWater] = useState<any[]>([]);
	const [completeInit, setCompleteInit] = useState(false);
	const [page, setPage] = useState(1);

	// load initial 20 items on page load
	useEffect(() => {
		const fetch = async () => {
			let sort: SortMethod = "name";

			const items = await getItems({ limit: 18, sortMethod: sort });
			setBottledWater(items);
			setFilteredItems(items);
			setLoading((prev) => ({ ...prev, bottled_water: false }));

			const fetchLocations = async () => {
				const locations = await getLocations({ limit: 18, sortMethod: sort });
				if (locations) {
					setTapWater(locations);
					setLoading((prev) => ({ ...prev, tap_water: false }));
				}
			};

			const fetchFilters = async () => {
				const filters = await getFilters({ limit: 18, sortMethod: sort });
				if (filters) {
					setFilters(filters);
					setLoading((prev) => ({ ...prev, filter: false }));
				}
			};

			const fetchFlavoredWater = async () => {
				const flavoredWater = await getFlavoredWater({
					limit: 18,
					sortMethod: sort,
				});
				if (flavoredWater) {
					setFlavoredWater(flavoredWater);
					setLoading((prev) => ({ ...prev, flavored_water: false }));
				}
			};

			const fetchWaterGallons = async () => {
				const waterGallons = await getWaterGallons({
					limit: 18,
					sortMethod: sort,
				});
				if (waterGallons) {
					setWaterGallons(waterGallons);
					setLoading((prev) => ({ ...prev, water_gallons: false }));
				}
			};

			fetchLocations();
			fetchFilters();
			fetchFlavoredWater();
			fetchWaterGallons();

			setCompleteInit(true);
		};

		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// load all items
	useEffect(() => {
		if (completeInit) {
			let sort: SortMethod = "name";
			if (subscription && uid) {
				sort = "score";
			}

			getItems().then((items) => {
				setBottledWater(items);
				if (tabValue === "bottled_water") {
					setAllItems(items);
				}
			});

			getLocations().then((locations: any) => {
				setTapWater(locations);
				if (tabValue === "tap_water") {
					setAllItems(locations);
				}
			});

			getFilters().then((filters) => {
				setFilters(filters);
				if (tabValue === "filter") {
					setAllItems(filters);
				}
			});

			getFlavoredWater().then((flavoredWater) => {
				setFlavoredWater(flavoredWater);
				if (tabValue === "flavored_water") {
					setAllItems(flavoredWater);
				}
			});

			getWaterGallons().then((waterGallons) => {
				setWaterGallons(waterGallons);
				if (tabValue === "water_gallons") {
					setAllItems(waterGallons);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [completeInit]);

	// manage tab switching.
	useEffect(() => {
		if (tabValue) {
			manageTab(tabValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabValue]);

	useEffect(() => {
		if (!allItems) return;

		let sorted = allItems;
		if (sortMethod === "score") {
			sorted = sorted?.sort((a, b) => (b.score || 0) - (a.score || 0));
		} else if (sortMethod === "name") {
			sorted = sorted?.sort((a, b) => a.name.localeCompare(b.name));
		}

		if (sorted && sorted?.length > 5) {
			setFilteredItems(sorted);
		}
	}, [sortMethod, allItems]);

	// manage sort based on subscription
	useEffect(() => {
		if (!subscription || !uid) {
			setSortMethod("name");
		} else if (subscription && uid) {
			setSortMethod("score");
		}
	}, [subscription, uid]);

	const manageTab = (tabValue: TabKeys) => {
		if (tabValue === "bottled_water") {
			setAllItems(bottledWater);
		} else if (tabValue === "tap_water") {
			setAllItems(tapWater);
		} else if (tabValue === "filter") {
			setAllItems(filters);
		} else if (tabValue === "flavored_water") {
			setAllItems(flavoredWater);
		} else if (tabValue === "water_gallons") {
			setAllItems(waterGallons);
		}
	};

	const handleClickSortByScore = () => {
		if (subscription) {
			setSortMethod("score");
		} else {
			router.push("/subscribeModal");
		}
	};

	return (
		<View className="pb-14 w-full">
			<Tabs
				value={tabValue}
				className="w-full"
				onValueChange={(value) => {
					setTabValue(value as TabKeys);
				}}
			>
				<View className="py-2 flex flex-row justify-between mb-2">
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						<TabsList className="flex flex-row gap-2 bg-transparent">
							{CATEGORIES.map((category) => (
								<TabsTrigger
									key={category.title}
									value={category.id}
									disabled={
										loading[category.id] && category.id !== "bottled_water"
									}
									className={`flex flex-row justify-center items-center gap-1 bg-transparent shadow-none rounded-lg px-3 ${
										tabValue === category.id ? "bg-secondary text-white" : ""
									}`}
									style={{ flex: 1 }} // This ensures each tab trigger tries to take equal space
								>
									{React.cloneElement(category.logo, {
										className: `${tabValue === category.id ? "text-primary" : "text-slate-400"}`,
									})}
									<P>{category.title}</P>
								</TabsTrigger>
							))}
						</TabsList>
					</ScrollView>

					<View className="flex flex-row justify-end items-center w-1/6">
						<View className="flex flex-row items-center gap-4">
							{/* @ts-ignore */}
							<DropdownMenu>
								<DropdownMenuTrigger
									asChild
									className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-full px-3 max-w-56 hover:cursor-pointer"
								>
									<FontAwesome6 name="sliders" size={16} color="black" />
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-64 native:w-72">
									<Typography size="sm" fontWeight="medium" className="p-2">
										Sort by
									</Typography>
									<DropdownMenuItem
										onPress={handleClickSortByScore}
										className="hover:cursor-pointer"
									>
										{!subscription && (
											<Feather name="lock" size={24} color="black" />
										)}
										Score
									</DropdownMenuItem>

									<DropdownMenuItem
										onPress={() => {
											setSortMethod("name");
										}}
										className="hover:cursor-pointer flex justify-between"
									>
										Name
										{sortMethod === "name" && (
											<Feather name="check" size={24} color="black" />
										)}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</View>
					</View>
				</View>

				<TabsContent value={tabValue} className="w-full">
					<FlatList
						data={filteredItems}
						renderItem={({ item }) => (
							<View key={item.id} style={{ width: "48%" }} className="mb-8">
								<ItemPreviewCard item={item} size="md" showFavorite />
							</View>
						)}
						keyExtractor={(item) => item.id}
						numColumns={2}
						showsVerticalScrollIndicator={false}
						style={{ minHeight: 300, maxHeight: 600 }}
						columnWrapperStyle={{ justifyContent: "space-between" }}
						onEndReached={() => setPage((prevPage) => prevPage + 1)}
						onEndReachedThreshold={0.1}
						ListFooterComponent={() =>
							loading[tabValue] && (
								<ActivityIndicator size="large" color="#0000ff" />
							)
						}
					/>

					{loading[tabValue] && (
						<ActivityIndicator size="large" color="black" />
					)}

					{/* <View ref={lastItemRef} /> */}
				</TabsContent>
			</Tabs>
		</View>
	);
}
