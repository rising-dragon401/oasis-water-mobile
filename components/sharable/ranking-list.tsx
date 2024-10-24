import { Octicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import ItemPreviewCard from "./item-preview-card";
import Loader from "./loader";

import { getFilters } from "@/actions/filters";
import { getItems } from "@/actions/items";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { H2, Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

const CATEOGRIES = [
	{
		id: "water",
		name: "Water",
		tags: "gallon, sparkling, still, spring, alkaline",
	},
	{
		id: "filter",
		name: "Filter",
		tags: "shower, bottle, pitcher, countertop, sink, home",
	},
];

const TAG_CATEGORY_MAP = {
	gallon: ["gallon", "5 gallon"],
	sparkling: ["sparkling"],
	still: ["still"],
	spring: ["spring"],
	alkaline: ["alkaline"],
	shower: ["shower"],
	bottle: ["bottle"],
	pitcher: ["pitcher"],
	countertop: ["countertop"],
	sink: ["sink", "under sink"],
	home: ["home", "house"],
};

const ITEM_TYPES = [
	{
		id: "water",
		types: ["bottled_water", "water_gallon", "gallon"],
	},
	{
		id: "filter",
		types: ["filter", "shower_filter", "bottle_filter", "sink"],
	},
];

const CONTAMINANTS = [
	{
		id: "fluoride",
		supabase_ids: [22],
		label: "Fluoride",
	},
	{
		id: "heavy_metals",
		supabase_ids: [
			20, 21, 38, 46, 47, 58, 59, 62, 63, 64, 65, 78, 79, 80, 81, 84, 112, 166,
			167, 191, 408, 409,
		],
		label: "Heavy Metals",
	},
	// {
	// 	id: "microplastics",
	// 	label: "Microplastics",
	// },
	// {
	// 	id: "PFAS",
	// 	supabase_ids: [95, 96, 97, 98, 99, 69],
	// 	label: "PFAS",
	// },
	{
		id: "nitrate",
		supabase_ids: [23],
		label: "Nitrates",
	},
	{
		id: "radium",
		supabase_ids: [162, 163, 16],
		label: "Radium",
	},
	// {
	// 	id: "haloacetic_acids",
	// 	label: "Haloacetic Acids",
	// },
];

const FILTER_CONTAMINANTS = [
	{
		id: "Heavy Metals",
		label: "Heavy Metals",
	},
	{
		id: "Microplastics",
		label: "Microplastics",
	},
	{
		id: "Haloacetic Acids",
		label: "Haloacetic Acids",
	},
	{
		id: "Fluoride",
		label: "Fluoride",
	},
	{
		id: "Herbicides",
		label: "Herbicides",
	},
	{
		id: "Perfluorinated Chemicals (PFAS)",
		label: "PFAS",
	},
	{
		id: "Pesticides",
		label: "Pesticides",
	},

	{
		id: "Pharmaceuticals",
		label: "Pharmaceuticals",
	},
	{
		id: "Phthalates",
		label: "Phthalates",
	},
	{
		id: "Radiological Elements",
		label: "Radiologicals",
	},
	{
		id: "Semi-Volatile Compounds",
		label: "sVOCs",
	},
	{
		id: "Volatile Organic Compounds (VOCs)",
		label: "VOCs",
	},
	{
		id: "Microbiologicals",
		label: "Microbiologicals",
	},
];

// Function to categorize items based on tags
const categorizeItems = (items: any[]) => {
	return items.map((item) => {
		const categories = Array.isArray(item?.tags)
			? item.tags
					.flatMap(
						(tag: string) =>
							TAG_CATEGORY_MAP[tag as keyof typeof TAG_CATEGORY_MAP] || [],
					)
					.filter((category: string) => category !== undefined)
			: [];
		return { ...item, categories };
	});
};

// Define the renderLoader function
const renderLoader = () => <Loader />;

export default function RankingList({ categoryId }: { categoryId: string }) {
	const { subscription, uid, user } = useUserProvider();
	const router = useRouter();
	const navigation = useNavigation();
	const { backgroundColor } = useColorScheme();
	const params = useLocalSearchParams<{ tags?: string }>();
	const { tags: defaultTags } = params;

	const [loading, setLoading] = useState(true);
	const [allItems, setAllItems] = useState<any[]>([]);
	const [title, setTitle] = useState<string>("");
	const [openContaminantDropdown, setOpenContaminantDropdown] = useState(false);
	const [openTypeDropdown, setOpenTypeDropdown] = useState(false);
	const [tags, setTags] = useState<any[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedContaminants, setSelectedContaminants] = useState<string[]>(
		[],
	);
	const [productType, setProductType] = useState<string>("");

	const isAuthUser = uid === user?.uid;

	const fetchAndSetData = async (
		key: string,
		fetchFunction: () => Promise<any>,
	) => {
		const data = await fetchFunction();
		const categorizedData = categorizeItems(data);

		// Sort the data if the user has a subscription
		if (subscription && uid) {
			const items = categorizedData;
			const indexedItems = categorizedData.filter(
				(item: any) => item.is_indexed !== false,
			);
			const nonIndexedItems = categorizedData.filter(
				(item: any) => item.is_indexed === false,
			);

			indexedItems.sort((a: any, b: any) => b.score - a.score);
			nonIndexedItems.sort((a: any, b: any) => b.score - a.score);
			items.sort((a: any, b: any) => b.score - a.score);

			setAllItems(items);
		} else {
			setAllItems(categorizedData);
		}

		setLoading(false);
	};

	useEffect(() => {
		const type = ITEM_TYPES.find((item) => item.types.includes(categoryId));

		const productType_ = type?.id || "";

		setProductType(productType_);

		switch (productType_) {
			case "water":
				fetchAndSetData("bottled_water", () =>
					getItems({
						limit: 500,
						sortMethod: "name",
						type: ["bottled_water", "water_gallon"],
					}),
				);
				navigation.setOptions({
					title: "Bottled water",
				});
				setTitle("Bottled water");
				break;
			case "filter":
				fetchAndSetData("filter", () =>
					getFilters({
						limit: 250,
						sortMethod: "name",
						type: ["filter", "shower_filter", "bottle_filter"],
					}),
				);
				navigation.setOptions({
					title: "Filters",
				});
				setTitle("Water filters");
				break;

			default:
				break;
		}

		setTags(
			(
				CATEOGRIES.find((category) => category.id === productType_)?.tags || ""
			).split(", "),
		);

		if (defaultTags) {
			setSelectedTags(defaultTags.split(", "));
		}
	}, [categoryId]);

	const toggleTagSelection = useCallback((tag: string) => {
		setSelectedTags((prevSelectedTags) =>
			prevSelectedTags?.includes(tag)
				? prevSelectedTags?.filter((t) => t !== tag)
				: [...prevSelectedTags, tag],
		);
	}, []);

	const toggleContaminantSelection = useCallback((contaminantId: string) => {
		setSelectedContaminants((prevSelectedContaminants) =>
			prevSelectedContaminants?.includes(contaminantId)
				? prevSelectedContaminants?.filter((id) => id !== contaminantId)
				: [...prevSelectedContaminants, contaminantId],
		);
	}, []);

	// Memoize the ItemPreviewCard component
	const MemoizedItemPreviewCard = React.memo(ItemPreviewCard);

	const filteredItems = useMemo(() => {
		if (!allItems) return [];

		const itemsWithoutDrafts = allItems.filter((item) => !item.is_draft);

		let nextItems = itemsWithoutDrafts;

		// Don't include non-indexed items if tags are selected
		// since they can't be guaranteed to not include / remove the contaminants
		if (selectedContaminants.length > 0) {
			nextItems = itemsWithoutDrafts.filter((item) => item.is_indexed);
		}

		const itemsFilteredByTags = nextItems.filter((item) => {
			if (selectedTags.length === 0) return true;

			const possibleTags = selectedTags.flatMap(
				(tag: string) =>
					TAG_CATEGORY_MAP[tag as keyof typeof TAG_CATEGORY_MAP] || [],
			);

			return possibleTags.some((tag) => item.tags?.includes(tag));
		});

		const itemsFilteredByContaminants = itemsFilteredByTags.filter((item) => {
			if (selectedContaminants.length === 0) return true;

			if (productType === "water") {
				return !item.ingredients?.some((ing: any) =>
					selectedContaminants.some((contaminantId) => {
						const contaminant = CONTAMINANTS.find(
							(contaminant) => contaminant.id === contaminantId,
						);

						// Check for PFAS and Microplastics conditions
						// if (contaminantId === "PFAS" && item.metadata?.pfas !== "No") {
						// 	console.log("PFAS: ", item.metadata?.pfas);
						// 	return true;
						// }

						// if (
						// 	contaminantId === "microplastics" &&
						// 	item.packaging !== "glass"
						// ) {
						// 	console.log("");
						// 	return true;
						// }

						return (
							contaminant &&
							contaminant.supabase_ids &&
							contaminant.supabase_ids.includes(ing?.ingredient_id)
						);
					}),
				);
			} else if (productType === "filter") {
				return selectedContaminants.every((contaminantId) =>
					item.filtered_contaminant_categories?.some(
						(categoryObj: any) =>
							categoryObj.category === contaminantId &&
							categoryObj.percentage > 50,
					),
				);
			}

			return true;
		});

		return itemsFilteredByContaminants;
	}, [selectedTags, selectedContaminants, allItems]);

	const renderItem = useCallback(
		({ item, index }: { item: any; index: number }) => (
			<View
				key={item?.id}
				style={{ width: "46%" }}
				className={`mb-2 ${index < 2 ? "mt-0" : ""}`}
			>
				<MemoizedItemPreviewCard item={item} showFavorite isGeneralListing />
			</View>
		),
		[],
	);

	const keyExtractor = useCallback((item: any, index: number) => item.id, []);

	const renderFilters = useCallback(() => {
		return (
			<View className="flex flex-row flex-wrap w-full justify-start pb-2 px-0 ml-0 gap-2">
				<DropdownMenu
					open={openContaminantDropdown}
					onOpenChange={setOpenContaminantDropdown}
					className=" rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant={
								selectedContaminants.length > 0 ? "secondary" : "outline"
							}
							className={
								selectedContaminants?.length < 1 && openContaminantDropdown
									? "border-pirmary text-primary"
									: ""
							}
							label={`Contaminants ${
								selectedContaminants.length > 0
									? `(${selectedContaminants.length})`
									: ""
							}`}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-96 flex flex-col mt-2 py-2 px-2 roounded-2xl"
						align="start"
					>
						<Muted className="text-muted pl-1 mb-1">
							{productType === "water" ? "Free of:" : "Removes:"}
						</Muted>
						<View className="flex flex-row flex-wrap gap-x-2">
							{(productType === "water"
								? CONTAMINANTS
								: FILTER_CONTAMINANTS
							).map((contaminant, index) => (
								<TouchableOpacity
									key={contaminant.id + index.toString()}
									className={`border rounded-full border-muted px-2 py-1 my-2 ${
										selectedContaminants.includes(contaminant.id)
											? "border-muted border-2"
											: ""
									}`}
									style={{ alignSelf: "flex-start" }}
									onPress={() => toggleContaminantSelection(contaminant.id)}
								>
									<View className="flex flex-row items-center gap-2 px-2">
										<P
											className={
												selectedContaminants.includes(contaminant.id)
													? "text-muted font-bold"
													: "text-muted"
											}
										>
											{contaminant.label}
										</P>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu
					open={openTypeDropdown}
					onOpenChange={setOpenTypeDropdown}
					className="rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant={selectedTags.length > 0 ? "secondary" : "outline"}
							label={`Type ${selectedTags.length > 0 ? `(${selectedTags.length})` : ""}`}
							className={
								selectedTags?.length < 1 && openTypeDropdown
									? "border-primary text-primary"
									: ""
							}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-96 flex flex-row flex-wrap rounded-2xl px-4 gap-x-2 mt-2 py-1"
						align="center"
					>
						{tags.map((tag: string) => (
							<TouchableOpacity
								key={tag}
								className={`border rounded-full border-muted px-2 py-1 my-2 ${
									selectedTags.includes(tag) ? "border-muted border-2" : ""
								}`}
								style={{ alignSelf: "flex-start" }}
								onPress={() => toggleTagSelection(tag)}
							>
								<View className="flex flex-row items-center gap-2 px-2">
									<P
										className={
											selectedTags.includes(tag)
												? "text-muted font-bold"
												: "text-muted"
										}
									>
										{tag}
									</P>
								</View>
							</TouchableOpacity>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</View>
		);
	}, [
		openContaminantDropdown,
		openTypeDropdown,
		selectedContaminants,
		selectedTags,
		tags,
		toggleContaminantSelection,
		toggleTagSelection,
		productType,
	]);

	return (
		<View className="flex-1 md:mt-4 mt-0 w-screen px-4">
			{!subscription ? (
				<View className="px-4">
					<H2>All {title.charAt(0).toLowerCase() + title.slice(1)}</H2>
					<Muted>
						Want to know the best{" "}
						{title.charAt(0).toLowerCase() + title.slice(1)} based on science?
					</Muted>
					<View className="flex flex-row items-center gap-2">
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
				</View>
			) : (
				<View className="pb-4 max-w-sm">
					<H2>All {title.charAt(0).toLowerCase() + title.slice(1)}</H2>
					<Muted>
						Browse and find the best{" "}
						{title.charAt(0).toLowerCase() + title.slice(1)} based on science
						and lab reports. Default sorted by score.
					</Muted>
				</View>
			)}

			{subscription && renderFilters()}

			{filteredItems?.length > 0 ? (
				// <MemoizedFlatList
				// 	data={filteredItems}
				// 	renderItem={renderItem}
				// 	keyExtractor={keyExtractor}
				// 	numColumns={2}
				// 	columnWrapperStyle={{ justifyContent: "space-around", gap: 8 }}
				// 	contentContainerStyle={{ paddingTop: 0, paddingBottom: 0, gap: 16 }}
				// 	showsVerticalScrollIndicator={false}
				// 	// ListEmptyComponent={loading ? renderLoader() : null}
				// 	ListHeaderComponent={<View style={{ height: 1 }} />}
				// 	initialNumToRender={30}
				// 	maxToRenderPerBatch={30}
				// 	windowSize={30}
				// 	removeClippedSubviews={false}
				// 	scrollToOverflowEnabled={false}
				// />

				<FlatList
					data={filteredItems}
					renderItem={({ item, index }) => (
						<View
							key={item?.id}
							style={{ width: "46%" }}
							className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
						>
							<ItemPreviewCard
								item={item}
								showFavorite
								isAuthUser={isAuthUser}
								isGeneralListing
							/>
						</View>
					)}
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
					removeClippedSubviews
					scrollToOverflowEnabled={false}
				/>
			) : (
				<View className="flex-1 justify-center items-center">
					<P className="text-center">
						No items match this criteria. Try removing some filters
					</P>
				</View>
			)}
		</View>
	);
}
