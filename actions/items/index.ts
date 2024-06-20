import { supabase } from "@/config/supabase";

export const getItems = async ({
	limit,
	sortMethod,
}: { limit?: number; sortMethod?: "name" | "score" } = {}) => {
	let items;
	let orderBy = sortMethod || "name";

	console.log("orderBy: ", orderBy);

	if (limit) {
		const { data } = await supabase
			.from("items")
			.select()
			.order(orderBy, { ascending: true })
			.limit(limit);

		items = data;
	} else {
		const { data } = await supabase
			.from("items")
			.select()
			.order(orderBy, { ascending: true });

		items = data;
	}

	if (!items) {
		return [];
	}

	const itemsWithCompany = await Promise.all(
		items.map(async (item) => {
			const { data: company, error: companyError } = await supabase
				.from("companies")
				.select("name")
				.eq("id", item.company);

			return {
				...item,
				company_name: company ? company[0].name : null,
			};
		}),
	);

	return itemsWithCompany;
};

export const getItemDetails = async (id: string) => {
	try {
		const { data: item, error } = await supabase
			.from("items")
			.select(`*, brand:brands(*), company:companies(*)`)
			.eq("id", id)
			.single();

		if (!item) {
			return null;
		}

		const ingredientIds = item.ingredients
			? (item.ingredients as any[])
					.filter(Boolean)
					.map((ingredient: any) => ingredient.ingredient_id)
			: [];

		const { data: ingredients, error: ingredientsError } = await supabase
			.from("ingredients")
			.select("*")
			.in("id", ingredientIds);

		const ingredientsMap = ingredients?.reduce(
			(map, ingredient) => {
				map[ingredient.id] = ingredient;
				return map;
			},
			{} as Record<string, any>,
		);

		const detailedIngredients = item.ingredients
			? item.ingredients
					.filter(Boolean)
					.map((ingredient: any) => {
						if (!ingredient.ingredient_id) return null;

						if (!ingredientsMap) return null;

						const detail = ingredientsMap[ingredient.ingredient_id];
						let limit = detail?.legal_limit || 0;
						if (detail?.health_guideline) {
							limit = detail.health_guideline;
						}
						let exceedingLimit = 0;
						if (limit && ingredient.amount) {
							exceedingLimit = Math.round(ingredient.amount / limit);
						}
						return {
							...detail,
							amount: ingredient.amount,
							legal_limit: detail?.legal_limit,
							health_guideline: detail?.health_guideline,
							exceedingLimit: exceedingLimit,
						};
					})
					?.filter((ingredient: any) => ingredient !== null)
			: [];

		const itemWithDetails = {
			...item,
			brand: item.brand,
			ingredients: detailedIngredients,
			company: item.company,
			contaminants: detailedIngredients?.filter(
				(ingredient: any) => ingredient?.is_contaminant,
			),
		};

		return itemWithDetails;
	} catch (error) {
		console.error("getItemDetails error: ", error);
		return error;
	}
};

export const getRandomItems = async () => {
	const { data, error } = await supabase.rpc("get_random_items");

	if (error) {
		console.error("error", error);

		return [];
	}

	return data;
};

export const getFlavoredWater = async ({
	limit,
	sortMethod,
}: { limit?: number; sortMethod?: "name" | "score" } = {}) => {
	let orderBy = sortMethod || "name";

	const { data: items, error } = await supabase
		.from("items")
		.select()
		.eq("type", "flavored_water")
		.order(orderBy, { ascending: true });

	return items || [];
};

export const getWaterGallons = async ({
	limit,
	sortMethod,
}: { limit?: number; sortMethod?: "name" | "score" } = {}) => {
	let orderBy = sortMethod || "name";

	const { data: items, error } = await supabase
		.from("items")
		.select()
		.ilike("name", "%gallon%")
		.order(orderBy, { ascending: true });

	if (!items) {
		return [];
	}

	const itemsWithCompany = await Promise.all(
		items.map(async (item) => {
			const { data: company, error: companyError } = await supabase
				.from("companies")
				.select("name")
				.eq("id", item.company);

			return {
				...item,
				company_name: company ? company[0].name : null,
			};
		}),
	);

	return itemsWithCompany;
};

export const getMineralPackets = async ({
	limit,
	sortMethod,
}: { limit?: number; sortMethod?: "name" | "score" } = {}) => {
	let orderBy = sortMethod || "name";

	const { data: items, error } = await supabase
		.from("items")
		.select()
		.eq("type", "mineral_packets")
		.order(orderBy, { ascending: true });

	return items || [];
};
