import { Octicons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import ItemPreviewCard from "./item-preview-card";
import Skeleton from "./skeleton";

import { getFilters } from "@/actions/filters";
import { getItems } from "@/actions/items";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { H2, P } from "@/components/ui/typography";
import { useDataProvider } from "@/context/data-provider";
import { useSubscription } from "@/context/subscription-provider";
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
	{
		id: "PFAS",
		supabase_ids: [95, 96, 97, 98, 99, 69],
		label: "PFAS",
	},
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

export default function RankingList({ categoryId }: { categoryId: string }) {
	const { uid, user } = useUserProvider();
	const { hasActiveSub } = useSubscription();
	const { categories } = useDataProvider();
	const router = useRouter();
	const navigation = useNavigation();
	const { backgroundColor, iconColor, accentColor } = useColorScheme();
	const params = useLocalSearchParams<{ tags?: string; catId?: string }>();
	const { tags: defaultTags } = params;

	const [loading, setLoading] = useState(true);
	const [allItems, setAllItems] = useState<any[]>([]);
	const [title, setTitle] = useState<string>("");
	const [openContaminantDropdown, setOpenContaminantDropdown] = useState(false);
	const [openTypeDropdown, setOpenTypeDropdown] = useState(false);
	const [tags, setTags] = useState<any[]>([]);
	const [categoryImage, setCategoryImage] = useState<string>("");
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
		if (hasActiveSub && uid) {
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
			setLoading(false);
		} else {
			setAllItems(categorizedData);
			setLoading(false);
		}
	};

	// Fetch items based on categoryId
	useEffect(() => {
		const category = categories.find((item: any) => item.ref === categoryId);

		const productType_ = category?.productType || "";

		setCategoryImage(category?.image || "");

		setTitle(category?.label || "");

		navigation.setOptions({
			title: category?.title || "",
		});

		setProductType(productType_);

		switch (productType_) {
			case "water":
				fetchAndSetData("bottled_water", () =>
					getItems({
						limit: 500,
						sortMethod: "name",
						type: category?.dbTypes,
						tags: category?.selectedTags,
					}),
				);

				break;
			case "filter":
				fetchAndSetData("filter", () =>
					getFilters({
						limit: 250,
						sortMethod: "name",
						type: category?.dbTypes,
						tags: category?.tags,
					}),
				);

				break;

			default:
				break;
		}

		setTags(
			(
				CATEOGRIES.find((category) => category.id === productType_)?.tags || ""
			).split(", "),
		);

		if (defaultTags && defaultTags?.length > 0 && defaultTags !== "undefined") {
			setSelectedTags(defaultTags.split(", "));
		}

		setLoading(false);
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
				// console.log("selectedContaminants", selectedContaminants);

				// PFAS is manually tracked
				if (selectedContaminants.includes("PFAS")) {
					console.log("item.metaadata?.pfas", item.metaadata?.pfas);
					if (item.metadata?.pfas !== "No") {
						return false;
					} else {
						return true;
					}
				} else {
					// check for contaminants present in ingredients like normal
					return !item.ingredients?.some((ing: any) =>
						selectedContaminants.some((contaminantId) => {
							const contaminant = CONTAMINANTS.find(
								(contaminant) => contaminant.id === contaminantId,
							);

							return (
								contaminant &&
								contaminant.supabase_ids &&
								contaminant.supabase_ids.includes(ing?.ingredient_id)
							);
						}),
					);
				}
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

	const renderFilters = useCallback(() => {
		const handleDropdownOpenChange = (
			setOpenFunction: (open: boolean) => void,
			isOpen: boolean,
		) => {
			if (!hasActiveSub) {
				router.push({
					pathname: "/subscribeModal",
					params: {
						path: "search/top-rated",
						feature: "top-rated",
						productType,
					},
				});
			} else {
				setOpenFunction(isOpen);
			}
		};

		return (
			<View
				className={`flex flex-row flex-wrap w-full justify-start pb-2 px-0 ml-0 gap-2 `}
			>
				<DropdownMenu
					open={openContaminantDropdown}
					onOpenChange={(isOpen) =>
						handleDropdownOpenChange(setOpenContaminantDropdown, isOpen)
					}
					className="rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							className={
								selectedContaminants?.length < 1 && openContaminantDropdown
									? "border-accent text-accent"
									: "!text-accent"
							}
							label={`${productType === "water" ? "Contaminants" : "Removes"} ${
								selectedContaminants.length > 0
									? `(${selectedContaminants.length})`
									: ""
							}`}
							icon={
								<Ionicons
									name="chevron-down-outline"
									size={14}
									color={iconColor}
								/>
							}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-96 flex flex-col mt-2 py-2 px-2 roounded-2xl"
						align="start"
					>
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
													? "text-muted-foreground font-bold"
													: "text-muted-foreground"
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
				{/* <DropdownMenu
					open={openContaminantDropdown}
					onOpenChange={(isOpen) =>
						handleDropdownOpenChange(setOpenContaminantDropdown, isOpen)
					}
					className="rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							className={
								selectedContaminants?.length < 1 && openContaminantDropdown
									? "border-accent text-accent"
									: "!text-accent"
							}
							label={`Price ${
								selectedContaminants.length > 0
									? `(${selectedContaminants.length})`
									: ""
							}`}
							icon={
								<Ionicons
									name="chevron-down-outline"
									size={14}
									color={iconColor}
								/>
							}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-96 flex flex-col mt-2 py-2 px-2 roounded-2xl"
						align="start"
					/>
				</DropdownMenu>
				<DropdownMenu
					open={openContaminantDropdown}
					onOpenChange={(isOpen) =>
						handleDropdownOpenChange(setOpenContaminantDropdown, isOpen)
					}
					className="rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							className={
								selectedContaminants?.length < 1 && openContaminantDropdown
									? "border-accent text-accent"
									: "!text-accent"
							}
							label={`Store ${
								selectedContaminants.length > 0
									? `(${selectedContaminants.length})`
									: ""
							}`}
							icon={
								<Ionicons
									name="chevron-down-outline"
									size={14}
									color={iconColor}
								/>
							}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-96 flex flex-col mt-2 py-2 px-2 roounded-2xl"
						align="start"
					/>
				</DropdownMenu>
				<DropdownMenu
					open={openContaminantDropdown}
					onOpenChange={(isOpen) =>
						handleDropdownOpenChange(setOpenContaminantDropdown, isOpen)
					}
					className="rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							className={
								selectedContaminants?.length < 1 && openContaminantDropdown
									? "border-accent text-accent"
									: "!text-accent"
							}
							label={`Country ${
								selectedContaminants.length > 0
									? `(${selectedContaminants.length})`
									: ""
							}`}
							icon={
								<Ionicons
									name="chevron-down-outline"
									size={14}
									color={iconColor}
								/>
							}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-96 flex flex-col mt-2 py-2 px-2 roounded-2xl"
						align="start"
					/>
				</DropdownMenu> */}

				{/* <DropdownMenu
					open={openTypeDropdown}
					onOpenChange={(isOpen) =>
						handleDropdownOpenChange(setOpenTypeDropdown, isOpen)
					}
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
				</DropdownMenu> */}
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

	const renderLoader = () => (
		<>
			{Array(10)
				.fill(0)
				.map((_, index) => (
					<>
						<Skeleton key={`loader-${index}`} width="100%" height={80} />
						<View style={{ height: 10 }} />
					</>
				))}
		</>
	);

	return (
		<View className="flex-1 md:mt-4 mt-0 w-screen px-6">
			<H2> Top rated {title.toLowerCase()} </H2>

			<View className="pb-2">{renderFilters()}</View>

			{loading ? renderLoader() : null}
			{filteredItems?.length > 0 ? (
				<View className="flex-1 relative">
					<FlatList
						data={filteredItems}
						renderItem={({ item }) => (
							<View key={item?.id} style={{ width: "100%" }} className="mb-2">
								<ItemPreviewCard
									item={item}
									isAuthUser={isAuthUser}
									isGeneralListing
									variation="row"
									imageHeight={80}
									showShadow
								/>
							</View>
						)}
						keyExtractor={(item) => item.id}
						numColumns={1}
						contentContainerStyle={{
							paddingTop: 0,
							paddingBottom: 100,
							gap: 2,
						}}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={loading ? renderLoader() : null}
						ListHeaderComponent={<View style={{ height: 1 }} />}
						ListFooterComponent={
							<Button
								label="Request a product"
								variant="outline"
								onPress={() =>
									// @ts-ignore
									router.push("/contributeModal?kind=new_item")
								}
								className="mt-4 !h-16"
							/>
						}
						initialNumToRender={8}
						maxToRenderPerBatch={4}
						windowSize={5}
						removeClippedSubviews
						scrollToOverflowEnabled={false}
					/>

					{!hasActiveSub && (
						<View
							className="flex-1 relative justify-center items-center"
							style={{ position: "absolute", bottom: 20, width: "100%" }}
						>
							<Button
								className="w-64 !h-16 mt-2 !py-3 !px-4 shadow-lg"
								variant="default"
								label="Unlock ratings"
								icon={
									<Octicons name="lock" size={16} color={backgroundColor} />
								}
								iconPosition="left"
								onPress={() => {
									router.push({
										pathname: "/subscribeModal",
										params: {
											path: "search/top-rated",
											feature: "top-rated",
											productType,
										},
									});
								}}
							/>
						</View>
					)}
				</View>
			) : (
				<View>
					{loading ? (
						renderLoader()
					) : (
						<View className="flex-1 justify-center items-center">
							<P className="text-center">
								No items match this criteria. Try removing some filters
							</P>
						</View>
					)}
				</View>
			)}
		</View>
	);
}
