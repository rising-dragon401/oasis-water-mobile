import { H1, Muted, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";
import { getBlogs } from "actions/blogs";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function TopRatedScreen() {
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const [blogs, setBlogs] = useState<any[]>([]);

	useEffect(() => {
		getBlogs().then(setBlogs);
	}, []);

	return (
		<View
			className="flex-1 justify-between px-4 mt-6"
			style={{ backgroundColor }}
		>
			<H1>Top rated</H1>
			<Muted>
				Discover the best bottled waters and filters based lab tested data.
			</Muted>

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
					renderItem={({ item: category }) => (
						<View className="mb-4 w-[48%] py-2 rounded-xl">
							<Link
								key={category.id}
								href={`/search/top-rated/${category.id}`}
								className=""
							>
								<View className="relative w-full aspect-square flex items-center justify-center rounded-xl bg-card">
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
							<P className="text-left text-lg font-medium">{category.title}</P>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</View>
	);
}
