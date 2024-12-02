import Octicons from "@expo/vector-icons/Octicons";
import { Text, TouchableOpacity, View } from "react-native";

import { Muted, Small } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreBadge({ score }: { score: number }) {
	const { iconColor, redColor, greenColor, neutralColor } = useColorScheme();
	const { hasActiveSub } = useSubscription();

	const getBgColor = () => {
		if (score === null) {
			return redColor;
		} else if (score > 70) {
			return greenColor;
		} else if (score > 50) {
			return neutralColor;
		} else {
			return redColor;
		}
	};

	return (
		<TouchableOpacity
			onPress={() => console.log("pressed")}
			className={`flex-row items-center justify-end rounded-full px-4 py-2 gap-x-2  `}
		>
			{hasActiveSub && (
				<View className="flex-row items-center gap-x-1">
					<View
						className="w-2 h-2 rounded-full"
						style={{ backgroundColor: getBgColor() }}
					/>
					<Small className=" ">
						{score ? <Text className="font-bold text-lg">{score}</Text> : "0"}
						<Muted className="text-base">/100</Muted>
					</Small>
				</View>
			)}

			{!hasActiveSub && (
				<View className="flex-row items-end gap-x-1 rounded-full px-4 py-2">
					<Octicons
						name="lock"
						size={16}
						color={iconColor}
						style={{ fontWeight: "bold" }}
					/>
					<Small className="text-sm">/ 100</Small>
				</View>
			)}
		</TouchableOpacity>
	);
}
