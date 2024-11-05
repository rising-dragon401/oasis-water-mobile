import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

import { getCompanyAndProducts } from "@/actions/companies";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import Skeleton from "@/components/sharable/skeleton";
import { H2, P } from "@/components/ui/typography";
import { BLUR_IMAGE_PLACEHOLDER } from "@/lib/constants/images";

export function CompanyForm({ id }: { id: string }) {
	const [company, setCompany] = useState<any>(null);
	const [products, setProducts] = useState<any>(null);
	const [brands, setBrands] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCompany = async () => {
			const company = await getCompanyAndProducts(id);
			if (company && company.length > 0) {
				setCompany(company[0]);
				setProducts(company[0].products);
				setBrands(company[0].brands);
			} else {
				setError("No company found");
			}
			setLoading(false);
		};
		fetchCompany();
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
					{/* <Skeleton width="75%" height={32} style={{ marginBottom: 16 }} />
					<Skeleton width="100%" height={80} style={{ marginBottom: 16 }} /> */}
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
				{/* <Image
					source={{ uri: company.image || BLUR_IMAGE_PLACEHOLDER }}
					style={{
						width: 72,
						height: 72,
						borderRadius: 10,
						marginRight: 10,
					}}
					contentFit="cover"
					className="rounded-md"
					transition={1000}
				/> */}

				<Image
					source={{ uri: company.image || BLUR_IMAGE_PLACEHOLDER }}
					className="w-40 h-40 rounded-lg mb-4 shadow-md"
					// style={{ borderRadius: 8 }}
					// width
					contentFit="contain"
				/>

				<H2>{company?.name}</H2>
				<View className="flex flex-row flex-wrap">
					{brands?.map((brand: any) => (
						<View className="bg-gray-100 rounded-md p-2 m-1">
							<P>{brand.name}</P>
						</View>
					))}
				</View>
				{/* <Muted>{company?.brand}</Muted> */}

				<P className="mb-4">{company.description}</P>

				{products && products.length > 0 && (
					<FlatList
						data={products}
						numColumns={2}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<View className="flex-1 m-2">
								<ItemPreviewCard item={item} />
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
