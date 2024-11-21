import { supabase } from "@/config/supabase";
import { ITEM_TYPES } from "@/lib/constants/categories";
import { HEALTH_EFFECTS } from "@/lib/constants/health-effects";

export async function getCurrentUserData(uid?: string) {
	const userId = uid;

	if (!userId) {
		return null;
	}

	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching user: ", error);
		return null;
	}

	// generate avatar url
	if (!data.avatar_url) {
		const randomInt = Math.floor(Math.random() * 15) + 1;
		data.avatar_url = `https://connect.live-oasis.com/storage/v1/object/public/website/avatars/gradients/gradient-${randomInt}.png`;

		// update user with new avatar url
		try {
			await supabase
				.from("users")
				.update({ avatar_url: data.avatar_url })
				.eq("id", userId);
		} catch (error) {
			console.error("Error updating user avatar url:", error);
		}
	}

	const dataWithFields = {
		...data,
		email: data.email || "",
	};

	return dataWithFields;
}

export const getUserData = async (uid: string) => {
	const user = await getCurrentUserData(uid);
	return user;
};

// Checks for active Stripe subscription
export async function getStripeSubscription(uid: string | null) {
	try {
		if (!uid) {
			throw new Error("No user id found");
		}

		// fetch all subscriptions including metadata
		const { data: subscription } = await supabase
			.from("subscriptions")
			.select("*")
			.in("status", ["active"])
			.not("rc_customer_id", "is", null)
			.eq("user_id", uid);

		if (!subscription || subscription?.length === 0) {
			throw new Error("No subscription found");
		}

		const subData = subscription[0];

		if (
			subData.metadata.provider === "revenue_cat" ||
			subData.price_id.includes("pro")
		) {
			throw new Error("No active Stripe subscription found");
		}

		// Default to Pro
		const subscriptionDetails = {
			...subscription[0],
			plan: "Pro",
		};

		return {
			success: true,
			data: subscriptionDetails,
		};
	} catch (error) {
		console.log("Error fetching stripe subscription:", error);
		return {
			success: false,
			data: null,
		};
	}
}

export async function getUserFavorites(uid: string) {
	const userId = uid;

	const { data, error } = await supabase
		.from("favorites")
		.select("*")
		.eq("uid", userId);

	if (error) {
		throw new Error(error.message);
	}

	// Filter out duplicates by item_id
	const uniqueFavorites = data.filter(
		(favorite, index, self) =>
			index === self.findIndex((f) => f.item_id === favorite.item_id),
	);

	if (error) {
		throw new Error("Error fetching unique favorites");
	}

	const bottledWaterTypes = ITEM_TYPES.filter(
		(item) => item.id === "water",
	).flatMap((item) => item.dbTypes);

	const filterTypes = ITEM_TYPES.filter((item) => item.id === "filter").flatMap(
		(item) => item.dbTypes,
	);

	// go through each favorite and get the data for the favorite. If type is 'bottled_water' search items table. If type is 'tap_water_locations'. If type is 'filter' search water_filters table.
	const favorites = await Promise.all(
		uniqueFavorites.map(async (favorite) => {
			let result;
			if (bottledWaterTypes.includes(favorite.type)) {
				const { data, error } = await supabase
					.from("items")
					.select("*, brand:brands(name)")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				result = data;
			} else if (filterTypes.includes(favorite.type)) {
				const { data, error } = await supabase
					.from("water_filters")
					.select("*, brand:brands(name)")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				result = data;
			}

			// Only return the result if it has an id, image, and brandName
			if (result && result.id && result.image) {
				return {
					...result,
					brandName: result.brand?.name || null,
				};
			}
		}),
	);

	// Filter out any undefined results (where id or image were null)
	return favorites.filter(Boolean);
}

export async function updateUserData(id: string, column: string, value: any) {
	try {
		if (!id) {
			throw new Error("No user found");
		}

		const { error } = await supabase
			.from("users")
			.update({ [column]: value })
			.eq("id", id);

		if (error) {
			throw new Error(error.message);
		}

		return true;
	} catch (e) {
		console.error("Error updating user data:", e);
		return false;
	}
}

