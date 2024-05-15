import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

import { H4, Muted } from "@/components/ui/typography";
import { determineLink } from "@/lib/utils";
import FavoriteButton from "./favorite-button";

import { useUserProvider } from "context/user-provider";

type Props = {
	item: any;
	showWarning?: boolean;
	size?: "sm" | "md" | "lg";
	showFavorite?: boolean;
};

const ItemPreviewCard = ({
	item,
	showWarning,
	size,
	showFavorite = false,
}: Props) => {
	const { subscription } = useUserProvider();

	const renderScore = () => {
		const score = item?.score || 0;

		return (
			<View className="flex flex-col gap-0 items-end">
				{subscription ? (
					<>
						<H4>{score}</H4>
					</>
				) : (
					<Octicons name="lock" size={16} color="blue" />
				)}
				<Muted>/100</Muted>
			</View>
		);
	};

	const width = size === "sm" ? 96 : size === "md" ? 168 : 288;
	const height = size === "sm" ? 96 : size === "md" ? 168 : 288;

	return (
		// @ts-ignore
		<Link href={determineLink(item)}>
			<View className="flex flex-col items-center gap-2">
				<View className="relative h-48 w-48 py-1">
					<Image
						source={{ uri: item.image || undefined }}
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 10,
						}}
						resizeMode="cover"
					/>

					{showFavorite && (
						<View
							style={{ position: "absolute", top: 8, right: 8, zIndex: 99 }}
						>
							<FavoriteButton item={item} />
						</View>
					)}
				</View>
				<View className="flex-row w-48 justify-between items-start">
					<Text className="flex flex-wrap w-2/3">{item.name}</Text>

					{item.score && <View className="w-1/3">{renderScore()}</View>}

					{!item.score && showWarning && (
						<View className="w-2/3">
							<Text style={{ fontSize: 24, color: "red" }}>⚠️</Text>
						</View>
					)}
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
