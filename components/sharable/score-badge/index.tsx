import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Small } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreBadge() {
	const router = useRouter();
	const { iconColor } = useColorScheme();
	const { subscription, userScores } = useUserProvider();

	const score = userScores?.overallScore || 0;

	const getBgColor = (score: number) => {
		if (score === null) {
			return "bg-zinc-300";
		} else if (score > 70) {
			return "bg-emerald-300";
		} else if (score > 50) {
			return "bg-amber-300";
		} else {
			return "bg-rose-300";
		}
	};

	return (
		<TouchableOpacity
			onPress={() => router.push("/(protected)/oasis")}
			className={`flex-row items-center justify-end rounded-full px-4 py-2 gap-x-2  `}
		>
			{subscription && (
				<View className="flex-row items-center gap-x-1">
					<View className={`w-3 h-3 rounded-full ${getBgColor(score)}`} />
					<Small>{score ? `${score}/100` : "0/100"}</Small>
				</View>
			)}

			{!subscription && (
				<View className="flex-row items-end gap-x-1 bg-muted rounded-full px-4 py-2">
					<Octicons name="lock" size={14} color={iconColor} />
					<Small>/ 100</Small>
				</View>
			)}
		</TouchableOpacity>
	);
}
