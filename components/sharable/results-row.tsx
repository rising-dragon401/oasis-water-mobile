import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { placeHolderImageBlurHash } from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";

type Props = {
	results: any[];
	noResults?: boolean;
};

export default function ResultsRow({ results, noResults }: Props) {
	const { colorScheme } = useColorScheme();

	const borderColor = colorScheme === "dark" ? "#333" : "#ddd";

	const readableType = (type: string) => {
		if (type === "tap_water") {
			return "Tap water";
		} else if (type === "filter") {
			return "Filter";
		} else if (type === "company") {
			return "Company";
		} else if (type === "item") {
			return "Bottled water";
		} else if (type === "bottle_filter") {
			return "Filter";
		} else {
			return "Bottled water";
		}
	};

	return (
		<View
			style={{
				position: "absolute",
				width: "100%",
				maxHeight: 240,
				marginTop: 60,
				zIndex: 100,
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
				{noResults ? (
					<View className="flex justify-center pl-4 h-12">
						<Muted>No results found</Muted>
					</View>
				) : (
					<FlatList
						data={results}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item: result }) => (
							<View className="p-2">
								<Link
									// @ts-ignore
									href={determineLink(result)}
								>
									<View className="flex flex-row items-center justify-between w-full py-1">
										<View className="flex flex-row gap-2 items-start justify-center pl-2 h-12">
											<Image
												source={{
													uri:
														result.type === "tap_water"
															? result.image_url
															: result.image || "",
												}}
												alt={result.name || ""}
												style={{ width: 40, height: "100%", borderRadius: 5 }}
												placeholder={{ blurhash: placeHolderImageBlurHash }}
												transition={1000}
											/>
											<View className="flex flex-col">
												<P
													className="max-w-72 font-medium"
													numberOfLines={1}
													ellipsizeMode="tail"
												>
													{result.name}
												</P>
												<Muted>{readableType(result.type)}</Muted>
											</View>
										</View>
									</View>
								</Link>
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
