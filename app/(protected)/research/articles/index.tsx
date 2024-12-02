import { Image } from "expo-image";
import { Link } from "expo-router";
import { useContext } from "react";
import { FlatList, View } from "react-native";

import Skeleton from "@/components/sharable/skeleton";
import StickyHeader from "@/components/sharable/sticky-header";
import { P } from "@/components/ui/typography";
import { BlogContext } from "@/context/blogs-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ArticlesScreen() {
	const { colorScheme } = useColorScheme();
	const { blogs } = useContext(BlogContext);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<View
			className="justify-between px-4 mt-6 pb-10 flex-1"
			style={{ backgroundColor }}
		>
			<StickyHeader
				title="Articles"
				description="Stay updated with the latest research and lab testing"
				hideMargin
			/>

			<View className="mt-4">
				{blogs.length === 0 ? (
					<FlatList
						data={[1, 2, 3, 4, 5, 6]}
						numColumns={2}
						columnWrapperStyle={{ justifyContent: "space-between" }}
						contentContainerStyle={{
							paddingVertical: 5,
							paddingBottom: 44,
						}}
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
						contentContainerStyle={
							{
								// paddingBottom: 270,
							}
						}
						showsVerticalScrollIndicator={false}
						ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
						renderItem={({ item }) => (
							<Link
								href={`/search/article/${item.id}`}
								className="flex flex-col"
								style={{ width: "48%", marginBottom: 12 }}
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
											className="mt-2 text-left"
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
