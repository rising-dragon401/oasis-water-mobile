import { supabase } from "@/config/supabase";

export const getFilters = async ({
	limit,
	sortMethod,
}: { limit?: number; sortMethod?: "name" | "score" } = {}) => {
	let filters;
	let orderBy = sortMethod || "name";

	if (limit) {
		const { data } = await supabase
			.from("water_filters")
			.select()
			.order(orderBy)
			.limit(limit);

		filters = data;
	} else {
		const { data } = await supabase
			.from("water_filters")
			.select()
			.order(orderBy);

		filters = data;
	}

	if (!filters) {
		return [];
	}

	const filtersWithCompany = await Promise.all(
		filters.map(async (filter) => {
			const { data: company, error: companyError } = await supabase
				.from("companies")
				.select("name")
				.eq("id", filter.company);

			return {
				...filter,
				company_name: company ? company[0].name : null,
			};
		}),
	);

	return filtersWithCompany;
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

	console.log("getFilterDetails: ", item);

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

	console.log("filter.brand.name: ", filter.brand.name);
	console.log("filter.company.name: ", filter.company.name);

	// Constructing the final object with all details
	const filterWithDetails = {
		...filter,
		brand: filter.brand.name,
		company: filter.company.name,
		contaminants_filtered: contaminantData,
	};

	return filterWithDetails;
};
