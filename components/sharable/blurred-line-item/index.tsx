import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

type BlurredLineItemProps = {
	label: string;
	value?: string;
	labelClassName?: string;
	flexDirection?: "row" | "col";
	isPaywalled?: boolean;
	score?: "good" | "bad" | "neutral";
	icon?: React.ReactNode;
	untested?: boolean;
};

export default function BlurredLineItem({
	label,
	value,
	labelClassName,
	flexDirection = "row",
	isPaywalled = false,
	score,
	icon,
	untested = false,
}: BlurredLineItemProps) {
	const router = useRouter();
	const { subscription } = useUserProvider();
	const { textColor, mutedForegroundColor } = useColorScheme();

	const handleOpenPaywall = () => {
		if (!subscription) {
			router.push("/subscribeModal");
		}
	};

	const showPaywall = !subscription && isPaywalled;

	const colorMark = untested
		? "#E5E7EB" // gray-200
		: score === "good"
			? "#34D399" // emerald-400
			: score === "bad"
				? "#FB7185" // rose-400
				: "#E5E7EB"; // gray-200

	return (
		<View className="flex flex-row justify-between w-full py-1 ">
			<View className="flex flex-row items-center gap-x-2">
				{icon}
				<P className="flex-wrap text-lg">{label}</P>
			</View>

			<View className="flex flex-row gap-2 items-center">
				{showPaywall ? (
					<TouchableOpacity
						onPress={handleOpenPaywall}
						className="cursor-pointer flex flex-row items-center"
					>
						<Feather name="lock" size={16} color={textColor} />
						<View className={`w-4 h-4 rounded-full ${colorMark} ml-2`} />
					</TouchableOpacity>
				) : (
					<>
						{untested ? (
							<Ionicons name="help" size={16} color={mutedForegroundColor} />
						) : (
							<P className="text-right text-lg text-muted-foreground">
								{value}
							</P>
						)}
						<View
							className="rounded-full"
							style={{
								width: 14,
								height: 14,
								backgroundColor: colorMark,
							}}
						/>
					</>
				)}
			</View>
		</View>
	);
}
