import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";

import { H1, H4 } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TopRatedScreen() {
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<View
			className="flex-1 justify-between px-4 mt-6 pb-10"
			style={{ backgroundColor }}
		>
			<H1>Categories</H1>

			<View className="flex-1 flex-col mt-4">
				<FlatList
					data={CATEGORIES.sort(
						(a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0),
					)}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 8,
					}}
					columnWrapperStyle={{ justifyContent: "space-between" }}
					ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
					renderItem={({ item: category, index }) => (
						<View className="mb-4 w-[48%] py-2 rounded-xl">
							<Link
								key={category.id + index.toString()}
								href={`/search/top-rated/${category.typeId}?tags=${category.selectedTags}`}
								className=""
							>
								<View className="relative w-full aspect-square flex items-center justify-center rounded-2xl bg-card">
									<Image
										source={{ uri: category.image }}
										alt={category.title}
										style={{
											width: "70%",
											height: "80%",
											borderRadius: 4,
										}}
									/>
								</View>
							</Link>
							<H4 className="text-left">{category.title}</H4>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</View>
	);
}
