import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreCard({
	title,
	description,
	score,
	onPress,
	type = "large_row",
	healthEffects,
	icon,
	scoreLocked = false,
	totalContaminants = 0,
	totalContaminantsAboveLimit = 0,
	totalHealthRisks = 0,
}: {
	title: string;
	description: string;
	score: number;
	onPress: () => void;
	type?: "square" | "large_row" | "small_row";
	healthEffects?: any[];
	icon?: React.ReactNode;
	scoreLocked?: boolean;
	totalContaminants?: number;
	totalContaminantsAboveLimit?: number;
	totalHealthRisks?: number;
}) {
	const { iconColor } = useColorScheme();

	const ratingColor =
		score > 70
			? "text-green-300"
			: score > 50
				? "text-yellow-300"
				: "text-red-400";

	const textColor = "text-stone-800";

	if (type === "square") {
		return (
			<TouchableOpacity
				onPress={onPress}
				className="flex-1 flex-col bg-card rounded-xl px-4 pb-4 pt-4 justify-between border border-border gap-12"
			>
				<P className="text-lg">{title}</P>

				{totalContaminants > 0 && (
					<View className="flex-row gap-2">
						<View className="w-4 h-4 bg-red-400 rounded-full" />
						<P>{totalContaminants} contaminants detected</P>
					</View>
				)}

				<View className="flex-row justify-between items-end">
					{scoreLocked ? (
						<Octicons name="lock" size={24} color={iconColor} />
					) : (
						<P className="text-5xl">{score}</P>
					)}
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
				<View className="flex flex-col h-full justify-between flex-wrap">
					{icon}
					<P className="text-lg">{title}</P>
					<Muted className="flex-wrap w-64">{description}</Muted>
				</View>

				<View className="flex flex-col justify-end pr-4">
					<View className="flex-row items-end justify-end gap-1">
						{scoreLocked ? (
							<Octicons name="lock" size={28} color={iconColor} />
						) : (
							<P className="text-5xl">{score}</P>
						)}

						<Muted>/ 100</Muted>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex-1 w-full h-44 flex-row bg-card rounded-xl pl-4 pr-2 pt-4 pb-4  justify-between items-end border border-border"
		>
			<View className="flex flex-col h-full justify-between">
				{icon}
				<P className="text-lg">{title}</P>

				{scoreLocked && (
					<View className="flex-col gap-2">
						<View className="flex-row gap-2 items-center">
							<View className="w-4 h-4 bg-red-400 rounded-full" />
							<P>contaminants detected</P>
						</View>
						<View className="flex-row gap-2 items-center">
							<View className="w-4 h-4 bg-red-400 rounded-full" />
							<P>above guidelines</P>
						</View>

						<View className="flex-row gap-2 items-center">
							<View className="w-4 h-4 bg-red-400 rounded-full" />
							<P>health risks</P>
						</View>
					</View>
				)}
			</View>

			<View className="flex flex-col justify-end pr-4">
				<View className="flex-row items-end justify-end gap-1">
					{scoreLocked ? (
						<Octicons name="lock" size={36} color={iconColor} />
					) : (
						<P className="text-5xl">{score}</P>
					)}

					<Muted>/ 100</Muted>
				</View>
			</View>
		</TouchableOpacity>
	);
}
