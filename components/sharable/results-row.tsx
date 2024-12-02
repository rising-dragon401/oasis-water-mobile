import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { ITEM_TYPES } from "@/lib/constants/categories";
import { placeHolderImageBlurHash } from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";

type Props = {
	results: any[];
	noResults?: boolean;
	overridePress?: (item: any) => void;
	setResults?: (results: any[]) => void;
	showRequestItem?: boolean;
};

export default function ResultsRow({
	results,
	noResults,
	overridePress,
	setResults,
	showRequestItem = true,
}: Props) {
	const { colorScheme, foregroundColor } = useColorScheme();
	const router = useRouter();
	const borderColor = colorScheme === "dark" ? "#333" : "#ddd";

	const handleRequestItem = () => {
		// @ts-ignore
		router.push("/contributeModal?kind=new_item");
	};

	const handleItemPress = async (item: any) => {
		if (overridePress) {
			overridePress(item);
			if (setResults) {
				setResults([]);
			}
		} else {
			const link = await determineLink(item);
			// @ts-ignore
			router.push(link);
		}
	};

	const renderItemIcon = (item: any) => {
		let icon = ITEM_TYPES.find((itemObj) =>
			itemObj.dbTypes.includes(item.typeId || item.type),
		)?.icon;

		let categoryLabel = ITEM_TYPES.find((itemObj) =>
			itemObj.dbTypes.includes(item.typeId || item.type),
		)?.categoryLabel;

		if (item.type === "item") {
			icon = "water-outline";
			categoryLabel = "Bottled water";
		}

		if (item.type === "brand") {
			icon = "pricetag-outline";
			categoryLabel = "Brand";
		}

		return (
			<View className="flex flex-row items-center gap-1">
				{/* @ts-ignore */}
				<Ionicons name={icon} size={10} color={foregroundColor} />

				<Muted className="text-sm text-foreground">{categoryLabel}</Muted>
			</View>
		);
	};

	return (
		<View
			style={{
				position: "absolute",
				width: "100%",
				maxHeight: 240,
				marginTop: 60,
				zIndex: 999,
			}}
		>
			<View
				style={{
					overflow: "hidden",
					borderWidth: 1,
					borderColor,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
					maxHeight: 240,
				}}
				className="bg-card border border-border rounded-xl"
			>
				<FlatList
					data={[...results, { id: "request-item", type: "request" }]}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item: result }) => (
						<View>
							{result.type === "request" ? (
								<View className="flex justify-center pl-4 h-12">
									<TouchableOpacity onPress={handleRequestItem}>
										<Muted>
											Looking for something else?{" "}
											<Muted style={{ textDecorationLine: "underline" }}>
												Request it
											</Muted>
										</Muted>
									</TouchableOpacity>
								</View>
							) : (
								<TouchableOpacity onPress={() => handleItemPress(result)}>
									<View
										className={`flex flex-row items-center justify-between w-full p-2
											${result.type === "category" && ""}
										`}
									>
										<View
											className={`flex flex-row gap-2 items-start justify-center pl-2 h-12
											
											
											`}
										>
											<Image
												source={{
													uri:
														result.type === "tap_water"
															? result.image_url
															: result.image || "",
												}}
												alt={result.name || ""}
												allowDownscaling
												style={{
													width: 40,
													height: "100%",
													borderRadius: 5,
													backgroundColor: "white",
												}}
												placeholder={{ blurhash: placeHolderImageBlurHash }}
												transition={300}
												cachePolicy="disk"
											/>
											<View className="flex flex-col">
												<P
													className="max-w-80"
													numberOfLines={1}
													ellipsizeMode="tail"
												>
													{result.name}
												</P>
												{renderItemIcon(result)}
											</View>
										</View>
									</View>
								</TouchableOpacity>
							)}
						</View>
					)}
					nestedScrollEnabled
					scrollEnabled
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					style={{ maxHeight: 240 }}
					contentContainerStyle={{ flexGrow: 1 }}
				/>
			</View>
		</View>
	);
}
