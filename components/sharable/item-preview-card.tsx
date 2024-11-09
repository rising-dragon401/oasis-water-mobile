import { Ionicons, Octicons } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";

import { H4, Muted, P } from "@/components/ui/typography";
import {
	RANDOM_BLUR_IMAGES,
	placeHolderImageBlurHash,
} from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";

type Props = {
	item: any;
	showFavorite?: boolean;
	isAuthUser?: boolean;
	isGeneralListing?: boolean;
	imageHeight?: number;
};

const ItemPreviewCard = ({
	item,
	showFavorite = false,
	isAuthUser = false,
	isGeneralListing = false,
	imageHeight = 100,
}: Props) => {
	const { subscription } = useUserProvider();
	const { mutedForegroundColor } = useColorScheme();

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
		const imageStyle = {
			width: "100%",
			height: imageHeight || 100,
			aspectRatio: 1,
			contentFit: "cover",
			borderRadius: 10,
		};

		if (!showData) {
			return (
				<Image
					source={{ uri: randomBlurImage }}
					// @ts-ignore
					style={imageStyle}
					className="rounded-xl "
					transition={100}
					cachePolicy="memory-disk"
					placeholder={{ blurhash: placeHolderImageBlurHash }}
					placeholderContentFit="contain"
				/>
			);
		} else {
			return (
				<Image
					source={{ uri: item.image }}
					// @ts-ignore
					style={imageStyle}
					className="rounded-xl"
					transition={100}
					cachePolicy="memory-disk"
					placeholder={{ blurhash: placeHolderImageBlurHash }}
					placeholderContentFit="contain"
				/>
			);
		}
	};

	const renderScore = () => {
		if (subscription) {
			let dotColor;

			if (item.score >= 80) {
				dotColor = "bg-green-300";
			} else if (item.score >= 50) {
				dotColor = "bg-yellow-300";
			} else if (item.score >= 0) {
				dotColor = "bg-red-300";
			} else {
				dotColor = "bg-gray-300";
			}

			return (
				<View className="flex flex-row items-center gap-2">
					<View
						style={{
							width: 10,
							height: 10,
							borderRadius: 5,
						}}
						className={dotColor}
					/>
					<H4>{item.score}</H4>
				</View>
			);
		}
	};

	return (
		// @ts-ignore
		<Link href={showData ? determineLink(item) : "/subscribeModal"}>
			<View className="relative flex-col w-full rounded-2xl overflow-hidden bg-white px-4">
				<View
					className={`flex justify-center items-center w-full px-6 pb-0 pt-4
						${showData && " rounded-xl"}
					`}
				>
					{renderImage()}
				</View>

				<View className="flex h-16 justify-center">
					{showData ? (
						<P className="text-base pb-2" numberOfLines={2}>
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

				<View className="absolute top-2 right-4 z-10 mt-1">
					{subscription ? (
						item.score ? (
							renderScore()
						) : (
							<View className="flex flex-row items-center gap-2">
								<Ionicons
									name="warning"
									size={14}
									color={mutedForegroundColor}
								/>
								<Muted>/ 100</Muted>
							</View>
						)
					) : (
						<View className="flex flex-row items-center gap-1">
							<Octicons name="lock" size={14} color={mutedForegroundColor} />
							<Muted>/ 100</Muted>
						</View>
					)}
				</View>
			</View>
		</Link>
	);
};

export default ItemPreviewCard;
