export const SCORES = [
	{
		id: "radiance",
		name: "Skin/hair health",
		icon: "sparkles-outline",
		categoriesImpactedBy: [
			"Semi-Volatile Compounds",
			"Herbicides",
			"Chemical Disinfectants",
			"Heavy Metals",
			"Haloacetic Acids",
			"Microplastics",
			"Fluoride",
			"Minerals",
		],
	},
	{
		id: "vitality",
		name: "Vitality",
		icon: "flash-outline",
	},
	{
		id: "fertility",
		name: "Fertility",
		icon: "flower-outline",
		categoriesImpactedBy: [
			"Herbicides",
			"Phthalates",
			"PFAS",
			"Haloacetic Acids",
			"Pesticides",
			"Heavy Metals",
			"Radiological Elements",
			"Fluoride",
			"Minerals",
		],
	},
	{
		id: "detoxification",
		name: "Detoxification",
		icon: "shield-outline",
		categoriesImpactedBy: [
			"Pharmaceuticals",
			"Heavy Metals",
			"PFAS",
			"Radiological Elements",
			"Volatile Organic Compounds (VOCs)",
			"Semi-Volatile Compounds",
			"Microbiologicals",
			"Microplastics",
			"Minerals",
		],
	},
	{
		id: "performance",
		name: "Performance",
		icon: "flash-outline",
		categoriesImpactedBy: [
			"Heavy Metals",
			"Volatile Organic Compounds (VOCs)",
			"Phthalates",
			"Radiological Elements",
			"Microbiologicals",
			"Fluoride",
			"Minerals",
		],
	},
	{
		id: "hydration",
		name: "Hydration",
		icon: "water-outline",
		categoriesImpactedBy: [
			"Chemical Disinfectants",
			"Fluoride",
			"Haloacetic Acids",
			"Semi-Volatile Compounds",
			"Microplastics",
			"Minerals",
		],
	},
];

