import { supabase } from "@/config/supabase";
import { ITEM_TYPES } from "@/lib/constants/categories";

export const fetchInProgressThings = async ({
	type,
	limit,
}: {
	type?: string[];
	limit: number;
}) => {
	try {
		let allItemDetails: any[] = [];

		if (type) {
			for (const t of type) {
				const query = supabase
					.from("labs")
					.select("*")
					.eq("status", "in_progress")
					.eq("product_type", t);

				const { data, error } = await query.limit(limit);

				if (error) {
					throw new Error(
						`Error fetchInProgressThings fetching data from labs: ${error.message}`,
					);
				}

				const table = ITEM_TYPES.find((item) => item.typeId === t)?.tableName;

				if (table) {
					for (const labItem of data) {
						const itemQuery = supabase
							.from(table)
							.select("id, name, image, test_request_count, type")
							.eq("id", labItem.product);

						const { data: itemData, error: itemError } = await itemQuery;

						if (itemError) {
							throw new Error(
								`Error getting table data from ${table}: ${itemError.message}`,
							);
						}

						if (itemData) {
							allItemDetails = allItemDetails.concat(itemData);
						}
					}
				}
			}
		}

		return allItemDetails;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const fetchTestedThings = async ({
	tables,
	limit,
}: {
	tables: string[];
	limit: number;
}) => {
	try {
		let allData: any[] = [];

		for (const table of tables) {
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

			allData = allData.concat(data);
		}

		// Sort the combined data by updated_at in ascending order
		allData.sort(
			(a, b) =>
				new Date(b?.updated_at).getTime() - new Date(a?.updated_at).getTime(),
		);

		return allData;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const fetchUntestedThings = async ({
	tables,
	limit,
}: {
	tables: string[];
	limit: number;
}) => {
	try {
		let allData: any[] = [];

		for (const table of tables) {
			let query = supabase
				.from(table)
				.select("id, name, image, test_request_count, type")
				.eq("is_indexed", false)
				.order("test_request_count", { ascending: true });

			if (table === "items") {
				query = query.in("type", ["bottled_water", "water_gallon"]);
			}

			const { data, error } = await query.limit(limit);

			if (error) {
				throw new Error(
					`Error fetchUntestedThings fetching data from ${table}: ${error.message}`,
				);
			}

			allData = allData.concat(data);
		}

		// Sort the combined data by test_request_count in descending order
		allData.sort((a, b) => b?.test_request_count - a?.test_request_count);

		return allData;
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
		.from("contributions")
		.insert([
			{
				product_id: thingId,
				user_id: userId,
				product_type: type,
				kind: "upvote_product",
			},
		]);

	if (requestError) {
		console.error("Error inserting request:", requestError);
		return false;
	}

	return true;
};

export const fetchUpcomingCategories = async () => {
	const { data, error } = await supabase
		.from("categories")
		.select("*")
		.eq("status", "inactive")
		.order("request_count", { ascending: true });

	if (error) {
		console.error("Error fetching upcoming categories:", error);
		return [];
	}

	return data;
};

export const upvoteCategory = async (categoryId: string, userId: string) => {
	const { data, error } = await supabase.rpc("increment", {
		table_name: "categories",
		column_name: "request_count",
		record_id: categoryId,
		amount: 1,
	});

	if (error) {
		console.error("Error incrementing count:", error);
		return false;
	}

	const { data: requestData, error: requestError } = await supabase
		.from("contributions")
		.insert([
			{ category_id: categoryId, user_id: userId, kind: "upvote_category" },
		]);

	if (requestError) {
		console.error("Error inserting request:", requestError);
		return false;
	}

	return true;
};

export const submitRequest = async ({
	name,
	productId,
	productType,
	userId,
	message,
	attachment,
	kind,
}: {
	name: string;
	productId?: string;
	productType?: string;
	userId: string;
	message: string;
	attachment?: string | null;
	kind: "request_new_product" | "update_existing_product";
}) => {
	console.log("submitRequest", {
		name,
		productId,
		productType,
		userId,
		message,
		attachment,
		kind,
	});

	const { data, error } = await supabase.from("contributions").insert([
		{
			name,
			product_id: productId,
			product_type: productType,
			user_id: userId,
			note: message,
			file_url: attachment,
			kind,
		},
	]);

	if (error) {
		console.error("Error submitting request:", error);
		return false;
	}

	return true;
};
