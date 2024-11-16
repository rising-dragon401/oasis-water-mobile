import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { getNearestLocation } from "@/actions/admin";
import { updateUserData } from "@/actions/user";
import LocationSelector from "@/components/sharable/location-selector";
import { Button } from "@/components/ui/button";
import { H3, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function LocationModal() {
	const router = useRouter();
	const { iconColor, mutedForegroundColor } = useColorScheme();
	const { uid, refreshUserData, userData, tapScore } = useUserProvider();

	const showToast = useToast();

	const [selectedAddress, setSelectedAddress] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [showUpdateLocation, setShowUpdateLocation] = useState(true);
	const [statusText, setStatusText] = useState<string | null>(null);

	useEffect(() => {
		if (userData?.tap_location_id) {
			// setSelectedAddress(userData.location?.formattedAddress);
			setShowUpdateLocation(false);
		} else {
			setShowUpdateLocation(true);
		}
	}, [userData]);

	// Hacky toast since can't use toast in modal
	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (statusText) {
			timeout = setTimeout(() => {
				setStatusText(null);
			}, 2000);
		}
		return () => clearTimeout(timeout);
	}, [statusText]);

	// Helper function to check if the address is in the US
	const isAddressInUS = (address: any) => {
		// Assuming address has a country property
		return address.country === "United States";
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

			if (isAddressInUS(selectedAddress)) {
				// first get and update nearest taplocation
				const nearestLocationRes = await getNearestLocation(latLong, uid);

				if (!nearestLocationRes) {
					throw new Error("Unable to sync location: getNearestLocation failed");
				}

				const res = await updateUserData(uid, "location", selectedAddress);

				if (res) {
					refreshUserData("all");
					setShowUpdateLocation(false);
					setSelectedAddress(null);
				} else {
					throw new Error("Unable to update location: updateUserData failed");
				}
			} else {
				setStatusText("Tap water scores are only available in the US");
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
			<View className="pt-8 px-8 flex-1">
				<View className="flex flex-col items-center justify-between h-full">
					{userData?.location?.formattedAddress && (
						<View className="flex flex-col items-center ">
							<View className="flex flex-col items-center ">
								<P className="text-center">Current location:</P>
								<View className="flex flex-row items-center max-w-lg px-4 py-2 bg-muted rounded-full gap-2">
									<Feather name="map-pin" size={14} color={iconColor} />
									<P className="text-center" numberOfLines={1}>
										{userData?.location?.formattedAddress || "Address"}
									</P>
								</View>
							</View>

							<View className="flex flex-col items-start mt-4">
								<P className="text-center">Nearest tap water score:</P>
								<View className="flex flex-row items-center px-4 py-2 bg-muted rounded-full gap-2">
									<Feather name="droplet" size={14} color={iconColor} />
									<P className="text-center" numberOfLines={1}>
										{tapScore?.name || "No tap water score found"}
									</P>
								</View>
							</View>
						</View>
					)}
					<View className="flex flex-grow flex-shrink items-center" />
					<View className="flex flex-grow flex-shrink items-center">
						{/* <Feather
							name="map-pin"
							size={24}
							color={iconColor}
							className="mb-2"
						/> */}
						<H3>Change location</H3>
						<Muted>Enter your address to see the nearest tap water score</Muted>
						<LocationSelector
							address={selectedAddress}
							setAddress={setSelectedAddress}
							initialAddress={null}
						/>
					</View>

					<View className="flex flex-grow flex-shrink items-center ">
						<Button
							onPress={handleUpdateLocation}
							disabled={!selectedAddress}
							label="Update location"
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

				<View className="absolute bottom-20 w-full items-center">
					{statusText && <P className="text-center">{statusText}</P>}
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
