import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import SectionHeader from "../section-header";

import { getStores } from "@/actions/stores";
import { Muted } from "@/components/ui/typography";

export default function StoreList() {
	const router = useRouter();

	const [stores, setStores] = useState<any[]>([]);

	useEffect(() => {
		const fetchStores = async () => {
			const stores = await getStores();
			setStores(stores);
		};
		fetchStores();
	}, []);

	return (
		<View className="flex flex-col w-full">
			<SectionHeader title="Stores" />
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
				}}
			>
				{[...stores, { id: "show-more", isShowMore: true }].map((store) => (
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
