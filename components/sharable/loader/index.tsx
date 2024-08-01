import { ActivityIndicator } from "react-native";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	size?: "small" | "large";
	defaultColor?: "dark" | "light";
};

export default function Loader({ size = "large", defaultColor }: Props) {
	const { colorScheme } = useColorScheme();

	const colorTheme = defaultColor || colorScheme;

	const color =
		colorTheme === "dark" ? theme.dark.background : theme.light.background;

	return <ActivityIndicator size={size} color={color} />;
}
