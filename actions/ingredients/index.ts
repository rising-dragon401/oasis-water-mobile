import { supabase } from "@/config/supabase";

export const getContaminants = async () => {
	const { data: contaminants, error } = await supabase
		.from("ingredients")
		.select()
		.eq("is_contaminant", true);

	if (error) {
		console.error("Error fetching contaminants:", error);
		return [];
	}

	if (!contaminants) {
		return [];
	}

	return contaminants;
};

export const getIngredient = async (id: string) => {
	const { data: ingredient, error } = await supabase
		.from("ingredients")
		.select()
		.eq("id", id);

	if (error) {
		console.error("Error fetching ingredient:", error);
		return null;
	}

	return ingredient;
};
