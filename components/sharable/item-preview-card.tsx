import { Ionicons, Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import ScoreIndicator from "./score-indicator";

import { Muted, P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useUserProvider } from "@/context/user-provider";
import {
	RANDOM_BLUR_IMAGES,
	placeHolderImageBlurHash,
} from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink, timeSince } from "@/lib/utils";

type Props = {
	item: any;
	isAuthUser?: boolean;
	isGeneralListing?: boolean;
	imageHeight?: number;
	variation?: "square" | "row";
	showTime?: boolean;
	backPath?: string;
	hideScore?: boolean;
	showContPreview?: boolean;
	showShadow?: boolean;
	titleLines?: number;
};

const ItemPreviewCard = ({
	item,
	isAuthUser = false,
	isGeneralListing = false,
	imageHeight = 100,
	variation = "square",
	showTime = false,
	backPath = "",
	hideScore = false,
	showContPreview = false,
	showShadow = false,
	titleLines = 2,
}: Props) => {
	const { userData } = useUserProvider();
	const { hasActiveSub } = useSubscription(); // should not be calling this here lol
	const {
		mutedForegroundColor,
		accentColor,

		dropShadowStyles,
	} = useColorScheme();
	const router = useRouter();

	const isItemUnlocked = useMemo(() => {
		return userData?.unlock_history?.some((unlock: any) => {
			return (
				String(unlock.product_id) === String(item.id) &&
				String(unlock.product_type) === String(item.type)
			);
		});
	}, [userData, item.id, item.type]);

	// show if listed in top-rate or preview list but not on favorites page
	// unless subscribed or is the auth user
	const showData =
		hasActiveSub || isAuthUser || isGeneralListing || isItemUnlocked;

	const randomBlurImage = useMemo(
		() =>
			RANDOM_BLUR_IMAGES[
				Math.floor(Math.random() * RANDOM_BLUR_IMAGES?.length)
			],
		[],
	);

	const renderImage = () => {
		const imageStyle = {
			width: variation === "row" ? 80 : "90%",
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
					placeholderContentFit="cover"
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
					placeholderContentFit="cover"
				/>
			);
		}
	};

	const renderScore = () => {
		if (hasActiveSub || isItemUnlocked) {
			let value: "ok" | "good" | "bad" = "ok";

			if (item.score >= 80) {
				value = "good";
			} else if (item.score >= 50) {
				value = "ok";
			} else {
				value = "bad";
			}

			return (
				<View className="flex flex-row items-center gap-1">
					<ScoreIndicator value={value} width={2} height={2} />
					<P>{item.score}</P>
				</View>
			);
		}
	};

	const link = backPath
		? `${determineLink(item)}?backPath=${backPath}`
		: determineLink(item);

	return (
		<TouchableOpacity
			onPress={() => {
				// @ts-ignore
				router.push(link);
			}}
			style={{
				...(showShadow ? dropShadowStyles : {}),
			}}
		>
			<View
				className={`relative w-full flex rounded-2xl ${
					variation === "row" ? "flex-row gap-2 px-2 py-2" : "flex-col gap-y-2"
				} bg-card`}
				style={{ paddingHorizontal: variation === "square" ? 0 : undefined }}
			>
				<View
					className={`flex justify-center items-center ${
						variation === "row" ? "w-1/4" : "pt-2"
					} ${showData && "rounded-xl"}`}
					style={{ flex: variation === "row" ? 1 : undefined }}
				>
					{renderImage()}
				</View>

				<View
					className={`flex ${
						variation === "row"
							? "flex-col items-start justify-between py-3"
							: "justify-start items-start px-4 pb-2"
					}`}
					style={{ flex: variation === "row" ? 3 : undefined }}
				>
					{showData ? (
						<>
							<P
								className="text-sm font-medium text-left"
								numberOfLines={titleLines || 2}
							>
								{item.name}
							</P>
							{item.brandName && (
								<Muted className="text-xs text-primary">{item.brandName}</Muted>
							)}

							{showContPreview &&
							(item.cont_count > 0 || item.cont_not_removed > 0) ? (
								<P className="text-xs text-muted-foreground italic">
									{item?.cont_count || item?.cont_not_removed} alerts
								</P>
							) : (
								<View className="h-4" />
							)}
						</>
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

					{variation !== "row" && showTime && (
						<View className="flex flex-col items-start px-3">
							<Muted className="text-xs">{timeSince(item.updated_at)}</Muted>
						</View>
					)}
				</View>

				{variation === "row" && (
					<View className="absolute mt-2 right-2  z-10  rounded-full p-1 px-2">
						{hasActiveSub || isItemUnlocked ? (
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
								<Octicons name="lock" size={14} color={accentColor} />
								<Muted>/100</Muted>
							</View>
						)}
					</View>
				)}

				{variation !== "row" && !hideScore && (
					<View className="absolute top-2 right-2 z-10 mt-1 mr-1 p-1 px-2">
						{hasActiveSub || isItemUnlocked ? (
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
							<View className="flex items-end">
								<Octicons name="lock" size={14} color={accentColor} />
							</View>
						)}
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
};

export default ItemPreviewCard;
