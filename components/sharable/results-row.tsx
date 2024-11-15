import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { placeHolderImageBlurHash } from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink, readableType } from "@/lib/utils";

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
	const { colorScheme } = useColorScheme();
	const router = useRouter();
	const borderColor = colorScheme === "dark" ? "#333" : "#ddd";

	const handleRequestItem = () => {
		router.push("/requestModal");
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
				className="bg-input rounded-xl"
			>
				{noResults && showRequestItem ? (
					<View className="flex justify-center pl-4 h-12">
						<TouchableOpacity onPress={handleRequestItem}>
							<Muted>
								No result for this yet.{" "}
								<Muted style={{ textDecorationLine: "underline" }}>
									Request
								</Muted>
							</Muted>
						</TouchableOpacity>
					</View>
				) : (
					<FlatList
						data={results}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item: result }) => (
							<View>
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
													className="max-w-80 font-medium"
													numberOfLines={1}
													ellipsizeMode="tail"
												>
													{result.name}
												</P>
												<Muted>{readableType(result.type)}</Muted>
											</View>
										</View>
									</View>
								</TouchableOpacity>
							</View>
						)}
						nestedScrollEnabled
						scrollEnabled
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						style={{ maxHeight: 240 }}
						contentContainerStyle={{ flexGrow: 1 }}
					/>
				)}
			</View>
		</View>
	);
}
