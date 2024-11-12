import { Ionicons } from "@expo/vector-icons"; // If using expo for icons
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import Toast from "react-native-root-toast";

import { getNearestLocation } from "@/actions/admin";
import {
	addWatersAndFiltersToUserFavorites,
	updateUserData,
} from "@/actions/user";
// import ItemSelector from "@/components/sharable/item-selector";
// import LocationSelector from "@/components/sharable/location-selector";
import { SubscribeOnboarding } from "@/components/sharable/subscribe-onboarding";
import { Button } from "@/components/ui/button";
import * as ProgressPrimitive from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { H1, Large, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";
// import { readableType } from "@/lib/utils";

export default function OnboardingScreen() {
	const router = useRouter();
	const { user, userData, userFavorites, subscription, uid } =
		useUserProvider();
	const { packages, purchasePackage } = useRevenueCat();
	const { iconColor, mutedForegroundColor } = useColorScheme();
	const showToast = useToast();

	const [currentStep, setCurrentStep] = useState<number>(0); // Adjust based on your total number of steps

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
		latitude: number;
		longitude: number;
	} | null>(null);
	const [selectedPlan, setSelectedPlan] = useState("weekly");
	const [favs, setFavs] = useState<any[]>([]);
	const [loadingSubStatus, setLoadingSubStatus] = useState(false);
	const [loadingLocation, setLoadingLocation] = useState(false);
	const [loadingFavs, setLoadingFavs] = useState(false);

	const windowWidth = Dimensions.get("window").width;
	const windowHeight = Dimensions.get("window").height;

	// Onboarding steps
	const steps = [
		{
			title: "Our water is contaminated",
			subtitle:
				"90% of drinking water is laced with endocrine disruptors, forever chemicals and other toxins, all upping the risk of inflammation, illness and other health issues.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/toxins%20in%20water%20graphic.png?t=2024-10-08T05%3A26%3A22.658Z", // Add image option
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.4,
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
			loading: loadingSubStatus,
			submitButtonLabel: "Continue",
			onSkip: null,
			canSkip: false,
		},
		// {
		// 	title: "Where are you based?",
		// 	subtitle:
		// 		"This is used to locate your nearest tap water report and find available brands",
		// 	image: null,
		// 	imageStyle: {
		// 		width: "100%",
		// 		height: windowHeight * 0.44,
		// 		resizeMode: "contain",
		// 	},
		// 	component: (
		// 		<View className="flex mt-8">
		// 			<LocationSelector
		// 				address={selectedAddress}
		// 				setAddress={setSelectedAddress}
		// 				initialAddress={userData?.location?.formattedAddress || null}
		// 			/>
		// 		</View>
		// 	),
		// 	onSubmit: () => {
		// 		handleUpdateLocation();
		// 	},
		// 	loading: loadingLocation,
		// 	submitButtonLabel: "Continue",
		// 	onSkip: () => {
		// 		setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
		// 	},
		// 	canSkip: true,
		// 	skipButtonLabel: "Skip",
		// },
		// {
		// 	title: "What do you drink?",
		// 	subtitle: "Enter all the bottled waters and filters you use",
		// 	image: null,
		// 	imageStyle: {
		// 		width: "100%",
		// 		height: windowHeight * 0.44,
		// 		resizeMode: "contain",
		// 	},
		// 	component: (
		// 		<View className="flex mt-6">
		// 			<ItemSelector
		// 				items={favs}
		// 				setItems={setFavs}
		// 				initialItems={userFavorites || []} // Pass in initial items
		// 			/>

		// 			{favs.length > 0 && (
		// 				<View className="flex flex-col items-center gap-4 mt-4 ">
		// 					{favs.map((fav) => (
		// 						<View
		// 							key={fav.id}
		// 							className="flex flex-row items-center gap-2 bg-card p-2 rounded-xl border border-border w-full py-2 px-4 justify-between"
		// 						>
		// 							<View className="flex flex-row items-center gap-2">
		// 								<Image
		// 									source={{ uri: fav.image }}
		// 									style={{ width: 36, height: 36 }}
		// 									className="rounded-lg"
		// 								/>
		// 								<View className="flex flex-col gap-0  flex-wrap">
		// 									<P className="max-w-64 font-medium" numberOfLines={1}>
		// 										{fav.name}
		// 									</P>
		// 									<Muted>{readableType(fav.type)}</Muted>
		// 								</View>
		// 							</View>

		// 							<TouchableOpacity onPress={() => handleRemoveFav(fav)}>
		// 								<Ionicons
		// 									name="close"
		// 									size={24}
		// 									color={mutedForegroundColor}
		// 								/>
		// 							</TouchableOpacity>
		// 						</View>
		// 					))}
		// 				</View>
		// 			)}
		// 		</View>
		// 	),
		// 	onSubmit: () => {
		// 		handleUpdateFavs();
		// 	},
		// 	loading: loadingFavs,
		// 	submitButtonLabel: "Continue",
		// 	onSkip: () => {
		// 		setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
		// 	},
		// 	canSkip: true,
		// 	skipButtonLabel: "Skip",
		// },
		{
			title: "Oasis Member",
			subtitle:
				"Join 10,000+ members transforming their water habits and supporting unbiased ratings.",
			titleStyle: "text-center",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/paywall%20cards.jpg",
			// image: null,
			imageStyle: {
				width: "70%",
				height: windowHeight * 0.16,
				resizeMode: "contain",
			},
			component: (
				<SubscribeOnboarding
					setSelectedPlan={setSelectedPlan}
					selectedPlan={selectedPlan}
				/>
			),
			onSubmit: () => {
				handleSubscribe();
			},
			loading: loadingPurchase,
			submitButtonLabel: "Try for free 💧",
			submitButtonStyles: "shadow-lg shadow-blue-500/50 bg-primary",
			onSkip: null,
			skipButtonLabel: "No thanks, continue with basic and view limited data",
			canSkip: false,
		},
	];

	const totalSteps = steps.length;
	const slideAnim = useRef(new Animated.Value(0)).current;

	// save current step to AsyncStorage
	useEffect(() => {
		const saveCurrentStep = async () => {
			try {
				await AsyncStorage.setItem("currentStep", currentStep.toString());
			} catch (error) {
				console.error("Failed to save current step to AsyncStorage", error);
			}
		};

		saveCurrentStep();
	}, [currentStep]);

	// animate the slide
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
		setLoadingSubStatus(true);
		await updateUserData(
			userData.id,
			"newsletter_subscribed",
			isSubscribedToNewsletter,
		);
		setLoadingSubStatus(false);
	};

	const handleUpdateLocation = async () => {
		try {
			const thisAddress = selectedAddress || userData.location;

			if (!thisAddress || !uid) {
				throw new Error(
					"Unable to sync location: selectedAddress or uid is null",
				);
			}

			const userCoords = {
				latitude: thisAddress?.latitude,
				longitude: thisAddress?.longitude,
			};

			// Ensure latitude and longitude are defined
			if (
				userCoords.latitude !== undefined &&
				userCoords.longitude !== undefined
			) {
				// first get and update nearest taplocation for user id
				const nearestLocationRes = await getNearestLocation(userCoords, uid);

				if (!nearestLocationRes) {
					throw new Error("Unable to sync location: getNearestLocation failed");
				}
			} else {
				throw new Error("Unable to sync location: userCoords is incomplete");
			}

			// then update user data with location
			await updateUserData(uid, "location", thisAddress);
		} catch (error) {
			showToast("Unable to update location");
			throw new Error(error as string);
		}
	};

	const handleRemoveFav = (fav: any) => {
		setFavs((prev) => prev.filter((item) => item.id !== fav.id));
	};

	const handleUpdateFavs = async () => {
		setLoadingFavs(true);

		try {
			if (!uid) {
				console.log("uid is null");
				throw new Error("Unable to update favs: uid is null");
			}

			const added = await addWatersAndFiltersToUserFavorites(uid, favs);

			// refreshUserData(uid, "all");

			if (!added) {
				throw new Error(
					"Unable to update favs: addWatersAndFiltersToUserFavorites failed",
				);
			}

			return true;
		} catch (error) {
			return false;
		} finally {
			setLoadingFavs(false);
		}
	};

	const handleSubscribe = async () => {
		setLoadingPurchase(true);

		try {
			if (!user) {
				Toast.show("No user found", {
					duration: Toast.durations.LONG,
				});

				throw new Error("User not found");
			}

			const annualPackage = packages.find((p) => p.packageType === "ANNUAL");
			const weeklyPackage = packages.find((p) => p.packageType === "WEEKLY");

			const pack = annualPackage;

			console.log("pack", JSON.stringify(pack, null, 2));

			if (!pack) {
				console.log("No package found");
				throw new Error("No package found");
			}

			const res = await purchasePackage!(pack);

			if (res) {
				// Handle success here
				handleFinishOnboarding();
				// TODO impelement toast
			} else {
				setLoadingPurchase(false);

				Toast.show("Unable to subscribe. Please try again.", {
					duration: Toast.durations.LONG,
				});
				throw new Error("Failed to purchase package");
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
		<View className="flex h-full  flex-col pb-14">
			{/* Back Button and Progress Bar */}
			<View className="flex flex-row items-center justify-between mb-2 py px-4 ">
				<View className="w-14 flex flex-row justify-center">
					{currentStep !== 0 && currentStep !== totalSteps - 1 ? (
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
			<View className="flex-1 overflow-hidden ">
				<Animated.View
					style={getSlideStyle() as Animated.AnimatedProps<ViewStyle>}
				>
					{steps.map((step, index) => (
						<View key={index} style={{ width: windowWidth }} className="px-8">
							<View className="flex flex-col gap-2 mt-4 px-4 tex">
								<H1 className={step.titleStyle}>{step.title}</H1>
								<P className={step.titleStyle}>{step.subtitle}</P>
							</View>
							<View className="flex flex-col justify-center items-center  w-full ">
								{step.image && (
									<View className="flex justify-center items-center w-full  ">
										<Image
											source={{ uri: step.image }}
											style={step.imageStyle as any}
											className="rounded-2xl f"
											resizeMode="cover"
										/>
									</View>
								)}
							</View>
							{step.component && (
								<View className="flex" style={{ marginBottom: 20 }}>
									{step.component}
								</View>
							)}
						</View>
					))}
				</Animated.View>
			</View>

			{/* Continue Button pinned to bottom */}
			<View className="px-8">
				{currentStep === steps.length - 1 && (
					<Large className="text-center font-semibold mb-6">
						No payment due now
					</Large>
				)}
				<Button
					onPress={() => handleNextStep(true)}
					variant="default"
					className={`!h-20 w-full ${steps[currentStep].submitButtonStyles} bg-primary`}
					label={steps[currentStep].submitButtonLabel}
					loading={steps[currentStep].loading}
				/>
				<View className="text-center mt-2 h-8 flex flex-col items-center">
					{currentStep === steps.length - 1 && (
						<Muted className="text-center max-w-sm">
							3 Day free trial then $0.90 a week (billed annually)
						</Muted>
					)}

					{steps[currentStep].canSkip && (
						<Button
							onPress={() => handleNextStep(false)}
							variant="ghost"
							className="h-16 w-full"
							label={steps[currentStep].skipButtonLabel}
						/>
					)}
				</View>
			</View>
		</View>
	);
}
