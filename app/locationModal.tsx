import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { getNearestLocation } from "@/actions/admin";
import { updateUserData } from "@/actions/user";
import LocationSelector from "@/components/sharable/location-selector";
import { Button } from "@/components/ui/button";
import { H2, Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function LocationModal() {
	const router = useRouter();
	const { iconColor } = useColorScheme();
	const { uid, refreshUserData, userData } = useUserProvider();

	const showToast = useToast();

	const [selectedAddress, setSelectedAddress] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [refetched, setRefetched] = useState(false);

	useEffect(() => {
		if (userData?.location) {
			setSelectedAddress(userData.location.formattedAddress);
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
			showToast("Unable to sync location");
			return;
		}

		const nearestLocation = await getNearestLocation(latLong, uid);
		if (nearestLocation) {
			setRefetched(true);
			showToast("Location updated");
			refreshUserData(uid, "scores");
			// router.back();
		} else {
			showToast("Unable to update location");
			setRefetched(false);
		}
	};

	const handleUpdateLocation = async (address: any) => {
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
				refreshUserData();
				router.back();
			} else {
				throw new Error("Unable to update location: updateUserData failed");
			}

			setLoading(false);
		} catch (error) {
			showToast("Unable to update location");
			setLoading(false);
		}
	};

	return (
		<View className="flex-1">
			<View className="flex-1 py-14 justify-center items-center max-w-md mx-auto pb-20">
				<View>
					<View className="flex flex-col justify-center items-center mb-4">
						<Feather
							name="map-pin"
							size={32}
							color={iconColor}
							className="mb-4"
						/>
						<H2>Sync your location</H2>
						<P className="text-center max-w-sm">
							Enter your address to see the tap water quality in your area.
						</P>
					</View>
					<LocationSelector
						address={selectedAddress}
						setAddress={setSelectedAddress}
						initialAddress={userData?.location?.formattedAddress}
					/>
				</View>

				<Button
					onPress={handleUpdateLocation}
					disabled={!selectedAddress}
					label="Select location"
					loading={loading}
					className="w-80 !h-16"
				/>

				<View className="absolute bottom-10 ">
					{refetched && (
						<Muted className="mt-8">Refetched location data!</Muted>
					)}
				</View>
			</View>

			<View className="absolute top-8 left-8">
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
			</View>
		</View>
	);
}
