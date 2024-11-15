import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, usePathname } from "expo-router";
import { TouchableOpacity } from "react-native";

import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function HeaderBackButton({ backPath }: { backPath: string }) {
	const navigation = useNavigation();
	const { iconColor } = useColorScheme();

	const currentPage = usePathname();

	const isInSameStack = currentPage === "/research/view-all";

	return (
		<TouchableOpacity
			onPress={(canGoBack) => {
				if (isInSameStack) {
					navigation.goBack();
				} else if (backPath) {
					// @ts-ignore
					navigation.navigate(backPath);
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
