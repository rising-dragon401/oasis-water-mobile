import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { getNearestLocation } from "@/actions/admin";
import { updateUserData } from "@/actions/user";
import LocationSelector from "@/components/sharable/location-selector";
import Score from "@/components/sharable/score";
import { Button } from "@/components/ui/button";
import { H1, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function LocationModal() {
	const router = useRouter();
	const { iconColor } = useColorScheme();
	const { uid, refreshUserData, userData, tapScore } = useUserProvider();

	const showToast = useToast();

	const [selectedAddress, setSelectedAddress] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [refetched, setRefetched] = useState(false);
	const [showUpdateLocation, setShowUpdateLocation] = useState(true);

	useEffect(() => {
		if (userData?.tap_location_id) {
			setSelectedAddress(userData.location?.formattedAddress);
			setShowUpdateLocation(false);
		} else {
			setShowUpdateLocation(true);
		}
	}, [userData]);

	// Hacky toast since can't use toast in modal
	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (refetched) {
			timeout = setTimeout(() => {
				setRefetched(false);
			}, 1000);
		}
		return () => clearTimeout(timeout);
	}, [refetched]);

	const updateNearestLocation = async () => {
		const addressToUse = selectedAddress || userData?.location;

		const latLong = {
			latitude: addressToUse?.latitude,
			longitude: addressToUse?.longitude,
		};

		if (
			!uid ||
			!latLong ||
			latLong.latitude === undefined ||
			latLong.longitude === undefined
		) {
			// showToast("Unable to sync location");
			return;
		}

		const nearestLocation = await getNearestLocation(latLong, uid);
		if (nearestLocation) {
			setRefetched(true);
			showToast("Location updated");
			refreshUserData("scores");
			// router.back();
		} else {
			showToast("Unable to update location");
			setRefetched(false);
		}
	};

	const handleUpdateLocation = async (address: any) => {
		if (!uid) {
			router.back();
			router.push("/(public)/sign-in");
			return;
		}

		if (!uid || !address) {
			throw new Error("Unable to update location: uid or address is null");
		}

		try {
			setLoading(true);

			const latLong = {
				latitude: selectedAddress.latitude,
				longitude: selectedAddress.longitude,
			};

			// first get and update nearest taplocation
			const nearestLocationRes = await getNearestLocation(latLong, uid);

			if (!nearestLocationRes) {
				throw new Error("Unable to sync location: getNearestLocation failed");
			}

			const res = await updateUserData(uid, "location", selectedAddress);

			if (res) {
				showToast("Location updated");
				refreshUserData("all");
				setShowUpdateLocation(false);
				// router.back();
			} else {
				throw new Error("Unable to update location: updateUserData failed");
			}

			setLoading(false);
		} catch (error) {
			setShowUpdateLocation(false);
			router.back();
			showToast("Unable to update location");
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View className=" pt-8 px-8">
				<View className="flex flex-col justify-center items-center">
					<H1>Location</H1>
				</View>

				{!showUpdateLocation && (
					<View className="flex flex-col items-center justify-between h-full">
						<View className="flex flex-col items-center flex-grow flex-shrink  p-4 rounded-full mt-4 w-full">
							<View className="flex flex-row items-center px-4 py-2 bg-muted rounded-full gap-2">
								<Feather name="map-pin" size={14} color={iconColor} />
								<P className="text-center" numberOfLines={1}>
									{userData?.location?.formattedAddress || "Address"}
								</P>
							</View>
						</View>

						<View className="flex flex-col items-center flex-grow flex-shrink">
							<Score score={tapScore?.score || 0} size="xl" showScore />
							<Button
								label={tapScore?.name}
								variant="outline"
								className="mb-0 mt-4"
								onPress={() => {
									router.back();
									router.push(`/search/location/${userData?.tap_location_id}`);
								}}
								icon={
									<Ionicons name="arrow-forward" size={16} color={iconColor} />
								}
							/>
							<Muted className="mt-2">
								Tap water test results closest to your location
							</Muted>
						</View>

						<View className="flex flex-grow flex-shrink">
							<Button
								label="Change location"
								variant="default"
								className="w-80 !h-16"
								onPress={() => setShowUpdateLocation(true)}
							/>
						</View>
					</View>
				)}

				{showUpdateLocation && (
					<View className="flex flex-col items-center justify-between h-full">
						<View className="flex flex-grow flex-shrink items-center" />
						<View className="flex flex-grow flex-shrink items-center">
							<Feather
								name="map-pin"
								size={32}
								color={iconColor}
								className="mb-4"
							/>
							<H1>Update address</H1>
							<Muted>Connect your address to see your tap water score</Muted>
							<LocationSelector
								address={selectedAddress}
								setAddress={setSelectedAddress}
								initialAddress={userData?.location?.formattedAddress}
							/>
						</View>

						<View className="flex flex-grow flex-shrink items-center">
							<Button
								onPress={handleUpdateLocation}
								disabled={!selectedAddress}
								label="Select location"
								loading={loading}
								className="w-80 !h-16"
							/>
							{userData?.location?.formattedAddress && (
								<Button
									label="Cancel"
									variant="ghost"
									className="w-80 !h-16"
									onPress={() => setShowUpdateLocation(false)}
								/>
							)}
						</View>
					</View>
				)}

				<View className="absolute bottom-10 ">
					{refetched && <Muted className="">Refetched location data!</Muted>}
				</View>

				{/* <View className="absolute top-10 left-8">
					<TouchableOpacity
						style={{
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={updateNearestLocation}
					>
						<Ionicons
							name="refresh"
							size={24}
							color={iconColor}
							className="mb-2"
							style={{ transform: [{ rotate: "45deg" }] }}
						/>
					</TouchableOpacity>
				</View> */}
			</View>
		</KeyboardAvoidingView>
	);
}
