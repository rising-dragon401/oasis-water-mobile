import { Ionicons } from "@expo/vector-icons"; // If using expo for icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Image,
	Platform,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";
import Toast from "react-native-root-toast";

import { getNearestLocation } from "@/actions/admin";
import {
	addWatersAndFiltersToUserFavorites,
	attachReferralCodeToUser,
	updateUserData,
} from "@/actions/user";
import ItemSelector from "@/components/sharable/item-selector";
import { SubscribeOnboarding } from "@/components/sharable/subscribe-onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as ProgressPrimitive from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { H1, Muted, P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { readableType } from "@/lib/utils";

let StoreReview: {
	isAvailableAsync: () => Promise<boolean>;
	requestReview: () => Promise<void>;
};
if (Platform.OS !== "web") {
	StoreReview = require("expo-store-review");
} else {
	StoreReview = {
		isAvailableAsync: async () => false,
		requestReview: async () => {},
	};
}

export default function OnboardingScreen() {
	const router = useRouter();
	const { user, userData, userFavorites, uid, userScores, refreshUserData } =
		useUserProvider();
	const { hasActiveSub, packages, purchasePackage } = useSubscription();
	const { iconColor, mutedForegroundColor } = useColorScheme();
	const showToast = useToast();
	const posthog = usePostHog();
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
	const [loadingNearestLocation, setLoadingNearestLocation] = useState(false);
	const [nearestLocation, setNearestLocation] = useState<any>(null);
	const [loadingFavs, setLoadingFavs] = useState(false);
	const [hasRequestedRate, setHasRequestedRate] = useState(false);
	const [referralCode, setReferralCode] = useState("");
	const [loadingReferralCode, setLoadingReferralCode] = useState(false);
	const [referralCodeError, setReferralCodeError] = useState(false);

	const windowWidth = Dimensions.get("window").width;
	const windowHeight = Dimensions.get("window").height;

	const hasScores = userScores && userScores?.allIngredients?.length > 0;

	const handleReferralCodeSubmit = async () => {
		try {
			setLoadingReferralCode(true);
			if (uid) {
				const res = await attachReferralCodeToUser(uid, referralCode);

				if (res) {
					showToast("Code applied!", 1000, "top");
					stepForward();

					posthog?.capture("applied_referral_code", {
						new_user: uid,
						referral_code: referralCode,
					});
				} else {
					setReferralCodeError(true);
					throw new Error("Unable to apply code");
				}
			} else {
				console.error("No uid found");
				setReferralCodeError(true);
				throw new Error("No uid found");
			}
		} catch (error) {
			showToast(
				"Unable to apply code, please try something else.",
				1000,
				"top",
			);
			console.error("Error applying referral code", error);
		} finally {
			setLoadingReferralCode(false);
		}
	};

	// Onboarding steps
	const steps = [
		// {
		// 	title: "There's something in the water",
		// 	titleStyle: "max-w-xs",
		// 	subtitle:
		// 		"Much of the water we drink is filled with harmful toxins that brands don't tell you about.",
		// 	image:
		// 		"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/brands_cant_be_trusted.png",
		// 	imageStyle: {
		// 		width: "100%",
		// 		height: windowHeight * 0.44,
		// 		resizeMode: "cover",
		// 		borderRadius: 20,
		// 		marginTop: 18,
		// 	},
		// 	component: null,
		// 	onSubmit: null,
		// 	submitButtonLabel: "Continue",
		// 	onSkip: null,
		// 	canSkip: false,
		// },
		{
			title: "Do you know what's in the water you drink?",
			subtitle:
				"Most waters and products are filled with harmful toxins that delibiate our health and lead to disease. We rank and test each product based on the latest lab data so you can make informed choices best for your health.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/toxins%20in%20water%20graphic.png",
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
			title: "Your support means everything",
			subtitle:
				"As a small self-funded team your 5-star rating helps support the mission and allows us to share this information with more people.",
			image:
				"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/hand_water_dripping.jpeg?t=2024-11-20T19%3A17%3A40.942Z",
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.4,
				resizeMode: "contain",
				borderRadius: 20,
				marginTop: 18,
			},
			component: null,
			onSubmit: () => {
				if (!hasRequestedRate) {
					handleRatePress();
				} else {
					stepForward();
				}
			},
			submitButtonLabel: hasRequestedRate
				? "Thank you! 💙 Continue"
				: " ✨ Give 5 stars ✨",
			onSkip: null,
			canSkip: true,
			skipButtonLabel: "Skip",
		},
		{
			title: "Stay notified of new lab results and research",
			subtitle:
				"Get weekly updates on the latest research and insights on water quality and health.",
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
		{
			id: "referral",
			title: "Did someone refer you?",
			subtitle: "If so, enter their username and they will thank you later.",
			image: null,
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.44,
				resizeMode: "contain",
			},
			component: (
				<View className="flex mt-6">
					<Input
						placeholder="username"
						onChangeText={setReferralCode}
						value={referralCode}
						className="border border-gray-300 rounded-lg p-2"
					/>

					{/* <Button
						className="mt-4 text-primary"
						variant="outline"
						onPress={handleReferralCodeSubmit}
						loading={loadingReferralCode}
						disabled={loadingReferralCode}
						label="Apply Code"
					/> */}
				</View>
			),
			onSubmit: () => {
				handleReferralCodeSubmit();
			},
			submitButtonLabel: "Apply Code",
			onSkip: () => {
				stepForward();
			},
			canSkip: true,
			skipButtonLabel: "Skip",
		},
		// {
		// 	id: "location",
		// 	title: "Where are you based?",
		// 	subtitle:
		// 		"Used to locate the nearest tap water report and find available brands2",
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
		// 				initialAddress={null}
		// 			/>
		// 			{/* {loadingNearestLocation && (
		// 				<View className="flex flex-row items-center justify-center gap-2 mt-4">
		// 					<Loader size="small" />
		// 					<P>Finding nearest tap water report</P>
		// 				</View>
		// 			)}
		// 			{nearestLocation && !loadingNearestLocation && (
		// 				<View className="flex flex-col items-center gap-2 mt-4">
		// 					<P>Nearest tap water report:</P>
		// 					<P>{nearestLocation?.name || "None"}</P>
		// 				</View>
		// 			)} */}
		// 			{/* {selectedAddress && !loadingLocation && !nearestLocation && (
		// 				<View className="flex flex-col items-center gap-2 mt-6 bg-card px-4 py-2 rounded-xl">
		// 					<P>
		// 						We couldn’t find tap water reports for your area just yet, but
		// 						you can still enjoy Oasis! We’ll update you when new water
		// 						quality reports are available.
		// 					</P>

		// 				</View>
		// 			)} */}
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
		{
			id: "favs",
			title: "What do you drink?",
			subtitle: "Enter all the bottled waters and filters you use",
			image: null,
			imageStyle: {
				width: "100%",
				height: windowHeight * 0.44,
				resizeMode: "contain",
			},
			component: (
				<View className="flex mt-6">
					<ItemSelector
						items={favs}
						setItems={setFavs}
						initialItems={userFavorites || []} // Pass in initial items
					/>

					{favs.length > 0 && (
						<View className="flex flex-col items-center gap-4 mt-4 ">
							{favs.map((fav) => (
								<View
									key={fav.id}
									className="flex flex-row items-center gap-2 bg-card p-2 rounded-xl border border-border w-full py-2 px-4 justify-between"
								>
									<View className="flex flex-row items-center gap-2">
										<Image
											source={{ uri: fav.image }}
											style={{ width: 36, height: 36 }}
											className="rounded-lg"
										/>
										<View className="flex flex-col gap-0  flex-wrap">
											<P className="max-w-64 font-medium" numberOfLines={1}>
												{fav.name}
											</P>
											<Muted>{readableType(fav.type)}</Muted>
										</View>
									</View>

									<TouchableOpacity onPress={() => handleRemoveFav(fav)}>
										<Ionicons
											name="close"
											size={24}
											color={mutedForegroundColor}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					)}
				</View>
			),
			onSubmit: null,
			loading: loadingFavs,
			submitButtonLabel: "Continue",
			onSkip: () => {
				stepForward();
			},
			canSkip: true,
			skipButtonLabel: "Skip",
		},
		{
			title: "Unlock your top waters",
			// subtitle: "😳💧",
			titleStyle: "text-center",
			// image:
			// 	"https://connect.live-oasis.com/storage/v1/object/public/website/images/onboarding/paywall%20cards.jpg",
			image: null,
			imageStyle: {
				width: !hasScores ? "80%" : "54%",
				height: !hasScores ? windowHeight * 0.18 : windowHeight * 0.1,
				resizeMode: "contain",
				marginTop: 8,
			},
			component: (
				<SubscribeOnboarding
					setSelectedPlan={setSelectedPlan}
					selectedPlan={selectedPlan}
					onPress={() => {
						handleSubscribe();
					}}
				/>
			),
			onSubmit: () => {
				handleSubscribe();
			},
			loading: loadingPurchase,
			submitButtonLabel: "Continue for free 🙌",
			submitButtonStyles: "shadow-lg shadow-blue-500/50 bg-primary",
			onSkip: null,
			skipButtonLabel: "No thanks, continue with basic and view limited data",
			canSkip: false,
		},
	];

	const totalSteps = steps.length;
	const slideAnim = useRef(new Animated.Value(0)).current;

	const stepForward = () => {
		setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
	};

	const handlePrevStep = () => {
		setDirection("backward");
		setCurrentStep((prev) => Math.max(0, prev - 1));
	};

	// save current step to AsyncStorage
	useEffect(() => {
		const saveCurrentStep = async () => {
			try {
				await AsyncStorage.setItem("currentStep", currentStep.toString());
			} catch (error) {
				console.error("Failed to save current step to AsyncStorage", error);
			}

			if (currentStep === totalSteps - 1 && hasActiveSub) {
				handleFinishOnboarding();
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
			steps[currentStep].onSubmit(); // submit function responsible for moving to next step
		} else {
			stepForward();
		}
	};

	const handleRatePress = async () => {
		if (await StoreReview.isAvailableAsync()) {
			try {
				await StoreReview.requestReview();
			} catch (error) {
				console.error("Error requesting review:", error);
			}
		} else {
			// For development builds or when StoreReview is not available
			console.log("App rating not available in this environment");
			// You can add a mock implementation or alert here
			// showToast("Thank you 😊", 1000, "top");
		}

		setTimeout(() => {
			setHasRequestedRate(true);
		}, 1000);
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
		stepForward();
		setLoadingSubStatus(false);
	};

	const isAddressInUS = (address: any) => {
		// Assuming address has a country property
		return address.country === "United States";
	};

	// update nearest location
	useEffect(() => {
		const fetch = async () => {
			if (!selectedAddress || !uid) {
				return;
			}

			try {
				if (!isAddressInUS(selectedAddress)) {
					setNearestLocation(null);
					throw new Error("Address is not in the US");
				}

				const userCoords = {
					latitude: selectedAddress?.latitude,
					longitude: selectedAddress?.longitude,
				};

				// Ensure latitude and longitude are defined
				if (
					userCoords.latitude !== undefined &&
					userCoords.longitude !== undefined
				) {
					setLoadingNearestLocation(true);
					// first get and update nearest taplocation for user id
					const nearestLocationRes = await getNearestLocation(
						{ latitude: userCoords.latitude, longitude: userCoords.longitude },
						uid || "",
					);

					if (!nearestLocationRes) {
						throw new Error(
							"Unable to sync location: getNearestLocation failed",
						);
					}

					setNearestLocation(nearestLocationRes);
					refreshUserData("scores");
				} else {
					throw new Error("Unable to sync location: userCoords is incomplete");
				}
			} catch (error) {
				throw new Error(error as string);
			} finally {
				setLoadingNearestLocation(false);
			}
		};

		if (steps[currentStep].id === "location") {
			fetch();
		}
	}, [selectedAddress, currentStep]);

	const handleUpdateLocation = async () => {
		try {
			const thisAddress = selectedAddress || userData.location;

			if (!thisAddress || !uid) {
				throw new Error(
					"Unable to sync location: selectedAddress or uid is null",
				);
			}

			// then update user data with location
			await updateUserData(uid, "location", thisAddress);
			await refreshUserData("scores");
		} catch (error) {
			showToast("Unable to update location", 1000, "top");
			throw new Error(error as string);
		} finally {
			setLoadingNearestLocation(false);
			stepForward();
		}
	};

	// when favs change add or remove from user favorites
	useEffect(() => {
		const addFavs = async () => {
			if (favs.length > 0 && steps[currentStep].id === "favs" && uid) {
				const recentFav = favs[favs.length - 1];
				await addWatersAndFiltersToUserFavorites(uid, favs);
				refreshUserData("scores");
			}
		};

		addFavs();
	}, [favs]);

	const handleRemoveFav = (fav: any) => {
		setFavs((prev) => prev.filter((item) => item.id !== fav.id));
		refreshUserData("scores");
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

			const annualPackage = packages.annual;
			const weeklyPackage = packages.weekly;

			const pack = annualPackage;

			console.log("pack", JSON.stringify(pack, null, 2));

			if (!pack) {
				console.log("No package found");
				throw new Error("No package found");
			}

			const res = await purchasePackage(pack, {
				feature: "onboarding",
				path: "onboarding",
				component: "subscribe-onboarding",
			});

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
		<View className="flex-1 h-full flex-col justify-between pb-14">
			{/* Back Button and Progress Bar */}
			<View className="flex flex-row items-center justify-between mb-2 py px-4 ">
				<View className="w-14 flex flex-row justify-center">
					<TouchableOpacity
						onPress={handlePrevStep}
						disabled={currentStep === 0}
					>
						<Ionicons name="arrow-back" size={24} color={iconColor} />
					</TouchableOpacity>
					{/* {currentStep !== 0 && currentStep !== totalSteps - 1 ? (
						<TouchableOpacity
							onPress={handlePrevStep}
							disabled={currentStep === 0}
						>
							<Ionicons name="arrow-back" size={24} color={iconColor} />
						</TouchableOpacity>
					) : (
						<View style={{ width: 24, height: 24 }} />
					)} */}
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
							<View className="flex flex-col gap-2 py-2 text-center">
								<H1 className={`${step.titleStyle} font-semibold`}>
									{step.title}
								</H1>
								<P>{step.subtitle}</P>
							</View>
							{step.image && (
								<View className="flex flex-col justify-center items-center  w-full ">
									<View className="flex justify-center items-center w-full  ">
										<Image
											source={{ uri: step.image }}
											style={step.imageStyle as any}
											className="rounded-2xl f"
											resizeMode="cover"
										/>
									</View>
								</View>
							)}
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
				{/* {currentStep === steps.length - 1 && (
					<Large className="text-center font-semibold mb-6">
						No payment due now
					</Large>
				)} */}
				<Button
					onPress={() => handleNextStep(true)}
					variant="default"
					className={`!h-20 w-full ${steps[currentStep].submitButtonStyles} bg-primary`}
					textClassName="!text-lg"
					label={steps[currentStep].submitButtonLabel}
					loading={steps[currentStep].loading}
				/>
				<View className="text-center mt-2 h-8 flex flex-col items-center">
					{currentStep === steps.length - 1 && (
						<Muted className="text-center max-w-sm">
							3-day free trial then $0.90/week (billed annually)
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