export const updateUserRcId = async (uid: string, rcId: string) => {
	const { data, error: fetchError } = await supabase
		.from("users")
		.select("*")
		.eq("rc_customer_id", rcId);

	if (fetchError) {
		throw new Error(fetchError.message);
	}

	if (!data || data.length === 0) {
		const { error } = await supabase
			.from("users")
			.update({ rc_customer_id: rcId })
			.eq("id", uid);

		if (error) {
			throw new Error(error.message);
		}
	}
};

const getUserByUUID = async (uuid: string) => {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", uuid)
		.single();
	if (error) throw error;
	return data;
};

// reward user referral if applicabe
const handleReferral = async (subscriptionData: any, uuid: string) => {
	try {
		// Attribute referral code to the user
		const userData = await getUserByUUID(uuid);

		// referral codes are simply the other user's username
		const referralCode = userData?.referred_by;

		if (!referralCode) return;

		// Check if a referral record already exists for this subscription
		const { data: existingReferral, error: fetchError } = await supabase
			.from("referrals")
			.select("*")
			.eq("subscription_id", subscriptionData.id)
			.single();

		// console.log("existingReferral", existingReferral);

		const referralData = {
			referring_user_id: referralCode,
			user_id: uuid,
			subscription_id: subscriptionData.id,
			price_id: subscriptionData.price_id,
			amount: subscriptionData.amount,
			subscription_status: subscriptionData.status,
		};

		if (existingReferral) {
			// Update existing referral record
			const { error } = await supabase
				.from("referrals")
				.update(referralData)
				.eq("id", existingReferral.id);

			throw error;
		} else {
			// Insert new referral record
			const { error } = await supabase.from("referrals").insert([referralData]);
			throw error;
		}
	} catch (error) {
		console.error("Error handling referral: ", error);
	}
};

// when in doubt mark as inactive
const markSubscriptionAsInactive = async (uid: string) => {
	const { error } = await supabase
		.from("subscriptions")
		.update({ status: "expired" })
		.eq("user_id", uid);

	if (error) {
		console.error("Error marking subscription as inactive:", error);
	}
};

const markSubscriptionAsActive = async (uid: string) => {
	const { error } = await supabase
		.from("subscriptions")
		.update({ status: "active" })
		.eq("user_id", uid);

	if (error) {
		console.error("Error marking subscription as active:", error);
	}
};

export const awardFreeUnlock = async (
	uid: string,
	unlocksRemaining: number,
) => {
	const newUnlocksRemaining = unlocksRemaining ? unlocksRemaining + 1 : 1;

	console.log("newUnlocksRemaining", newUnlocksRemaining);

	const { error } = await supabase
		.from("users")
		.update({ unlocks_remaining: newUnlocksRemaining })
		.eq("id", uid);

	if (error) {
		console.error("Error awarding free unlock:", error);
		return false;
	}

	return true;
};

export const attachReferralCodeToUser = async (
	uid: string,
	referred_by: string,
) => {
	try {
		console.log("referred_by", referred_by);

		// first get the uid of the referring user
		const { data: referringUser, error: referringUserError } = await supabase
			.from("users")
			.select("id, username, unlocks_remaining")
			.eq("username", referred_by);

		if (referringUserError) {
			console.error("Error fetching referring user:", referringUserError);
			throw referringUserError;
		}

		const referringUserId = referringUser[0].id;
		const referringUnlocksRemaining = referringUser[0].unlocks_remaining;

		// assign user id to new user referred_by column
		const { error } = await supabase
			.from("users")
			.update({ referred_by: referringUserId })
			.eq("id", uid);

		if (error) {
			console.error("Error attaching referral code to user:", error);
			throw error;
		}

		// then award free unlock to the referring user
		const success = await awardFreeUnlock(
			referringUserId,
			referringUnlocksRemaining,
		);

		if (!success) {
			throw new Error("Error awarding free unlock to referring user");
		}

		return success;
	} catch (error) {
		console.error("Error attaching referral code to user:", error);
		return false;
	}
};

