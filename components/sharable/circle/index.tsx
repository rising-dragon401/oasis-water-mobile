import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle as SvgCircle } from "react-native-svg";

interface CircleProps {
	value: number;
	size: number;
	strokeWidth: number;
}

export function Circle({ value, size, strokeWidth }: CircleProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const progress = (value / 100) * circumference;

	let strokeColor;
	if (value > 70) {
		strokeColor = "#10b981"; // green
	} else if (value >= 40) {
		strokeColor = "#fbbf24"; // yellow
	} else {
		strokeColor = "#ef4444"; // red
	}

	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size}>
				<SvgCircle
					stroke="#e5e7eb"
					fill="none"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
				/>
				<SvgCircle
					stroke={strokeColor}
					fill="none"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${progress} ${circumference}`}
					strokeLinecap="round"
				/>
			</Svg>
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>{value}</Text>
			</View>
		</View>
	);
}
