import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function WaterScores({
	userScores,
	hideSubtitle,
}: {
	userScores: any;
	hideSubtitle?: boolean;
}) {
	const { subscription } = useUserProvider();
	const { redColor, greenColor, yellowColor } = useColorScheme();
	const router = useRouter();
	const [openItems, setOpenItems] = useState<string[]>([]);

	const blurryBadge = (name: string, type: string, index: number) => {
		const color =
			type === "harm"
				? redColor
				: type === "benefit"
					? greenColor
					: yellowColor;

		if (index < 2) {
			return (
				<View
					style={{
						backgroundColor: color,
						borderRadius: 16,
						paddingHorizontal: 8,
						paddingVertical: 4,
					}}
				>
					<P className="text-sm px-2 py-1">{name}</P>
				</View>
			);
		}

		return (
			<TouchableOpacity onPress={() => router.push("/subscribeModal")}>
				<P className="text-sm px-2 py-1">{name}</P>

				<BlurView
					intensity={24}
					tint="regular"
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						right: 0,
						bottom: 20,
						borderRadius: 16,
						height: "100%",
						paddingHorizontal: 8,
						paddingVertical: 4,
						overflow: "hidden",
						backgroundColor: color,
						opacity: 0.8,
					}}
				/>
			</TouchableOpacity>
		);
	};

	const itemBadge = (name: string, type: string, index: number) => {
		if (subscription) {
			const bgColor =
				type === "harm"
					? "bg-red-200"
					: type === "benefit"
						? "bg-emerald-200"
						: "bg-amber-200";
			return (
				<View
					key={name}
					className={`flex flex-row gap-2 rounded-full px-2 py-1 ${bgColor}`}
				>
					<P className="text-sm">{name}</P>
				</View>
			);
		} else {
			return blurryBadge(name, type, index);
		}
	};

	return (
		<View className="flex flex-col gap-y-4">
			<View className="flex flex-col items-start justify-between gap-2 w-full mb-2 pr-2">
				<View className="flex flex-row">
					<Ionicons name="warning-outline" size={24} color={redColor} />
					<P className=" text-xl">
						{" "}
						{userScores?.allContaminants?.length} Contaminants found
					</P>
				</View>
				<View className="flex flex-row flex-wrap gap-2">
					{userScores?.allContaminants?.map(
						(ingredient: any, index: number) => (
							<>{itemBadge(ingredient.name, "harm", index)}</>
						),
					)}
				</View>
			</View>

			<View className="flex flex-col items-start justify-between gap-2 w-full mb-2 pr-2">
				<View className="flex flex-col">
					<Ionicons name="heart-dislike-outline" size={24} color={redColor} />
					<P className=" text-xl">Health concerns</P>
				</View>
				<View className="flex flex-row flex-wrap gap-2">
					{userScores?.allHarms?.map((harm: any, index: number) => (
						<>{itemBadge(harm.name, "harm", index)}</>
					))}
				</View>
			</View>
			{/* 
			<Accordion type="multiple" className="flex flex-col gap-y-2">
				<AccordionItem key="contaminants_found" value="contaminants_found">
					<AccordionTrigger
						className={getAccordionTriggerStyle(
							openItems.includes("contaminants_found"),
						)}
						onPress={() => toggleItem("contaminants_found")}
					>
						<View className="flex flex-row items-start justify-between gap-2 w-full mb-2 pr-2">
							<View className="flex flex-col">
								<Ionicons name="warning-outline" size={24} color={redColor} />
								<P className=" text-xl">Contaminants found</P>
								{!hideSubtitle && (
									<Muted className="max-w-xs">
										Toxins found in your drinking and bathing water
									</Muted>
								)}
							</View>
							{renderAmount(userScores?.allContaminants?.length)}
						</View>
					</AccordionTrigger>
					<AccordionContent
						className={getAccordionContentStyle(
							openItems.includes("contaminants_found"),
						)}
					>
						<View className="flex flex-row flex-wrap gap-2">
							{userScores?.allContaminants?.map((ingredient: any) => (
								<>{itemBadge(ingredient.name, "harm")}</>
							))}
						</View>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem key="health_risks" value="health_risks">
					<AccordionTrigger
						className={getAccordionTriggerStyle(
							openItems.includes("health_risks"),
						)}
						onPress={() => toggleItem("health_risks")}
					>
						<View className="flex flex-row items-start justify-between gap-2 w-full mb-2 pr-2">
							<View className="flex flex-col">
								<Ionicons
									name="heart-dislike-outline"
									size={24}
									color={redColor}
								/>
								<P className=" text-xl">Health concerns</P>
								{!hideSubtitle && (
									<Muted className="max-w-xs">
										You may be at risk to the following based on your hydration
										habits
									</Muted>
								)}
							</View>
							{renderAmount(userScores?.allHarms?.length)}
						</View>
					</AccordionTrigger>
					<AccordionContent
						className={getAccordionContentStyle(
							openItems.includes("health_risks"),
						)}
					>
						<View className="flex flex-row flex-wrap gap-2">
							{userScores?.allHarms?.map((harm: any) => (
								<>{itemBadge(harm.name, "harm")}</>
							))}
						</View>
					</AccordionContent>
				</AccordionItem>
			</Accordion> */}
		</View>
	);
}
