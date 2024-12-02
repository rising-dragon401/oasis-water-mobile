import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { getStores } from "@/actions/stores";
import { Muted } from "@/components/ui/typography";

export default function StoreList() {
	const router = useRouter();

	const [stores, setStores] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchStores = async () => {
			const stores = await getStores();
			setStores(stores);
			setLoading(false);
		};
		fetchStores();
	}, []);

	return (
		<View className="flex flex-col w-full">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
				}}
			>
				{loading
					? Array.from({ length: 5 }).map((_, index) => (
							<View
								key={index}
								className="flex-col items-center justify-center bg-card border border-border rounded-lg overflow-hidden w-24 h-16"
								style={{ marginHorizontal: 5, backgroundColor: "#e0e0e0" }}
							>
								{/* Skeleton content */}
							</View>
						))
					: [...stores, { id: "show-more", isShowMore: true }].map((store) => (
							<TouchableOpacity
								key={store.id}
								onPress={() => {
									if (store.isShowMore) {
										// Handle show more action
									} else {
										router.push(`/search/store/${store.id}`);
									}
								}}
								className="flex-col items-center justify-center bg-card border border-border rounded-lg overflow-hidden w-24 h-16"
								style={{ marginHorizontal: 5 }}
							>
								{store.isShowMore ? (
									<Muted className="text-center">More soon</Muted>
								) : (
									<Image
										source={{ uri: store?.image }}
										alt={store?.name}
										style={{
											width: "100%",
											height: "100%",
										}}
									/>
								)}
							</TouchableOpacity>
						))}
			</ScrollView>
		</View>
	);
}
