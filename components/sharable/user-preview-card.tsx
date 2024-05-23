import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

import { H4, Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "context/user-provider";
import FavoriteButton from "./favorite-button";

type Props = {
	item: any;
	showWarning?: boolean;
	size?: "sm" | "md" | "lg";
	showFavorite?: boolean;
};

const UserPreviewCard = ({
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

	return (
		// @ts-ignore
		<Link href={`/search/oasis/${item.id}`}>
			<View className="flex flex-col items-center gap-2">
				<View className="relative h-40 w-40 py-1">
					<Image
						source={{ uri: item.avatar_url || undefined }}
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 99,
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
					<P className="flex flex-wrap w-2/3">{item.full_name}</P>

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

export default UserPreviewCard;
