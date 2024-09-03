import { useColorScheme } from "@/lib/useColorScheme";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { H4, Muted, P } from "@/components/ui/typography";
import { placeHolderImageBlurHash } from "@/lib/constants/images";
import { determineLink } from "@/lib/utils";
import { Octicons } from "@expo/vector-icons";
import FavoriteButton from "./favorite-button";

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
	const { textColor } = useColorScheme();

	return (
		// @ts-ignore
		<Link href={determineLink(item)}>
			<View className="flex flex-col items-center gap-2 rounded-md">
				<View className="relative h-48 w-48 bg-input">
					<Image
						source={{ uri: item.image || undefined }}
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 8,
						}}
						placeholder={{ blurhash: placeHolderImageBlurHash }}
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
					<P className="flex flex-wrap w-2/3 h-14">{item.name}</P>

					{subscription ? (
						<>
							{item.score ? (
								<View className="flex flex-col gap-0 items-end justify-end">
									<H4>{item.score}</H4>
									<Muted>/100</Muted>
								</View>
							) : (
								<View className="w-full flex text-right justify-end">
									<Text style={{ fontSize: 14 }}>⚠️</Text>
								</View>
							)}
						</>
					) : (
						<Octicons name="lock" size={16} color={textColor} />
					)}
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
