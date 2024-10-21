import { supabase } from "@/config/supabase";

export const getCompanyAndProducts = async (name: string) => {
	console.log("saerching for company: ", name);

	const { data: company, error } = await supabase
		.from("companies")
		.select()
		.eq("name", name);

	if (!company || company.length === 0) {
		return [];
	}

	const id = company[0].id;

	const { data: items, error: itemsError } = await supabase
		.from("items")
		.select()
		.eq("company", id);

	const { data: waterFilters, error: waterFiltersError } = await supabase
		.from("water_filters")
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

	if (company && company.length > 0) {
		company[0].products = [...(items || []), ...(waterFilters || [])];
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
