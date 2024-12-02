/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				border: "rgb(var(--border))",
				input: "rgb(var(--input))",
				ring: "rgb(var(--ring))",
				card: "rgb(var(--card))",
				background: "rgb(var(--background))",
				foreground: "rgb(var(--foreground))",
				"card-foreground": "rgb(var(--foreground))",
				offwhite: "hsl(var(--offwhite))",
				primary: {
					DEFAULT: "rgb(var(--primary))",
					foreground: "rgb(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "rgb(var(--secondary))",
					foreground: "rgb(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "rgb(var(--destructive))",
					foreground: "rgb(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "rgb(var(--accent))",
					foreground: "rgb(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "rgb(var(--popover))",
					foreground: "rgb(var(--popover-foreground))",
				},
			},
			aspectRatio: {
				"4/3": "4 / 3",
				"3/2": "3 / 2",
				"4/5": "4 / 5",
				"5/6": "5 / 6",
			},
		},
	},
	plugins: [],
};
