import { P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

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
			className="mb-3 flex flex-row items-center gap-2"
		>
			<Octicons name="chevron-left" size={24} color={iconColor} />
			<P className="self-start">back</P>
		</TouchableOpacity>
	);
}
