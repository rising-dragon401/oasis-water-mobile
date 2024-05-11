import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";

type BlurredLineItemProps = {
	label: string;
	value: string;
	labelClassName?: string;
};

export default function BlurredLineItem({
	label,
	value,
	labelClassName,
}: BlurredLineItemProps) {
	const router = useRouter();
	const { subscription } = useUserProvider();

	const handleOpenPaywall = () => {
		if (!subscription) {
			router.push("/subscribeModal");
		}
	};

	const showPaywall = !subscription;

	return (
		<View className="flex flex-row items-center">
			<P className={labelClassName}>{label}: </P>

			<TouchableOpacity
				onPress={showPaywall ? handleOpenPaywall : undefined}
				className="min-w-14"
			>
				<P>{value}</P>
			</TouchableOpacity>
		</View>
	);
}
