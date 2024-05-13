import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

import { H4, Muted, P } from "@/components/ui/typography";
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
			<View
				className="flex flex-col items-center gap-2"
				// style={{ width, height }}
			>
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
				<View
					className="flex flex-row justify-between items-start"
					style={{ width }}
				>
					<View className="flex flex-col w-3/4">
						<P>{item.name}</P>
					</View>

					{item.score && <View className="w-1/4">{renderScore()}</View>}

					{!item.score && showWarning && (
						<View className="w-1/4">
							<Text style={{ fontSize: 24, color: "red" }}>⚠️</Text>
						</View>
					)}
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
