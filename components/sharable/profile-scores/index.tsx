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
import { Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";

export default function ProfileScores({
	userScores,
	hideSubtitle,
}: {
	userScores: any;
	hideSubtitle?: boolean;
}) {
	const { subscription } = useUserProvider();
	const router = useRouter();
	const [openItems, setOpenItems] = useState<string[]>([]);

	const blurryBadge = (name: string, type: string) => {
		const color =
			type === "harm"
				? "rgba(255, 0, 0, 0.2)"
				: type === "benefit"
					? "rgba(0, 128, 0, 0.2)" // Darker emerald green
					: "rgba(255, 255, 0, 0.2)";

		return (
			<TouchableOpacity onPress={() => router.push("/subscribeModal")}>
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

	const itemBadge = (name: string, type: string) => {
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
			return blurryBadge(name, type);
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

	const renderAmount = (amount: number) => {
		return <P className="text-2xl">{amount}</P>;
		// if (subscription) {
		// 	return <P className="text-2xl">{amount}</P>;
		// } else {
		// 	return (
		// 		<TouchableOpacity
		// 			className="flex flex-row items-center justify-center gap-2 "
		// 			onPress={() => router.push("/subscribeModal")}
		// 		>
		// 			<Ionicons name="lock-closed-outline" size={20} color={iconColor} />
		// 		</TouchableOpacity>
		// 	);
		// }
	};

	return (
		<View>
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

				<AccordionItem key="benefits" value="benefits">
					<AccordionTrigger
						className={getAccordionTriggerStyle(openItems.includes("benefits"))}
						onPress={() => toggleItem("benefits")}
					>
						<View className="flex flex-row items-start justify-between gap-2 w-full mb-2 pr-2">
							<View className="flex flex-col">
								<P className=" text-xl">Benefits</P>
								{!hideSubtitle && (
									<Muted className="max-w-xs">
										The positive effects found in your water routine
									</Muted>
								)}
							</View>
							{renderAmount(userScores?.allBenefits?.length)}
						</View>
					</AccordionTrigger>
					<AccordionContent
						className={getAccordionContentStyle(openItems.includes("benefits"))}
					>
						<View className="flex flex-row flex-wrap gap-2">
							{userScores?.allBenefits?.map((benefit: any) => (
								<View key={benefit.name}>
									{itemBadge(benefit.name, "benefit")}
								</View>
							))}
						</View>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</View>
	);
}
