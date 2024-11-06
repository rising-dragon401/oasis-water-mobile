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
};

const ItemPreviewCard = ({
	item,
	showFavorite = false,
	isAuthUser = false,
	isGeneralListing = false,
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
			width: 100,
			height: 100,
			aspectRatio: 1,
			contentFit: "contain",
			borderRadius: 10,
		};

		if (!showData) {
			return (
				<Image
					source={{ uri: randomBlurImage }}
					style={imageStyle}
					className="rounded-xl bg-white"
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
					style={imageStyle}
					className="rounded-xl bg-white "
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
			<View className="relative w-full aspect-square rounded-2xl overflow-hidden">
				<View
					className={`flex justify-center items-center w-full h-full 
						${showData && "p-4 pb-6 bg-white rounded-xl"}
					`}
				>
					{renderImage()}
				</View>

				{showData ? (
					<P
						className="absolute bottom-2 left-2 bg-opacity-50 px-2 flex-wrap leading-tight"
						numberOfLines={2}
					>
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
