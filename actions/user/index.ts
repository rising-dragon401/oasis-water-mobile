import { supabase } from "@/config/supabase";
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

export async function getSubscription(uid: string | null) {
	if (!uid) {
		return {
			success: false,
			data: null,
		};
	}

	try {
		// fetch all subscriptions including metadata
		const { data: subscription } = await supabase
			.from("subscriptions")
			.select("*, prices(*, products(*)), metadata")
			.in("status", ["trialing", "active"])
			.eq("user_id", uid);

		if (!subscription) {
			console.log("no subscription found");
			return null;
		}

		// use most recent subscription
		const activePlan = subscription[0]?.prices?.products?.name;

		let planPlan = "Free";
		if (!activePlan) {
			planPlan = "Free";
			return {
				success: false,
				data: null,
			};
		} else if (
			activePlan?.toLowerCase() === "pro (test)" ||
			activePlan?.toLowerCase() === "pro (beta)" ||
			activePlan?.toLowerCase() === "oasis pro"
		) {
			planPlan = "Pro";
		}

		const subscriptionDetails = {
			...subscription[0],
			plan: planPlan,
		};

		// only return subscription details if user is subscribed
		return {
			success: true,
			data: subscriptionDetails,
		};
	} catch (error) {
		console.error("Error:", error);
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

	// go through each favorite and get the data for the favorite. If type is 'bottled_water' search items table. If type is 'tap_water_locations'. If type is 'filter' search water_filters table.
	const favorites = await Promise.all(
		data.map(async (favorite) => {
			let result;
			if (favorite.type === "bottled_water") {
				const { data, error } = await supabase
					.from("items")
					.select("*")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				result = data;
			} else if (favorite.type === "tap_water") {
				const { data, error } = await supabase
					.from("tap_water_locations")
					.select("*")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				result = data;
			} else if (favorite.type === "filter") {
				const { data, error } = await supabase
					.from("water_filters")
					.select("*")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				result = data;
			}

			// Only return the result if it has an id and image
			if (result && result.id && result.image) {
				return result;
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
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return true;
	} catch (e) {
		console.error("Error updating user data:", e);
		return false;
	}
}

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

		console.log("existingReferral", existingReferral);

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

export async function manageSubscriptionStatusChange(
	uid: string,
	rcVustomerInfo: any,
) {
	// console.log(
	// 	"manageSubscriptionStatusChange rcVustomerInfo: ",
	// 	JSON.stringify(rcVustomerInfo, null, 2),
	// );
	try {
		// check for any active subscriptions
		// if no active subscriptions, then return
		const purchases = rcVustomerInfo?.allPurchasedProductIdentifiers;

		if (!purchases || purchases.length === 0) {
			await markSubscriptionAsInactive(uid);
			throw new Error("No rev cat purchases found");
			// console.log("no purchases found");
			// return {
			// 	data: "no purchases found",
			// 	success: true,
			// };
		}
		const provider = "revenue_cat";
		const entitlements = rcVustomerInfo.entitlements;

		const proEntitlement = entitlements?.all?.pro;
		const proIsActive = proEntitlement?.isActive === true || false;
		const proExpiresDate = proEntitlement?.expirationDate || null;
		const proCreatedAt = proEntitlement?.originalPurchaseDate || null;
		const proPriceId = proEntitlement?.productIdentifier || null;
		const proWillRenew = proEntitlement?.willRenew || false;
		const pastExpirationDate = proExpiresDate < new Date();

		// Mark subscription as expired if trial has ended or pro is not active
		const status = proIsActive && !pastExpirationDate ? "active" : "expired";

		const subscriptionId = "sub_rc_" + proCreatedAt?.toString() + proPriceId;

		// check if required fields are present
		if (!subscriptionId || !proCreatedAt || !proPriceId) {
			// console.log(
			// 	"No rev cat subscription  found – missing required fields:",
			// 	subscriptionId,
			// 	":",
			// 	proCreatedAt,
			// 	":",
			// 	proPriceId,
			// );

			await markSubscriptionAsInactive(uid);
			throw new Error(
				"Rev cat sub details not found - Missing required fields",
			);
		}

		// Latest data from rev cat
		const subscriptionData = {
			id: subscriptionId,
			user_id: uid,
			metadata: {
				provider,
				...rcVustomerInfo,
			},
			amount: 4700,
			status,
			price_id: proPriceId,
			quantity: 1,
			created: proCreatedAt,
			current_period_end: proExpiresDate,
			cancel_at_period_end: !proWillRenew,
		};

		// Check if the existing data matches the new data
		const { data: existingSubscription, error: fetchError } = await supabase
			.from("subscriptions")
			.select("*")
			.eq("id", subscriptionId)
			.single();

		// Compare existing data with new data
		let hasChanged = false;
		// only update if status has changed
		if (
			existingSubscription &&
			subscriptionData?.status !== existingSubscription?.status
		) {
			hasChanged = true;
		}

		// console.log("hasChanged", hasChanged);

		if (hasChanged || !existingSubscription) {
			console.log("upserting subscription");
			const { error } = await supabase
				.from("subscriptions")
				.upsert([subscriptionData]);
			// handle referral
			// only reward referral if subscription is active
			if (status === "active") {
				await handleReferral(subscriptionData, uid);
			}

			if (error) throw error;
			console.log(
				`Inserted/updated subscription [${subscriptionId}] for user [${uid}]`,
			);
		} else {
			// console.log(
			// 	`No changes detected for subscription [${subscriptionId}]. No update performed.`,
			// );
		}

		// redundant update subscription
		// definitely paranoia lol
		if (status === "active") {
			await markSubscriptionAsActive(uid);
		} else {
			await markSubscriptionAsInactive(uid);
		}

		return {
			success: true,
		};
	} catch (error) {
		await markSubscriptionAsInactive(uid);
		console.error("Error inserting/updating subscription:", error);
		return {
			success: false,
			data: error,
		};
	}
}

export async function addFavorite(uid: string, type: any, itemId: number) {
	const { data, error } = await supabase
		.from("favorites")
		.insert({ uid, type, item_id: itemId })
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
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
		.neq("is_oasis_public", false);

	if (error) {
		console.error("Error fetching users with oasis:", error);
		return null;
	}

	const filtered = data.filter((user) => user.score !== null);
	const sorted = filtered.sort(
		(a, b) => Number(b.is_featured) - Number(a.is_featured),
	);

	return sorted;
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

export const getUserTapScore = async (tapWaterLocationId: string) => {
	if (!tapWaterLocationId) {
		return null;
	}

	const id = parseInt(tapWaterLocationId);

	const { data, error } = await supabase
		.from("tap_water_locations")
		.select("name, score, utilities, image")
		.eq("id", id);

	if (error) {
		console.error("Error getting user tap score:", error);
		return null;
	}

	const contaminants = data?.[0]?.utilities[0]?.contaminants;

	const healthEffects = contaminants.map((contaminant: any) => {
		const ingredientId = contaminant.ingredient_id;
		return HEALTH_EFFECTS.find((effect) =>
			effect.dbRowIds.includes(ingredientId),
		);
	});

	const details = {
		id,
		image: data?.[0]?.image,
		name: data?.[0]?.name,
		score: data?.[0]?.score,
		health_effects: [
			...new Set(healthEffects.map((effect: any) => effect?.harms).flat()),
		].filter(Boolean),
		contaminants: contaminants.map(
			(contaminant: any) => contaminant.ingredient_id,
		),
	};

	return details;
};

export const calculateUserScores = async (favorites: any, tapScore: any) => {
	const calculateShowersScore = () => {
		const showerFilters = (favorites ?? []).filter((favorite: any) =>
			favorite.tags.includes("shower"),
		);

		const topShowerScore =
			showerFilters.length > 0
				? Math.max(...showerFilters.map((filter: any) => filter.score))
				: 0;

		return topShowerScore > 0 ? topShowerScore : tapScore?.score;
	};

	const calculateWaterFilterScore = () => {
		const drinkingFilters = (favorites ?? []).filter(
			(favorite: any) => favorite.type === "filter",
		);

		const drinkingFilterScore =
			drinkingFilters.length > 0
				? Math.max(...drinkingFilters.map((filter: any) => filter.score))
				: 0;

		return drinkingFilterScore > 0 ? drinkingFilterScore : tapScore?.score;
	};

	const calculateBottledWaterScore = () => {
		const bottledWater = (favorites ?? []).filter(
			(favorite: any) => favorite.type === "bottled_water",
		);

		if (bottledWater.length === 0) {
			return 0;
		}

		const totalBottledWaterScore = bottledWater.reduce(
			(acc: number, water: any) => acc + water.score,
			0,
		);
		return totalBottledWaterScore / bottledWater.length;
	};

	const overallScore =
		(favorites ?? []).reduce(
			(acc: number, favorite: any) => acc + favorite.score,
			0,
		) / (favorites?.length || 1);

	console.log("overallScore", overallScore);

	const showersScore = calculateShowersScore();
	const waterFilterScore = calculateWaterFilterScore();
	const bottledWaterScore = calculateBottledWaterScore();

	return {
		showersScore,
		waterFilterScore,
		bottledWaterScore,
		overallScore,
	};
};
