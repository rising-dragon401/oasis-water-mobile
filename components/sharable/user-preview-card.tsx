import { useUserProvider } from "context/user-provider";
import { Link } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";

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

	// const renderScore = () => {
	// 	const score = item?.score || 0;

	// 	return (
	// 		<View className="flex flex-col gap-0 items-end">
	// 			{subscription ? (
	// 				<>
	// 					<H4>{score}</H4>
	// 				</>
	// 			) : (
	// 				<Octicons name="lock" size={16} color="blue" />
	// 			)}
	// 			<Muted>/100</Muted>
	// 		</View>
	// 	);
	// };

	return (
		<Link href={`/search/oasis/${item.id}`}>
			<View className="flex flex-row items-center gap-2 h-20 w-full bg-white rounded-xl  px-4 py-2">
				<View className="flex h-10 w-10 rounded-full overflow-hidden">
					<Image
						source={{ uri: item.avatar_url || undefined }}
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 14,
						}}
						resizeMode="cover"
					/>
				</View>
				<View className="flex-row w-full justify-between items-start gap-2 flex-1">
					<View className="flex flex-col gap-0">
						<P className="flex flex-wrap">{item.full_name}</P>
						<Muted>{new Date(item.created_at).toLocaleDateString()}</Muted>
					</View>

					<View className="flex flex-col gap-0 items-end">
						<P className="flex font-bold text-lg">{item.score}</P>
						<Muted>/100</Muted>
					</View>

					{/* {item.score && <View className="w-1/3">{renderScore()}</View>}

					{!item.score && showWarning && (
						<View className="w-2/3">
							<Text style={{ fontSize: 24, color: "red" }}>⚠️</Text>
						</View>
					)} */}
				</View>
			</View>
		</Link>
	);
};

export default UserPreviewCard;
