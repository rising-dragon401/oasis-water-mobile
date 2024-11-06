import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Input } from "@/components/ui/input";
import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

const LocationSelector = ({
	address,
	setAddress,
	initialAddress,
}: {
	address: any;
	setAddress: any;
	initialAddress?: any;
}) => {
	const { iconColor } = useColorScheme();

	const [input, setInput] = useState("");
	const [results, setResults] = useState<any[]>([]);

	const [error, setError] = useState<string | null>(null);

	const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

	const handleLocationSearch = useCallback(async () => {
		try {
			// Google Places Autocomplete API URL
			const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}&types=address`;

			const response = await axios.get(url);
			const data = response.data;

			if (data.status === "OK") {
				setResults(data.predictions.slice(0, 4));
				setError(null);
			} else {
				setResults([]);
				setError("Address not found");
			}
		} catch (err) {
			setResults([]);
			setError("Failed to fetch address");
		}
	}, [input, API_KEY]);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (input) {
				// Clear selected address if input changes
				if (address && input !== address.formattedAddress) {
					setAddress(null);
				}
				handleLocationSearch();
			} else {
				setResults([]);
				setAddress(null);
			}
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [input, handleLocationSearch, address]);

	const handleSelectAddress = async (placeId: string) => {
		try {
			// Clear results immediately when an address is selected
			setResults([]);

			// Fetch the place details using the Place ID from Places API
			const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
			const placeDetailsResponse = await axios.get(placeDetailsUrl);
			const result = placeDetailsResponse.data.result;

			// Extract address components
			const addressComponents = result.address_components;
			const zipCode =
				addressComponents.find((comp: any) =>
					comp.types.includes("postal_code"),
				)?.long_name || undefined;
			const city =
				addressComponents.find(
					(comp: any) =>
						comp.types.includes("locality") ||
						comp.types.includes("administrative_area_level_2"),
				)?.long_name || undefined;
			const state =
				addressComponents.find((comp: any) =>
					comp.types.includes("administrative_area_level_1"),
				)?.long_name || undefined;
			const country =
				addressComponents.find((comp: any) => comp.types.includes("country"))
					?.long_name || undefined;

			// Set selected address with all necessary details
			setAddress({
				placeId: result.place_id, // Place ID
				reference: result.reference, // Reference
				formattedAddress: result.formatted_address, // Full formatted address
				zipCode,
				city,
				state,
				country,
				latitude: result.geometry.location.lat,
				longitude: result.geometry.location.lng,
			});

			// Set input field to the formatted address
			setInput(result.formatted_address);
		} catch (err) {
			console.error("Error fetching selected address:", err);
			setError("Failed to fetch selected address");
		}
	};

	return (
		<View className="flex p-5 justify-center w-full ">
			<View className="relative">
				<Input
					className="border border-gray-300 p-3 mb-0 rounded-xl  pr-10 !h-16 w-96"
					placeholder={
						initialAddress || address?.formattedAddress || "Enter address"
					}
					value={input}
					onChangeText={setInput}
				/>
				{address && (
					<View className="absolute right-3 top-1/2 transform -translate-y-1/2">
						<Ionicons name="checkmark" size={24} color={iconColor} />
					</View>
				)}
			</View>

			{results.length > 0 && !address && (
				<View className="border border-gray-300 rounded-lg mb-5 max-h-60 overflow-y-scroll">
					{results.map((result, index) => (
						<TouchableOpacity
							key={result.place_id}
							onPress={() => handleSelectAddress(result.place_id)}
							className={`p-3 ${
								index !== results.length - 1 ? "border-b border-gray-200" : ""
							}`}
						>
							<P>{result.description}</P>
						</TouchableOpacity>
					))}
				</View>
			)}

			{error && <Text className="text-red-500 mt-5">{error}</Text>}
		</View>
	);
};

export default LocationSelector;
