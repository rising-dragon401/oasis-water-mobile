import { ActivityIndicator } from "react-native";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function Loader() {
	const { colorScheme } = useColorScheme();

	const color =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return <ActivityIndicator size="large" color={color} />;
}
