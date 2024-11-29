import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { getStores } from "@/actions/stores";
import SectionHeader from "@/components/sharable/section-header";
import { Muted, P } from "@/components/ui/typography";
import { useDataProvider } from "@/context/data-provider";
import { useToast } from "@/context/toast-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TopRatedScreen() {
	const { colorScheme, mutedColor, shadowColor, textColor } = useColorScheme();
	const { categories } = useDataProvider();
	const router = useRouter();
	const showToast = useToast();

	const [stores, setStores] = useState<any[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		const fetchStores = async () => {
			const stores = await getStores();
			setStores(stores);
		};
		fetchStores();
	}, []);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const toggleDropdown = () => {
		setIsExpanded(!isExpanded);
	};

	const handlePressComingSoon = (category: any) => {
		showToast("Coming Soon!");
	};

	const visibleCategories = isExpanded ? categories : categories.slice(0, 20);

	return (
		<ScrollView
			style={{ backgroundColor }}
			contentContainerStyle={{ paddingBottom: 100 }}
		>
			<View className="justify-between px-6 mt-6 pb-14 flex flex-col gap-y-10">
				{/* <View className="flex flex-col gap-0 mb-4">
					<H2 className="max-w-sm">The rated for you</H2> */}
				{/* <Muted>Based on your preferences and most recent data</Muted> */}
				{/* </View> */}

				<View className="flex flex-col">
					<SectionHeader title="Stores" />
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
						}}
					>
						{[...stores, { id: "show-more", isShowMore: true }].map((store) => (
							<TouchableOpacity
								key={store.id}
								onPress={() => {
									if (store.isShowMore) {
										// Handle show more action
									} else {
										router.push(`/search/store/${store.id}`);
									}
								}}
								className="flex-col items-center justify-center bg-card border border-border rounded-lg overflow-hidden w-24 h-16"
								style={{ marginHorizontal: 5 }}
							>
								{store.isShowMore ? (
									<Muted className="text-center">More soon</Muted>
								) : (
									<Image
										source={{ uri: store?.image }}
										alt={store?.name}
										style={{
											width: "100%",
											height: "100%",
										}}
									/>
								)}
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				<View className="flex flex-col">
					<SectionHeader title="Categories" />

					<View className="flex flex-col gap-2">
						{visibleCategories
							.filter(
								(category) =>
									category.status === "active" ||
									category.status === "coming_soon",
							)
							.map((category, index) => (
								<TouchableOpacity
									key={category.id}
									onPress={() => {
										if (category.status === "active") {
											router.push(
												`/search/top-rated/${category.ref}?backPath=top`,
											);
										} else if (category.status === "coming_soon") {
											handlePressComingSoon(category);
										}
									}}
									className="flex-1 justify-center rounded-2xl bg-card mr-4"
									style={{
										maxHeight: 64,
										shadowColor,
										shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.1,
										shadowRadius: 4,
										elevation: 5,
										overflow: "visible",
										zIndex: 99,
										position: "relative",
									}}
								>
									<View className="flex flex-row items-center px-4 justify-between w-full h-full">
										<View className="flex flex-row items-center gap-4">
											<View className="rounded-xl overflow-hidden ">
												<Image
													source={{ uri: category.image }}
													alt={category.label}
													style={{
														width: 40,
														height: 40,
													}}
													contentFit="cover"
												/>
											</View>
											<View className="flex flex-col gap-1 h-full">
												<P className="text-xl">{category.label}</P>
											</View>
										</View>
										<View className="flex flex-col justify-end items-center gap-1">
											{category.status === "active" ? (
												<Ionicons
													name="chevron-forward"
													size={18}
													color={mutedColor}
												/>
											) : (
												<P className="text-xs text-muted-foreground">
													Coming Soon
												</P>
											)}
										</View>
									</View>
								</TouchableOpacity>
							))}
						{/* <TouchableOpacity onPress={toggleDropdown} className="mt-2">
							<P className="text-center text-muted-foreground">
								{isExpanded ? "Show Less" : "Show More"}
							</P>
						</TouchableOpacity> */}
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
