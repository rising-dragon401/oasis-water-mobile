import React from "react";
import { TouchableOpacity, View } from "react-native";

import Score from "@/components/sharable/score";
import { H3, Muted, P } from "@/components/ui/typography";

export default function ScoreCard({
	title,
	description,
	score,
	onPress,
	type = "large_row",
	healthEffects,
	icon,
}: {
	title: string;
	description: string;
	score: number;
	onPress: () => void;
	type?: "square" | "large_row" | "small_row";
	healthEffects?: any[];
	icon?: React.ReactNode;
}) {
	const ratingColor =
		score > 70
			? "text-green-300"
			: score > 50
				? "text-yellow-300"
				: "text-red-400";

	const textColor = "text-stone-800";

	const circle = <View className="w-4 h-4 bg-red-200 rounded-full" />;

	if (type === "square") {
		return (
			<TouchableOpacity
				onPress={onPress}
				className="flex-1 flex-col bg-card rounded-xl px-4 pb-4 pt-4 justify-between border border-border gap-12"
			>
				<P className="text-lg">{title}</P>

				<View className="flex-row justify-between items-end">
					<P className="text-5xl">{score}</P>
					<Muted>/ 100</Muted>
				</View>
			</TouchableOpacity>
		);
	} else if (type === "small_row") {
		return (
			<TouchableOpacity
				onPress={onPress}
				className="flex-1 w-full h-24 flex-row bg-card rounded-xl pl-4 pr-2 pt-4 pb-2  justify-between items-end border border-border"
			>
				<View className="flex flex-col h-full justify-between">
					{icon}
					<P className="text-lg">{title}</P>
				</View>

				<View className="flex flex-col justify-end pr-4">
					<View className="flex-row items-end justify-end gap-1">
						<P className="text-5xl !mb-0 !pb-0">{score}</P>

						<Muted>/ 100</Muted>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex-1 w-full h-40 items-center justify-center rounded-xl px-4 py-4 bg-card"
		>
			<View className="flex-row justify-between items-start px-4 py-4 w-full">
				<View>
					<H3 className="font-bold mb-2">{title}</H3>
					<P className="text-sm opacity-80">{description}</P>
				</View>
				<Score score={score} size="xs" />
			</View>
		</TouchableOpacity>
	);
}
