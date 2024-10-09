import Skeleton from "@/components/sharable/skeleton";
import { H1, Muted, P } from "@/components/ui/typography";
import { BlogContext } from "@/context/blogs-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useContext } from "react";
import { FlatList, View } from "react-native";

export default function ResearchScreen() {
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const { blogs } = useContext(BlogContext);

	return (
		<View className="flex-1  justify-between px-4" style={{ backgroundColor }}>
			<H1 className="mt-24">Research</H1>
			<Muted>
				Stay current with scientific advances in product health and safety
			</Muted>

			<View className="flex-1 flex-col mt-4">
				{blogs.length === 0 ? (
					<FlatList
						data={[1, 2, 3, 4, 5, 6]}
						numColumns={2}
						columnWrapperStyle={{ justifyContent: "space-between" }}
						contentContainerStyle={{ paddingVertical: 5 }}
						ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
						renderItem={() => (
							<View style={{ width: "48%" }}>
								<Skeleton
									width={180}
									height={150}
									style={{ borderRadius: 20, width: "100%" }}
								/>
								<Skeleton
									width={180}
									height={20}
									style={{ marginTop: 8, borderRadius: 4, width: "100%" }}
								/>
								<Skeleton
									width={144}
									height={20}
									style={{ marginTop: 4, borderRadius: 4, width: "80%" }}
								/>
							</View>
						)}
					/>
				) : (
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
				)}
			</View>
		</View>
	);
}
