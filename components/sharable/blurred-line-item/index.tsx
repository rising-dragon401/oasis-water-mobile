import { useColorScheme } from "@/lib/useColorScheme";
import { Feather } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";

type BlurredLineItemProps = {
	label: string;
	value?: string;
	labelClassName?: string;
	flexDirection?: "row" | "col";
	isPaywalled?: boolean;
	score?: "good" | "bad" | "neutral";
};

export default function BlurredLineItem({
	label,
	value,
	labelClassName,
	flexDirection = "row",
	isPaywalled = false,
	score,
}: BlurredLineItemProps) {
	const router = useRouter();
	const { subscription } = useUserProvider();
	const { textColor } = useColorScheme();

	const handleOpenPaywall = () => {
		if (!subscription) {
			router.push("/subscribeModal");
		}
	};

	const showPaywall = !subscription && isPaywalled;

	const colorMark =
		score === "good"
			? "bg-green-200"
			: score === "bad"
				? "bg-red-200"
				: "bg-gray-200";

	return (
		<View className="flex flex-row justify-between w-full">
			<P className="flex-wrap">{label}</P>

			<View className="flex flex-row gap-2 items-center">
				{showPaywall ? (
					<TouchableOpacity
						onPress={handleOpenPaywall}
						className="cursor-pointer flex flex-row items-center"
					>
						<Feather name="lock" size={16} color={textColor} />
						<View className={`min-w-8 h-4 rounded-full ${colorMark} ml-2`} />
					</TouchableOpacity>
				) : (
					<>
						<P className="text-right">{value}</P>
						<View className={`min-w-8 h-4 rounded-full ${colorMark}`} />
					</>
				)}
			</View>
		</View>
	);
}
