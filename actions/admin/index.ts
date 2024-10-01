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
		.eq("is_featured", true);

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
