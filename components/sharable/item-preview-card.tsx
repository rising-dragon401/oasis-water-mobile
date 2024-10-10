import { useColorScheme } from "@/lib/useColorScheme";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { Link, usePathname } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { H4, Muted, P } from "@/components/ui/typography";
import {
	placeHolderImageBlurHash,
	RANDOM_BLUR_IMAGES,
} from "@/lib/constants/images";
import { determineLink } from "@/lib/utils";
import { Octicons } from "@expo/vector-icons";
import FavoriteButton from "./favorite-button";

type Props = {
	item: any;
	showFavorite?: boolean;
	isAuthUser?: boolean;
};

const ItemPreviewCard = ({
	item,
	showFavorite = false,
	isAuthUser = false,
}: Props) => {
	const { subscription } = useUserProvider();
	const { textColor } = useColorScheme();
	const pathname = usePathname();

	// Check if the content should be blurred
	const shouldBlur =
		(!subscription || !isAuthUser) && pathname.includes("/search/oasis");

	const randomBlurIamge =
		RANDOM_BLUR_IMAGES[Math.floor(Math.random() * RANDOM_BLUR_IMAGES?.length)];

	const renderImage = () => {
		if (shouldBlur) {
			return (
				<Image
					source={{ uri: randomBlurIamge }}
					style={{
						width: "100%",
						height: "100%",
						resizeMode: "cover",
						borderRadius: 10,
					}}
					className="rounded-xl"
					transition={100}
					cachePolicy="memory-disk"
					placeholder={{ blurhash: placeHolderImageBlurHash }}
				/>
			);
		} else {
			return (
				<Image
					source={{ uri: item.image }}
					style={{
						width: "100%",
						height: "100%",
						resizeMode: "cover",
						borderRadius: 10,
					}}
					className="rounded-xl"
					transition={100}
					cachePolicy="memory-disk"
					placeholder={{ blurhash: placeHolderImageBlurHash }}
				/>
			);
		}
	};

	return (
		// @ts-ignore
		<Link href={!shouldBlur ? determineLink(item) : "/subscribeModal"}>
			<View className="flex flex-col items-center gap-2">
				<View className="relative h-48 w-48">
					{renderImage()}

					{showFavorite && !shouldBlur && (
						<View
							style={{ position: "absolute", top: 12, right: 12, zIndex: 99 }}
						>
							<FavoriteButton item={item} />
						</View>
					)}
				</View>

				<View className="flex-row w-48 justify-between items-start px-1 pb-1 mt-1">
					<View className="relative w-2/3">
						{!shouldBlur ? (
							<P className={`flex flex-wrap w-full h-14 `}>{item.name}</P>
						) : (
							<View className="flex flex-col gap-1">
								<View
									style={{
										width: `${Math.min(item.name.length * 5, 100)}%`,
										height: 10,
										backgroundColor: "#E0E0E0",
										borderRadius: 2,
									}}
								/>
								<View
									style={{
										width: `${Math.min(item.name.length * 3, 80)}%`,
										height: 10,
										backgroundColor: "#E0E0E0",
										borderRadius: 2,
									}}
								/>
							</View>
						)}
					</View>

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