export const redeemUnlock = async (
	uid: string,
	productId: string,
	productType: string,
) => {
	// first get user data
	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("id, unlock_history, unlocks_remaining")
		.eq("id", uid);

	const data = userData?.[0];

	if (userError || !data) {
		console.error("Error fetching user data:", userError);
		return false;
	}

	const currentUnlockHistory = data.unlock_history || [];
	const unlocksRemaining = data.unlocks_remaining || 0;

	if (unlocksRemaining <= 0) {
		return false;
	}

	const newUnlockHistory = [
		...currentUnlockHistory,
		{
			product_id: productId,
			product_type: productType,
			unlocked_at: new Date(),
		},
	];

	const newUnlocksRemaining = unlocksRemaining - 1;

	//  add item to user's unlock history
	const { error } = await supabase
		.from("users")
		.update({
			unlock_history: newUnlockHistory,
			unlocks_remaining: newUnlocksRemaining,
		})
		.eq("id", uid);

	if (error) {
		console.error("Error updating user data:", error);
		return false;
	}

	return true;
};

export const getMostRecentUserSub = async (uid: string) => {
	const { data, error } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", uid)
		.order("created", { ascending: false });

	if (error) {
		console.error("Error fetching most recent user sub:", error);
		return null;
	}

	return data[0];
};

export async function addFavorite(uid: string, type: any, itemId: number) {
	console.log("addFavorite", uid, type, itemId);
	// Insert the new favorite
	const { data, error } = await supabase
		.from("favorites")
		.insert({ uid, type, item_id: itemId });

	if (error) {
		console.error("Error adding favorite:", error);
		return false;
	}

	return true;
}

