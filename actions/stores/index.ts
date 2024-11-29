import { supabase } from "@/config/supabase";

export const getStores = async () => {
	const { data, error } = await supabase
		.from("stores")
		.select("*")
		.contains("countries", [1]);

	if (error) {
		console.error("Error fetching stores:", error);
		return [];
	}

	return data;
};

export const getStoreAndProducts = async (id: string) => {
	const { data: store, error } = await supabase
		.from("stores")
		.select("*")
		.eq("id", id);

	if (error) {
		console.error("Error fetching store:", error);
		return null;
	}

	const items = store[0]?.items;
	const filters = store[0]?.filters;

	const { data: itemsData, error: itemsError } = await supabase
		.from("items")
		.select("*")
		.in("id", items);

	if (itemsError) {
		console.error("Error fetching items:", itemsError);
		return null;
	}

	store[0].items = itemsData;

	const { data: filtersData, error: filtersError } = await supabase
		.from("water_filters")
		.select("*")
		.in("id", filters);

	if (filtersError) {
		console.error("Error fetching filters:", filtersError);
		return null;
	}

	store[0].filters = filtersData;

	const combinedData = [...itemsData, ...filtersData].sort((a, b) => {
		const dateA = new Date(a.updated_at || a.created_at);
		const dateB = new Date(b.updated_at || b.created_at);
		return dateB.getTime() - dateA.getTime();
	});

	const allData = {
		...store[0],
		items: combinedData,
	};

	return allData;
};
