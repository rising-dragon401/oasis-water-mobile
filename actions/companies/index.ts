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

export const getBrandAndProducts = async (id: string) => {
	if (!id) {
		return [];
	}

	try {
		const { data: brandData, error } = await supabase
			.from("brands")
			.select()
			.eq("id", id);

		const brand = brandData?.[0];

		console.log("brand", JSON.stringify(brand, null, 2));

		if (error || !brand) {
			return [];
		}

		const { data: items, error: itemsError } = await supabase
			.from("items")
			.select()
			.eq("brand", id);

		const { data: waterFilters, error: waterFiltersError } = await supabase
			.from("water_filters")
			.select()
			.eq("brand", id);

		const companyId = brand?.company;

		console.log("companyId", companyId);

		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("id, name")
			.eq("id", companyId);

		if (itemsError) {
			console.error("Error fetching items:", itemsError);
			return [];
		}

		if (waterFiltersError) {
			console.error("Error fetching water filters:", waterFiltersError);
			return [];
		}

		if (companyError) {
			console.error("Error fetching brand company:", companyError);
			// return [];
		}

		brand.products = [...(items || []), ...(waterFilters || [])];
		brand.companyName = company ? company[0]?.name || "" : "";

		if (error) {
			console.error("Error fetching brand:", error);
			return [];
		}

		if (!brand) {
			return [];
		}

		console.log("RETUNRING brand", JSON.stringify(brand, null, 2));

		return brand;
	} catch (error) {
		console.error("Error fetching brand:", error);
		return [];
	}
};

export const getFeaturedBrands = async () => {
	const { data, error } = await supabase
		.from("brands")
		.select()
		.eq("featured", true)
		.order("featured_order", { ascending: true })
		.limit(10);

	if (error) {
		console.error("Error fetching featured brands:", error);
		return [];
	}

	return data;
};
