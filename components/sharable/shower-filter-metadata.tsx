import { View } from "react-native";
import BlurredLineItem from "./blurred-line-item";

export default function ShowerFilterMetadata({
	filteredContaminants,
	contaminantsByCategory,
}: {
	filteredContaminants: any[];
	contaminantsByCategory: any;
}) {
	return (
		<View className="flex md:flex-row flex-col gap-10 gap-y-1 w-full md:mt-2 mt-4">
			<View className="flex flex-col gap-y-1 w-full">
				<BlurredLineItem
					label="Chlorine"
					value={
						filteredContaminants.some((fc: any) => fc.name === "Chlorine")
							? "Yes"
							: "No"
					}
					isPaywalled={false}
					score={
						filteredContaminants.some((fc: any) => fc.name === "Chlorine")
							? "good"
							: "bad"
					}
				/>

				<BlurredLineItem
					label="Chloramine"
					value={
						filteredContaminants.some((fc: any) => fc.name === "Chloramine")
							? "Yes"
							: "No"
					}
					isPaywalled={false}
					score={
						filteredContaminants.some((fc: any) => fc.name === "Chloramine")
							? "good"
							: "bad"
					}
				/>

				<BlurredLineItem
					label="Heavy metals"
					value={
						contaminantsByCategory["Heavy Metals"]?.percentageFiltered > 10
							? "Some"
							: "No"
					}
					isPaywalled={false}
					score={
						contaminantsByCategory["Heavy Metals"]?.percentageFiltered > 70
							? "good"
							: contaminantsByCategory["Heavy Metals"]?.percentageFiltered > 10
								? "neutral"
								: "bad"
					}
				/>
			</View>

			<View className="flex flex-col gap-y-1 w-full">
				<BlurredLineItem
					label="VOCs"
					value={
						contaminantsByCategory["Volatile Organic Compounds (VOCs)"]
							?.percentageFiltered > 70
							? "Yes"
							: contaminantsByCategory["Volatile Organic Compounds (VOCs)"]
										?.percentageFiltered > 10
								? "Some"
								: "No"
					}
					isPaywalled={false}
					score={
						contaminantsByCategory["Volatile Organic Compounds (VOCs)"]
							?.percentageFiltered > 70
							? "good"
							: contaminantsByCategory["Volatile Organic Compounds (VOCs)"]
										?.percentageFiltered > 10
								? "neutral"
								: "bad"
					}
				/>

				<BlurredLineItem
					label="Fluoride"
					value={
						filteredContaminants.some((fc: any) => fc.name === "Fluoride")
							? "Yes"
							: "No"
					}
					isPaywalled={false}
					score={
						filteredContaminants.some((fc: any) => fc.name === "Fluoride")
							? "good"
							: "bad"
					}
				/>

				<BlurredLineItem
					label="Microplastics"
					value={
						contaminantsByCategory["Microplastics"]?.percentageFiltered > 70
							? "Yes"
							: contaminantsByCategory["Microplastics"]?.percentageFiltered > 10
								? "Some"
								: "No"
					}
					isPaywalled={false}
					score={
						contaminantsByCategory["Microplastics"]?.percentageFiltered > 70
							? "good"
							: contaminantsByCategory["Microplastics"]?.percentageFiltered > 10
								? "neutral"
								: "bad"
					}
				/>
			</View>
		</View>
	);
}