export async function removeFavorite(
	uid: string,
	type: string,
	itemId: number,
) {
	const { data, error } = await supabase
		.from("favorites")
		.delete()
		.eq("uid", uid)
		.eq("type", type)
		.eq("item_id", itemId);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export const calculateUserScore = async (uid: string) => {
	try {
		const favs = await getUserFavorites(uid);

		let score = 0;
		let totalCount = 0;
		let totalScore = 0;

		// get average
		await favs.map((fav: any) => {
			totalScore += fav.score || 0;
			totalCount += 1;
		});

		score = Math.round(totalScore / totalCount);

		return updateUserData(uid, "score", score);
	} catch {
		return false;
	}
};

export const incrementItemsViewed = async (uid: string | null | undefined) => {
	if (!uid) {
		return null;
	}

	// Fetch current user data to get the current items_viewed count
	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("*")
		.eq("id", uid)
		.single();

	if (userError) {
		console.error("Error fetching user data:", userError);
		return null;
	}

	// Increment items_viewed count
	// @ts-ignore
	const currentItemsViewed = userData.metadata?.items_viewed || 0;
	const updatedItemsViewed = currentItemsViewed + 1;

	// Update user metadata with new items_viewed count
	const { data, error } = await supabase
		.from("users")
		.update({ metadata: { items_viewed: updatedItemsViewed } })
		.eq("id", uid)
		.select();

	if (error) {
		console.error("Error incrementing items viewed:", error);
		return null;
	}

	return data;
};

export const getUsersWithOasis = async () => {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.not("score", "is", null)
		.not("full_name", "is", null)
		.order("created_at", { ascending: false })
		.limit(50);

	if (error) {
		console.error("Error fetching users with oasis:", error);
		return null;
	}

	// const filtered = data.filter((user) => user.score !== null);
	// const sorted = filtered.sort(
	// 	(a, b) => Number(b.is_featured) - Number(a.is_featured),
	// );

	return data;
};

export const getUserInviteCode = async (uid: string): Promise<any> => {
	const { data, error } = await supabase
		.from("invite_codes")
		.select("id, redemptions")
		.eq("uid", uid)
		.single();

	if (error || !data) {
		console.error("Error fetching invite code:", error);
		return null;
	}

	return data;
};

export const generateUserInviteCode = async (uid: string): Promise<any> => {
	const inviteCode = (Math.random().toString(36) + "000000")
		.substring(2, 8)
		.toUpperCase();

	console.log("inviteCode", inviteCode);

	try {
		// make sure the invite code doesn't already exist
		const { data: existingInvite, error } = await supabase
			.from("invite_codes")
			.select("id")
			.eq("id", inviteCode)
			.single();

		if (existingInvite) {
			return generateUserInviteCode(uid);
		}

		const { data: createCode, error: inviteError } = await supabase
			.from("invite_codes")
			.insert([{ id: inviteCode, uid }]);

		if (inviteError) {
			console.error("Error creating invite code:", inviteError);
			return null;
		}

		return inviteCode;
	} catch (error) {
		console.error("Error generating invite code:", error);
		return null;
	}
};

export const redeemInviteCode = async (uid: string, code: string) => {
	try {
		// first check if user has already redeemed a code
		const { data: userData, error: redemptionError } = await supabase
			.from("users")
			.select("*")
			.single();

		if (userData?.redeemed_invite_code) {
			console.error("User has already redeemed a code");
			return null;
		}

		// if not, get user id of the creator of the code and add uid above to their redemptions array
		const { data: inviteData, error: inviteError } = await supabase
			.from("invite_codes")
			.select("*")
			.eq("id", code)
			.single();

		if (inviteError) {
			console.error("Error fetching invite code:", inviteError);
			return null;
		}

		if (!inviteData) {
			console.error("Invite code not found");
			return null;
		}

		if (inviteData.uid === uid) {
			console.error("User cannot redeem their own code");
			return null;
		}

		const currentArray = inviteData.redemptions || [];
		// check if code is already redeemed
		if (currentArray.includes(uid)) {
			console.error("Code already redeemed");
			return null;
		}

		currentArray.push(uid);

		// add uid to the creator's redemptions array
		const { data: redemptionData, error: redemptionError2 } = await supabase
			.from("invite_codes")
			.update({ redemptions: currentArray })
			.eq("id", code);

		if (redemptionError2) {
			console.error("Error updating invite code:", redemptionError2);
			return null;
		}

		// add the code to the user's redeemed_invite_code
		const { data: userData2, error: redemptionError3 } = await supabase
			.from("users")
			.update({ redeemed_invite_code: code })
			.eq("id", uid);

		if (redemptionError3) {
			console.error("Error updating user:", redemptionError3);
			return null;
		}

		return true;
	} catch (error) {
		console.error("Error redeeming invite code:", error);
		return null;
	}
};

export const awardFreeMonth = async (uid: string) => {
	// create row in subscriptions table
	// get current date
	const currentDate = new Date();
	const nextMonth = new Date();
	nextMonth.setMonth(nextMonth.getMonth() + 1);

	const subscriptionData = {
		id: "sub_free_" + currentDate.toString(),
		user_id: uid,
		metadata: {
			provider: "invite_codes",
		},
		status: "active",
		price_id: process.env.EXPO_PUBLIC_STRIPE_PRO_PRICE_ID,
		quantity: 1,
		created: currentDate,
		current_period_end: nextMonth,
		cancel_at_period_end: false,
	};

	try {
		const { error } = await supabase
			.from("subscriptions")
			.upsert([subscriptionData]);

		if (error) {
			throw new Error(error.message);
		}

		return true;
	} catch (error) {
		console.error("Error awarding free month:", error);
		return false;
	}
};

const checkUsernameExists = async (username: string) => {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("username", username)
		.single();

	return data;
};

export const createUsername = async (uid: string): Promise<string | false> => {
	try {
		const randomString = Math.random().toString(36).substring(2, 15);
		const username = `oasis-${randomString}`;

		// check if username already exists
		const existingUsername = await checkUsernameExists(username);

		if (existingUsername) {
			return await createUsername(uid);
		}

		const { data, error } = await supabase
			.from("users")
			.update({ username })
			.eq("id", uid)
			.select();

		return username;
	} catch (error) {
		console.error("Error creating username:", error);
		return false;
	}
};

export const updateUsername = async (uid: string, username: string) => {
	const existingUsername = await checkUsernameExists(username);

	if (existingUsername && existingUsername.id !== uid) {
		return false;
	}

	const { data, error } = await supabase
		.from("users")
		.update({ username })
		.eq("id", uid)
		.select();

	return data;
};

export const getUserByUsername = async (username: string) => {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("username", username)
		.single();

	return data;
};

export const isUserLoggedIn = async () => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return false;
	}

	const { data, error: userError } = await supabase
		.from("users")
		.select("id")
		.eq("id", user.id)
		.single();

	if (userError || !data) {
		return false;
	}

	return true;
};

