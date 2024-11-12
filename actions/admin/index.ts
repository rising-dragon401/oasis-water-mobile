import axios from "axios";

import { getFilterDetails } from "@/actions/filters";
import { getItemDetails } from "@/actions/items";
import { supabase } from "@/config/supabase";
import { CATEGORIES } from "@/lib/constants/categories";

export const handleDeleteUser = async (uid: string) => {
	try {
		const { error } = await supabase
			.from("deletion_requests")
			.insert({ user_id_to_delete: uid });

		if (error) throw error;

		console.log(`Deletion request added for user [${uid}]`);

		return true;
	} catch (error) {
		console.error("Error adding deletion request:", error);
		return false;
	}
};

export const getFeaturedUsers = async () => {
	const { data: featuredUsers, error: featuredError } = await supabase
		.from("users")
		.select("*")
		.eq("is_featured", true)
		.order("created_at", { ascending: false });

	if (featuredError) {
		console.error("Error fetching featured users:", featuredError);
		return [];
	}

	const { data: favorites, error: favoritesError } = await supabase
		.from("favorites")
		.select("*")
		.in(
			"uid",
			featuredUsers.map((user) => user.id),
		);

	if (favoritesError) {
		console.error("Error fetching user favorites:", favoritesError);
		return [];
	}

	const usersWithFavorites = featuredUsers.map((user) => ({
		...user,
		type: "user",
		favorites: favorites.filter((fav) => fav.uid === user.id),
	}));

	// sort by most recent favorite
	usersWithFavorites.sort((a, b) => {
		const maxFavoriteA = Math.max(...a.favorites.map((fav: any) => fav.id));
		const maxFavoriteB = Math.max(...b.favorites.map((fav: any) => fav.id));
		return maxFavoriteB - maxFavoriteA;
	});

	return usersWithFavorites;
};

export const getUserReferralStats = async (userId: string) => {
	const { data, error } = await supabase
		.from("referrals")
		.select("*")
		.eq("referring_user_id", userId);

	let stats = {
		total_earnings: 0,
		total_paid_referrals: 0,
		total_trials: 0,
	};

	if (data) {
		// TODO - needs to be tracked by differnt parameter
		// i.e. if user cancels after paying they still count as a paid referral
		const totalEarnings =
			data.reduce(
				(acc, referral) =>
					referral.subscription_status === "active"
						? acc + referral.amount
						: acc,
				0,
			) * 0.2;

		const totalPaidReferrals = data.reduce(
			(acc, referral) =>
				referral.subscription_status === "paid" ? acc + 1 : acc,
			0,
		);

		const totalTrials = data.reduce(
			(acc, referral) =>
				referral.subscription_status === "trialing" ? acc + 1 : acc,
			0,
		);

		stats = {
			total_earnings: Math.round(totalEarnings / 100),
			total_paid_referrals: totalPaidReferrals,
			total_trials: totalTrials,
		};
	}

	return stats;
};

export const uploadChatImage = async (image: string, uid: string) => {
	const { data, error } = await supabase.storage
		.from("users")
		.upload(`users/${uid}/${Date.now()}_chat_image.jpg`, image, {
			cacheControl: "3600",
			upsert: false,
		});

	if (error) {
		console.error("Error uploading image:", error);
		return { success: false, error };
	}

	return { success: true, data };
};

export const getEmbedding = async (text: string) => {
	const response = await fetch("https://api.openai.com/v1/embeddings", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			input: text,
			model: "text-embedding-ada-002",
			encoding_format: "float",
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		console.error("Error fetching embedding:", error);
		return { success: false, error: error.message };
	}

	const responseData = await response.json();
	const embedding = responseData.data[0].embedding;

	return { success: true, embedding };
};

export const getAllItemIdsAndNames = async () => {
	const { data, error } = await supabase.from("items").select("id, name");

	if (error) {
		console.error("Error fetching item ids and names:", error);
		return [];
	}

	return data;
};

export const getAllFilterIdsAndNames = async () => {
	const { data, error } = await supabase
		.from("water_filters")
		.select("id, name");

	if (error) {
		console.error("Error fetching filter ids and names:", error);
		return [];
	}

	return data;
};

