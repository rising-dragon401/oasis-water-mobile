import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function HeaderBackButton({ backPath }: { backPath: string }) {
	const navigation = useNavigation();
	const router = useRouter();
	const { iconColor } = useColorScheme();

	const clearBackPath = () => {
		router.setParams({ backPath: "" });
	};

	return (
		<TouchableOpacity
			onPress={() => {
				if (backPath && backPath !== "") {
					// @ts-ignore
					navigation.navigate(backPath);
					clearBackPath();
				} else {
					navigation.goBack();
				}
			}}
			className="flex flex-row items-center gap-1"
		>
			<Ionicons name="arrow-back" size={20} color={iconColor} />
			<P className="text-base">Back</P>
		</TouchableOpacity>
	);
}
