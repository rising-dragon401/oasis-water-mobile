// also managed in global.css

export const theme = {
	light: {
		background: "#FEFCF9",
		primary: "#222529",
		card: "#FFFFFF",
		accent: "#0D00F3",
		border: "#D3D6D1",
		input: "#f6f4f2",
		secondary: "#F1F0ED",
		accentForeground: "#FEFCF9",
		foreground: "#9B9C9A",
		muted: "#D3D6D1",
		"tab-background": "#F5F4F0",
		popover: "hsl(30 4.2% 38.82%)",
		"secondary-foreground": "hsl(40 13% 92.94%)",
		"muted-foreground": "hsl(0 0% 45%)",
		destructive: "hsl(0 84.2% 60.2%)",
	},
	dark: {
		background: "hsl(330, 6%, 12%)",
		foreground: "hsl(40 42.86% 96.25%)",

		card: "hsl(20, 7%, 18%)",
		popover: "hsl(222 24% 18%)",
		primary: "hsl(44 8% 92%)",
		secondary: "hsl(40 13% 36%)",
		muted: "hsl(220 26% 22%)",
		"muted-foreground": "hsl(220 26% 22%)",
		accent: "hsl(229 59% 62%)",
		destructive: "hsl(0 84.2% 60.2%)",
		border: "hsl(220 26% 24%)",
		input: "hsl(20, 7%, 18%)",
	},
};

export const IngredientCategories: string[] = [
	"Chemical Disinfectants",
	"Heavy Metals",
	"Haloacetic Acids",
	"Fluoride",
	"Herbicides",
	"Perfluorinated Chemicals (PFAS)",
	"Pesticides",
	"Pharmaceuticals",
	"Phthalates",
	"Radiological Elements",
	"Semi-Volatile Compounds",
	"Volatile Organic Compounds (VOCs)",
	"Microbiologicals",
	"Microplastics",
	// "Inorganics",
	// "Other",
];

export const PROFILE_AVATAR =
	"https://connect.live-oasis.com/storage/v1/object/public/website/avatars/user-icon-outline.png?t=2024-11-05T17%3A08%3A14.075Z";

export const FEATURES = [
	{
		label: "Access to all scores and ratings",
	},
	{
		label: "Unlimited scans and searches",
	},
	{
		label: "Full contaminant breakdowns",
	},
	{
		label: "Personalized filter recommendations",
	},
	// {
	// 	label: "Oasis Research AI",
	// },
	{
		label: "Support independent lab testing",
	},
];
