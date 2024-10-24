import { supabase } from "@/config/supabase";

export const getFilters = async ({
	limit,
	sortMethod,
	type,
}: {
	limit?: number;
	sortMethod?: "name" | "score";
	type?: string[] | null;
} = {}) => {
	let filters;
	const orderBy = sortMethod || "name";

	let query = supabase.from("water_filters").select().order(orderBy);

	if (type && type.length > 0) {
		query = query.in("type", type);
	}

	if (limit) {
		query = query.limit(limit);
	}

	console.log("limit: ", limit);

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

export const getRecommendedFilter = async (contaminants: any[]) => {
	const filters = await getFilters();

	let highestScoringFilter: { [key: string]: any } | null = null;
	let highestScore = 0;

	await filters.map((filter) => {
		const filteredContaminantsCount = contaminants.reduce(
			(acc, contaminant) => {
				if (!filter.contaminants_filtered) {
					return null;
				}

				if (filter.contaminants_filtered.includes(contaminant.id)) {
					return acc + 1;
				}
				return acc;
			},
			0,
		);

		if (!highestScoringFilter || filteredContaminantsCount > highestScore) {
			highestScoringFilter = filter;
			highestScore = filteredContaminantsCount;
		}
	});

	return highestScoringFilter;
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
		company: filter.company.name,
		contaminants_filtered: contaminantData,
	};

	return filterWithDetails;
};
