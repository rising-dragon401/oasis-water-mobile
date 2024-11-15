import { useColorScheme as useNativewindColorScheme } from "nativewind";

import { theme } from "@/lib/constants";

export function useColorScheme() {
	const { colorScheme, setColorScheme, toggleColorScheme } =
		useNativewindColorScheme();

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	const secondaryColor =
		colorScheme === "dark" ? theme.dark.secondary : theme.light.secondary;

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

	const mutedForegroundColor =
		colorScheme === "dark"
			? theme.dark["muted-foreground"]
			: theme.light["muted-foreground"];

	const accentColor =
		colorScheme === "dark" ? theme.dark.accent : theme.light.accent;

	const foregroundColor =
		colorScheme === "dark" ? theme.dark.foreground : theme.light.foreground;
	const greenColor = "#2E8B57"; // Less dark green
	const yellowColor = "#FFDD57"; // Less harsh yellow
	const redColor = "#FF6F61"; // Less harsh red
	const neutralColor = "#E5E7EB";

	return {
		colorMode: colorScheme,
		colorScheme: colorScheme ?? "dark",
		isDarkColorScheme: colorScheme === "dark",
		secondaryColor,
		setColorScheme,
		toggleColorScheme,
		iconColor,
		borderColor,
		backgroundColor,
		textColor,
		textSecondaryColor,
		mutedColor,
		mutedForegroundColor,
		accentColor,
		foregroundColor,
		greenColor,
		yellowColor,
		redColor,
		neutralColor,
	};
}
