import { supabase } from "@/config/supabase";
import { ITEM_TYPES } from "@/lib/constants/categories";

export const fetchFundingStatus = async ({
	itemId,
	type,
	name,
	createLab = true,
}: {
	itemId: any;
	type: string;
	name: string;
	createLab: boolean;
}) => {
	console.log(
		"fetching funding status for item",
		itemId,
		type,
		name,
		createLab,
	);

	if (!itemId || !type) {
		return {
			lab_id: null,
			raised_amount: 0,
			status: "not_started",
			total_cost: 28500,
			user_contributions: [],
		};
	}

	const query = supabase
		.from("labs")
		.select("id, test_kit, raised_amount, is_funded, status")
		.eq("product", itemId)
		.eq("product_type", type);

	const { data, error } = await query;

	if (error) {
		console.error("Error fetching funding status: ", error);
	}

	const labRow = data?.[0];

	// create new lab row for standard water testing
	if (!labRow && createLab) {
		console.log("no lab row, creating new lab row");
		// create new lab row for standard water testing
		const { data: newLabData, error: newLabError } = await supabase
			.from("labs")
			.insert({
				product: itemId,
				product_type: type as any,
				label: name + " - Standard Water Testing",
				test_kit: 1,
				status: "not_started",
			})
			.select();

		if (newLabError) {
			return {
				lab_id: null,
				raised_amount: 0,
				status: "not_started",
				total_cost: 28500, // assume all funding is for standard water testing for now (test kit id === 1)
			};
		}

		const newLabRow = newLabData?.[0];

		if (!newLabRow) {
			throw new Error("Error creating new lab");
		}

		return {
			lab_id: newLabRow?.id,
			raised_amount: 0,
			status: "not_started",
			total_cost: 28500, // assume all funding is for standard water testing for now (test kit id === 1)
		};
	}

	const testKit = labRow?.test_kit;

	const { data: testKitData, error: testKitError } = await supabase
		.from("test_kits")
		.select("price")
		.eq("id", testKit as any);

	if (testKitError) {
		throw new Error(`Error fetching test kit: ${testKitError.message}`);
	}

	if (labRow?.id) {
		const { data: contributionsData, error: contributionsError } =
			await supabase
				.from("contributions")
				.select("user_id, amount, users!inner(avatar_url, full_name, username)")
				.eq("kind", "donation")
				.eq("lab_id", labRow.id);

		if (contributionsError) {
			throw new Error(
				`Error fetching contributors: ${contributionsError.message}`,
			);
		}

		// Restructure contributions to include user details in the same object
		const userContributions = contributionsData.map((contribution) => ({
			user_id: contribution.user_id,
			amount: contribution.amount,
			avatar_url: contribution.users[0]?.avatar_url,
			full_name: contribution.users[0]?.full_name,
			username: contribution.users[0]?.username,
		}));

		const labDetails = {
			lab_id: labRow.id,
			raised_amount: labRow.raised_amount || 0,
			status: labRow.status,
			total_cost: testKitData?.[0]?.price || null,
			user_contributions: userContributions,
		};

		return labDetails;
	} else {
		throw new Error("Lab ID is undefined");
	}
};

export const fetchInProgressThings = async ({
	type,
	limit,
	offset = 0,
}: {
	type?: string[];
	limit: number;
	offset?: number;
}) => {
	try {
		let allItemDetails: any[] = [];

		if (type) {
			for (const t of type) {
				const query = supabase
					.from("labs")
					.select("*")
					.eq("status", "in_progress")
					.eq("product_type", t)
					.range(offset, offset + limit - 1);

				const { data, error } = await query;

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
	offset = 0,
}: {
	tables: string[];
	limit: number;
	offset?: number;
}) => {
	try {
		let allData: any[] = [];

		for (const table of tables) {
			const query = supabase
				.from(table)
				.select("id, name, image, updated_at, type")
				.eq("is_indexed", true)
				.order("updated_at", { ascending: true })
				.range(offset, offset + limit - 1);

			const { data, error } = await query;

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
	offset = 0,
}: {
	tables: string[];
	limit: number;
	offset?: number;
}) => {
	try {
		const allData: any[] = [];

		for (const table of tables) {
			let query = supabase
				.from(table)
				.select("id, name, image, test_request_count, type, labs, is_indexed")
				.eq("is_indexed", false)
				.order("lab_updated_at", { ascending: true })
				.order("created_at", { ascending: true })
				.range(offset, offset + limit - 1);

			if (table === "items") {
				query = query.in("type", ["bottled_water", "water_gallon"]);
			}

			const { data, error } = await query;

			if (error) {
				throw new Error(
					`Error fetchUntestedThings fetching data from ${table}: ${error.message}`,
				);
			}

			// Fetch funding status for each item
			for (const item of data) {
				const fundingStatus = await fetchFundingStatus({
					itemId: item.id,
					type: item.type,
					name: item.name,
					createLab: true,
				});

				if (!fundingStatus) {
					return null;
				}

				allData.push({
					...item,
					raised_amount: fundingStatus.raised_amount,
					total_cost: fundingStatus.total_cost,
				});
			}
		}

		// Sort the combined data by raised_amount in descending order, then by updated_at or created_at
		allData.sort((a, b) => {
			if (b?.raised_amount !== a?.raised_amount) {
				return b?.raised_amount - a?.raised_amount;
			}
			return (
				new Date(b?.updated_at || b?.created_at).getTime() -
				new Date(a?.updated_at || a?.created_at).getTime()
			);
		});

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
