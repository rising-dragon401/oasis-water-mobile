import { Octicons } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { H4, Muted, P } from "@/components/ui/typography";
import { determineLink } from "@/lib/utils";
import FavoriteButton from "./favorite-button";

const blurhash = "LTR{+2of~oj[%LfQM|fP%2fQM|j[";

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

	return (
		// @ts-ignore
		<Link href={determineLink(item)}>
			<View className="flex flex-col items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-md">
				<View className="relative h-48 w-48">
					<Image
						source={{ uri: item.image || undefined }}
						style={{
							width: "100%",
							height: "100%",
							borderTopLeftRadius: 4,
							borderTopRightRadius: 4,
						}}
						placeholder={{ blurhash }}
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
				<View className="flex-row w-48 justify-between items-start px-1 pb-1">
					<P className="flex flex-wrap w-2/3 !max-h-14">{item.name}</P>

					{item.score && <View className="w-1/3">{renderScore()}</View>}

					{!item.score && showWarning && (
						<View className="w-full flex text-right justify-end">
							<Text style={{ fontSize: 14 }}>⚠️</Text>
						</View>
					)}
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
