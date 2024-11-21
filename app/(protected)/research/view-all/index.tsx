import Ionicons from "@expo/vector-icons/Ionicons";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import {
	fetchInProgressThings,
	fetchTestedThings,
	fetchUntestedThings,
} from "@/actions/labs";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import StickyHeader from "@/components/sharable/sticky-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { P } from "@/components/ui/typography";
import { ITEM_TYPES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProductTestingScreen() {
	const global = useGlobalSearchParams();
	const { backgroundColor, mutedForegroundColor } = useColorScheme();

	const [products, setProducts] = useState<any[]>([]);
	const [pageTitle, setPageTitle] = useState("");
	const [subTitle, setSubTitle] = useState("");
	const [search, setSearch] = useState("");
	const [openFilters, setOpenFilters] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);

	const status = Array.isArray(global.status)
		? global.status[0]
		: global.status;
	const type = Array.isArray(global.type) ? global.type[0] : global.type;

	const pathname = usePathname();

	const handlePageTitle = (status: string, type: string) => {
		let testingStatus = "";
		let subTitle = "";

		switch (status) {
			case "untested":
				testingStatus = "untested";
				subTitle = "Sorted by most requested";
				break;
			case "completed":
				testingStatus = "recently tested";
				subTitle = "Most recently updated reports";
				break;
			case "in_progress":
				testingStatus = "in progress";
				subTitle = "Currenlty in the lab undergoing testing";
				break;
			default:
				testingStatus = "All";
		}

		const title = "All " + testingStatus;

		setPageTitle(title);
		setSubTitle(subTitle);
	};

	useEffect(() => {
		if (pathname === "/research/view-all") {
			const fetchData = async () => {
				handlePageTitle(status, type);

				let data;

				switch (status) {
					case "untested":
						data = await fetchUntestedThings({
							tables: ["items", "water_filters", "tap_water_locations"],
							limit: 100,
						});

						break;
					case "completed":
						data = await fetchTestedThings({
							tables: ["items", "water_filters", "tap_water_locations"],
							limit: 100,
						});
						break;
					case "in_progress":
						data = await fetchInProgressThings({
							type: ["bottled_water", "filter", "tap_water"],
							limit: 1000,
						});

						break;
					default:
						data = await fetchInProgressThings({
							type: ["bottled_water", "filter", "tap_water"],
							limit: 1000,
						});
				}

				setProducts(data || []);
			};

			fetchData();
		}
	}, [pathname, status, type]);

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(search.toLowerCase()) &&
			(selected ? product.type === selected : true),
	);

	const renderFilters = useCallback(() => {
		return (
			<View className="flex flex-row flex-wrap w-36 justify-end pb-2 px-0 ml-0 gap-2">
				<DropdownMenu
					open={openFilters}
					onOpenChange={(isOpen) => setOpenFilters(isOpen)}
					className="rounded-xl "
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className={`${selected && openFilters ? "border-pirmary text-primary" : ""} w-36`}
							label={`${selected ? ITEM_TYPES.find((item) => item.typeId === selected)?.categoryLabel : "All"}`}
							size="sm"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-72 flex flex-col mt-2 py-2 px-4 roounded-2xl"
						align="end"
					>
						<View className="flex flex-row flex-wrap gap-x-2">
							{ITEM_TYPES.map((item, index) => (
								<TouchableOpacity
									key={item.id + index.toString()}
									className={`border rounded-full px-2 py-1 my-2 ${
										selected === item.typeId
											? "border-accent bg-accent"
											: "border-muted"
									}`}
									style={{ alignSelf: "flex-start" }}
									onPress={() =>
										setSelected(selected === item.typeId ? null : item.typeId)
									}
								>
									<View className="flex flex-row items-center gap-2 px-2">
										<P
											className={
												selected === item.id
													? "text-background font-bold"
													: "text-foreground"
											}
										>
											{item.categoryLabel}
										</P>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</DropdownMenuContent>
				</DropdownMenu>
			</View>
		);
	}, [selected, openFilters]);

	return (
		<View
			className="justify-between px-6 mt-6 pb-10"
			style={{ backgroundColor }}
		>
			<StickyHeader
				title={pageTitle}
				description={subTitle}
				hideMargin
				icon="plus"
				// @ts-ignore
				path="/contributeModal?kind=new_item"
			/>
			<View className="h-2" />
			<View className="flex flex-row items-center justify-between ">
				<View className="my-2 flex-row items-center flex-1 mr-4">
					<Input
						placeholder="Search"
						className="p-3 pl-12 mb-0 w-full rounded-full border border-gray-300"
						value={search}
						onChangeText={setSearch}
					/>

					<View
						className="flex flex-row gap-4 z-20 items-center"
						style={{ position: "absolute", left: 16 }}
					>
						<Ionicons name="search" size={20} color={mutedForegroundColor} />
					</View>
				</View>
				{renderFilters()}
			</View>

			<FlatList
				data={filteredProducts}
				renderItem={({ item }) => (
					<View key={item?.id} style={{ width: "100%" }} className="mb-2 ">
						<ItemPreviewCard
							item={item}
							showFavorite
							isAuthUser={false}
							isGeneralListing
							variation="row"
							imageHeight={80}
							showVotes={status === "untested"}
							showTime={status === "completed"}
							backPath="research"
							hideScore={pathname !== "/research/view-all"}
						/>
					</View>
				)}
				keyExtractor={(item) => item.id}
				numColumns={1}
				contentContainerStyle={{ paddingTop: 0, paddingBottom: 120, gap: 2 }}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={<View style={{ height: 1 }} />}
				initialNumToRender={8}
				maxToRenderPerBatch={4}
				windowSize={5}
				removeClippedSubviews
				scrollToOverflowEnabled={false}
			/>
		</View>
	);
}
