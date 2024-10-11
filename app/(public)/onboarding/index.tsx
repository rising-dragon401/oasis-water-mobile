import { updateUserData } from "@/actions/user";
import LocationSelector from "@/components/sharable/location-selector";
import { SubscribeOnboarding } from "@/components/sharable/subscribe-onboarding";
import { Button } from "@/components/ui/button";
import * as ProgressPrimitive from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { H1, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { Ionicons } from "@expo/vector-icons"; // If using expo for icons
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Image,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";

export default function OnboardingScreen() {
	const [currentStep, setCurrentStep] = useState(0); // Adjust based on your total number of steps
	const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] =
		useState(true); // Default to yes
	const [direction, setDirection] = useState("forward"); // Track direction of navigation
	const [loadingPurchase, setLoadingPurchase] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<{
		placeId: string;
		reference: string;
		formattedAddress: string;
		zipCode: string;
		city: string;
		state: string;
		country: string;
	} | null>(null);

	const router = useRouter();
	const { user, userData, subscription } = useUserProvider();
	const { packages, purchasePackage } = useRevenueCat();
	const { iconColor, mutedForegroundColor } = useColorScheme();

	const windowWidth = Dimensions.get("window").width;
	const windowHeight = Dimensions.get("window").height;

	// Onboarding steps
	const steps = [
		{
			title: "Drink with confidence",
			subtitle:
				"Get lab-tested data on your water and filters, ensuring transparency and healthier choices every time.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/toxins%20in%20water%20graphic.png?t=2024-10-08T05%3A26%3A22.658Z", // Add image option
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.44,
				resizeMode: "contain",
				borderRadius: 20,
				marginTop: 18,
			},
			component: null,
			onSubmit: null,
			submitButtonLabel: "Continue",
			onSkip: null,
			canSkip: false,
		},
		{
			title: "Stay notified of the latest research",
			subtitle:
				"Get weekly updates on the latest research and insights on water quality and health delivered to your inbox.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/app%20newsletter%20subscribe.png?t=2024-10-08T17%3A34%3A58.212Z",
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.44,
				resizeMode: "contain",
			},
			component: (
				<View className="flex flex-col items-center w-full">
					<View className="flex flex-row items-center gap-2 justify-center">
						<Switch
							checked={isSubscribedToNewsletter}
							onCheckedChange={setIsSubscribedToNewsletter}
							nativeID="onboarding-toggle"
						/>
						<P>Get weekly updates</P>
					</View>
				</View>
			),
			onSubmit: () => {
				handleUpateSubStatus();
			},
			submitButtonLabel: "Continue",
			onSkip: null,
			canSkip: false,
		},
		{
			title: "Where are you based?",
			subtitle:
				"This will help us find the best local water and filter brands for you (keep in mind we only support the US currently).",
			image: null,
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.44,
				resizeMode: "contain",
			},
			component: (
				<LocationSelector
					address={selectedAddress}
					setAddress={setSelectedAddress}
				/>
			),
			onSubmit: () => {
				handleUpdateLocation();
			},
			submitButtonLabel: "Continue",
			onSkip: null,
			canSkip: false,
		},
		{
			title: "Unlock the top rated water and filters",
			subtitle:
				"Your membership funds independent lab testing (which is expensive!) and helps keep Oasis unbiased.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/paywall%20cards.jpg",
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.2,
				resizeMode: "contain",
			},
			component: <SubscribeOnboarding />,
			onSubmit: () => {
				handleSubscribe();
			},
			submitButtonLabel: "Start 3 day free trial",
			onSkip: null,
			skipButtonLabel: "No thanks, continue with basic and view limited data",
			canSkip: true,
		},
	];

	const totalSteps = steps.length;
	const slideAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Run this whenever the step changes
		Animated.timing(slideAnim, {
			toValue: -currentStep * windowWidth,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [currentStep, windowWidth]);

	const handleNextStep = async (submit: boolean) => {
		setDirection("forward");

		// only if user pressed submit button and there is a submit function
		if (submit && steps[currentStep].onSubmit) {
			await steps[currentStep].onSubmit();
		}

		const nextStep = currentStep + 1;

		// Skip the last step if user already has a subscription
		if (nextStep === totalSteps - 1 && subscription) {
			handleFinishOnboarding();
		} else {
			setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
		}
	};

	const handlePrevStep = () => {
		setDirection("backward");
		setCurrentStep((prev) => Math.max(0, prev - 1));
	};

	const handleFinishOnboarding = async () => {
		await updateUserData(userData.id, "is_onboarded", true);
		router.push("/(protected)/search");
	};

	const handleUpateSubStatus = async () => {
		await updateUserData(
			userData.id,
			"newsletter_subscribed",
			isSubscribedToNewsletter,
		);
	};

	const handleUpdateLocation = async () => {
		console.log("selectedAddress", selectedAddress);
		await updateUserData(userData.id, "location", selectedAddress);
	};

	const handleSubscribe = async () => {
		setLoadingPurchase(true);

		try {
			if (!user || !userData) {
				throw new Error("User not found");
			}

			const pack = packages[0];

			console.log("pack", pack);

			if (!pack) {
				console.log("No package found");
				throw new Error("No package found");
			}

			const res = await purchasePackage!(pack);

			if (res) {
				// Handle success here
				handleFinishOnboarding();
				// TODO impelement toast
			}
		} catch (e) {
			throw new Error(e as string);
		}

		setLoadingPurchase(false);
	};

	function getSlideStyle(): Animated.AnimatedProps<ViewStyle> {
		return {
			transform: [{ translateX: slideAnim }],
			width: windowWidth * steps.length,
			flexDirection: "row" as const,
		};
	}

	return (
		<View className="flex-1 pb-14">
			{/* Back Button and Progress Bar */}
			<View className="flex flex-row items-center justify-between mb-4 p-4 px-8 w-full">
				<View className="w-14 flex flex-row justify-center">
					{currentStep !== 0 ? (
						<TouchableOpacity
							onPress={handlePrevStep}
							disabled={currentStep === 0}
						>
							<Ionicons name="arrow-back" size={24} color={iconColor} />
						</TouchableOpacity>
					) : (
						<View style={{ width: 24, height: 24 }} />
					)}
				</View>
				<View className="flex-1 mx-4">
					<ProgressPrimitive.Root
						value={currentStep + 1}
						max={totalSteps}
						className="w-full bg-muted rounded-full h-2"
					>
						<ProgressPrimitive.Indicator
							className="h-full bg-primary rounded-full transition-all duration-500"
							style={{
								width: `${((currentStep + 1) / totalSteps) * 100}%`,
							}}
						/>
					</ProgressPrimitive.Root>
				</View>
				<View className="w-14 flex flex-row justify-center">
					{currentStep === totalSteps - 1 ? (
						<TouchableOpacity onPress={handleFinishOnboarding}>
							<Ionicons name="close" size={24} color={mutedForegroundColor} />
						</TouchableOpacity>
					) : (
						<View style={{ width: 24, height: 24 }} />
					)}
				</View>
			</View>

			{/* Content */}
			<View className="flex-1 overflow-hidden">
				<Animated.View
					style={getSlideStyle() as Animated.AnimatedProps<ViewStyle>}
				>
					{steps.map((step, index) => (
						<View key={index} style={{ width: windowWidth }} className="px-8">
							<View className="flex flex-col gap-2">
								<H1>{step.title}</H1>
								<P>{step.subtitle}</P>
							</View>
							<View className="flex justify-center items-center mb-4">
								{step.image && (
									<Image
										source={{ uri: step.image }}
										style={step.imageStyle as any}
										className="rounded-2xl"
										resizeMode="cover"
									/>
								)}
								{step.component && (
									<View className="flex w-full" style={{ marginBottom: 20 }}>
										{step.component}
									</View>
								)}
							</View>
						</View>
					))}
				</Animated.View>
			</View>

			{/* Continue Button pinned to bottom */}
			<View className="px-8">
				<Button
					onPress={() => handleNextStep(true)}
					variant="default"
					className="!h-20 w-full"
					label={steps[currentStep].submitButtonLabel}
					loading={loadingPurchase}
				/>
				<View className="text-center mt-2 h-8">
					{currentStep === steps.length - 1 && (
						<P className="text-center">
							Free for 3 days then $4 /mo ($47 annual charge)
						</P>
					)}
				</View>
				{/* {steps[currentStep].canSkip && (
					<Button
						onPress={() => handleNextStep(false)}
						variant="ghost"
						className="!h-16 w-full"
						label="No thanks, continue with basic and view limited data"
					/>
				)} */}
			</View>
		</View>
	);
}