export const searchForProduct = async (
	productIdentified: {
		name: string;
		type: "filter" | "bottled_water";
	},
	allItems: any[],
	allFilters: any[],
) => {
	// Normalize input name
	const productName = productIdentified.name.trim().toLowerCase();

	const listToSearch =
		productIdentified.type === "filter" ? allFilters : allItems;

	console.log("productName: ", productName);

	// ask open ai to search for the closes match
	const requestBody = {
		model: "gpt-4o",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `What item from listToSearch most closely matches productName. If it includes gallon, make sure to select the gallon named item, otherwise select the item without gallon in the name
							listToSearch: ${JSON.stringify(listToSearch)}
							productName: ${productName}


							Only respond with the name of the product and type like this: {id: 'id', name: 'name'}.
							`,
					},
				],
			},
		],
		// max_tokens: 300,
	};

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	});
	const responseData = await response.json();

	const rowIdentifiedObject = responseData.choices[0].message.content.match(
		/{\s*id:\s*'([^']*)',\s*name:\s*'([^']*)'\s*}/,
	);

	if (!rowIdentifiedObject) {
		throw new Error("Error parsing rowIdentified");
	}

	const rowIdentified = {
		id: rowIdentifiedObject[1],
		name: rowIdentifiedObject[2],
	};

	console.log("rowIdentified: ", rowIdentified);

	const productId = rowIdentified.id;

	try {
		console.log("productId: ", productId);
		let productDetails;
		if (productIdentified.type === "filter") {
			productDetails = await getFilterDetails(productId);
		} else {
			productDetails = await getItemDetails(productId);
		}

		// If product details were found, return them
		if (productDetails) {
			return { success: true, data: productDetails };
		} else {
			return { success: false, message: "Product details not found." };
		}
	} catch (detailError) {
		return {
			success: false,
			message: `Error fetching details: ${detailError instanceof Error ? detailError.message : "Unknown error"}`,
		};
	}
};

// fetch science articles
export const getResearch = async () => {
	const { data, error } = await supabase
		.from("research")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("error", error);

		return [];
	}

	return data;
};

export const getCategoryCounts = async () => {
	const categoryData = [];

	const categoryCounts: Record<string, number> = {};

	for (const category of CATEGORIES) {
		const allTypes = category.dbTypes;

		let table = "items";
		if (
			category.typeId === "filter" ||
			category.typeId === "shower_filter" ||
			category.typeId === "bottle_filter"
		) {
			table = "water_filters";
		}

		const { data, error } = await supabase
			.from(table)
			.select("id, tags")
			.in("type", allTypes);

		if (error) {
			console.error("error", error);
			return [];
		}

		// Convert tags to an array and filter
		const filteredData = data.filter((item) => {
			return category?.tags?.some((tag: string) => item.tags?.includes(tag));
		});

		categoryCounts[category.id] = filteredData.length;

		categoryData.push({
			id: category.id,
			title: category.title,
			typeId: category.typeId,
			image: category.image,
			count: filteredData.length,
			selectedTags: category.selectedTags,
		});
	}

	return categoryData;
};

export const getMostRecentlyUpdatedItems = async () => {
	const { data: itemsData, error: itemsError } = await supabase
		.from("items")
		.select("*")
		.eq("is_indexed", true)
		.order("created_at", { ascending: false })
		.limit(5);

	const { data: filtersData, error: filtersError } = await supabase
		.from("water_filters")
		.select("*")
		.eq("is_indexed", true)
		.order("created_at", { ascending: false })
		.limit(5);

	if (itemsError || filtersError) {
		console.error(
			"Error fetching most recently updated items:",
			itemsError || filtersError,
		);
		return [];
	}

	const combinedData = [...itemsData, ...filtersData];

	// Sort combined data by created_at
	combinedData.sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);

	return combinedData;
};

