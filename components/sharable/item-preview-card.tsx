import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

import { Octicons } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import Typography from "./typography";

// import FavoriteButton from "../favorite-button";

type Props = {
	item: any;
	showWarning?: boolean;
	size?: "sm" | "md" | "lg";
};

const ItemPreviewCard = ({ item, showWarning, size }: Props) => {
	const { subscription } = useUserProvider();

	const renderScore = () => {
		const score = item?.score || 0;
		const color = "blue";

		return (
			<View className="flex flex-col gap-0 items-end">
				{subscription ? (
					<Typography
						size="2xl"
						fontWeight="normal"
						className={`!no-underline ${color} text-right`}
					>
						{score}
					</Typography>
				) : (
					<Octicons name="lock" size={16} color="muted" />
				)}
				<Typography size="xs" fontWeight="normal">
					/100
				</Typography>
			</View>
		);
	};

	const determineLink = () => {
		let basePath = "";

		if (item.type === "tap_water") {
			basePath = `/search/location/${item.id}`;
		} else if (item.type === "filter") {
			basePath = `/search/filter/${item.id}`;
		} else {
			basePath = `/search/item/${item.id}`;
		}

		return basePath;
	};

	const width = size === "sm" ? 96 : size === "md" ? 192 : 288; // 24*4, 48*4, 72*4 pixels
	const height = size === "sm" ? 96 : size === "md" ? 192 : 288; // 24*4, 48*4, 72*4 pixels

	return (
		// @ts-ignore
		<Link href={determineLink()}>
			<View
				className="flex flex-col items-center gap-2"
				style={{ width: width, height: height }}
			>
				<View className="relative rounded-md overflow-hidden h-full w-full">
					<Image
						source={{ uri: item.image || undefined }}
						style={{
							width: "100%",
							height: "100%",
						}}
					/>
					{/* <View style={{ position: "absolute", top: 0, right: 0 }}>
						<FavoriteButton item={item} />
					</View> */}
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
				<View
					className="flex flex-row justify-between pt-1 md:gap-2 items-start"
					style={{ width: width }}
				>
					<View className="flex flex-col">
						<Typography
							size="base"
							fontWeight="bold"
							className="!no-underline text-primary md:overflow-hidden flex-wrap max-w-56 max-h-24 md:whitespace-nowrap overflow-ellipsis"
						>
							{item.name}
						</Typography>
						{item.company_name && (
							<Text style={{ color: "#666", fontSize: 10 }}>
								{item.company_name}
							</Text>
						)}
					</View>
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
