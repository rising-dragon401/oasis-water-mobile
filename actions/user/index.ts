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
			.in("status", ["trialing", "active"])
			.eq("user_id", uid)
			.single();

		if (!subscription) {
			return null;
		}

		const activePlan = subscription?.prices?.products?.name;

		let planPlan = "Free";
		if (!activePlan) {
			planPlan = "Free";
		} else if (
			activePlan?.toLowerCase() === "pro (test)" ||
			activePlan?.toLowerCase() === "pro (beta)"
		) {
			planPlan = "Pro";
		}

		return {
			...subscription,
			plan: planPlan,
		};
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