const getZipCodeLatLng = async (zipCode: string) => {
	const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${API_KEY}`;

	try {
		const response = await axios.get(url);
		const data = response.data;

		if (data.status === "OK") {
			const location = data.results[0].geometry.location;
			return {
				latitude: location.lat,
				longitude: location.lng,
			};
		} else {
			throw new Error(`Geocoding API error: ${data.status}`);
		}
	} catch (error) {
		console.error("Error fetching lat/lng for ZIP code:", error);
		return null;
	}
};

type LatLong = {
	lat: number;
	long: number;
};

type Location = {
	name: string;
	lat_long: LatLong;
};

// Haversine formula to calculate the distance between two latitude/longitude points
function calculateDistance(
	lat1: number,
	long1: number,
	lat2: number,
	long2: number,
): number {
	const R = 6371; // Radius of Earth in kilometers
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLong = (long2 - long1) * (Math.PI / 180);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLong / 2) *
			Math.sin(dLong / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in kilometers
}

export const getNearestLocation = async (
	userCoords: {
		latitude: number;
		longitude: number;
	},
	userId: string,
) => {
	try {
		if (
			!userCoords ||
			!userId ||
			userCoords.latitude === undefined ||
			userCoords.longitude === undefined
		) {
			console.error("Invalid user coords or userId");
			return null;
		}

		console.log("userCoords: ", userCoords);

		const { data, error } = await supabase
			.from("tap_water_locations")
			.select("id, lat_long, score");

		if (error) {
			console.error("Error fetching tap water locations:", error);
			return [];
		}

		const tapWaterLocations = data.filter(
			(location: any) => location.score !== null && location.lat_long !== null,
		);

		let nearestLocation: any = null;
		let shortestDistance = Infinity;

		for (const location of tapWaterLocations) {
			const distance = await calculateDistance(
				userCoords.latitude,
				userCoords.longitude,
				location.lat_long.latitude,
				location.lat_long.longitude,
			);

			// console.log("distance: ", distance);

			if (distance < shortestDistance) {
				shortestDistance = distance;
				nearestLocation = location;
			}
		}

		console.log("nearestLocation: ", nearestLocation);

		// update user's nearest location
		if (nearestLocation) {
			const { error: updateError } = await supabase
				.from("users")
				.update({ tap_location_id: nearestLocation.id })
				.eq("id", userId);

			if (updateError) {
				console.error("Error updating user's nearest location:", updateError);
				return false;
			} else {
				console.log("User's nearest location updated successfully.");
			}
		}

		return true;
	} catch (error) {
		console.error("Error fetching nearest location:", error);
		return null;
	}
};

// Add lat/long to each location
// MANUALLY RUN THIS
// export const addLatLongToEachLocation = async () => {
// 	const { data, error } = await supabase
// 		.from("tap_water_locations")
// 		.select("*")
// 		.is("lat_long", null);

// 	if (error) {
// 		console.error("Error fetching tap water locations:", error);
// 		return [];
// 	}

// 	for (const location of data) {
// 		// console.log("location: ", JSON.stringify(location, null, 2));
// 		const utilities = location.utilities;

// 		if (utilities && utilities.length > 0) {
// 			const zipCode = utilities[0].zip_codes.substring(0, 5);

// 			if (zipCode) {
// 				const latLng = await getZipCodeLatLng(zipCode);

// 				if (latLng) {
// 					const { latitude, longitude } = latLng;

// 					const { error: updateError } = await supabase
// 						.from("tap_water_locations")
// 						.update({ lat_long: { latitude, longitude } })
// 						.eq("id", location.id);

// 					if (updateError) {
// 						console.error(
// 							`Error updating location ${location.id}:`,
// 							updateError,
// 						);
// 					} else {
// 						console.log(`Updated location ${location.id} with lat/long.`);
// 					}
// 				}
// 			}
// 		}
// 	}
// };

// returns row ids for each contaminant
export const getContaminantData = async () => {
	const validCategories = [
		"Chemical Disinfectants",
		"Fluoride",
		"Haloacetic Acids",
		"Heavy Metals",
		"Herbicides",
		"Microplastics",
		"Perfluorinated Chemicals (PFAS)",
		"Pesticides",
		"Pharmaceuticals",
		"Phthalates",
		"Radiological Elements",
		"Semi-Volatile Compounds",
		"Volatile Organic Compounds (VOCs)",
		"Microbiologicals",
		"Minerals",
	];

	const categoryDetails = await Promise.all(
		validCategories.map(async (category) => {
			const { data, error } = await supabase
				.from("ingredients")
				.select("id")
				.eq("is_contaminant", true)
				.eq("category", category);

			if (error) {
				console.error(
					`Error fetching contaminants for category ${category}:`,
					error,
				);
				return { name: category, dbRowIds: [] };
			}

			const dbRowIds = data.map((ingredient) => ingredient.id);
			return { name: category, dbRowIds };
		}),
	);

	console.log("categoryDetails: ", JSON.stringify(categoryDetails, null, 2));
	return categoryDetails;
};
