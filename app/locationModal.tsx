import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { getNearestLocation } from "@/actions/admin";
import { updateUserData } from "@/actions/user";
import LocationCard from "@/components/cards/location-card";
import LocationSelector from "@/components/sharable/location-selector";
import { Button } from "@/components/ui/button";
import { H3, P } from "@/components/ui/typography";
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
	const [showUpdateLocation, setShowUpdateLocation] = useState(true);
	const [statusText, setStatusText] = useState<string | null>(null);
	const [focused, setFocused] = useState(false);

	useEffect(() => {
		if (userData?.tap_location_id) {
			setShowUpdateLocation(false);
		} else {
			setFocused(true);
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

			const res = await updateUserData(uid, "location", selectedAddress);

			// first get and update nearest taplocation
			if (isAddressInUS(selectedAddress)) {
				const nearestLocationRes = await getNearestLocation(latLong, uid);

				if (!nearestLocationRes) {
					setLoading(false);
					showToast("Unable to find nearest tap location", 2000, "top");
					return;
				}
			} else {
				showToast(
					"Location updated! But tap water scores are only available in the US",
					2000,
					"top",
				);
			}

			if (res) {
				refreshUserData("scores");
				setShowUpdateLocation(false);
				setSelectedAddress(null);
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

	const openEditLocation = () => {
		setShowUpdateLocation(true);
		setFocused(true);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View className="py-14 px-8 flex-1">
				<View className="flex flex-col items-center h-full">
					{userData?.location?.formattedAddress && !focused && (
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

							<View className="flex flex-col items-start mt-8">
								<P className="text-center">Nearest tap water report:</P>
								<View className="h-14">
									<LocationCard location={tapScore || {}} size="lg" />
								</View>
							</View>
						</View>
					)}
					<View className="flex flex-grow flex-shrink items-center" />

					{focused && (
						<View className="flex flex-col w-full">
							<H3>Enter new location</H3>
							<LocationSelector
								address={selectedAddress}
								setAddress={setSelectedAddress}
								initialAddress={null}
								focused={focused}
								setFocused={setFocused}
							/>

							<View className="flex flex-row items-center justify-end w-full gap-4 max-w-sm">
								<Button
									onPress={() => setFocused(false)}
									variant="ghost"
									label="Cancel"
									className="mt-4"
								/>
								<Button
									onPress={handleUpdateLocation}
									label="Update"
									loading={loading}
									className="w-36 mt-4"
								/>
							</View>
						</View>
					)}

					<View className="flex flex-grow flex-shrink items-center mt-6 justify-end w-full pb-10">
						{!focused && (
							<Button
								onPress={openEditLocation}
								label="Change location"
								loading={loading}
								className="w-80 !h-16"
							/>
						)}
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
