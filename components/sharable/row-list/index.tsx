import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { FlatList, TouchableOpacity, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";

export const RowList = ({
	data,
	limitItems,
	size = "medium",
	status,
	type,
	showVotes = false,
}: {
	data: {
		id: string;
		name: string;
		image: string;
		test_request_count?: number;
	}[];
	limitItems?: number;
	size?: "small" | "medium" | "large";
	status?: string;
	type?: string;
	showVotes?: boolean;
}) => {
	const { mutedForegroundColor } = useColorScheme();
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
			rowHeight: 60,
			imageSize: 36,
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

	// Limit the data array if limitItems is provided
	const limitedData = Array.isArray(data)
		? limitItems
			? data.slice(0, limitItems)
			: data
		: [];

	const viewAllLink = `/research/view-all?status=${status}&type=${type}&backPath=research`;

	return (
		<View>
			<View className="flex flex-col w-full bg-white rounded-xl ">
				<FlatList
					data={limitedData}
					keyExtractor={(item, index) => item.id + index.toString()}
					renderItem={({ item }) => (
						<View
							className="flex justify-center rounded-2xl border-b border-muted"
							style={{ height: sizeStyles.rowHeight, width: "100%" }}
						>
							{/* @ts-ignore */}
							<Link href={`${determineLink(item)}?backPath=research`}>
								<View className="flex flex-row items-center px-4 justify-between w-full py-2">
									<View className="flex flex-row items-center gap-4">
										<View className="rounded-full overflow-hidden ">
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
										<View className="flex flex-col  h-full">
											<P
												className={`${sizeStyles.textSize} max-w-64`}
												numberOfLines={showVotes ? 1 : 2}
											>
												{item.name}
											</P>
											{showVotes && (
												<Muted className="text-xs">
													{item.test_request_count || 0}{" "}
													{item.test_request_count === 1 ? "vote" : "votes"}
												</Muted>
											)}
										</View>
									</View>
									<View className="flex flex-col h-full justify-center">
										<Ionicons
											name="chevron-forward"
											size={sizeStyles.iconSize}
											color={mutedForegroundColor}
										/>
									</View>
								</View>
							</Link>
						</View>
					)}
				/>
			</View>

			{limitedData.length < data.length && (
				<View className="flex w-full mt-2">
					{/* @ts-ignore */}
					<TouchableOpacity onPress={() => router.push(viewAllLink)}>
						<P className="text-sm text-secondary text-center">View all</P>
					</TouchableOpacity>
				</View>
			)}

			{(!data || data.length === 0) && (
				<View className="bg-muted border border-border rounded-xl w-full mt-2 h-14 justify-center">
					<P className="text-sm text-secondary text-center">
						Nothing at the moment
					</P>
				</View>
			)}
		</View>
	);
};
