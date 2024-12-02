import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import Skeleton from "../skeleton";

import { getFeaturedBrands } from "@/actions/companies";

interface Brand {
	id: string;
	name: string;
	image: string;
}

export const BrandsList = () => {
	const router = useRouter();
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loadingBrands, setLoadingBrands] = useState(true);

	useEffect(() => {
		const fetchBrands = async () => {
			const data = await getFeaturedBrands();
			setBrands(data);
			setLoadingBrands(false);
		};
		fetchBrands();
	}, []);

	return (
		<View>
			{loadingBrands ? (
				<FlatList
					data={[1, 2, 3]} // Placeholder items
					horizontal
					renderItem={() => (
						<View className="mr-4">
							<Skeleton width={80} height={80} style={{ borderRadius: 99 }} />
						</View>
					)}
					keyExtractor={(item) => item.toString()}
				/>
			) : (
				<FlatList
					data={[...brands]}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingLeft: 0,
						gap: 24,
					}}
					// style={{ height: 80 }}
					className="overflow-x-scroll "
					renderItem={({ item: brand }) => (
						<TouchableOpacity
							key={brand.id}
							onPress={() => {
								router.push(`/search/brand/${brand.id}`);
							}}
							className="flex-col items-center justify-center gap-2 bg-card border border-border flex rounded-full overflow-hidden w-20 h-20"
						>
							<Image
								source={{
									uri: brand?.image,
								}}
								alt={brand?.name}
								style={{
									width: "100%",
									height: "100%",
								}}
								contentFit="cover"
							/>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id}
				/>
			)}
		</View>
	);
};
