import { H1, Muted, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { getBlogs } from "actions/blogs";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function ResearchScreen() {
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const [blogs, setBlogs] = useState<any[]>([]);

	useEffect(() => {
		getBlogs().then(setBlogs);
	}, []);

	return (
		<View className="flex-1  justify-between px-4" style={{ backgroundColor }}>
			<H1 className="mt-24">Latest research</H1>
			<Muted>
				Stay current with scientific advances in product health and safety
			</Muted>

			<View className="flex-1 flex-col mt-4">
				<FlatList
					data={blogs}
					numColumns={2}
					columnWrapperStyle={{ justifyContent: "space-between" }}
					contentContainerStyle={{ paddingVertical: 5 }}
					ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
					renderItem={({ item }) => (
						<Link
							href={`/search/article/${item.id}`}
							className="flex flex-col"
							style={{ width: "48%" }}
						>
							<View>
								<Image
									source={{ uri: item.cover }}
									alt={item.attributes.title}
									style={{
										width: "100%",
										aspectRatio: 1.25,
										borderRadius: 20,
									}}
								/>

								<View>
									<P
										className="mt-1 text-left"
										numberOfLines={2}
										ellipsizeMode="tail"
									>
										{item.attributes.title}
									</P>
								</View>
							</View>
						</Link>
					)}
				/>
			</View>
		</View>
	);
}
