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

export async function getSubscription(uid: string | null) {
	if (!uid) {
		return null;
	}

	try {
		const { data: subscription } = await supabase
			.from("subscriptions")
			.select("*, prices(*, products(*))")
			// .in("status", ["trialing", "active"])
			.eq("user_id", uid)
			.single();

		if (!subscription) {
			return null;
		}

		const activePlan = subscription?.prices?.products?.name;

		// console.log(
		// 	"subscription?.prices?.products?.name",
		// 	subscription?.prices?.products?.name,
		// );

		let planPlan = "Free";
		if (!activePlan) {
			planPlan = "Free";
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
			if (favorite.type === "bottled_water") {
				const { data, error } = await supabase
					.from("items")
					.select("*")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				return data;
			} else if (favorite.type === "tap_water") {
				const { data, error } = await supabase
					.from("tap_water_locations")
					.select("*")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				return data;
			} else if (favorite.type === "filter") {
				const { data, error } = await supabase
					.from("water_filters")
					.select("*")
					.eq("id", favorite.item_id)
					.single();

				if (error) {
					throw new Error(error.message);
				}

				return data;
			}
		}),
	);

	return favorites;
}

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

		if (!isDataSame) {
			const { error } = await supabase
				.from("subscriptions")
				.upsert([subscriptionData]);

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
