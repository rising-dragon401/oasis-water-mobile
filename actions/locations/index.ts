import { supabase } from "@/config/supabase";

export const getLocations = async () => {
	try {
		const { data: locations } = await supabase
			.from("tap_water_locations")
			.select();

		if (!locations) {
			return [];
		}

		locations.forEach((location) => {
			if (location && location.utilities && location.utilities.length > 0) {
				// @ts-ignore
				location.score = location.utilities[0]?.score;
			} else {
				location.score = null;
			}
		});

		return locations;
	} catch (error) {
		console.error("Error fetching locations:", error);
		return [];
	}
};

export const getFeaturedLocations = async () => {
	const { data: featuredLocations, error } = await supabase
		.from("tap_water_locations")
		.select()
		.eq("is_featured", true);

	if (error) {
		console.error("Error fetching featured locations:", error);
		return [];
	}

	featuredLocations.forEach((location) => {
		if (location && location.utilities && location.utilities.length > 0) {
			// @ts-ignore
			location.score = location.utilities[0]?.score;
		} else {
			location.score = null;
		}
	});

	const randomOrder = featuredLocations.sort(() => Math.random() - 0.5);

	return randomOrder || [];
};

export const getLocationDetails = async (id: string) => {
	// Fetch location details
	const { data: location } = await supabase
		.from("tap_water_locations")
		.select()
		.eq("id", id)
		.single();

	const { data: allIngredients } = await supabase.from("ingredients").select();

	if (!location || !allIngredients) {
		return null;
	}

	// Assuming utility processing doesn't inherently require async operations
	const cleanUtilities =
		location.utilities?.map((utility: any) => {
			if (!utility) return null;

			const cleanedContaminants = utility.contaminants.map(
				(contaminant: any) => {
					const ingredient = allIngredients.find(
						(ingredient) => ingredient.id === contaminant.ingredient_id,
					);

					let limit =
						ingredient?.legal_limit || ingredient?.health_guideline || 0;
					let exceedingLimit = 0;
					if (limit && contaminant.amount) {
						exceedingLimit = Math.round(contaminant.amount / limit);
					}

					return {
						...ingredient,
						ingredient_id: contaminant.ingredient_id,
						amount: contaminant.amount,
						exceedingLimit: exceedingLimit > 0 ? exceedingLimit : null,
					};
				},
			);

			cleanedContaminants.sort(
				(
					a: { exceedingLimit: number | null },
					b: { exceedingLimit: number | null },
				) => {
					// Assuming exceedingLimit can be null, handle nulls in your comparison logic
					if (a.exceedingLimit === null) return 1;
					if (b.exceedingLimit === null) return -1;
					return b.exceedingLimit - a.exceedingLimit;
				},
			);
			return {
				...utility,
				contaminants: cleanedContaminants,
			};
		}) || [];

	const locationWithDetails = {
		...location,
		utilities: cleanUtilities,
	};

	return locationWithDetails;
};
