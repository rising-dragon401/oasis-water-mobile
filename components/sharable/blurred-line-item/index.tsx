import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useUserProvider } from "@/context/user-provider";
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
	itemDetails?: {
		productId: string;
		productType: string;
	};
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
	itemDetails,
}: BlurredLineItemProps) {
	const router = useRouter();
	const { userData } = useUserProvider();
	const { hasActiveSub } = useSubscription();
	const {
		textColor,
		mutedForegroundColor,
		greenColor,
		redColor,
		neutralColor,
	} = useColorScheme();

	const isItemUnlocked = useMemo(() => {
		return userData?.unlock_history?.some((unlock: any) => {
			return (
				unlock.product_id === itemDetails?.productId &&
				unlock.product_type === itemDetails?.productType
			);
		});
	}, [userData, itemDetails]);

	const handleOpenPaywall = () => {
		if (!hasActiveSub) {
			router.push({
				pathname: "/subscribeModal",
				params: itemDetails,
			});
		}
	};

	const showPaywall = !hasActiveSub && isPaywalled && !isItemUnlocked;

	const colorMark = untested
		? neutralColor
		: score === "good"
			? greenColor
			: score === "bad"
				? redColor
				: neutralColor;

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
							<Feather
								name="alert-triangle"
								size={18}
								color={mutedForegroundColor}
							/>
						) : (
							<>
								<P className="text-right text-lg text-muted-foreground">
									{value}
								</P>
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
					</>
				)}
			</View>
		</View>
	);
}