export const HEALTH_EFFECTS = [
	{
		name: "Liver and Kidney Damage",
		type: "harm",
		description:
			"Accumulation in the liver and kidneys can lead to organ damage over time.",
		source: "https://pubs.rsc.org/en/content/articlehtml/2020/em/d0em90008g",
		scoreIds: ["detoxification", "vitality"],
		categories: [
			"Heavy Metals",
			"Volatile Organic Compounds (VOCs)",
			"Phthalates",
			"Perfluorinated Chemicals (PFAS)",
		],
	},
	{
		name: "Skin Irritation",
		type: "harm",
		description:
			"Exposure may cause skin irritation and rashes, particularly for sensitive individuals.",
		source: "https://link.springer.com/article/10.1007/s13762-013-0423-9",
		scoreIds: ["radiance"],
		categories: [
			"Chemical Disinfectants",
			"Volatile Organic Compounds (VOCs)",
			"Haloacetic Acids",
			"Herbicides",
		],
	},
	{
		name: "Respiratory Issues",
		type: "harm",
		description:
			"Inhalation of fumes during hot showers can lead to respiratory irritation.",
		source: "https://www.epa.gov/ground-water-and-drinking-water",
		scoreIds: ["vitality", "performance"],
		categories: [
			"Volatile Organic Compounds (VOCs)",
			"Chemical Disinfectants",
			"Microbiologicals",
		],
	},
	{
		name: "Hormone Disruption",
		type: "harm",
		description:
			"Can interfere with endocrine function, leading to hormonal imbalances.",
		source:
			"https://www.epa.gov/pesticide-science-and-assessing-pesticide-risks/human-health-issues-related-pesticides",
		scoreIds: ["fertility", "vitality"],
		categories: [
			"Phthalates",
			"Herbicides",
			"Pesticides",
			"Perfluorinated Chemicals (PFAS)",
		],
	},
	{
		name: "Increased Cancer Risk",
		type: "harm",
		description: "Certain contaminants are linked to a higher risk of cancers.",
		source:
			"https://www.foodandwine.com/pesticides-prostate-cancer-risk-8739772",
		scoreIds: ["detoxification", "radiance"],
		categories: [
			"Herbicides",
			"Heavy Metals",
			"Perfluorinated Chemicals (PFAS)",
			"Haloacetic Acids",
		],
	},
	{
		name: "Reproductive Issues",
		type: "harm",
		description:
			"Associated with reproductive toxicity and developmental problems.",
		source: "https://www.cdc.gov/biomonitoring/Phthalates_FactSheet.html",
		scoreIds: ["fertility"],
		categories: [
			"Phthalates",
			"Pesticides",
			"Pharmaceuticals",
			"Perfluorinated Chemicals (PFAS)",
		],
	},
	{
		name: "Neurological Damage",
		type: "harm",
		description:
			"Exposure can lead to cognitive deficits and nervous system damage.",
		source:
			"https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health",
		scoreIds: ["performance"],
		categories: [
			"Heavy Metals",
			"Volatile Organic Compounds (VOCs)",
			"Pharmaceuticals",
			"Microplastics",
		],
	},
	{
		name: "Bone Health",
		type: "benefit",
		description:
			"Minerals like calcium and phosphorus are essential for the development and maintenance of strong bones and teeth.",
		source:
			"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
		scoreIds: ["radiance", "vitality"],
		categories: ["Minerals"],
	},
	{
		name: "Energy Production",
		type: "benefit",
		description:
			"Magnesium plays a crucial role in converting food into energy, supporting overall vitality.",
		source: "https://www.healthline.com/nutrition/magnesium-benefits",
		scoreIds: ["vitality"],
		categories: ["Minerals"],
	},
	{
		name: "Immune Function",
		type: "benefit",
		description:
			"Zinc is vital for a healthy immune system, aiding in wound healing and reducing the duration of common colds.",
		source:
			"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
		scoreIds: ["vitality", "detoxification"],
		categories: ["Minerals"],
	},
	{
		name: "Oxygen Transport",
		type: "benefit",
		description:
			"Iron is a key component of hemoglobin, enabling red blood cells to transport oxygen throughout the body.",
		source:
			"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
		scoreIds: ["vitality"],
		categories: ["Minerals"],
	},
	{
		name: "Nerve and Muscle Function",
		type: "benefit",
		description:
			"Potassium and sodium are electrolytes that help regulate nerve signals and muscle contractions.",
		source:
			"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
		scoreIds: ["vitality", "hydration"],
		categories: ["Minerals"],
	},
	{
		name: "Thyroid Health",
		type: "benefit",
		description:
			"Iodine is necessary for the production of thyroid hormones, which regulate metabolism.",
		source:
			"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
		scoreIds: ["vitality", "fertility"],
		categories: ["Minerals"],
	},
	{
		name: "Hydration Balance",
		type: "benefit",
		description:
			"Electrolytes maintain fluid balance, ensuring proper hydration and cellular function.",
		source:
			"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
		scoreIds: ["hydration"],
		categories: ["Minerals"],
	},
];

