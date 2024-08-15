export type TabKeys =
	| "bottled_water"
	| "flavored_water"
	| "gallons"
	| "tap_water"
	| "filter"
	| "shower_filter"
	| "bottle_filter"
	| "energy_drink";

type CategoryType = {
	id: TabKeys;
	title: string;
	href?: string;
	image: string;
	tags?: string[];
	is_new?: boolean;
};

export const CATEGORIES: CategoryType[] = [
	{
		id: "bottled_water",
		title: "Bottled water",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water%20bottle%20category%20cover.png",
		tags: ["still", "sparkling"],
	},
	{
		id: "filter",
		title: "Water filters",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water%20filter%20category%20cover.png?t=2024-07-26T17%3A26%3A46.995Z",
		tags: ["sink", "counter", "pitcher"],
	},
	{
		id: "flavored_water",
		title: "Flavored drinks",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/flavored%20water%20category%20cover.png",
		tags: ["still", "sparkling"],
	},
	{
		id: "gallons",
		title: "Water gallons",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water%20gallon%20category%20cover.png?t=2024-07-26T17%3A52%3A28.192Z",
	},
	{
		id: "shower_filter",
		title: "Shower filters",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/shower%20filter%20category%20cover.png",
	},
	{
		id: "bottle_filter",
		title: "Bottle filters",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/bottle%20filter%20category%20coverpng.png",
	},
	{
		id: "energy_drink",
		title: "Energy drinks",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/energy%20drink%20cover.png?t=2024-08-12T21%3A43%3A47.242Z",
		is_new: true,
	},
];
