import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileScores({
	userScores,
	hideSubtitle,
}: {
	userScores: any;
	hideSubtitle?: boolean;
}) {
	const { hasActiveSub } = useSubscription();
	const { greenColor, redColor, yellowColor, mutedColor } = useColorScheme();
	useColorScheme();
	const router = useRouter();
	const [openItems, setOpenItems] = useState<string[]>([]);

	const blurryBadge = (
		id: string,
		name: string,
		type: string,
		index: number,
	) => {
		const color =
			type === "harm"
				? redColor
				: type === "benefit"
					? greenColor
					: yellowColor;

		return (
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname: "/subscribeModal",
						params: {
							path: "profile",
							feature: "profile-scores",
							component: "blurred-badges",
						},
					})
				}
				key={id}
			>
				<P className="text-sm px-2 py-1">{name}</P>

				<BlurView
					intensity={14}
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
					}}
				/>
			</TouchableOpacity>
		);
	};

	const itemBadge = (id: string, name: string, type: string, index: number) => {
		if (hasActiveSub || index < 1) {
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
			return blurryBadge(id, name, type, index);
		}
	};

	const toggleItem = (item: string) => {
		setOpenItems((prev) =>
			prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
		);
	};

	const getAccordionTriggerStyle = (isOpen: boolean) => {
		return `bg-card border border-border px-4 ${
			isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl"
		}`;
	};

	const getAccordionContentStyle = (isOpen: boolean) => {
		return `bg-card border border-border pb-4 px-4 ${
			isOpen ? "rounded-b-2xl border-t-0" : "rounded-lg"
		}`;
	};

	const renderAmount = (amount: number, type: string) => {
		const getIconName = (type: string, amount: number) => {
			if (
				(type === "health_risks" || type === "contaminants_found") &&
				amount > 0
			) {
				return "warning-outline";
			} else if (type === "benefits" && amount > 0) {
				return "leaf-outline";
			} else {
				return "checkmark-outline";
			}
		};

		return (
			<View className="flex flex-row items-center gap-x-2">
				<Ionicons
					name={getIconName(type, amount)}
					size={24}
					color={type === "benefits" ? greenColor : redColor}
				/>
				{/* <P className="text-3xl">{amount}</P> */}
			</View>
		);
	};

	return (
		<View className="flex flex-col gap-y-4">
			<Accordion type="multiple" className="flex flex-col gap-y-4">
				<AccordionItem key="contaminants_found" value="contaminants_found">
					<AccordionTrigger
						className={getAccordionTriggerStyle(
							openItems.includes("contaminants_found"),
						)}
						onPress={() => toggleItem("contaminants_found")}
					>
						<View className="flex flex-row items-center gap-2 w-full mb-2 pr-2">
							{renderAmount(
								userScores?.allContaminants?.length,
								"contaminants_found",
							)}
							<View className="flex flex-col flex-grow">
								<P className="text-2xl">
									{userScores?.allContaminants?.length} toxins
								</P>
							</View>
							{!hideSubtitle && (
								<Feather name="chevron-down" size={20} color={mutedColor} />
							)}
						</View>
					</AccordionTrigger>
					<AccordionContent
						className={getAccordionContentStyle(
							openItems.includes("contaminants_found"),
						)}
					>
						<View className="flex flex-row flex-wrap gap-2">
							{userScores?.allContaminants.map(
								(ingredient: any, index: number) => (
									<View key={ingredient.id}>
										{itemBadge(ingredient.id, ingredient.name, "harm", index)}
									</View>
								),
							)}
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
						<View className="flex flex-row items-center gap-2 w-full mb-2 pr-2">
							{renderAmount(userScores?.allHarms?.length, "health_risks")}
							<View className="flex flex-col flex-grow">
								<P className="text-2xl">
									{userScores?.allHarms?.length} health concerns
								</P>
							</View>
							{!hideSubtitle && (
								<Feather name="chevron-down" size={20} color={mutedColor} />
							)}
						</View>
					</AccordionTrigger>
					<AccordionContent
						className={getAccordionContentStyle(
							openItems.includes("health_risks"),
						)}
					>
						<View className="flex flex-row flex-wrap gap-2">
							{userScores?.allHarms?.map((harm: any, index: number) => (
								<View key={harm.id}>
									{itemBadge(harm.id, harm.name, "harm", index)}
								</View>
							))}
						</View>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem key="benefits" value="benefits">
					<AccordionTrigger
						className={getAccordionTriggerStyle(openItems.includes("benefits"))}
						onPress={() => toggleItem("benefits")}
					>
						<View className="flex flex-row items-center gap-2 w-full mb-2 pr-2">
							{renderAmount(userScores?.allBenefits?.length, "benefits")}
							<View className="flex flex-col flex-grow">
								<P className="text-2xl">
									{userScores?.allBenefits?.length} benefits detected
								</P>
							</View>
							{!hideSubtitle && (
								<Feather name="chevron-down" size={20} color={mutedColor} />
							)}
						</View>
					</AccordionTrigger>
					<AccordionContent
						className={getAccordionContentStyle(openItems.includes("benefits"))}
					>
						<View className="flex flex-row flex-wrap gap-2">
							{userScores?.allBenefits?.map((benefit: any, index: number) => (
								<View key={benefit.id}>
									{itemBadge(benefit.id, benefit.name, "benefit", index)}
								</View>
							))}
						</View>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</View>
	);
}
