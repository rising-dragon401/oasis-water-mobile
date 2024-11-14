import { Ionicons, Octicons } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

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
	variation?: "square" | "row";
	showVotes?: boolean;
	backPath?: string;
};

const ItemPreviewCard = ({
	item,
	showFavorite = false,
	isAuthUser = false,
	isGeneralListing = false,
	imageHeight = 100,
	variation = "square",
	showVotes = false,
	backPath = "",
}: Props) => {
	const { subscription } = useUserProvider();
	const { mutedForegroundColor } = useColorScheme();
	const router = useRouter();

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
			width: variation === "row" ? 80 : "100%",
			height: imageHeight || 80,
			aspectRatio: variation === "row" ? undefined : 1,
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

	const link = backPath
		? `${determineLink(item)}?backPath=${backPath}`
		: determineLink(item);

	console.log("link", link);

	return (
		<TouchableOpacity
			onPress={() => {
				// @ts-ignore
				router.push(link);
			}}
		>
			<View
				className={`relative w-full flex rounded-2xl ${
					variation === "row" ? "flex-row gap-2 px-2 py-3 " : "flex-col"
				}  border border-border overflow-hidden bg-white pt-4 `}
			>
				<View
					className={`flex justify-center items-center ${
						variation === "row" ? "w-1/4" : "w-full "
					}  ${showData && "rounded-xl"}`}
					style={{ flex: variation === "row" ? 1 : undefined }}
				>
					{renderImage()}
				</View>

				<View
					className={`flex ${
						variation === "row"
							? "flex-col items-start justify-between py-3"
							: "h-14 justify-center"
					}`}
					style={{ flex: variation === "row" ? 3 : undefined }}
				>
					{showData ? (
						<P
							className={`text-base ${
								variation === "row"
									? "text-lg max-w-48 w-48 flex-wrap"
									: "px-3 text-sm"
							}`}
							numberOfLines={2}
							style={{ lineHeight: 18 }}
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

					{variation === "row" && item.brandName && (
						<Muted>{item.brandName} </Muted>
					)}

					{variation === "row" && showVotes && (
						<Muted>
							{item.test_request_count || 0}{" "}
							{item.test_request_count === 1 ? "vote" : "votes"}
						</Muted>
					)}
				</View>

				{variation === "row" && (
					<View className="absolute mt-4 right-4  z-10  rounded-full p-1 px-2">
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
				)}

				{variation !== "row" && (
					<View className="absolute top-2 right-2 z-10 mt-1 p-1 px-2">
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
				)}
			</View>
		</TouchableOpacity>
	);
};

export default ItemPreviewCard;
