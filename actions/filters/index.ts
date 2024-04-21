import { supabase } from "@/config/supabase";

export const getFilters = async () => {
	const { data: filters, error } = await supabase
		.from("water_filters")
		.select();

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
