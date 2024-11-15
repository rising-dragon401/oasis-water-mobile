import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { FlatList, TouchableOpacity, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { ITEM_TYPES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink, timeSince } from "@/lib/utils";

export const ResearchRowList = ({
	data,
	limitItems,
	size = "medium",
	status,
	type,
	label = null,
	showVotes = false,
}: {
	data: {
		id: string;
		name: string;
		type: string;
		image: string;
		test_request_count?: number;
		updated_at?: string;
	}[];
	limitItems?: number;
	size?: "small" | "medium" | "large";
	status?: string;
	type?: string;
	label?: "votes" | "dates" | null;
	showVotes?: boolean;
}) => {
	const { mutedColor, mutedForegroundColor } = useColorScheme();
	const router = useRouter();
	// Define styles based on size
	const sizeStyles = {
		small: {
			rowHeight: 44,
			imageSize: 26,
			textSize: "text-sm",
			numberOfLines: 1,
			iconSize: 8,
		},
		medium: {
			rowHeight: 64,
			imageSize: 40,
			textSize: "text-base",
			numberOfLines: 2,
			iconSize: 18,
		},
		large: {
			rowHeight: 80,
			imageSize: 48,
			textSize: "text-lg",
			numberOfLines: 2,
			iconSize: 18,
		},
	}[size];

	const typeLabel = ITEM_TYPES.find((item) => item.id === type)?.name;

	// Limit the data array if limitItems is provided
	const limitedData = Array.isArray(data)
		? limitItems
			? data.slice(0, limitItems)
			: data
		: [];

	const viewAllLink = `/research/view-all?status=${status}`;

	return (
		<View>
			<View className="flex flex-col w-full bg-white rounded-xl border border-border">
				<FlatList
					data={limitedData}
					keyExtractor={(item, index) => item.id + item.toString()}
					renderItem={({ item, index }) => (
						<View
							className={`flex justify-center rounded-2xl ${
								index < limitedData.length - 1 ? "border-b border-muted" : ""
							}`}
							style={{ height: sizeStyles.rowHeight, width: "100%" }}
						>
							{/* @ts-ignore */}
							<Link href={`${determineLink(item)}?backPath=research`}>
								<View className="flex flex-row items-center px-4 justify-between w-full py-4">
									<View className="flex flex-row items-center gap-4">
										<View className="rounded-md overflow-hidden ">
											<Image
												source={{ uri: item.image }}
												alt={item.name}
												style={{
													width: sizeStyles.imageSize,
													height: sizeStyles.imageSize,
												}}
												contentFit="cover"
											/>
										</View>
										<View className="flex flex-col h-full justify-between">
											<P
												className={`${sizeStyles.textSize} max-w-64 leading-tight`}
												numberOfLines={1}
											>
												{item.name}
											</P>
											<View className="flex flex-row items-center gap-1">
												<Ionicons
													// @ts-ignore
													name={
														ITEM_TYPES.find(
															(itemObj) => itemObj.typeId === item.type,
														)?.icon
													}
													size={10}
													color={mutedForegroundColor}
												/>
												<Muted className="text-xs">
													{
														ITEM_TYPES.find(
															(itemObj) => itemObj.typeId === item.type,
														)?.categoryLabel
													}
												</Muted>
											</View>
										</View>
									</View>
									<View className="flex flex-col items-end justify-start gap-2 h-full">
										{label === "votes" && (
											<View className="px-2 min-w-6 flex flex-row items-center justify-end rounded-full ">
												<Muted className="!text-accent text-xs">
													{item.test_request_count || 0}
												</Muted>
											</View>
										)}

										{label === "dates" && (
											<Muted className="text-xs">
												{timeSince(item?.updated_at || "")}
											</Muted>
										)}
										{/* <Ionicons
											name="chevron-forward"
											size={sizeStyles.iconSize}
											color={mutedColor}
										/> */}
									</View>
								</View>
							</Link>
						</View>
					)}
				/>
			</View>

			{/* {limitedData?.length < data?.length && ( */}
			<View className="flex justify-center items-center mt-1">
				<TouchableOpacity
					// @ts-ignore
					onPress={() => router.push(viewAllLink)}
					className="flex w-32 mt-2 bg-white rounded-full px-4 py-2 shadow-md"
					style={{
						shadowColor: "#000", // Black color for shadow
						shadowOffset: { width: 0, height: 2 }, // Offset for shadow
						shadowOpacity: 0.3, // Lower opacity for lighter shadow
						shadowRadius: 3.84, // Blur radius
						elevation: 5, // Elevation for Android
					}}
				>
					<P className="text-sm text-center text-secondary">View all</P>
				</TouchableOpacity>
			</View>
			{/* )} */}

			{(!data || data?.length === 0) && (
				<View className="bg-muted border border-border rounded-xl w-full mt-2 h-14 justify-center">
					<P className="text-sm text-secondary text-center">
						Nothing at the moment
					</P>
				</View>
			)}
		</View>
	);
};
