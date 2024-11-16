import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

import { getBrandAndProducts } from "@/actions/companies";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import Skeleton from "@/components/sharable/skeleton";
import { H2, Muted } from "@/components/ui/typography";
import { BLUR_IMAGE_PLACEHOLDER } from "@/lib/constants/images";

export function BrandForm({ id }: { id: string }) {
	const [brand, setBrand] = useState<any>(null);
	const [company, setCompany] = useState<any>(null);
	const [products, setProducts] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBrand = async () => {
			const brand = await getBrandAndProducts(id);
			if (brand) {
				setBrand(brand);
				setProducts(brand?.products);
				setCompany(brand?.company);
			} else {
				setError("No brand found");
			}
			setLoading(false);
		};
		fetchBrand();
	}, [id]);

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

	if (error) {
		return (
			<View className="flex items-center justify-center h-full">
				<H2>Error: {error}</H2>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View className="p-5 rounded-lg flex flex-col items-center justify-start w-full">
				<View className="w-40 h-40 rounded-2xl mb-4 shadow-md flex overflow-hidden">
					<Image
						source={{ uri: brand?.image || BLUR_IMAGE_PLACEHOLDER }}
						style={{ width: "100%", height: "100%" }}
						contentFit="contain"
					/>
				</View>

				<H2>{brand?.name}</H2>
				<View className="flex flex-row flex-wrap">
					<Muted>{brand?.companyName}</Muted>
				</View>

				{/* <P className="mb-4">{company?.description}</P> */}

				<View className="h-4" />

				{products && products.length > 0 && (
					<FlatList
						data={products}
						numColumns={2}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<View className="flex-1 m-2">
								<ItemPreviewCard
									item={item}
									showFavorite
									isGeneralListing
									variation="row"
									imageHeight={80}
								/>
							</View>
						)}
						contentContainerStyle={{ paddingHorizontal: 8 }}
						columnWrapperStyle={{ justifyContent: "space-between" }}
						className="w-full"
						scrollEnabled={false}
					/>
				)}
			</View>
		</ScrollView>
	);
}
