import { supabase } from "@/config/supabase";

export const getFilters = async ({
	limit,
	sortMethod,
	type,
	tags,
}: {
	limit?: number;
	sortMethod?: "name" | "score";
	type?: string[] | null;
	tags?: string[] | null;
} = {}) => {
	let filters;
	const orderBy = sortMethod || "name";

	let query = supabase.from("water_filters").select().order(orderBy);

	if (type && type.length > 0) {
		query = query.in("type", type);
	}

	if (tags && tags.length > 0) {
		query = query.or(tags.map((tag) => `tags.ilike.%${tag}%`).join(","));
	}

	if (limit) {
		query = query.limit(limit);
	}

	const { data } = await query;

	filters = data;

	if (!filters) {
		return [];
	}

	filters = filters.sort((a, b) => {
		if (a.is_indexed === false) return 1;
		if (b.is_indexed === false) return -1;
		return 0;
	});

	return filters;
};

export const getFiltersByContaminant = async (contaminantId: number) => {
	const { data: filters, error } = await supabase
		.from("water_filters")
		.select()
		.contains("contaminants_filtered", [contaminantId]);

	if (!filters) {
		return [];
	}

	return filters;
};

export const getTapContaminants = async (tapLocationId: number) => {
	const { data } = await supabase
		.from("tap_water_locations")
		.select()
		.eq("id", tapLocationId);

	if (!data) {
		return [];
	}

	console.log("data", JSON.stringify(data, null, 2));
	const contaminants = data[0].utilities[0].contaminants;

	return contaminants;
};

export const getRecommendedFilter = async (contaminants: any[]) => {
	const { data: indexedFilters, error } = await supabase
		.from("water_filters")
		.select(
			"id, name, type, image, brand, score, filtered_contaminant_categories",
		)
		.eq("is_indexed", true)
		.gt("score", 50);

	if (error) {
		console.error("Error fetching filters:", error);
		return [];
	}

	const contaminantCategories = contaminants.map(
		(contaminant) => contaminant.category,
	);

	// For each filter go through each category
	// Then check the percentage removed for each Contaminatn in contaminant Categories (i.e. Heayv MEtals)
	// Add up the average percentage for each filter
	// Sort the filters by effectiveness score in descending order and take the top 10
	const filtersWithScores = indexedFilters.map((filter) => {
		const filteredCategories = filter.filtered_contaminant_categories;

		let totalPercentageRemoved = 0;
		const categoryCount = contaminantCategories.length;

		contaminantCategories.forEach((category) => {
			const filteredCategory = filteredCategories.find(
				(filtered: { category: string; percentage: number }) =>
					filtered.category === category,
			);

			if (filteredCategory) {
				totalPercentageRemoved += filteredCategory.percentage;
				// categoryCount++;
			}
		});

		const effectivenessScore =
			categoryCount > 0 ? totalPercentageRemoved / categoryCount : 0;

		return {
			...filter,
			effectivenessScore,
		};
	});

	// Sort filters by effectiveness score in descending order and take the top 10
	const sortedFilters = filtersWithScores
		.sort((a, b) => b.effectivenessScore - a.effectivenessScore)
		.slice(0, 10);

	// Map to extract only the required properties
	const simplifiedFilters = sortedFilters.map((filter) => ({
		id: filter.id,
		name: filter.name,
		type: filter.type,
		image: filter.image,
		score: filter.score,
	}));

	return simplifiedFilters;
};

export const getRandomFilters = async () => {
	const { data, error } = await supabase.rpc("get_random_filters");

	if (error) {
		console.error("error", error);

		return [];
	}

	return data;
};

export const getFilterDetails = async (id: string) => {
	const { data: item, error } = await supabase
		.from("water_filters")
		.select(
			`
            *,
            brand:brands(*),
        	company:companies(*)
        `,
		)
		.eq("id", id);

	if (!item || item.length === 0) {
		return null;
	}

	const filter = item[0];

	// Fetching contaminants details in parallel
	let contaminantData = [];
	if (filter.contaminants_filtered && filter.contaminants_filtered.length > 0) {
		contaminantData = await Promise.all(
			filter.contaminants_filtered.map(async (contaminantId: number) => {
				const { data } = await supabase
					.from("ingredients")
					.select()
					.eq("id", contaminantId);
				return data ? data[0] : null;
			}),
		);

		contaminantData = contaminantData.filter(
			(contaminant) => contaminant !== null,
		); // Filter out null values
	}
	// Constructing the final object with all details
	const filterWithDetails = {
		...filter,
		brand: filter.brand.name,
		brand_id: filter.brand.id,
		company: filter.company.name,
		company_id: filter.company.id,
		contaminants_filtered: contaminantData,
	};

	return filterWithDetails;
};
