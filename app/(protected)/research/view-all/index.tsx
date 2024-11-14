import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import {
	fetchInProgressItems,
	fetchTestedThings,
	fetchUntestedThings,
} from "@/actions/labs";
// import { fetchProductTestData } from "@/actions/labs";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import StickyHeader from "@/components/sharable/sticky-header";
import { Input } from "@/components/ui/input";
import { ITEM_TYPES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProductTestingScreen() {
	const global = useGlobalSearchParams();

	const { backgroundColor } = useColorScheme();

	const [products, setProducts] = useState<any[]>([]);
	const [pageTitle, setPageTitle] = useState("");
	const [subTitle, setSubTitle] = useState("");
	const [search, setSearch] = useState("");
	const status = Array.isArray(global.status)
		? global.status[0]
		: global.status;
	const type = Array.isArray(global.type) ? global.type[0] : global.type;

	const handlePageTitle = (status: string, type: string) => {
		let testingStatus = "";
		let thingName = "items";
		let subTitle = "";

		console.log("type", type);
		console.log("status", status);

		switch (status) {
			case "untested":
				testingStatus = "Untested";
				subTitle = "Sorted by most requested";
				break;
			case "completed":
				testingStatus = "Tested";
				subTitle = "Sorted by most recent";
				break;
			case "in_progress":
				testingStatus = "In progress";
				subTitle = "Currenlty in the lab undergoing testing";
				break;
			default:
				testingStatus = "All";
		}

		const idenfifiedThing = ITEM_TYPES.find((item) => item.id === type);

		if (idenfifiedThing) {
			thingName = idenfifiedThing.name;
		}

		console.log("testingStatus", testingStatus);
		console.log("thingName", thingName);

		const title = testingStatus + " " + thingName + "s";

		setPageTitle(title);
		setSubTitle(subTitle);
	};

	useEffect(() => {
		const fetchData = async () => {
			const pageTitle = handlePageTitle(status, type);

			const idenfifiedThing = ITEM_TYPES.find((item) => item.id === type);

			const table = idenfifiedThing?.tableName;
			const productType = idenfifiedThing?.typeId;

			if (!table || !productType) return;

			let data;

			console.log("status", status);

			switch (status) {
				case "untested":
					data = await fetchUntestedThings({
						table,
						limit: 1000,
					});

					break;
				case "completed":
					data = await fetchTestedThings({
						table,
						limit: 1000,
					});
					break;
				default:
					data = await fetchInProgressItems({
						type: productType,
						limit: 1000,
					});
			}

			setProducts(data);
		};

		fetchData();
	}, [status, type]);

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<View
			className="justify-between px-4 mt-6 pb-10"
			style={{ backgroundColor }}
		>
			<StickyHeader
				title={pageTitle}
				description={subTitle}
				hideMargin
				icon="plus"
				path="requestModal"
			/>
			<View className="h-2" />
			<View className="my-2 mr-4">
				<Input
					placeholder="Search"
					className="border border-gray-300 p-3 pl-5 mb-0 rounded-full w-full"
					value={search}
					onChangeText={setSearch}
				/>
			</View>
			<FlatList
				data={filteredProducts}
				renderItem={({ item }) => (
					<View key={item?.id} style={{ width: "100%" }} className="mb-2">
						<ItemPreviewCard
							item={item}
							showFavorite
							isAuthUser={false}
							isGeneralListing
							variation="row"
							imageHeight={80}
							showVotes={status === "untested"}
							backPath="research"
						/>
					</View>
				)}
				keyExtractor={(item) => item.id}
				numColumns={1}
				contentContainerStyle={{ paddingTop: 0, paddingBottom: 0, gap: 2 }}
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
