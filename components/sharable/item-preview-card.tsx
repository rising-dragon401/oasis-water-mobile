import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

import Typography from "./typography";

// import FavoriteButton from "../favorite-button";

type Props = {
	item: any;
	showWarning?: boolean;
};

const ItemPreviewCard = ({ item, showWarning }: Props) => {
	const router = useRouter();

	const renderScore = () => {
		const score = item?.score || 0;
		const color = "blue";

		return (
			<View className="flex flex-col gap-0">
				<Typography
					size="2xl"
					fontWeight="normal"
					className={`!no-underline ${color} text-right`}
				>
					{score}
				</Typography>
				<Typography size="xs" fontWeight="normal">
					/100
				</Typography>
			</View>
		);
	};

	const determineLink = () => {
		// let basePath = "";
		// if (item.type === "tap_water") {
		// 	basePath = `/search/location/${item.id}`;
		// } else if (item.type === "filter") {
		// 	basePath = `/search/filter/${item.id}`;
		// } else {
		// 	basePath = `/search/item/${item.id}`;
		// }
		return `/search/item/${item.id}`;
	};

	return (
		<Link href={`/search/item/${item.id}`}>
			<View
				style={{
					position: "relative",
					width: 160,
					height: 160,
					borderRadius: 8,
					overflow: "hidden",
				}}
			>
				<Image
					source={{ uri: item.image || undefined }}
					style={{ width: "100%", height: "100%" }}
					resizeMode="cover"
				/>
				<View style={{ position: "absolute", top: 0, right: 0 }}>
					{/* <FavoriteButton item={item} /> */}
				</View>
				{item.score && (
					<View style={{ position: "absolute", bottom: 8, right: 8 }}>
						{renderScore()}
					</View>
				)}
				{!item.score && showWarning && (
					<View style={{ position: "absolute", bottom: 8, right: 8 }}>
						<Text style={{ fontSize: 24, color: "red" }}>⚠️</Text>
					</View>
				)}
			</View>
			<View className="flex flex-row justify-between pt-1 md:gap-2 items-start md:w-80 w-40">
				<View className="flex flex-col">
					<Typography
						size="base"
						fontWeight="bold"
						className="!no-underline text-primary md:overflow-hidden md:max-w-64 flex-wrap md:max-h-14 max-h-24 md:whitespace-nowrap overflow-ellipsis"
					>
						{item.name}
					</Typography>

					{item.company_name && (
						<Text style={{ color: "#666", fontSize: 14 }}>
							{item.company_name}
						</Text>
					)}
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
