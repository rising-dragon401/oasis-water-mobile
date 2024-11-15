import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreCard({
	score,
	title,
	icon,
	id,
}: {
	score: number;
	title: string;
	icon: React.ReactNode;
	id: string;
}) {
	const { mutedForegroundColor } = useColorScheme();
	const router = useRouter();
	const scoreColor = useMemo(() => {
		if (score > 70) return "text-green-500";
		if (score > 50) return "text-yellow-500";
		return "text-red-500";
	}, [score]);

	const handlePress = () => {
		router.push(`/(protected)/profile/score/${id}`);
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			className="flex-1 flex-row w-full gap-2 h-32 p-4 rounded-xl border border-muted bg-white justify-between items-start"
		>
			<View className="flex flex-col items-start justify-between gap-4">
				<View className="flex flex-row items-center justify-center gap-2">
					{icon}
					<P className="flex-shrink text-wrap">{title}</P>
				</View>
				<View className="flex flex-row items-end justify-center gap-1">
					<P className={`text-4xl font-semibold ${scoreColor}`}>{score}</P>
					<P className={`text-xl font-semibold ${scoreColor}`}>%</P>
				</View>
			</View>

			<Ionicons name="chevron-forward" size={18} color={mutedForegroundColor} />
		</TouchableOpacity>
	);
}
