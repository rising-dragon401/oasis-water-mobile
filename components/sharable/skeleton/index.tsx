import { useColorScheme } from "@/lib/useColorScheme";
import React from "react";
import { View, ViewStyle } from "react-native";

interface SkeletonProps {
	width?: number;
	height?: number;
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
			<View style={{ width }}>
				<View
					style={{
						width,
						height,
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
