import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { FlatList, TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function NewCategoriesRow({
	data,
	size = "medium",
	userVotes,
	handlePress,
}: {
	data: any[];
	size?: "small" | "medium" | "large";
	userVotes: any;
	handlePress: (item: any) => void;
}) {
	const { mutedColor } = useColorScheme();
	// Define size-based styles
	const sizeStyles = {
		small: {
			cardWidth: 120,
			cardHeight: 80,
			titleFontSize: 12,
		},
		medium: {
			cardWidth: 160,
			cardHeight: 100,
			titleFontSize: 14,
		},
		large: {
			cardWidth: 200,
			cardHeight: 120,
			titleFontSize: 16,
		},
	};

	const { cardWidth, cardHeight, titleFontSize } = sizeStyles[size];

	return (
		<View className="w-full justify-start ">
			<FlatList
				data={data}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: 8,
					paddingHorizontal: 0,
				}}
				className="overflow-x-scroll"
				renderItem={({ item }) => {
					const isVoted = userVotes?.data?.categories?.includes(item.id);

					return (
						<View className="flex flex-col mr-4">
							<View style={{ width: cardWidth }}>
								<View
									style={{
										width: cardWidth,
										height: cardHeight,
										borderRadius: 8,
										overflow: "hidden",
										position: "relative",
									}}
								>
									<Image
										source={{ uri: item.image }}
										alt={item.name}
										style={{
											width: "100%",
											height: "100%",
											borderRadius: 8,
										}}
									/>
									<View
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundColor: "rgba(0,0,0,0.3)",
											padding: 8,
											justifyContent: "flex-end",
										}}
									>
										<P
											className="text-left text-white"
											style={{ fontSize: titleFontSize }}
											numberOfLines={3}
											ellipsizeMode="tail"
										>
											{item.label}
										</P>
										<TouchableOpacity
											disabled={isVoted}
											onPress={() => handlePress(item.id)}
											style={{
												position: "absolute",
												bottom: 10,
												right: 10,
											}}
										>
											{isVoted ? (
												<Ionicons
													name="checkmark"
													size={24}
													color={mutedColor}
												/>
											) : (
												<Ionicons
													name="add-circle-outline"
													size={24}
													color={mutedColor}
												/>
											)}
										</TouchableOpacity>
										<View
											className="absolute bottom-0 right-0 bg-black/50 px-2 py-1 rounded-full h-8 w-8 flex items-center justify-center"
											style={{
												position: "absolute",
												top: 10,
												right: 10,
											}}
										>
											<P className="text-white">{item.request_count || 0}</P>
										</View>
									</View>
								</View>
							</View>
						</View>
					);
				}}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}
