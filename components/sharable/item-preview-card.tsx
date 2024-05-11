import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

import { P } from "@/components/ui/typography";
import { determineLink } from "@/lib/utils";
import FavoriteButton from "./favorite-button";
import Typography from "./typography";

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

	const width = size === "sm" ? 96 : size === "md" ? 168 : 288;
	const height = size === "sm" ? 96 : size === "md" ? 168 : 288;

	return (
		// @ts-ignore
		<Link href={determineLink(item)}>
			<View
				className="flex flex-col items-center gap-2 h-full"
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
					className="flex flex-row justify-between h-full items-start"
					style={{ width }}
				>
					<View className="flex flex-col">
						<P>{item.name}</P>
					</View>
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
