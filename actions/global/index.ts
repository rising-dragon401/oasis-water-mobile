import { supabase } from "@/config/supabase";
import { ITEM_TYPES } from "@/lib/constants/categories";

export const getData = async ({
	table,
	columns = [],
	filters = [],
	orderBy,
	sort = "asc",
	limit = 100,
}: {
	table: string;
	columns: string[];
	filters?: any[];
	orderBy?: string;
	sort?: "asc" | "desc";
	limit?: number;
}) => {
	let query = supabase.from(table).select(columns.join(","));

	// Apply filters
	filters?.forEach((filter) => {
		query = query.eq(filter.column, filter.value);
	});

	// Apply order by
	if (orderBy) {
		query = query.order(orderBy, { ascending: sort === "asc" });
	}

	// Apply limit
	query = query.limit(limit);

	const { data, error } = await query;

	if (error) {
		console.error("Error fetching data:", error);
		return null;
	}

	return data;
};

export const getLatestUsersJoined = async ({
	limit = 10,
}: {
	limit?: number;
}) => {
	const data = await getData({
		table: "users",
		columns: ["id", "full_name", "avatar_url", "username", "created_at"],
		filters: [],
		orderBy: "created_at",
		sort: "desc",
		limit,
	});

	return data;
};

export const getLatestFavorites = async ({
	limit = 10,
}: {
	limit?: number;
}) => {
	const data = await getData({
		table: "favorites",
		columns: ["*"],
		filters: [],
		orderBy: "created_at",
		sort: "desc",
		limit,
	});

	if (!data) {
		return null;
	}

	// console.log("latest favorites: ", JSON.stringify(data, null, 2));

	const favoritesWithDetails = await Promise.all(
		data.map(async (favorite: any) => {
			const user = await getData({
				table: "users",
				columns: ["id", "full_name", "avatar_url", "username"],
				filters: [{ column: "id", value: favorite.uid }],
				limit: 1,
			});

			const itemType = ITEM_TYPES.find((item) => item.typeId === favorite.type);

			const table = itemType ? itemType.tableName : null;

			if (!table) {
				return null;
			}

			const product = await getData({
				table,
				columns: ["id", "name", "image"],
				filters: [{ column: "id", value: favorite.item_id }],
				limit: 1,
			});

			return {
				...favorite,
				user: user ? user[0] : null,
				product: product ? product[0] : null,
			};
		}),
	);

	const filteredFavorites = favoritesWithDetails.filter(
		(favorite) => favorite !== null,
	);

	const simplifiedFavorites = filteredFavorites.map((favorite: any) => ({
		id: favorite.id,
		uid: favorite.uid,
		created_at: favorite.created_at,
		item_id: favorite.item_id,
		type: favorite.type,
		user: favorite.user,
		product: favorite.product,
	}));

	// console.log("latest favorites: ", JSON.stringify(simplifiedFavorites, null, 2));

	return simplifiedFavorites;
};

export const getLatestActions = async ({ limit = 10 }: { limit?: number }) => {
	const usersJoined = await getLatestUsersJoined({ limit });
	const favorites = await getLatestFavorites({ limit });

	const combinedActions: {
		id: string;
		image: string | null;
		name: string | null;
		date: string | null;
		action: string;
	}[] = [];

	if (usersJoined) {
		usersJoined.forEach((user: any, index: number) => {
			combinedActions.push({
				id: `user-${user?.id || index}`,
				image: user?.avatar_url,
				name: user?.full_name || `@${user?.username}`,
				date: user?.created_at,
				action: `joined`,
			});
		});
	}

	if (favorites) {
		favorites.forEach((favorite: any, index: number) => {
			combinedActions.push({
				id: `favorite-${favorite.id || index}`,
				image: favorite.user?.avatar_url,
				name: favorite.user?.full_name || `@${favorite.user?.username}`,
				date: favorite.created_at,
				action: `added ${favorite.product?.name} to their Oasis`,
			});
		});
	}

	// Sort combined actions by date in descending order
	combinedActions.sort(
		(a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
	);

	return combinedActions;
};
