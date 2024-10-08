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

	const textColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	const textSecondaryColor =
		colorScheme === "dark" ? theme.dark.secondary : theme.light.secondary;

	const mutedColor =
		colorScheme === "dark" ? theme.dark.muted : theme.light.muted;

	const accentColor =
		colorScheme === "dark" ? theme.dark.accent : theme.light.accent;

	return {
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
		iconColor,
		borderColor,
		backgroundColor,
		textColor,
		textSecondaryColor,
		mutedColor,
		accentColor,
	};
}
