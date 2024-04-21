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