export const getRecommendedProducts = async (uid: string) => {
	const recommendedProducts: any = {
		BottledWater: [],
		WaterDelivery: [],
		DrinkingWaterFilter: [],
		ShowerFilter: [],
		BottleFilter: [],
	};

	return recommendedProducts;

	// try {
	// 	// Bottled waters
	// 	const { data: bottledWaters, error } = await supabase
	// 		.from("items")
	// 		.select("*")
	// 		.eq("type", "bottled_water")
	// 		.in("tags", ["still", "sparkling"])
	// 		.not("score", "is", null)
	// 		.order("score", { ascending: false })
	// 		.limit(5);

	// 	if (error) {
	// 		throw new Error(error.message);
	// 	}

	// 	recommendedProducts.BottledWater = bottledWaters || [];

	// 	// Delivery services
	// 	const { data: deliveryServices, error: deliveryError } = await supabase
	// 		.from("items")
	// 		.select("*")
	// 		.eq("type", "water_gallon")
	// 		.not("score", "is", null)
	// 		.order("score", { ascending: false })
	// 		.limit(5);

	// 	// if (deliveryError) {
	// 	// 	throw new Error(deliveryError.message);
	// 	// }

	// 	recommendedProducts.WaterDelivery = deliveryServices || [];

	// 	// Drinking water filter
	// 	const { data: drinkingWaterFilters, error: drinkingWaterError } =
	// 		await supabase
	// 			.from("water_filters")
	// 			.select("*")
	// 			.in("tags", ["counter", "under_sink", "pitcher", "sink"])
	// 			.not("score", "is", null)
	// 			.order("score", { ascending: false })
	// 			.limit(5);

	// 	// if (drinkingWaterError) {
	// 	// 	throw new Error(drinkingWaterError.message);
	// 	// }

	// 	recommendedProducts.DrinkingWaterFilter = drinkingWaterFilters || [];

	// 	// Shower filters
	// 	const { data: showerFilters, error: showerError } = await supabase
	// 		.from("water_filters")
	// 		.select("*")
	// 		.in("tags", ["shower", "bath"])
	// 		.not("score", "is", null)
	// 		.order("score", { ascending: false })
	// 		.limit(5);

	// 	// if (showerError) {
	// 	// 	throw new Error(showerError.message);
	// 	// }

	// 	recommendedProducts.ShowerFilter = showerFilters || [];

	// 	// Water bottle filter
	// 	const { data: waterBottleFilters, error: waterBottleError } = await supabase
	// 		.from("water_filters")
	// 		.select("*")
	// 		.in("tags", ["bottle"])
	// 		.not("score", "is", null)
	// 		.order("score", { ascending: false })
	// 		.limit(5);

	// 	// if (waterBottleError) {
	// 	// 	throw new Error(waterBottleError.message);
	// 	// }

	// 	recommendedProducts.BottleFilter = waterBottleFilters || [];

	// 	// console.log("recommendedProducts", recommendedProducts);

	// 	return recommendedProducts;
	// } catch (error) {
	// 	console.error("Error getting recommended products:", error);
	// 	return null;
	// }
};

export const getUserTapScore = async (
	uid: string,
	tapWaterLocationId: number,
) => {
	if (!tapWaterLocationId) {
		return null;
	}

	const { data, error } = await supabase
		.from("tap_water_locations")
		.select("name, score, utilities, image")
		.eq("id", tapWaterLocationId);

	if (error) {
		console.error("Error getting user tap score:", error);
		return null;
	}

	const contaminants = data?.[0]?.utilities[0]?.contaminants;

	const contaminantCategories = await Promise.all(
		contaminants.map(async (contaminant: any) => {
			const { data } = await supabase
				.from("ingredients")
				.select("category")
				.eq("id", contaminant.ingredient_id);
			return data ? data[0].category : null;
		}),
	);

	const details = {
		id: tapWaterLocationId,
		image: data?.[0]?.image,
		name: data?.[0]?.name,
		score: data?.[0]?.score,

		contaminants: contaminants.map((contaminant: any) => ({
			id: contaminant.ingredient_id,
			category: contaminantCategories.find(
				(category: any, index: number) =>
					index === contaminants.indexOf(contaminant),
			),
		})),
	};

	// update tap_score in user table
	await updateUserData(uid, "tap_score", details);

	return details;
};

