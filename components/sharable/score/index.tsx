import { Feather, Octicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Circle, Svg } from "react-native-svg";

import { Muted, P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
	score: number;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	untested?: boolean;
	showScore?: boolean;
	showTooltip?: boolean;
	tooltipContent?: string;
	itemDetails?: {
		productId: string;
		productType: string;
	};
};

export default function Score({
	score,
	size,
	untested = false,
	showScore = false,
	showTooltip = false,
	tooltipContent = "",
	itemDetails,
}: Props) {
	const router = useRouter();
	const { hasActiveSub } = useSubscription();
	const {
		mutedForegroundColor,
		greenColor,
		yellowColor,
		redColor,
		accentColor,
	} = useColorScheme();
	const showToast = useToast();
	const pathName = usePathname();

	const roundedScore = Math.round(score);

	const radius =
		size === "xl"
			? 80
			: size === "lg"
				? 70
				: size === "md"
					? 50
					: size === "sm"
						? 42
						: size === "xs"
							? 34
							: 40;

	const strokeWidth =
		size === "xl"
			? 14
			: size === "lg"
				? 12
				: size === "md"
					? 8
					: size === "sm"
						? 6
						: size === "xs"
							? 6
							: 6;

	const svgSize = 2 * (radius + strokeWidth); // Adjust SVG size to accommodate stroke
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (roundedScore / 100) * circumference;

	const gradeColor =
		roundedScore >= 70
			? greenColor
			: roundedScore >= 40
				? yellowColor
				: redColor;

	const gradeBackground =
		roundedScore >= 70
			? greenColor
			: roundedScore >= 40
				? yellowColor
				: roundedScore >= 50
					? yellowColor
					: redColor;

	const fontSize =
		size === "xl"
			? 28
			: size === "lg"
				? 24
				: size === "md"
					? 18
					: size === "sm"
						? 12
						: size === "xs"
							? 12
							: 10;

	const grade = () => {
		if (untested) {
			return "Untested";
		}

		if (roundedScore >= 90) {
			return "Excellent";
		} else if (roundedScore >= 70) {
			return "Good";
		} else if (roundedScore >= 50) {
			return "Alright";
		} else if (roundedScore >= 0) {
			return "Poor";
			// @ts-ignore
		} else if (score === "?" || score === undefined || score === null) {
			return "Untested";
		} else if (roundedScore === 0) {
			return "Missing";
		} else {
			return "Missing tests";
		}
	};

	const paddingTop =
		size === "xl"
			? 8
			: size === "lg"
				? 6
				: size === "md"
					? 2
					: size === "sm"
						? 0
						: size === "xs"
							? 0
							: 0;

	const handleOpenSubscribeModal = async () => {
		router.push({
			pathname: "/subscribeModal",
			params: {
				...itemDetails,
				path: pathName,
				feature: "item-analysis",
				component: "locked-score",
			},
		});
	};

	const handleShowTooltip = () => {
		showToast(tooltipContent);
	};

	// Unindexed items have a score of 0
	if (!hasActiveSub && !showScore) {
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
						<Octicons name="lock" size={16} color={accentColor} />
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
					stroke={gradeBackground}
					strokeWidth={strokeWidth}
					fill="transparent"
					r={radius}
					cx={svgSize / 2}
					cy={svgSize / 2}
					strokeOpacity={0.3}
				/>
				<Circle
					stroke={gradeColor}
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
			<TouchableOpacity
				onPress={handleShowTooltip}
				disabled={!showTooltip}
				className="absolute flex flex-col justify-center items-center"
			>
				{!untested ? (
					<P style={{ fontSize }} className={`gap-1 pt-${paddingTop}`}>
						{roundedScore} / 100
					</P>
				) : (
					<View className="flex flex-row gap-1">
						<Feather
							name="alert-triangle"
							size={18}
							color={mutedForegroundColor}
						/>
						<P>/ 100</P>
					</View>
				)}

				<Muted className="text-center text-xs max-w-14">{grade()}</Muted>
			</TouchableOpacity>
		</View>
	);
}