export const CATEGORY_HEALTH_EFFECTS = [
	{
		name: "Semi-Volatile Compounds",
		id: "Semi-Volatile Compounds",
		harms: [
			{
				label: "Liver and Kidney Damage",
				description:
					"Accumulation in the liver and kidneys can lead to organ damage over time.",
				source:
					"https://pubs.rsc.org/en/content/articlehtml/2020/em/d0em90008g",
				scoreId: "detoxification",
			},
			{
				label: "Skin Irritation",
				description:
					"Exposure may cause skin irritation and rashes, particularly for sensitive individuals.",
				source: "https://link.springer.com/article/10.1007/s13762-013-0423-9",
				scoreId: "radiance",
			},
			{
				label: "Respiratory Issues",
				description:
					"Inhalation of fumes during hot showers can lead to respiratory irritation.",
				source: "https://www.epa.gov/ground-water-and-drinking-water",
				scoreId: "performance",
			},
		],
		benefits: [],
		dbRowIds: [
			335, 216, 340, 346, 348, 349, 336, 341, 345, 350, 351, 353, 314, 72, 342,
			330, 337, 331, 136, 145, 338, 211, 213, 214, 212, 220, 219, 232, 333, 239,
			247, 343, 269, 272, 271, 280, 277, 142, 210, 255, 244, 233, 339, 344, 347,
			358, 360, 363, 385, 407, 416, 422, 437, 471, 470, 478, 144, 143, 224, 352,
			378, 411, 444, 500, 234,
		],
	},
	{
		name: "Herbicides",
		id: "Herbicides",
		harms: [
			{
				label: "Hormone Disruption",
				description:
					"Can interfere with endocrine function, leading to hormonal imbalances.",
				source:
					"https://www.epa.gov/pesticide-science-and-assessing-pesticide-risks/human-health-issues-related-pesticides",
				scoreId: "fertility",
			},
			{
				label: "Increased Cancer Risk",
				description:
					"Certain herbicides are linked to a higher risk of cancers.",
				source:
					"https://www.foodandwine.com/pesticides-prostate-cancer-risk-8739772",
				scoreId: "detoxification",
			},
			{
				label: "Skin Absorption",
				description:
					"Can be absorbed through the skin, potentially causing systemic effects.",
				source:
					"https://www.epa.gov/safepestcontrol/drinking-water-and-pesticides",
				scoreId: "detoxification",
			},
		],
		benefits: [],
		dbRowIds: [
			309, 310, 174, 315, 316, 135, 133, 173, 182, 186, 320, 222, 206, 207, 221,
			302, 230, 231, 303, 254, 304, 238, 245, 250, 251, 252, 253, 305, 256, 146,
			202, 257, 306, 307, 289, 290, 295, 296, 299, 223, 308, 301, 412, 413, 414,
			415, 417, 429, 475, 477, 479, 481, 482, 483, 176, 189, 243, 501,
		],
	},
	{
		name: "Phthalates",
		id: "Phthalates",
		harms: [
			{
				label: "Reproductive Issues",
				description:
					"Associated with reproductive toxicity and developmental problems.",
				source: "https://www.cdc.gov/biomonitoring/Phthalates_FactSheet.html",
				scoreId: "fertility",
			},
			{
				label: "Hormonal Imbalances",
				description:
					"Can disrupt hormone levels, affecting various bodily functions.",
				source:
					"https://www.niehs.nih.gov/health/topics/agents/endocrine/index.cfm",
				scoreId: "fertility",
			},
			{
				label: "Respiratory Effects",
				description:
					"Inhalation may lead to respiratory issues, including asthma.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1240915/",
				scoreId: "performance",
			},
		],
		benefits: [],
		dbRowIds: [326, 327, 217, 226, 227, 229, 228, 445, 472, 225, 565],
	},
	{
		name: "Pharmaceuticals",
		id: "Pharmaceuticals",
		harms: [
			{
				label: "Antibiotic Resistance",
				description:
					"Presence in water can contribute to the development of antibiotic-resistant bacteria.",
				source:
					"https://www.who.int/news-room/fact-sheets/detail/antibiotic-resistance",
				scoreId: "detoxification",
			},
			{
				label: "Hormonal Effects",
				description:
					"May interfere with endocrine systems, leading to hormonal disruptions.",
				source: "https://www.epa.gov/hw/learn-about-pharmaceutical-waste",
				scoreId: "fertility",
			},
			{
				label: "Neurological Impact",
				description:
					"Certain pharmaceuticals can affect the nervous system, leading to cognitive issues.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6219925/",
				scoreId: "performance",
			},
		],
		benefits: [],
		dbRowIds: [
			278, 322, 262, 323, 266, 268, 324, 265, 276, 275, 287, 288, 286, 294, 293,
			273, 325, 419, 443, 442, 274, 264, 267,
		],
	},
	{
		name: "Chemical Disinfectants",
		id: "Chemical Disinfectants",
		harms: [
			{
				label: "Skin Dryness",
				description:
					"Can strip natural oils from the skin, leading to dryness and irritation.",
				source:
					"https://www.cdc.gov/healthywater/hygiene/hand/handwashing.html",
				scoreId: "radiance",
			},
			{
				label: "Respiratory Irritation",
				description:
					"Inhalation of vapors during showers can cause respiratory issues.",
				source: "https://www.osha.gov/chlorine/hazards",
				scoreId: "performance",
			},
			{
				label: "Gut Microbiota Disruption",
				description:
					"Ingestion may disrupt beneficial gut bacteria, affecting digestion.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7091200/",
				scoreId: "detoxification",
			},
		],
		benefits: [],
		dbRowIds: [34, 60, 89, 61, 403, 101, 399, 400],
	},
	{
		name: "Heavy Metals",
		id: "Heavy Metals",
		harms: [
			{
				label: "Neurological Damage",
				description:
					"Exposure can lead to cognitive deficits and nervous system damage.",
				source:
					"https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health",
				scoreId: "performance",
			},
			{
				label: "Kidney Dysfunction",
				description:
					"Accumulation in kidneys can impair their function over time.",
				source: "https://www.cdc.gov/niosh/topics/heavymetals/",
				scoreId: "detoxification",
			},
			{
				label: "Skin Conditions",
				description:
					"May cause rashes, irritation, and other dermatological issues.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4144270/",
				scoreId: "radiance",
			},
		],
		benefits: [],
		dbRowIds: [20, 63, 64, 62, 78, 38, 81, 47, 84, 166, 80, 409, 408, 21],
	},
	{
		name: "PFAS",
		id: "Perfluorinated Chemicals (PFAS)",
		harms: [
			{
				label: "Cancer Risk",
				description:
					"Linked to increased risk of certain cancers, including kidney and testicular cancer.",
				source: "https://www.epa.gov/pfas/pfas-explained",
				scoreId: "detoxification",
			},
			{
				label: "Immune System Suppression",
				description:
					"Can weaken immune response, making the body more susceptible to infections.",
				source: "https://www.atsdr.cdc.gov/pfas/health-effects/index.html",
				scoreId: "detoxification",
			},
			{
				label: "Hormonal Disruption",
				description:
					"Interferes with hormone function, potentially leading to reproductive issues.",
				source: "https://www.niehs.nih.gov/health/topics/agents/pfc/index.cfm",
				scoreId: "fertility",
			},
		],
		benefits: [],
		dbRowIds: [311, 99, 96, 111, 95, 420, 421, 313, 312, 98, 97, 69],
	},
	{
		name: "VOCs",
		id: "Volatile Organic Compounds (VOCs)",
		harms: [
			{
				label: "Respiratory Problems",
				description:
					"Inhalation can cause respiratory irritation and exacerbate asthma.",
				source:
					"https://www.epa.gov/indoor-air-quality-iaq/volatile-organic-compounds-impact-indoor-air-quality",
				scoreId: "performance",
			},
			{
				label: "Liver and Kidney Damage",
				description:
					"Prolonged exposure may lead to liver and kidney toxicity.",
				source: "https://www.cdc.gov/niosh/topics/organsolv/",
				scoreId: "detoxification",
			},
			{
				label: "Neurological Effects",
				description:
					"Can affect the central nervous system, leading to headaches and dizziness.",
				source: "https://www.osha.gov/chemical-hazards",
				scoreId: "performance",
			},
		],
		benefits: [],
		dbRowIds: [
			12, 67, 91, 88, 94, 103, 93, 100, 137, 114, 117, 127, 188, 258, 300, 240,
			261, 282, 281, 279, 370, 284, 285, 123, 122, 124, 141, 128, 116, 130, 129,
			355, 354, 356, 357, 362, 361, 365, 71, 368, 364, 366, 367, 371, 372, 374,
			375, 377, 379, 381, 380, 382, 383, 384, 386, 387, 388, 389, 390, 391, 392,
			393, 395, 396, 397, 398, 401, 428, 450, 446, 447, 448, 449, 451, 453, 454,
			466, 464, 459, 457, 458, 460, 461, 462, 463, 465, 456, 468, 469, 376, 131,
			121, 359, 126, 452, 369, 455, 467, 504, 507, 40,
		],
	},
	{
		name: "Haloacetic Acids",
		id: "Haloacetic Acids",
		harms: [
			{
				label: "Cancer Risk",
				description:
					"Associated with an increased risk of cancer with long-term exposure.",
				source: "https://www.epa.gov/dwreginfo/haloacetic-acids",
				scoreId: "detoxification",
			},
			{
				label: "Reproductive Issues",
				description: "May cause developmental and reproductive problems.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1567851/",
				scoreId: "fertility",
			},
			{
				label: "Skin Irritation",
				description: "Can cause skin irritation upon contact.",
				source:
					"https://www.cdc.gov/healthywater/drinking/public/water_disinfection.html",
				scoreId: "radiance",
			},
		],
		benefits: [],
		dbRowIds: [52, 51, 50, 68, 406, 36, 37, 109],
	},
	{
		name: "Radiological Elements",
		id: "Radiological Elements",
		harms: [
			{
				label: "Increased Cancer Risk",
				description:
					"Exposure to radiological elements in water can elevate the risk of developing cancers, particularly of the bone, liver, and lungs.",
				source: "https://www.epa.gov/radiation/radiation-health-effects",
				scoreId: "detoxification",
			},
			{
				label: "Organ Damage",
				description:
					"Accumulation of radioactive substances may lead to damage in vital organs over time.",
				source:
					"https://www.who.int/news-room/fact-sheets/detail/radiation-health-effects",
				scoreId: "detoxification",
			},
			{
				label: "Developmental Issues",
				description:
					"Prenatal exposure can result in developmental abnormalities and growth retardation.",
				source: "https://www.cdc.gov/nceh/radiation/emergencies/prenatal.htm",
				scoreId: "detoxification",
			},
		],
		benefits: [],
		dbRowIds: [
			328, 15, 329, 162, 163, 153, 150, 14, 24, 32, 16, 539, 536, 535, 534, 537,
			540, 541,
		],
	},
	{
		name: "Microbiologicals",
		id: "Microbiologicals",
		harms: [
			{
				label: "Gastrointestinal Illnesses",
				description:
					"Pathogens like bacteria, viruses, and parasites can cause diarrhea, nausea, and vomiting.",
				source:
					"https://www.who.int/news-room/fact-sheets/detail/drinking-water",
				scoreId: "detoxification",
			},
			{
				label: "Neurological Effects",
				description:
					"Certain microbes may lead to neurological symptoms, including headaches and muscle weakness.",
				source: "https://www.cdc.gov/parasites/naegleria/general.html",
				scoreId: "performance",
			},
			{
				label: "Respiratory Infections",
				description:
					"Inhalation of contaminated water droplets can result in respiratory issues such as pneumonia.",
				source: "https://www.cdc.gov/legionella/about/causes-transmission.html",
				scoreId: "performance",
			},
		],
		benefits: [],
		dbRowIds: [56, 55, 156, 259, 260, 533, 532],
	},
	{
		name: "Pesticides",
		id: "Pesticides",
		harms: [
			{
				label: "Endocrine Disruption",
				description:
					"Pesticides can interfere with hormone function, leading to reproductive and developmental problems.",
				source: "https://www.epa.gov/endocrine-disruption",
				scoreId: "fertility",
			},
			{
				label: "Carcinogenic Potential",
				description:
					"Some pesticides are classified as probable human carcinogens.",
				source:
					"https://www.cancer.gov/about-cancer/causes-prevention/risk/substances/pesticides",
				scoreId: "detoxification",
			},
			{
				label: "Neurological Effects",
				description:
					"Exposure may cause neurotoxic effects, including tremors and cognitive deficits.",
				source:
					"https://www.who.int/news-room/fact-sheets/detail/pesticide-residues-in-food",
				scoreId: "performance",
			},
		],
		benefits: [],
		dbRowIds: [
			317, 318, 169, 319, 178, 179, 180, 183, 185, 184, 321, 195, 196, 197, 198,
			199, 194, 200, 203, 201, 204, 209, 218, 236, 237, 241, 235, 242, 246, 248,
			249, 168, 297, 394, 425, 430, 426, 423, 424, 427, 431, 432, 434, 435, 436,
			439, 441, 476, 473, 474, 480, 498, 175, 170, 484, 499, 177, 181, 193, 503,
			502, 505, 506, 508, 509,
		],
	},
	{
		name: "Fluoride",
		id: "Fluoride",
		harms: [
			{
				label: "Dental Fluorosis",
				description:
					"Excessive fluoride intake during tooth development can lead to enamel discoloration and damage.",
				source:
					"https://www.cdc.gov/fluoridation/faqs/dental_fluorosis/index.htm",
				scoreId: "radiance",
			},
			{
				label: "Skeletal Fluorosis",
				description:
					"High levels of fluoride over time can cause joint stiffness and pain due to bone structure changes.",
				source: "https://www.who.int/news-room/fact-sheets/detail/fluorosis",
				scoreId: "detoxification",
			},
			{
				label: "Thyroid Function Interference",
				description:
					"Elevated fluoride levels may affect thyroid hormone production, leading to hypothyroidism.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4748746/",
				scoreId: "detoxification",
			},
		],
		benefits: [],
		dbRowIds: [404, 405, 485, 22],
	},
	{
		name: "Microplastics",
		id: "Microplastics",
		harms: [
			{
				label: "Cellular Damage",
				description:
					"Microplastics can cause oxidative stress and inflammation at the cellular level.",
				source: "https://www.nature.com/articles/s41598-019-46873-1",
				scoreId: "detoxification",
			},
			{
				label: "Chemical Leaching",
				description:
					"They may leach toxic chemicals, including additives and absorbed pollutants, into the body.",
				source:
					"https://www.sciencedirect.com/science/article/pii/S0160412019306188",
				scoreId: "detoxification",
			},
			{
				label: "Bioaccumulation",
				description:
					"Persistent microplastics can accumulate in tissues, potentially leading to long-term health effects.",
				source: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6132564/",
				scoreId: "detoxification",
			},
		],
		benefits: [],
		dbRowIds: [418],
	},
	{
		name: "Minerals",
		id: "Minerals",
		benefits: [
			{
				label: "Bone Health",
				description:
					"Minerals like calcium and phosphorus are essential for the development and maintenance of strong bones and teeth.",
				source:
					"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
				scoreId: "detoxification",
			},
			{
				label: "Energy Production",
				description:
					"Magnesium plays a crucial role in converting food into energy, supporting overall vitality.",
				source: "https://www.healthline.com/nutrition/magnesium-benefits",
				scoreId: "detoxification",
			},
			{
				label: "Immune Function",
				description:
					"Zinc is vital for a healthy immune system, aiding in wound healing and reducing the duration of common colds.",
				source:
					"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
				scoreId: "detoxification",
			},
			{
				label: "Oxygen Transport",
				description:
					"Iron is a key component of hemoglobin, enabling red blood cells to transport oxygen throughout the body.",
				source:
					"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
				scoreId: "detoxification",
			},
			{
				label: "Nerve and Muscle Function",
				description:
					"Potassium and sodium are electrolytes that help regulate nerve signals and muscle contractions.",
				source:
					"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
				scoreId: "detoxification",
			},
			{
				label: "Thyroid Health",
				description:
					"Iodine is necessary for the production of thyroid hormones, which regulate metabolism.",
				source:
					"https://www.health.harvard.edu/staying-healthy/precious-metals-and-other-important-minerals-for-health",
				scoreId: "detoxification",
			},
		],
		harms: [],
		dbRowIds: [
			1, 2, 3, 4, 5, 6, 8, 9, 10, 13, 17, 23, 25, 26, 28, 33, 39, 41, 42, 43,
			44, 45, 53, 74, 77, 82, 83, 104, 108, 115, 152, 157, 410, 738, 756, 758,
		],
	},
];

