import { FontAwesome } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/lib/useColorScheme";
import { Muted, P } from "../ui/typography";
import ItemPreviewCard from "./item-preview-card";
import Loader from "./loader";

import { getFilters } from "@/actions/filters";
import { getItems, getMineralPackets } from "@/actions/items";
import { getLocations } from "@/actions/locations";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProvider } from "@/context/user-provider";

type TabKeys = "bottled_water" | "tap_water" | "filter" | "mineral_packets";

type CategoryType = {
	id: TabKeys;
	title: string;
	href?: string;
	logo: React.ReactElement;
	tags?: string[];
};

const CATEGORIES: CategoryType[] = [
	{
		id: "bottled_water",
		title: "Bottled water",
		href: "/search/bottled-water",
		logo: (
			<MaterialCommunityIcons
				name="bottle-soda-classic-outline"
				size={18}
				color="black"
			/>
		),
		tags: ["still", "sparkling", "flavored", "gallon"],
	},
	{
		id: "filter",
		title: "Water Filters",
		logo: (
			<MaterialCommunityIcons name="filter-outline" size={18} color="black" />
		),
		tags: ["tap", "shower", "bottle", "sink"],
	},
	{
		id: "tap_water",
		title: "Tap water",
		logo: <Feather name="droplet" size={18} color="black" />,
	},
	{
		id: "mineral_packets",
		title: "Mineral packets",
		logo: <FontAwesome name="diamond" size={24} color="black" />,
	},
];

type Props = {
	title?: string;
	items?: any[];
};

