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

export const getSevenRandomFilters = async () => {
	const { data, error } = await supabase
		.from("water_filters")
		.select()
		.not("score", "is", null)
		.order("id", { ascending: false })
		.limit(7);

	if (error) {
		console.error("error", error);
		return [];
	}

	const shuffledData = data.sort(() => 0.5 - Math.random()).slice(0, 10);

	return shuffledData;
};

export const getFilterDetails = async (id: string) => {
	const { data: item, error } = await supabase
		.from("water_filters")
		.select()
		.eq("id", id);

	const { data: allIngredients, error: ingredientsError } = await supabase
		.from("ingredients")
		.select();

	if (!item || !allIngredients) {
		return null;
	}

	const contaminants = item[0].contaminants_filtered;

	let contaminantData: any[] = [];
	if (contaminants && contaminants.length > 0) {
		contaminantData = (
			await Promise.all(
				contaminants.map(async (contaminant: any) => {
					const data = allIngredients.find(
						(ingredient) => ingredient.id === contaminant,
					)
						? [
								allIngredients.find(
									(ingredient) => ingredient.id === contaminant,
								),
							]
						: null;

					if (!data) {
						return null;
					}

					return data[0];
				}),
			)
		).filter((contaminant) => contaminant !== null); // Filter out null values
	}

	const companyId = item[0].company;
	const brandId = item[0].brand;

	let brand = null;
	if (brandId) {
		const { data, error: brandError } = await supabase
			.from("brands")
			.select()
			.eq("id", brandId);
		brand = data ? data[0] : null;
	}

	let company = null;
	if (companyId) {
		const { data, error: companyError } = await supabase
			.from("companies")
			.select()
			.eq("id", companyId);
		company = data ? data[0] : null;
	}

	const filterWithDetails = {
		...item[0],
		brand,
		company,
		contaminants_filtered: contaminantData,
	};

	return filterWithDetails;
};
