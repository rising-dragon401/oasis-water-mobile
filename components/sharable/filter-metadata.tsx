import { View } from "react-native";
import BlurredLineItem from "./blurred-line-item";

const contaminants = [
	{ label: "Chlorine", value: "Chlorine", type: "single_contaminant" },
	{ label: "Chloramine", value: "Chloramine", type: "single_contaminant" },
	{ label: "Fluoride", value: "Fluoride", type: "single_contaminant" },
	{ label: "Heavy Metals", value: "Heavy Metals", type: "category" },
	{
		label: "VOCs",
		value: "Volatile Organic Compounds (VOCs)",
		type: "category",
	},
	{ label: "Haloacetic Acids", value: "Haloacetic Acids", type: "category" },
	{ label: "Microplastics", value: "Microplastics", type: "category" },
	{ label: "PFAS", value: "Perfluorinated compounds (PFAS)", type: "category" },
	{ label: "sVOCs", value: "Semi-Volatile Compounds", type: "category" },
	{ label: "Pesticides", value: "Pesticides", type: "category" },
	{ label: "Pharmaceuticals", value: "Pharmaceuticals", type: "category" },
	{ label: "Herbicides", value: "Herbicides", type: "category" },
	{ label: "Phthalates", value: "Phthalates", type: "category" },
	{ label: "Radiologicals", value: "Radiological Elements", type: "category" },
	{ label: "Bacteria", value: "Microbiologicals", type: "category" },
];

export default function FilterMetadata({
	filteredContaminants,
	contaminantsByCategory,
	isPaywalled = false,
}: {
	filteredContaminants: any[];
	contaminantsByCategory: Record<string, { percentageFiltered: number }>;
	isPaywalled?: boolean;
}) {
	return (
		<View className="flex flex-row w-full md:mt-2 mt-4">
			<View className="flex-1 pr-2 w-full">
				{contaminants
					.slice(0, Math.ceil(contaminants.length / 2))
					.map(({ label, value, type }) => {
						const isSingleContaminant = type === "single_contaminant";
						const percentageFiltered = isSingleContaminant
							? null
							: contaminantsByCategory[value]?.percentageFiltered ?? 0;

						return (
							<BlurredLineItem
								key={value}
								label={label}
								// value={
								// 	isSingleContaminant
								// 		? filteredContaminants.some((fc: any) => fc.name === value)
								// 			? "Filtered"
								// 			: "Not filtered"
								// 		: `${percentageFiltered}% filtered`
								// }
								isPaywalled={isPaywalled}
								score={
									isPaywalled
										? "neutral"
										: isSingleContaminant
											? filteredContaminants?.some(
													(fc: any) => fc?.name === value,
												)
												? "good"
												: "bad"
											: percentageFiltered === null
												? "bad"
												: percentageFiltered > 70
													? "good"
													: percentageFiltered > 10
														? "neutral"
														: "bad"
								}
							/>
						);
					})}
			</View>

			<View className="flex-1 pl-2 w-full">
				{contaminants
					.slice(Math.ceil(contaminants.length / 2))
					.map(({ label, value, type }) => {
						const percentageFiltered =
							type === "category"
								? contaminantsByCategory[value]?.percentageFiltered ?? 0
								: null;
						return (
							<BlurredLineItem
								key={value}
								label={label}
								// value={`${percentageFiltered}% filtered`}
								isPaywalled={isPaywalled}
								score={
									isPaywalled
										? "neutral"
										: percentageFiltered === null
											? "bad"
											: percentageFiltered > 70
												? "good"
												: percentageFiltered > 10
													? "neutral"
													: "bad"
								}
							/>
						);
					})}
			</View>
		</View>
	);
}
