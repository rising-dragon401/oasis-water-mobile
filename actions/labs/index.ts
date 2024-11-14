import { supabase } from "@/config/supabase";
import { ITEM_TYPES } from "@/lib/constants/categories";

export const fetchInProgressItems = async ({
	type,
	limit,
}: {
	type?: string;
	limit: number;
}) => {
	try {
		const query = supabase.from("labs").select("*").eq("status", "in_progress");

		if (type) {
			query.eq("product_type", type);
		}

		const { data, error } = await query.limit(limit);

		if (error) {
			throw new Error(
				`Error fetchInProgressItems fetching data from labs: ${error.message}`,
			);
		}

		const productId = data[0]?.product;

		if (!productId) {
			return [];
		}

		const table = ITEM_TYPES.find((item) => item.typeId === type)?.tableName;

		let itemDetails = data;

		if (table) {
			const itemQuery = supabase
				.from(table)
				.select("id, name, image, test_request_count, type")
				.eq("id", productId);

			const { data: itemData, error: itemError } = await itemQuery;

			if (itemError) {
				throw new Error(
					`Error gettting tabl data from ${table}: ${itemError.message}`,
				);
			}

			itemDetails = itemData;
		}

		return itemDetails;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const fetchTestedThings = async ({
	table,
	limit,
}: {
	table: string;
	limit: number;
}) => {
	try {
		const query = supabase
			.from(table)
			.select("id, name, image, updated_at, type")
			.eq("is_indexed", true)
			.order("updated_at", { ascending: true });

		const { data, error } = await query.limit(limit);

		if (error) {
			throw new Error(
				`Error fetchTestedThings fetching data from ${table}: ${error.message}`,
			);
		}

		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const fetchUntestedThings = async ({
	table,
	limit,
}: {
	table: string;
	limit: number;
}) => {
	try {
		const query = supabase
			.from(table)
			.select("id, name, image, test_request_count, type")
			.eq("is_indexed", false)
			.order("test_request_count", { ascending: true });

		const { data, error } = await query.limit(limit);

		if (error) {
			throw new Error(
				`Error fetchUntestedThings fetching data from ${table}: ${error.message}`,
			);
		}

		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const fetchProductTestData = async ({
	table,
	isIndexed,
	limit,
	type,
}: {
	table: string;
	isIndexed: boolean;
	limit: number;
	type: string;
}) => {
	try {
		const query = supabase
			.from(table)
			.select("id, name, image, test_request_count, type")
			.eq("is_indexed", isIndexed)
			.order("test_request_count", { ascending: true });

		if (type) {
			query.eq("type", type);
		}

		const { data, error } = await query.limit(limit);

		if (error) {
			throw new Error(
				`Error fetchProductTestData fetching data from ${table}: ${error.message}`,
			);
		}

		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const upvoteThing = async (
	thingId: string,
	type: string,
	table: string,
	userId: string,
) => {
	console.log("upvoteThing", thingId, type, table, userId);

	// Call the RPC function with table name, column name, record ID, and amount
	const { data, error } = await supabase.rpc("increment", {
		table_name: table,
		column_name: "test_request_count",
		record_id: thingId,
		amount: 1,
	});

	if (error) {
		console.error("Error incrementing count:", error);
		return false;
	}

	const { data: requestData, error: requestError } = await supabase
		.from("requests")
		.insert([{ product_id: thingId, user_id: userId, product_type: type }]);

	if (requestError) {
		console.error("Error inserting request:", requestError);
		return false;
	}

	return true;
};
