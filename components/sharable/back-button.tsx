import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function BackButton() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	return (
		<TouchableOpacity
			onPress={() => {
				router.back();
			}}
			className="flex flex-row items-center gap-1"
		>
			<Ionicons name="arrow-back" size={20} color={iconColor} />
			<P className="text-base">Back</P>
		</TouchableOpacity>
	);
}