export const getFilterScores = async (
	tapWaterContaminants: any[],
	filterList: any[],
) => {
	if (!filterList || filterList.length === 0) {
		return {
			topFilter: null,
			score: 0,
			exposedContaminants: tapWaterContaminants.map(
				(contaminant) => contaminant.id,
			),
		};
	}

	const contaminantCategories = tapWaterContaminants.map(
		(contaminant) => contaminant.category,
	);

	const filtersWithScores = filterList.map((filter) => {
		const filteredCategories = filter.filtered_contaminant_categories;

		let totalPercentageRemoved = 0;
		const categoryCount = contaminantCategories.length;

		contaminantCategories.forEach((category) => {
			const filteredCategory = filteredCategories.find(
				(filtered: { category: string; percentage: number }) =>
					filtered.category === category && filtered.percentage > 80,
			);

			if (filteredCategory) {
				totalPercentageRemoved += filteredCategory.percentage;
			}
		});

		const effectivenessScore =
			categoryCount > 0 ? totalPercentageRemoved / categoryCount : 0;

		return {
			...filter,
			effectivenessScore,
		};
	});

	// Sort filters by effectiveness score in descending order
	const sortedFilters = filtersWithScores.sort(
		(a, b) => b.effectivenessScore - a.effectivenessScore,
	);

	// Get the top filter
	const topFilter = sortedFilters[0];

	// Calculate exposed contaminants for the top filter
	const exposedContaminants = tapWaterContaminants
		.filter((contaminant) => {
			const filteredCategory = topFilter.filtered_contaminant_categories.find(
				(filtered: { category: string; percentage: number }) =>
					filtered.category === contaminant.category,
			);
			return !filteredCategory || filteredCategory.percentage < 80;
		})
		.map((contaminant) => contaminant.id);

	return {
		topFilter: topFilter.id,
		score: topFilter.effectivenessScore,
		exposedContaminants,
	};
};

const calculateBottledWaterScore = (favorites: any[]) => {
	const bottledWater = (favorites ?? []).filter(
		(favorite: any) =>
			favorite.type === "bottled_water" || favorite.type === "water_gallon",
	);

	const bottledWaterContaminants = bottledWater.flatMap((water: any) =>
		water.ingredients.map((ingredient: any) => ingredient.ingredient_id),
	);

	if (bottledWater.length === 0) {
		return {
			score: 0,
			exposedContaminants: [],
		};
	}

	const totalBottledWaterScore = bottledWater.reduce(
		(acc: number, water: any) => acc + water.score,
		0,
	);

	const exposedContaminants = bottledWaterContaminants.map(
		(contaminant: number) => contaminant,
	);

	// console.log(
	// 	"exposedContaminants",
	// 	JSON.stringify(exposedContaminants, null, 2),
	// );

	return {
		score: totalBottledWaterScore / bottledWater.length,
		exposedContaminants,
	};
};

export const getIngredientsMetadata = async (ingredientIds: number[]) => {
	// Remove duplicate ingredient IDs
	const uniqueIngredientIds = Array.from(new Set(ingredientIds));

	const ingredientsMetadata = await Promise.all(
		uniqueIngredientIds.map(async (ingredientId) => {
			const { data, error } = await supabase
				.from("ingredients")
				.select("id, name, category, risks, benefits, is_contaminant")
				.eq("id", ingredientId)
				.single();

			if (error) {
				console.error(
					`Error fetching ingredient data for ID ${ingredientId}:`,
					error,
				);
				return null;
			}

			return data;
		}),
	);

	return ingredientsMetadata.filter((metadata) => metadata !== null);
};

