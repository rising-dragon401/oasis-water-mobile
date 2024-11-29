import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";
import { useDataProvider } from "@/context/data-provider";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function CategoryList() {
	const { categories } = useDataProvider();
	const { shadowColor, mutedColor } = useColorScheme();
	const router = useRouter();
	const showToast = useToast();
	const [isExpanded, setIsExpanded] = useState(false);

	const visibleCategories = isExpanded ? categories : categories.slice(0, 12);

	const handlePressComingSoon = (category: any) => {
		showToast("Soon");
	};

	const handleSeeAll = () => {
		// @ts-ignore
		router.push("/(protected)/search/top?backPath=/search");
	};

	return (
		<View className="flex flex-col w-full">
			<View className="flex flex-col flex-wrap gap-y-4 gap-x-4 w-full justify-center">
				{visibleCategories
					.filter(
						(category) =>
							category.status === "active" || category.status === "coming_soon",
					)
					.map((category, index) => (
						<View
							className="flex justify-center rounded-2xl bg-card pr-6 border border-border"
							style={{
								maxHeight: 60,
								width: "100%",
								// shadowColor,
								// shadowOffset: { width: 0, height: 1 },
								// shadowOpacity: 0.2,
								// shadowRadius: 2,
							}}
						>
							<TouchableOpacity
								onPress={() => router.push(`/search/top-rated/${category.ref}`)}
							>
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
										<View className="flex flex-col gap-1 h-full flex-1">
											<P className="text-xl">{category.label}</P>
										</View>
									</View>
									<View className="flex flex-col justify-end items-center gap-2 h-full mr-6">
										<Ionicons
											name="chevron-forward"
											size={18}
											color={mutedColor}
										/>
										<View className="h-3" />
									</View>
								</View>
							</TouchableOpacity>
						</View>
					))}
			</View>
		</View>
	);
}
