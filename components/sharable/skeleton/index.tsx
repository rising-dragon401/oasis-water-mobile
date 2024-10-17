import React from "react";
import { View, ViewStyle } from "react-native";

import { useColorScheme } from "@/lib/useColorScheme";

interface SkeletonProps {
	width?: number | string;
	height?: number | string;
	style?: ViewStyle;
}
const Skeleton: React.FC<SkeletonProps> = ({
	width = 180,
	height = 120,
	style,
}) => {
	const { mutedColor } = useColorScheme();

	return (
		<View className="flex flex-col mr-4">
			<View style={{ width: typeof width === "number" ? width : "100%" }}>
				<View
					style={{
						width: "100%",
						height: typeof height === "number" ? height : "100%",
						borderRadius: 8,
						backgroundColor: mutedColor,
						...style,
					}}
				/>
			</View>
		</View>
	);
};

export default Skeleton;
