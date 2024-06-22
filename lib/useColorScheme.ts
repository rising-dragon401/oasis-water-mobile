import { theme } from "@/lib/constants";
import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
	const { colorScheme, setColorScheme, toggleColorScheme } =
		useNativewindColorScheme();

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	const borderColor =
		colorScheme === "dark" ? theme.dark.border : theme.light.border;

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return {
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
		iconColor,
		borderColor,
		backgroundColor,
	};
}