export const CONTAMINANT_KEYS = [
	{
		name: "Chemical Disinfectants",
		dbRowIds: [34, 60, 89, 61, 403, 101, 399, 400],
	},
	{
		name: "Fluoride",
		dbRowIds: [404, 405, 485, 22],
	},
	{
		name: "Haloacetic Acids",
		dbRowIds: [52, 51, 50, 68, 406, 36, 37, 109],
	},
	{
		name: "Heavy Metals",
		dbRowIds: [20, 63, 64, 62, 78, 38, 81, 47, 84, 166, 80, 409, 408, 21],
	},
	{
		name: "Herbicides",
		dbRowIds: [
			309, 310, 174, 315, 316, 135, 133, 173, 182, 186, 320, 222, 206, 207, 221,
			302, 230, 231, 303, 254, 304, 238, 245, 250, 251, 252, 253, 305, 256, 146,
			202, 257, 306, 307, 289, 290, 295, 296, 299, 223, 308, 301, 412, 413, 414,
			415, 417, 429, 475, 477, 479, 481, 482, 483, 176, 189, 243, 501,
		],
	},
	{
		name: "Microplastics",
		dbRowIds: [418],
	},
	{
		name: "Perfluorinated Chemicals (PFAS)",
		dbRowIds: [311, 99, 96, 111, 95, 420, 421, 313, 312, 98, 97, 69],
	},
	{
		name: "Pesticides",
		dbRowIds: [
			317, 318, 169, 319, 178, 179, 180, 183, 185, 184, 321, 195, 196, 197, 198,
			199, 194, 200, 203, 201, 204, 209, 218, 236, 237, 241, 235, 242, 246, 248,
			249, 168, 297, 394, 425, 430, 426, 423, 424, 427, 431, 432, 434, 435, 436,
			439, 441, 476, 473, 474, 480, 498, 175, 170, 484, 499, 177, 181, 193, 503,
			502, 505, 506, 508, 509,
		],
	},
	{
		name: "Pharmaceuticals",
		dbRowIds: [
			278, 322, 262, 323, 266, 268, 324, 265, 276, 275, 287, 288, 286, 294, 293,
			273, 325, 419, 443, 442, 274, 264, 267,
		],
	},
	{
		name: "Phthalates",
		dbRowIds: [326, 327, 217, 226, 227, 229, 228, 445, 472, 225, 565],
	},
	{
		name: "Radiological Elements",
		dbRowIds: [
			328, 15, 329, 162, 163, 153, 150, 14, 24, 32, 16, 539, 536, 535, 534, 537,
			540, 541,
		],
	},
	{
		name: "Semi-Volatile Compounds",
		dbRowIds: [
			335, 216, 340, 346, 348, 349, 336, 341, 345, 350, 351, 353, 314, 72, 342,
			330, 337, 331, 136, 145, 338, 211, 213, 214, 212, 220, 219, 232, 333, 239,
			247, 343, 269, 272, 271, 280, 277, 142, 210, 255, 244, 233, 339, 344, 347,
			358, 360, 363, 385, 407, 416, 422, 437, 471, 470, 478, 144, 143, 224, 352,
			378, 411, 444, 500, 234,
		],
	},
	{
		name: "Volatile Organic Compounds (VOCs)",
		dbRowIds: [
			12, 67, 91, 88, 94, 103, 93, 100, 137, 114, 117, 127, 188, 258, 300, 240,
			261, 282, 281, 279, 370, 284, 285, 123, 122, 124, 141, 128, 116, 130, 129,
			355, 354, 356, 357, 362, 361, 365, 71, 368, 364, 366, 367, 371, 372, 374,
			375, 377, 379, 381, 380, 382, 383, 384, 386, 387, 388, 389, 390, 391, 392,
			393, 395, 396, 397, 398, 401, 428, 450, 446, 447, 448, 449, 451, 453, 454,
			466, 464, 459, 457, 458, 460, 461, 462, 463, 465, 456, 468, 469, 376, 131,
			121, 359, 126, 452, 369, 455, 467, 504, 507, 40,
		],
	},
	{
		name: "Microbiologicals",
		dbRowIds: [56, 55, 156, 259, 260, 533, 532],
	},
	{
		name: "Minerals",
		dbRowIds: [83, 23, 115, 152, 10, 157, 39, 8, 410],
	},
];
