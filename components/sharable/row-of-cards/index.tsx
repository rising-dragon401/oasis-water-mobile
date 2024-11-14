import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";

import { P } from "@/components/ui/typography";

export default function RowOfCards({
	data,
	size = "medium",
}: {
	data: any[];
	size?: "small" | "medium" | "large";
}) {
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
		<View className="w-full justify-start mt-2">
			<FlatList
				data={data}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: 8,
					paddingHorizontal: 0,
				}}
				className="overflow-x-scroll"
				renderItem={({ item }) => (
					<Link
						href={`/search/article/${item.id}`}
						className="flex flex-col mr-4"
					>
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
										{item.name}
									</P>
								</View>
							</View>
						</View>
					</Link>
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}
