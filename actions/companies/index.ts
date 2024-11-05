import { supabase } from "@/config/supabase";

export const getCompanyAndProducts = async (id: string) => {
	const { data: company, error } = await supabase
		.from("companies")
		.select()
		.eq("id", id);

	if (!id) {
		return [];
	}

	const { data: items, error: itemsError } = await supabase
		.from("items")
		.select()
		.eq("company", id);

	const { data: waterFilters, error: waterFiltersError } = await supabase
		.from("water_filters")
		.select()
		.eq("company", id);

	const { data: brands, error: brandsError } = await supabase
		.from("brands")
		.select()
		.eq("company", id);

	if (itemsError) {
		console.error("Error fetching items:", itemsError);
		return [];
	}

	if (waterFiltersError) {
		console.error("Error fetching water filters:", waterFiltersError);
		return [];
	}

	if (brandsError) {
		console.error("Error fetching brands:", brandsError);
		// return [];
	}

	if (company && company.length > 0) {
		company[0].products = [...(items || []), ...(waterFilters || [])];
		company[0].brands = brands || [];
	}

	if (error) {
		console.error("Error fetching company:", error);
		return [];
	}

	if (!company) {
		return [];
	}

	return company;
};
