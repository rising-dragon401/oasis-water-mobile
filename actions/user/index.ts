import { supabase } from "@/config/supabase";

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
		return null;
	}

	try {
		// fetch all subscriptions
		const { data: subscription } = await supabase
			.from("subscriptions")
			.select("*, prices(*, products(*))")
			.in("status", ["trialing", "active"])
			.eq("user_id", uid);

		if (!subscription) {
			return null;
		}

		// console.log("subscription[0]: ", JSON.stringify(subscription[0], null, 2));

		// use most recent subscription
		const activePlan = subscription[0]?.prices?.products?.name;

		let planPlan = "Free";
		if (!activePlan) {
			planPlan = "Free";
			return false;
		} else if (
			activePlan?.toLowerCase() === "pro (test)" ||
			activePlan?.toLowerCase() === "pro (beta)" ||
			activePlan?.toLowerCase() === "oasis pro"
		) {
			planPlan = "Pro";
		}

		const subscriptionDetails = {
			...subscription,
			plan: planPlan,
		};

		// console.log(
		// 	"subscriptionDetails",
		// 	JSON.stringify(subscriptionDetails, null, 2),
		// );

		// only return subscription details if user is subscribed
		return subscriptionDetails;
	} catch (error) {
		console.error("Error:", error);
		return null;
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

export async function manageSubscriptionStatusChange(
	uid: string,
	rcVustomerInfo: any,
) {
	// console.log(
	// 	"manageSubscriptionStatusChange: ",
	// 	JSON.stringify(rcVustomerInfo, null, 2),
	// );

	try {
		// check for any active subscriptions
		// if no active subscriptions, then return
		const purchases = rcVustomerInfo?.allPurchasedProductIdentifiers;
		if (!purchases || purchases.length === 0) {
			return;
		}

		const provider = "revenue_cat";
		const entitlements = rcVustomerInfo.entitlements;
		const proEntitlement = entitlements?.all?.pro;
		const proIsActive = proEntitlement?.isActive === true || false;
		const proExpiresDate = proEntitlement?.expirationDate || null;
		const proCreatedAt = proEntitlement?.originalPurchaseDate || null;
		const proPriceId = proEntitlement?.productIdentifier || null;
		const proWillRenew = proEntitlement?.willRenew || false;

		console.log("proWillRenew", proWillRenew);
		// determine if active or cancelled based on proIsActive and expirationDate
		const pastExpirationDate = proExpiresDate < new Date();
		console.log("proIsActive", proIsActive);
		const status = !proIsActive && pastExpirationDate ? "canceled" : "active";
		// const status = !proIsActive ? "canceled" : "active";
		const subscriptionId = "sub_rc_" + proCreatedAt?.toString() + proPriceId;

		// check if required fields are present
		if (!subscriptionId || !proCreatedAt || !proExpiresDate || !proPriceId) {
			throw new Error("Missing required fields");
		}

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
		let isDataSame =
			existingSubscription &&
			Object.keys(subscriptionData).every((key) => {
				return (
					// @ts-ignore
					JSON.stringify(subscriptionData[key]) ===
					JSON.stringify(existingSubscription[key])
				);
			});

		if (!existingSubscription) {
			isDataSame = false;
		}

		// const hasStripeSubscription = existingSubscription.metadata?.provider !== "revenue_cat";

		if (!isDataSame) {
			const { error } = await supabase
				.from("subscriptions")
				.upsert([subscriptionData]);

			// handle referral
			await handleReferral(subscriptionData, uid);

			if (error) throw error;

			console.log(
				`Inserted/updated subscription [${subscriptionId}] for user [${uid}]`,
			);
		} else {
			console.log(
				`No changes detected for subscription [${subscriptionId}]. No update performed.`,
			);
		}
	} catch (error) {
		console.error("Error inserting/updating subscription:", error);
	}
}

export async function addFavorite(uid: string, type: any, itemId: number) {
	const { data, error } = await supabase
		.from("favorites")
		.insert({ uid: uid, type: type, item_id: itemId })
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
			.update({ username: username })
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
		.update({ username: username })
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
