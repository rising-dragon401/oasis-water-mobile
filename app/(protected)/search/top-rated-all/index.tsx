import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TopRatedScreen() {
	const { colorScheme, mutedColor } = useColorScheme();
	const router = useRouter();
	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<ScrollView style={{ backgroundColor }}>
			<View className="justify-between px-6 mt-6 pb-14">
				<H1>Top Rated Products</H1>
				<View className="flex flex-col gap-4 w-full bg-card border border-border rounded-xl mt-6">
					{CATEGORIES.map((category, index) => (
						<View
							key={category.id}
							className="flex justify-center rounded-2xl border-b border-muted"
							style={{
								maxHeight: 60,
								width: "100%",
								borderBottomWidth: index === CATEGORIES.length - 1 ? 0 : 1,
							}}
						>
							<Link href={`/search/top-rated/${category.id}`}>
								<View className="flex flex-row items-center px-4 justify-between w-full">
									<View className="flex flex-row items-center gap-4">
										<View className="rounded-full overflow-hidden ">
											<Image
												source={{ uri: category.image }}
												alt={category.title}
												style={{
													width: 36,
													height: 36,
												}}
												contentFit="cover"
											/>
										</View>
										<View className="flex flex-col gap-1 h-full">
											<P className=" text-xl">{category.title}</P>
										</View>
									</View>
									<View className="flex flex-col justify-end items-center gap-2 h-full mr-2">
										<Ionicons
											name="chevron-forward"
											size={18}
											color={mutedColor}
										/>
										<View className="h-3" />
									</View>
								</View>
							</Link>
						</View>
					))}
				</View>

				<View className="mt-36 px-6">
					<Button
						label="Request new category"
						variant="outline"
						// @ts-ignore
						onPress={() => router.push("/contributeModal?kind=new_item")}
					/>
				</View>
			</View>
		</ScrollView>
	);
}
