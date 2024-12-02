import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";

import ScoreIndicator from "../score-indicator";

import { Muted, P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink, timeSince } from "@/lib/utils";

export const ResearchRowList = ({
	data,
	limitItems,
	size = "medium",

	label = null,
}: {
	data: {
		id: string;
		name: string;
		type: string;
		image: string;
		raised_amount?: number;
		total_cost?: number;
		updated_at?: string;
		cont_not_removed?: number;
		cont_count?: number;
		score_updated_at?: string;
	}[];
	limitItems?: number;
	size?: "small" | "medium" | "large";
	status?: string;
	type?: string;
	label?: "funding" | "dates" | null;
	showVotes?: boolean;
}) => {
	const { dropShadowStyles } = useColorScheme();
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
			rowHeight: 76,
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

	// Limit the data array if limitItems is provided
	const limitedData = Array.isArray(data)
		? limitItems
			? data.slice(0, limitItems)
			: data
		: [];

	return (
		<FlatList
			data={limitedData}
			contentContainerStyle={{
				overflow: "visible",
				gap: 6,
				paddingBottom: 10,
				paddingHorizontal: 4,
				paddingTop: 4,
			}}
			keyExtractor={(item, index) => item.id + item.toString() + index}
			renderItem={({ item, index }) => (
				<View
					className="flex bg-card rounded-xl mb-2 overflow-visible"
					style={{
						height: sizeStyles.rowHeight,
						width: "100%",

						...dropShadowStyles,
					}}
				>
					{/* @ts-ignore */}
					<Link href={`${determineLink(item)}?backPath=research`}>
						<View className="flex flex-row items-center px-4 justify-between w-full py-6">
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
								<View className="flex flex-col h-full justify-between ">
									<P
										className={`${sizeStyles.textSize} w-56 leading-tight`}
										numberOfLines={1}
									>
										{item.name}
									</P>
									<View className="flex flex-row items-center gap-1">
										{item.type === "filter" &&
										(item.cont_not_removed ?? 0) > 0 ? (
											<>
												<ScoreIndicator value="bad" width={2} height={2} />
												<Muted className="text-xs">
													{item.cont_not_removed} changes
												</Muted>
											</>
										) : null}

										{item.type === "bottled_water" &&
										(item.cont_count ?? 0) > 0 ? (
											<>
												<ScoreIndicator value="bad" width={2} height={2} />
												<Muted className="text-xs">
													{item.cont_count} changes
												</Muted>
											</>
										) : null}
									</View>
								</View>
							</View>
							<View className="flex flex-col items-end justify-start gap-2 h-full">
								{/* <ScoreBadge
											value={item.score || null}
											width={2}
											height={2}
										/> */}
								{(item?.updated_at || item?.score_updated_at) && (
									<Muted className="text-xs">
										{timeSince(
											item?.updated_at || item?.score_updated_at || "",
										)}
									</Muted>
								)}
							</View>
						</View>
					</Link>
				</View>
			)}
		/>
	);
};
