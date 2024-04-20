"use client";

import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import PaywallContent from "../paywall-content";
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

	if (!subscription) {
		return (
			<TouchableOpacity
				onPress={() => router.push("/subscribeModal")}
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
				<View className="absolute flex-1 flex-col ">
					<Typography
						size="xl"
						fontWeight="normal"
						className="flex gap-2 text-primary mb-0"
					>
						Score:
					</Typography>
					<View className="flex-1 flex-row">
						<PaywallContent label="" hideButton>
							<Typography
								size="xl"
								fontWeight="normal"
								className="text-primary"
							>
								{score}
							</Typography>
						</PaywallContent>
						<Typography
							size="xl"
							fontWeight="normal"
							className="flex gap-2 text-primary mb-0"
						>
							/ 100
						</Typography>
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
			<View
				className="absolute flex flex-col justify-center items-center"
				style={{ width: "100%", height: "100%" }}
			>
				<Typography
					size="xl"
					fontWeight="normal"
					className="flex gap-2 text-secondary mb-0"
				>
					<PaywallContent label="" hideButton={true}>
						<Typography size="xl" fontWeight="normal" className="text-primary">
							{score}
						</Typography>
					</PaywallContent>
					/ 100
				</Typography>

				<Typography
					size="base"
					fontWeight="normal"
					className="text-secondary"
					style={{ fontSize: fontSize }}
				>
					{grade()}
				</Typography>
			</View>
		</View>
	);
}
