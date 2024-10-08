import { Button } from "@/components/ui/button";
import * as ProgressPrimitive from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { H1, P } from "@/components/ui/typography";
import { Ionicons } from "@expo/vector-icons"; // If using expo for icons
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Image,
	TouchableOpacity,
	View,
} from "react-native";

export default function OnboardingScreen() {
	const [currentStep, setCurrentStep] = useState(0);
	const totalSteps = 3; // Adjust based on your total number of steps
	const [selectedOption, setSelectedOption] = useState(null);
	const [toggleState, setToggleState] = useState(true); // Default to yes
	const [direction, setDirection] = useState("forward"); // Track direction of navigation

	const windowHeight = Dimensions.get("window").height;

	// Define your onboarding steps
	const steps = [
		{
			title: "Drink with confidence",
			subtitle:
				"Get lab-tested data on your water and filters, ensuring transparency and healthier choices every time.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/toxins%20in%20water%20graphic.png?t=2024-10-08T05%3A26%3A22.658Z", // Add image option
			component: null, // Add component option
		},
		{
			title: "Stay notified of the latest research",
			subtitle:
				"Get weekly updates on the latest research and insights on water quality and health delivered to your inbox.",
			image: null,
			component: (
				<View className="flex flex-row items-center gap-2">
					<Switch
						checked={toggleState}
						onCheckedChange={setToggleState}
						nativeID="onboarding-toggle"
					/>
					<P>Subscribe</P>
				</View>
			), // Add component option
		},
		// Add more steps here if necessary
	];

	const slideAnim = useRef(new Animated.Value(0)).current;
	const [currentStepAnim] = useState(new Animated.Value(0));
	const windowWidth = Dimensions.get("window").width;

	useEffect(() => {
		Animated.timing(currentStepAnim, {
			toValue: currentStep,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [currentStep]);

	const handleNextStep = () => {
		setDirection("forward");
		setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
	};

	const handlePrevStep = () => {
		setDirection("backward");
		setCurrentStep((prev) => Math.max(0, prev - 1));
	};

	const getSlideStyle = (index: number) => {
		const inputRange = [index - 1, index, index + 1];
		const translateX = currentStepAnim.interpolate({
			inputRange,
			outputRange: [windowWidth, 0, -windowWidth],
		});

		return {
			transform: [{ translateX }],
			position: "absolute",
			width: "100%",
			height: "100%",
		};
	};

	return (
		<View className="flex-1 px-8">
			{/* Back Button and Progress Bar */}
			<View className="flex-row items-center justify-center mb-4 p-4 relative">
				{currentStep !== 0 && (
					<TouchableOpacity
						onPress={handlePrevStep}
						disabled={currentStep === 0}
						className="absolute left-4"
					>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
				)}
				<View className="w-3/4">
					<ProgressPrimitive.Root
						value={currentStep + 1}
						max={totalSteps}
						className="w-full bg-muted rounded-full h-2.5"
					>
						<ProgressPrimitive.Indicator
							className="h-full bg-primary rounded-full"
							style={{
								width: `${((currentStep + 1) / totalSteps) * 100}%`,
							}}
						/>
					</ProgressPrimitive.Root>
				</View>
			</View>

			{/* Content */}
			<View style={{ flex: 1, overflow: "hidden" }}>
				{steps.map((step, index) => (
					<Animated.View key={index} style={getSlideStyle(index) as any}>
						<View className="flex flex-col gap-2">
							<H1>{step.title}</H1>
							<P>{step.subtitle}</P>
						</View>

						<View className="flex justify-center items-center mb-4 mt-8">
							{step.image && (
								<View
									style={{
										width: "100%",
										height: windowHeight * 0.44,
										marginBottom: 16,
										paddingHorizontal: 0,
									}}
								>
									<Image
										source={{ uri: step.image }}
										style={{
											width: "100%",
											height: "100%",
											borderRadius: 20,
											resizeMode: "cover",
											shadowColor: "#000",
											shadowOpacity: 0.2,
											shadowRadius: 10,
										}}
									/>
								</View>
							)}
							{step.component && (
								<View style={{ marginBottom: 20 }}>{step.component}</View>
							)}
						</View>
					</Animated.View>
				))}
			</View>

			{/* Continue Button pinned to bottom */}
			<View
				style={{
					padding: 16,
					width: "100%",
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
				}}
			>
				<Button
					onPress={handleNextStep}
					variant="default"
					className="!h-16 w-full"
					label="Continue"
				/>
			</View>
		</View>
	);
}
