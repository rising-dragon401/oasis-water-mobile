import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, View } from "react-native";

import { getCompanyAndProducts } from "@/actions/companies";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import { H1, P } from "@/components/ui/typography";
import { BLUR_IMAGE_PLACEHOLDER } from "@/lib/constants/images";

export function CompanyForm({ companyName }: { companyName: string }) {
	const [company, setCompany] = useState<any>(null);
	const [products, setProducts] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCompany = async () => {
			const company = await getCompanyAndProducts(companyName);
			if (company && company.length > 0) {
				setCompany(company[0]);
				setProducts(company[0].products);
			} else {
				setError("No company found");
			}
			setLoading(false);
		};
		fetchCompany();
	}, [companyName]);

	console.log("company: ", company);

	if (loading) {
		return <H1>Loading...</H1>;
	}

	if (error) {
		return <H1>Error: {error}</H1>;
	}

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View className="p-5 rounded-lg flex flex-col items-center justify-start w-full">
				<Image
					source={{ uri: company.image || BLUR_IMAGE_PLACEHOLDER }}
					className="w-40 h-40 rounded-lg mb-4 shadow-md"
				/>

				<H1>{company.name}</H1>

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
