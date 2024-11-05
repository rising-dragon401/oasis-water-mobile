import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Small } from "@/components/ui/typography";
export default function ScoreBadge({ score }: { score: number | null }) {
	const router = useRouter();

	const bgColor =
		score === null
			? "bg-gray-300"
			: score > 70
				? "bg-green-300"
				: score > 50
					? "bg-yellow-300"
					: "bg-red-300";

	return (
		<TouchableOpacity
			onPress={() => router.push("/scoreModal")}
			className={`flex-row items-center justify-end rounded-full px-4 py-2 gap-x-2  `}
		>
			<View className={`w-4 h-4 rounded-full ${bgColor}`} />
			<Small>{score ? `${score}/100` : "0/100"}</Small>
		</TouchableOpacity>
	);
}
