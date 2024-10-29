import { getFilterDetails } from "@/actions/filters";
import { getItemDetails } from "@/actions/items";
import { supabase } from "@/config/supabase";

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
