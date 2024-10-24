import { Ionicons, Octicons } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import { ImageStyle, View } from "react-native";

import FavoriteButton from "./favorite-button";

import { H4, P } from "@/components/ui/typography";
import {
	placeHolderImageBlurHash,
	RANDOM_BLUR_IMAGES,
} from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";

type Props = {
	item: any;
	showFavorite?: boolean;
	isAuthUser?: boolean;
	isGeneralListing?: boolean;
};

const ItemPreviewCard = ({
	item,
	showFavorite = false,
	isAuthUser = false,
	isGeneralListing = false,
}: Props) => {
	const { subscription } = useUserProvider();
	const { iconColor } = useColorScheme();

	// show if listed in top-rate or preview list but not on favorites page
	// unless subscribed or is the auth user
	const showData = subscription || isAuthUser || isGeneralListing;

	const randomBlurImage = useMemo(
		() =>
			RANDOM_BLUR_IMAGES[
				Math.floor(Math.random() * RANDOM_BLUR_IMAGES?.length)
			],
		[],
	);

	const renderImage = () => {
		const imageStyle: ImageStyle = {
			width: "100%",
			aspectRatio: 1, // This makes the image square
			resizeMode: "cover" as const,
			borderRadius: 10,
		};

		if (!showData) {
			return (
				<Image
					source={{ uri: randomBlurImage }}
					style={imageStyle}
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
					style={imageStyle}
					className="rounded-xl"
					transition={100}
					cachePolicy="memory-disk"
					placeholder={{ blurhash: placeHolderImageBlurHash }}
				/>
			);
		}
	};

	const renderScore = () => {
		if (subscription) {
			let dotColor;

			if (item.score >= 80) {
				dotColor = "rgba(144, 238, 144, 0.6)";
			} else if (item.score >= 50) {
				dotColor = "rgba(255, 255, 0, 0.6)";
				dotColor = "rgba(255, 0, 0, 0.6)";
			}

			return (
				<View className="flex flex-row items-center gap-2">
					<View
						style={{
							width: 10,
							height: 10,
							backgroundColor: dotColor,
							borderRadius: 5,
							marginLeft: 4,
						}}
					/>
					<H4>{item.score}</H4>
				</View>
			);
		}
	};

	return (
		// @ts-ignore
		<Link href={showData ? determineLink(item) : "/subscribeModal"}>
			<View className="flex flex-col items-center gap-2">
				<View className="relative w-full aspect-square rounded-xl overflow-hidden">
					{renderImage()}
					{showFavorite && showData && (
						<View className="absolute top-4 right-4 z-10">
							<FavoriteButton item={item} />
						</View>
					)}
				</View>

				<View className="flex-1 flex-row w-full items-start justify-between pb-2 px-2">
					<View className="flex-1 mr-2">
						{showData ? (
							<P className="font-semibold pb-2 h-18" numberOfLines={2}>
								{item.name}
							</P>
						) : (
							<>
								<View
									style={{
										width: "100%",
										height: 10,
										backgroundColor: "rgba(224, 224, 224, 0.5)",
										borderRadius: 2,
										marginBottom: 4,
									}}
								/>
								<View
									style={{
										width: "80%",
										height: 10,
										backgroundColor: "rgba(224, 224, 224, 0.5)",
										borderRadius: 2,
									}}
								/>
							</>
						)}
					</View>

					<View className="flex-shrink-0">
						{subscription ? (
							item.score ? (
								renderScore()
							) : (
								<Ionicons name="warning" size={16} color={iconColor} />
							)
						) : (
							<Octicons name="lock" size={16} color={iconColor} />
						)}
					</View>
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