export const calculateUserScores = async (
	uid: string,
	favorites: any,
	tapScore: any,
) => {
	const showerFilters = (favorites ?? []).filter((favorite: any) =>
		favorite.tags.includes("shower"),
	);

	let showerScore_ = null;
	if (tapScore) {
		showerScore_ = await getFilterScores(tapScore.contaminants, showerFilters);
	}

	const drinkingFilters = (favorites ?? []).filter(
		(favorite: any) =>
			favorite.type === "filter" || favorite.type === "bottle_filter",
	);

	let waterFilterScore_ = null;
	if (tapScore) {
		waterFilterScore_ = await getFilterScores(
			tapScore.contaminants,
			drinkingFilters,
		);
	}

	const bottledWaterScore_ = await calculateBottledWaterScore(favorites);

	const overallScore =
		(favorites ?? []).reduce(
			(acc: number, favorite: any) => acc + favorite.score,
			0,
		) / (favorites?.length || 1);

	// Combine exposed contaminants from all scores
	const allExposedContaminants = [
		...(showerScore_?.exposedContaminants || []),
		...(waterFilterScore_?.exposedContaminants || []),
		...(bottledWaterScore_.exposedContaminants || []),
	];

	const ingredientsMetadata = await getIngredientsMetadata(
		allExposedContaminants,
	);

	// use HEALTH_EFFECTS to associate each ingredient with a list of benefits and harms based on category
	const allIngredients = ingredientsMetadata.map((ingredient) => {
		const matchedCategories = HEALTH_EFFECTS.filter((category) =>
			category.categories.includes(ingredient.category),
		);

		const harms = matchedCategories
			.filter((category) => category.type === "harm")
			.map((category) => category);

		const benefits = matchedCategories
			.filter((category) => category.type === "benefit")
			.map((category) => category);

		return {
			...ingredient,
			harms,
			benefits,
		};
	});

	const allContaminants = allIngredients.filter(
		(ingredient) => ingredient.is_contaminant,
	);

	const allMinerals = allIngredients.filter(
		(ingredient) => ingredient.category === "Minerals",
	);

	const uniqueBenefits = new Set();
	const uniqueHarms = new Set();

	allIngredients.forEach((ingredient) => {
		((ingredient.benefits as any[]) ?? []).forEach((benefit: any) => {
			uniqueBenefits.add(benefit);
		});
		((ingredient.harms as any[]) ?? []).forEach((harm: any) => {
			uniqueHarms.add(harm);
		});
	});

	const allBenefits = Array.from(uniqueBenefits);
	const allHarms = Array.from(uniqueHarms);

	const data = {
		showerScore: showerScore_,
		waterFilterScore: waterFilterScore_,
		bottledWaterScore: bottledWaterScore_,
		overallScore: Math.round(overallScore),
		allIngredients,
		allBenefits,
		allHarms,
		allContaminants,
		allMinerals,
	};

	// update scores column in user table
	await updateUserData(uid, "scores", data);

	return data;
};

export const addWatersAndFiltersToUserFavorites = async (
	uid: string,
	favorites: any,
) => {
	for (const favorite of favorites) {
		// translate type
		let type = favorite.type;
		if (type === "item") {
			type = "bottled_water";
		}

		const added = await addFavorite(uid, type, favorite.id);
		if (!added) {
			return false;
		}
	}

	return true;
};

export const getUserUpvoted = async (userId: string | null | undefined) => {
	if (!userId) {
		return {
			items: [],
			filters: [],
			tapLocations: [],
			categories: [],
		};
	}
	const { data: itemsData, error: itemsError } = await supabase
		.from("contributions")
		.select("*")
		.eq("user_id", userId)
		.eq("kind", "upvote_product")
		.eq("product_type", "bottled_water");

	const { data: filtersData, error: filtersError } = await supabase
		.from("contributions")
		.select("*")
		.eq("user_id", userId)
		.eq("product_type", "filter")
		.eq("kind", "upvote_product");

	const { data: tapLocationsData, error: tapLocationsError } = await supabase
		.from("contributions")
		.select("*")
		.eq("user_id", userId)
		.eq("product_type", "tap_water")
		.eq("kind", "upvote_product");

	const { data: categoriesData, error: categoriesError } = await supabase
		.from("contributions")
		.select("*")
		.eq("user_id", userId)
		.eq("kind", "upvote_category");

	if (itemsError || filtersError || tapLocationsError || categoriesError) {
		console.error(
			"Error fetching user upvoted data:",
			itemsError,
			filtersError,
			tapLocationsError,
		);
		return {
			items: [],
			filters: [],
			tapLocations: [],
		};
	}

	return {
		items: itemsData.map((item: any) => item.product_id),
		filters: filtersData.map((filter: any) => filter.product_id),
		tapLocations: tapLocationsData.map(
			(tapLocation: any) => tapLocation.product_id,
		),
		categories: categoriesData.map((category: any) => category.category_id),
	};
};

export const checkIfUserUpvoted = async (
	userId: string,
	thingId: string,
	product_type: string,
) => {
	const { data, error } = await supabase
		.from("contributions")
		.select("*")
		.eq("user_id", userId)
		.eq("product_id", thingId)
		.eq("product_type", product_type)
		.eq("kind", "upvote_product");

	if (error) {
		console.error("Error checking if user upvoted:", error);
		return false;
	}

	if (data && data.length > 0) {
		return true;
	}

	return false;
};