export default function RankingList({ title, items }: Props) {
	const { subscription, uid } = useUserProvider();
	const router = useRouter();
	const { iconColor } = useColorScheme();

	const [loading, setLoading] = useState({
		bottled_water: true,
		filter: true,
		tap_water: true,
		mineral_packets: true,
	});
	const [tabValue, setTabValue] = useState<TabKeys>("bottled_water");
	const [allItems, setAllItems] = useState<any[]>([]);
	const [filteredItems, setFilteredItems] = useState<any[]>([]);
	const [bottledWater, setBottledWater] = useState<any[]>([]);
	const [mineralPackets, setMineralPackets] = useState<any[]>([]);
	const [tapWater, setTapWater] = useState<any[]>([]);
	const [filters, setFilters] = useState<any[]>([]);
	const [sortMethod, setSortMethod] = useState("name");
	const [completeInit, setCompleteInit] = useState(false);
	const [page, setPage] = useState(1);
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [filterMenuOpen, setFilterMenuOpen] = useState(false);
	const [tagsMenuOpen, setTagsMenuOpen] = useState(false);

	// const fetchData = async (
	// 	fetchFunction: () => Promise<any>,
	// 	setData: (data: any) => void,
	// 	setLoading: (loading: boolean) => void,
	// ) => {
	// 	try {
	// 		const data = await fetchFunction();
	// 		setData(data);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	useEffect(() => {
		const initialFetch = async () => {
			const itemsPromise = getItems({ limit: 999, sortMethod: "name" }).then(
				(items) => {
					setBottledWater(items);
					setLoading((prev) => ({ ...prev, bottled_water: false }));
					setAllItems(items);
					setCompleteInit(true);
				},
			);

			const filtersPromise = getFilters({
				limit: 999,
				sortMethod: "name",
			}).then((filters) => {
				setFilters(filters);
				setLoading((prev) => ({ ...prev, filter: false }));
			});

			const locationsPromise = getLocations({
				limit: 999,
				sortMethod: "name",
			}).then((locations: any) => {
				setTapWater(locations);
				setLoading((prev) => ({ ...prev, tap_water: false }));
			});

			const mineralPacketsPromise = getMineralPackets({
				limit: 999,
				sortMethod: "name",
			}).then((mineralPackets) => {
				setMineralPackets(mineralPackets);
				setLoading((prev) => ({ ...prev, mineral_packets: false }));
			});

			await Promise.all([
				itemsPromise,
				filtersPromise,
				locationsPromise,
				mineralPacketsPromise,
			]);
		};

		initialFetch();
	}, []);

	useEffect(() => {
		if (tabValue) manageTab(tabValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabValue]);

	useEffect(() => {
		if (!allItems) return;

		let sortedItems = [...allItems];
		if (sortMethod === "score") {
			sortedItems.sort((a, b) => (b.score || 0) - (a.score || 0));
		} else {
			sortedItems.sort((a, b) => a.name.localeCompare(b.name));
		}

		if (selectedTags.length > 0) {
			sortedItems = sortedItems.filter((item) =>
				selectedTags.every((tag) => item?.tags?.includes(tag)),
			);
		}

		setFilteredItems(sortedItems);
	}, [sortMethod, allItems, selectedTags]);

	useEffect(() => {
		setSortMethod(subscription && uid ? "score" : "name");
	}, [subscription, uid]);

	const manageTab = (tabValue: TabKeys) => {
		setSelectedTags([]);

		if (tabValue === "bottled_water") {
			setAllItems(bottledWater);
		} else if (tabValue === "tap_water") {
			setAllItems(tapWater);
		} else if (tabValue === "filter") {
			setAllItems(filters);
		} else if (tabValue === "mineral_packets") {
			setAllItems(mineralPackets);
		}

		setTags(
			CATEGORIES.find((category) => category.id === tabValue)?.tags || [],
		);
	};

	const handleClickSortByScore = () => {
		if (subscription) {
			setSortMethod("score");
		} else {
			router.push("/subscribeModal");
		}
	};

	// const UnlockTopButton = () => {
	// 	if (!subscription) {
	// 		return (
	// 			<Button
	// 				variant="outline"
	// 				className="flex flex-row gap-1"
	// 				onClick={handleClickSortByScore}
	// 			>
	// 				Unlock top rated
	// 				<TrendingUp className="w-4 h-4" />
	// 			</Button>
	// 		);
	// 	}
	// };

	return (
		<View className="pb-14 w-full">
			<Tabs
				value={tabValue}
				className="w-full"
				onValueChange={(value) => {
					setTabValue(value as TabKeys);
				}}
			>
				<View className="flex flex-row justify-between">
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
										tabValue === category.id
											? "bg-secondary text-white border"
											: ""
									}`}
									style={{ flex: 1 }}
								>
									<P>{category.title}</P>
								</TabsTrigger>
							))}
						</TabsList>
					</ScrollView>

					<View className="flex flex-row items-center gap-6 w-24 px-2">
						{tags.length > 0 ? (
							<DropdownMenu
								open={tagsMenuOpen}
								onOpenChange={(value) => setTagsMenuOpen(value)}
							>
								<DropdownMenuTrigger asChild>
									<TouchableOpacity>
										<FontAwesome6 name="sliders" size={16} color={iconColor} />
									</TouchableOpacity>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<Muted className="p-1">Tags</Muted>
									{tags.map((tag) => (
										<DropdownMenuItem
											onPress={() => {
												setSelectedTags((prevTags) =>
													prevTags.includes(tag)
														? prevTags.filter((t) => t !== tag)
														: [tag],
												);
											}}
											className="hover:cursor-pointer flex justify-between"
											key={tag}
										>
											<P className="flex justify-between">{tag}</P>
											<P className="flex justify-between">
												{selectedTags.includes(tag) && (
													<Feather name="check" size={16} color={iconColor} />
												)}
											</P>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<View className="w-4" />
						)}

						<DropdownMenu
							open={filterMenuOpen}
							onOpenChange={(value) => setFilterMenuOpen(value)}
						>
							<DropdownMenuTrigger asChild>
								<TouchableOpacity>
									<FontAwesome6
										name="arrow-down-short-wide"
										size={16}
										color={iconColor}
									/>
								</TouchableOpacity>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<Muted className="p-1">Sort by</Muted>
								<DropdownMenuItem
									onPress={handleClickSortByScore}
									className="hover:cursor-pointer"
								>
									{!subscription && (
										<Feather name="lock" size={16} color={iconColor} />
									)}
									<P>Score</P>
									{sortMethod === "score" && (
										<Feather name="check" size={16} color={iconColor} />
									)}
								</DropdownMenuItem>

								<DropdownMenuItem
									onPress={() => {
										setSortMethod("name");
									}}
									className="hover:cursor-pointer flex justify-between w-full"
								>
									<P>Name</P>
									{sortMethod === "name" && (
										<Feather name="check" size={16} color={iconColor} />
									)}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</View>
				</View>

				<TabsContent value={tabValue} className="w-full px-4">
					<View style={{ minHeight: 600 }} className="mt-2">
						{loading[tabValue] || !filteredItems ? (
							<View className="flex flex-row justify-center items-center h-40 w-full">
								<Loader />
							</View>
						) : (
							<FlatList
								data={filteredItems}
								renderItem={({ item }) => (
									<View key={item.id} style={{ width: "48%" }} className="mb-4">
										<ItemPreviewCard item={item} size="md" />
									</View>
								)}
								keyExtractor={(item) => item.id}
								numColumns={2}
								showsVerticalScrollIndicator={false}
								style={{ minHeight: 300, maxHeight: 600, paddingTop: 10 }}
								columnWrapperStyle={{ justifyContent: "space-between" }}
								onEndReached={() => setPage((prevPage) => prevPage + 1)}
								onEndReachedThreshold={0.1}
							/>
						)}
					</View>
				</TabsContent>
			</Tabs>
		</View>
	);
}
