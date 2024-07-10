import { useColorScheme } from "@/lib/useColorScheme";
import { Feather } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";

type BlurredLineItemProps = {
	label: string;
	value: string;
	labelClassName?: string;
	flexDirection?: "row" | "col";
	isPaywalled?: boolean;
};

export default function BlurredLineItem({
	label,
	value,
	labelClassName,
	flexDirection = "row",
	isPaywalled = false,
}: BlurredLineItemProps) {
	const router = useRouter();
	const { subscription } = useUserProvider();
	const { iconColor } = useColorScheme();

	const handleOpenPaywall = () => {
		if (!subscription) {
			router.push("/subscribeModal");
		}
	};

	const showPaywall = !subscription && isPaywalled;

	const alignItems = flexDirection === "row" ? "items-center" : "items-left";

	return (
		<View
			className={`flex flex-${flexDirection} ${alignItems} justify-between`}
		>
			<P className={labelClassName}>{label}: </P>

			{!showPaywall && <P>{value}</P>}

			{showPaywall && (
				<TouchableOpacity
					onPress={showPaywall ? handleOpenPaywall : undefined}
					className=""
				>
					<Feather name="lock" size={18} color={iconColor} />
				</TouchableOpacity>
			)}
		</View>
	);
}
