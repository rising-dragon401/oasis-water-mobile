import React from "react";
import { Image, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";

type Props = {
	image: string;
	name: string;
	action: string;
	date: string;
};

const CommunityActionCard = ({ image, name, action, date }: Props) => {
	const timeSince = () => {
		const now = new Date();
		const createdAt = new Date(date);
		const diffTime = Math.abs(now.getTime() - createdAt.getTime());

		const diffSeconds = Math.floor(diffTime / 1000);
		const diffMinutes = Math.floor(diffSeconds / 60);
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffSeconds < 60) {
			return `${diffSeconds} seconds ago`;
		} else if (diffMinutes < 60) {
			return `${diffMinutes} minutes ago`;
		} else if (diffHours < 24) {
			return `${diffHours} hours ago`;
		} else {
			return `${diffDays} days ago`;
		}
	};

	return (
		<View className="flex flex-row items-center gap-2 h-20 w-full bg-white rounded-xl border border-border  px-4 py-2">
			<View className="flex h-10 w-10 rounded-full overflow-hidden">
				<Image
					source={{ uri: image || undefined }}
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
					<View className="flex flex-row items-center gap-1">
						<P className="flex flex-wrap font-medium" numberOfLines={2}>
							{name}
							<P className="flex flex-wrap font-normal">
								{` `}
								{action}
							</P>
						</P>
					</View>
					<Muted>{timeSince()}</Muted>
				</View>

				{/* <View className="flex flex-col gap-0 items-end">
						<P className="flex font-bold text-lg">{item.score}</P>
						<Muted>/100</Muted>
					</View> */}

				{/* {item.score && <View className="w-1/3">{renderScore()}</View>}

					{!item.score && showWarning && (
						<View className="w-2/3">
							<Text style={{ fontSize: 24, color: "red" }}>⚠️</Text>
						</View>
					)} */}
			</View>
		</View>
	);
};

export default CommunityActionCard;
