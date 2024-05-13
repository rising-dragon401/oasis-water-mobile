"use client";

import { H4, Muted, P } from "@/components/ui/typography";
import { Octicons } from "@expo/vector-icons";
import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import Typography from "../typography";

type Props = {
	score: number;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export default function Score({ score, size }: Props) {
	const router = useRouter();
	const { subscription } = useUserProvider();

	const radius =
		size === "xl"
			? 80
			: size === "lg"
				? 70
				: size === "md"
					? 60
					: size === "sm"
						? 50
						: 40;
	const strokeWidth = 6;
	const svgSize = 2 * (radius + strokeWidth); // Adjust SVG size to accommodate stroke
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (score / 100) * circumference;

	const fontSize =
		size === "xl"
			? 18
			: size === "lg"
				? 16
				: size === "md"
					? 14
					: size === "sm"
						? 12
						: 10;
	// const color =
	//   score >= 70 ? 'stroke-green-500' : score >= 40 ? 'stroke-yellow-500' : 'stroke-red-500'

	const color = "stroke-blue-800";

	const grade = () => {
		if (score >= 90) {
			return "Excellent";
		} else if (score >= 70) {
			return "Good";
		} else if (score >= 50) {
			return "Alright";
		} else if (score >= 35) {
			return "Poor";
		} else {
			return "Bad";
		}
	};

	const handleOpenSubscribeModal = () => {
		router.push("/subscribeModal");
	};

	// Unindexed items have a score of 0
	if (!subscription && score !== 0) {
		return (
			<TouchableOpacity
				onPress={handleOpenSubscribeModal}
				style={{
					width: svgSize,
					height: svgSize,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Svg width={svgSize} height={svgSize}>
					<Circle
						stroke="gray"
						strokeWidth={strokeWidth}
						fill="transparent"
						r={radius}
						cx={svgSize / 2}
						cy={svgSize / 2}
					/>
				</Svg>
				<View className="absolute flex-1 flex-col justify-center items-center">
					<P>Score:</P>
					<View className="flex-1 flex-row items-center gap-2">
						<Octicons name="lock" size={16} color="blue" />
						<Muted>/ 100</Muted>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<View
			style={{
				width: svgSize,
				height: svgSize,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Svg width={svgSize} height={svgSize}>
				<Circle
					stroke="blue"
					strokeWidth={strokeWidth}
					fill="transparent"
					r={radius}
					cx={svgSize / 2}
					cy={svgSize / 2}
					strokeOpacity={0.3}
				/>
				<Circle
					stroke="blue"
					strokeWidth={strokeWidth}
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={offset}
					strokeLinecap="round"
					fill="transparent"
					r={radius}
					cx={svgSize / 2}
					cy={svgSize / 2}
				/>
			</Svg>
			<View className="absolute flex flex-col justify-center items-center">
				<View className="flex-1 flex-row items-center gap-2">
					<H4>{score}</H4>
					<P>/ 100</P>
				</View>

				{}
				<Typography
					size="base"
					fontWeight="normal"
					className="text-primary mt-1"
					style={{ fontSize: fontSize }}
				>
					{grade()}
				</Typography>
			</View>
		</View>
	);
}
