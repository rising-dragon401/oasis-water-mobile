import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import Typography from "../typography";

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
		<View>
			<Typography size="base" fontWeight="normal" className="text-primary my-0">
				<Text className={labelClassName}>{label}: </Text>

				<TouchableOpacity
					onPress={showPaywall ? handleOpenPaywall : undefined}
					className="min-w-14"
				>
					<Text>{value}</Text>
				</TouchableOpacity>
			</Typography>
		</View>
	);
}
