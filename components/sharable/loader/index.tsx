import { ActivityIndicator } from "react-native";

import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	size?: "small" | "large";
	defaultColor?: "dark" | "light";
};

export default function Loader({ size = "large", defaultColor }: Props) {
	const { colorScheme, foregroundColor } = useColorScheme();

	return <ActivityIndicator size={size} color={foregroundColor} />;
}
