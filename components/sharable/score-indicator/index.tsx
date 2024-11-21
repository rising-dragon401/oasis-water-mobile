import { View } from "react-native";

import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreIndicator({
	value,
	width = 4,
	height = 4,
}: {
	value: "good" | "ok" | "bad";
	width: number;
	height: number;
}) {
	const { greenColor, yellowColor, redColor } = useColorScheme();

	const getBgColor = () => {
		if (value === "good") {
			return greenColor;
		} else if (value === "ok") {
			return yellowColor;
		} else {
			return redColor;
		}
	};

	return (
		<View
			className={`w-${width} h-${height} rounded-full`}
			style={{ backgroundColor: getBgColor() }}
		/>
	);
}
