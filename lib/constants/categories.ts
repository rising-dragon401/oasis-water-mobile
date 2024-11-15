export type TabKeys =
	| "bottled_water"
	| "flavored_water"
	| "water_gallon"
	| "tap_water"
	| "filter"
	| "shower_filter"
	| "bottle_filter"
	| "energy_drink"
	| "coconut_water";

type CategoryType = {
	id: TabKeys | any;
	typeId: TabKeys; // main type
	dbTypes: string[]; // sub types (should deprecate this  and fix types)
	title: string;
	href?: string;
	image: string;
	icon?: string;
	tags?: string[];
	is_new?: boolean;
	selectedTags?: string[];
	isParentCategory?: boolean;
	productType?: string;
};

export const ITEM_TYPES = [
	{
		id: "water",
		name: "water",
		typeId: "bottled_water",
		dbTypes: ["bottled_water", "water_gallon"],
		tags: ["bottled_water", "water_gallon", "gallon"],
		productType: "water",
		tableName: "items",
		categoryLabel: "Bottled water",
		icon: "water-outline",
	},
	{
		id: "filter",
		name: "filter",
		typeId: "filter",
		dbTypes: ["filter", "shower_filter", "bottle_filter"],
		productType: "filter",
		tags: [
			"filter",
			"shower_filter",
			"bottle_filter",
			"sink",
			"home",
			"house",
			"tap",
		],
		tableName: "water_filters",
		categoryLabel: "Filters",
		icon: "funnel-outline",
	},
	{
		id: "tap_water",
		name: "tap water",
		typeId: "tap_water",
		dbTypes: ["tap_water"],
		productType: "water",
		categoryLabel: "Tap water",
		tableName: "tap_water_locations",
		icon: "location-outline",
	},
];

export const CATEGORIES: CategoryType[] = [
	{
		id: "bottled_water",
		typeId: "bottled_water",
		dbTypes: ["bottled_water", "water_gallon"],
		tags: ["still", "sparkling"],
		selectedTags: [],
		title: "Bottled water",
		productType: "water",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/bottled_water_cover.png",
		isParentCategory: true,
	},
	{
		id: "filter",
		typeId: "filter",
		dbTypes: ["filter", "shower_filter", "bottle_filter"],
		tags: [
			"shower",
			"shower_filter",
			"shower",
			"countertop",
			"counter",
			"bottle",
			"home",
			"tap",
			"pitcher",
			"sink",
			"bath",
			"under sink",
			"filter",
		],
		selectedTags: [],
		title: "Water filters",
		productType: "filter",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water_filters_cover.png?t=2024-09-02T23%3A58%3A21.298Z",
		isParentCategory: true,
	},
	{
		id: "shower_filter",
		typeId: "shower_filter",
		dbTypes: ["shower_filter"],
		tags: ["shower_filter", "shower"],
		selectedTags: ["shower"],
		productType: "filter",
		title: "Shower filters",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/shower_filter_cover.png",
		isParentCategory: true,
	},
	{
		id: "gallons",
		typeId: "water_gallon",
		dbTypes: ["water_gallon"],
		tags: ["gallon"],
		selectedTags: ["gallon"],
		productType: "water",
		title: "Water gallons",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water_gallon_cover.png?t=2024-09-03T00%3A05%3A12.584Z",
		isParentCategory: false,
	},
	{
		id: "bottle_filter",
		typeId: "bottle_filter",
		dbTypes: ["bottle_filter"],
		tags: ["bottle"],
		selectedTags: ["bottle"],
		productType: "filter",
		title: "Bottle filters",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/water_bottle_filter.png",
		isParentCategory: true,
	},
	{
		id: "sink_filter",
		typeId: "filter",
		dbTypes: ["filter"],
		tags: ["sink"],
		selectedTags: ["sink"],
		title: "Sink filters",
		productType: "filter",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/sink_filter_cover.png",
		isParentCategory: false,
	},
	{
		id: "home_filter",
		typeId: "filter",
		dbTypes: ["filter"],
		tags: ["home", "house"],
		selectedTags: ["home"],
		productType: "filter",
		title: "Home filters",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/home_filter_cover.png",
		isParentCategory: false,
	},
	{
		id: "sparkling_water",
		typeId: "bottled_water",
		dbTypes: ["bottled_water"],
		tags: ["sparkling"],
		selectedTags: ["sparkling"],
		productType: "water",
		title: "Sparkling water",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/sparkling_water_cover%20(1).png",
		isParentCategory: false,
	},
	// {
	// 	id: "flavored_water",
	// 	title: "Flavored drinks",
	// 	image:
	// 		"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/sparkling_water_cover.png",
	// 	tags: ["still", "sparkling"],
	// },
	// {
	// 	id: "energy_drink",
	// 	title: "Energy drinks",
	// 	image:
	// 		"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/energy%20drink%20cover.png",
	// },
	// {
	// 	id: "coconut_water",
	// 	title: "Coconut water",
	// 	image:
	// 		"https://connect.live-oasis.com/storage/v1/object/public/website/images/categories/coconut%20water%20category%20cover.png",
	// 	is_new: false,
	// },
];
