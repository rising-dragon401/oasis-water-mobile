import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

import { getStoreAndProducts } from "@/actions/stores";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import Skeleton from "@/components/sharable/skeleton";
import { Button } from "@/components/ui/button";
import { H2, Muted } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { BLUR_IMAGE_PLACEHOLDER } from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";

export function StoreForm({ id }: { id: string }) {
	const { hasActiveSub } = useSubscription();
	const { backgroundColor } = useColorScheme();
	const router = useRouter();
	const [store, setStore] = useState<any>(null);
	const [products, setProducts] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStore = async () => {
			console.log("fetching ", id);
			const store = await getStoreAndProducts(id);
			if (store) {
				setStore(store);
				if (hasActiveSub) {
					setProducts(handleSortRatings(store?.items));
				} else {
					setProducts(store?.items);
				}
			} else {
				setError("No store found");
			}
			setLoading(false);
		};
		fetchStore();
	}, [id]);

	const handleSortRatings = (products: any) => {
		return products.sort((a: any, b: any) => b.score - a.score);
	};

	if (loading) {
		return (
			<View className="flex px-4">
				<View className="p-5 rounded-lg flex flex-col items-center justify-start w-full">
					<Skeleton
						width={160}
						height={160}
						style={{ borderRadius: 8, marginBottom: 16 }}
					/>

					<View className="flex flex-row flex-wrap justify-between w-full gap-2">
						{Array.from({ length: 4 }).map((_, index) => (
							<Skeleton
								key={index}
								width={160}
								height={160}
								style={{ margin: 4 }}
							/>
						))}
					</View>
				</View>
			</View>
		);
	}

	console.log("hasActiveSub", hasActiveSub);

	if (error) {
		return (
			<View className="flex items-center justify-center h-full">
				<H2>Error: {error}</H2>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View className="p-5 rounded-lg flex flex-col items-center justify-start w-full relative">
				<View className="w-32 h-32 !rounded-full mb-4 shadow-md flex overflow-hidden ">
					<Image
						source={{ uri: store?.image || BLUR_IMAGE_PLACEHOLDER }}
						contentFit="cover"
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 12,
						}}
						className="w-full h-full rounded-2xl shadow-md"
					/>
				</View>

				<H2>{store?.name}</H2>
				<View className="flex flex-row flex-wrap">
					<Muted>{store?.companyName}</Muted>
				</View>

				{/* <P className="mb-4">{company?.description}</P> */}

				<View className="h-4" />

				{products && products.length > 0 && (
					<FlatList
						data={products}
						numColumns={1}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<ItemPreviewCard
								item={item}
								isGeneralListing
								variation="row"
								imageHeight={80}
							/>
						)}
						contentContainerStyle={{ paddingHorizontal: 8 }}
						className="w-full flex-1 gap-2"
						scrollEnabled={false}
						ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					/>
				)}

				{!hasActiveSub && (
					<View className="absolute bottom-20 w-full flex items-center justify-center">
						<Button
							className="w-64 !h-16 mt-2 !py-3 !px-4 shadow-lg"
							variant="default"
							label="Unlock top rated"
							icon={<Octicons name="lock" size={16} color={backgroundColor} />}
							iconPosition="left"
							onPress={() => {
								router.push({
									pathname: "/subscribeModal",
									params: {
										path: "search/store",
										feature: "store",
									},
								});
							}}
						/>
					</View>
				)}
			</View>
		</ScrollView>
	);
}
