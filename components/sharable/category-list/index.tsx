import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { useDataProvider } from "@/context/data-provider";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function CategoryList({
	showComingSoon = true,
	limit = 20,
}: {
	showComingSoon?: boolean;
	limit?: number;
}) {
	const { categories } = useDataProvider();
	const { mutedColor, dropShadowStyles } = useColorScheme();
	const router = useRouter();
	const showToast = useToast();
	const [isExpanded, setIsExpanded] = useState(false);

	const visibleCategories = isExpanded
		? categories.filter((category) => category.status === "active")
		: categories
				.filter((category) => category.status === "active")
				.slice(0, limit);

	const handlePressComingSoon = (category: any) => {
		showToast("Soon");
	};

	const handleSeeAll = () => {
		setIsExpanded(true);
	};

	const handleShowLess = () => {
		setIsExpanded(false);
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
							key={index}
							className="flex justify-center rounded-2xl pr-6 bg-card"
							style={{
								maxHeight: 60,
								width: "100%",
								...dropShadowStyles,
							}}
						>
							<TouchableOpacity
								onPress={() => {
									if (category.status === "coming_soon") {
										handlePressComingSoon(category);
									} else {
										router.push(
											`/search/top-rated/${category.ref}?backPath=top`,
										);
									}
								}}
							>
								<View className="flex flex-row items-center px-4 justify-between w-full">
									<View className="flex flex-row items-center gap-4">
										<View className="overflow-hidden ">
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
										{category.status === "coming_soon" ? (
											<Muted>Comming soon</Muted>
										) : (
											<Ionicons
												name="chevron-forward"
												size={18}
												className="mb-6"
												color={mutedColor}
											/>
										)}
									</View>
								</View>
							</TouchableOpacity>
						</View>
					))}
			</View>
			{categories.length > limit && (
				<TouchableOpacity
					onPress={isExpanded ? handleShowLess : handleSeeAll}
					className="flex justify-center items-center rounded-2xl mt-4"
				>
					<Muted>{isExpanded ? "Show Less" : "Show all"}</Muted>
				</TouchableOpacity>
			)}
		</View>
	);
}
