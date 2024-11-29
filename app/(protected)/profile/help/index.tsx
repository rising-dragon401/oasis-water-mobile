import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Muted, P } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";
const FAQ_LIST = [
	{
		value: "what-is-oasis",
		trigger: "What is Oasis?",
		content:
			"Oasis is a project we started to help find a healthier, cleaner source of water. We collect all the hard to find scientific data surrounding water, brands and filters and put it into one searchable website. Long-term we are on a mission to source the cleanest and healthiest source of water to you. ",
	},
	{
		value: "why-do-you-charge",
		trigger: "Why do you charge to see the ratings?",
		content:
			"Lab testing is very expensive and our aim is to independently test as many products as possible to ensure the most accurate and unbiased ratings. Funds go to further testing/research in addition to improving the product.",
	},
	{
		value: "do-you-get-paid-to-promote-brands",
		trigger: "Do you get paid to promote brands?",
		content:
			"Nope. We never do paid sponsorships, ads or any type of paid promotion. All data and marketing is purely based off the lab and research and funded by us.",
	},
	{
		value: "how-scoring-works",
		trigger: "How does the scoring work?",
		content:
			"Scoring for waters and filters is based on a comprehensive analysis of the scientific data and elements from the lab reports. Please see the 'How Scoring Works' page on our website for more details.",
	},
	{
		value: "tap-water-rated-higher",
		trigger: "Why is some tap water rated higher than bottled waters?",
		content:
			"Tap water ratings are scored on a different scale than bottled water ratings. And should not be direclty compared.",
	},
	{
		value: "data",
		trigger: "Where do you get your data from?",
		content:
			"We get our data from science-backed research papers, official water testing reports, non-profit research centers like EWG and from leading scientific experts.",
	},
	{
		value: "affiliate-links",
		trigger: "Do you use affilite links?",
		content:
			"We do add affiliate links to help fund this project and to help direct people to where to buy each product.",
	},
	{
		value: "testing",
		trigger: "Can I get my water tested?",
		content:
			"We partner with Tapscore to provide testing kits and analyze toxins in water. You can learn more on the Lab testing page",
	},
	{
		value: "people-pages",
		trigger: "How can I create my own Oasis page?",
		content:
			"Your page is automatically generated after creating an account and adding items to your favorites. Please note that certain pages were curated by the Oasis research team to showcase their public recommendations",
	},
	{
		value: "warning-score",
		trigger: "Why do some scores have a warning and untested symbol?",
		content:
			"We show a warning (untested) symbol for any waters and filters that are listed on Oasis but do not provide a lab / performance report. We are unable to provide a score for these items since there is no data to backup their claims. Users that add these items to their favorites may also see a warning symbol in their personal score.",
	},
];

export default function HelpScreen() {
	const { iconColor, shadowColor } = useColorScheme();
	const router = useRouter();
	const showToast = useToast();
	const [openItems, setOpenItems] = useState<string[]>([]);

	const handleCopyEmail = async () => {
		await Clipboard.setStringAsync("hello@live-oasis.com");
		showToast("Copied email");
	};

	const handleContribute = () => {
		// @ts-ignore
		router.push("/contributeModal");
	};

	const handleRequest = () => {
		// @ts-ignore
		router.push("/contributeModal?kind=new_item");
	};

	return (
		<ScrollView className="flex-1">
			<View className="w-full flex flex-col justify-between pb-14 px-8">
				<View className="flex flex-col items-center gap-x-2">
					<View className="flex-1 mt-6 w-full py-4 bg-card border border-border rounded-xl text-left flex flex-col justify-center px-4">
						<View className="flex flex-row items-center gap-x-2">
							<Feather name="edit" size={14} color={iconColor} />
							<P className="text-xl">Update item</P>
						</View>
						<Muted className="text-left mt-2">
							Submit a change request or new data regarding an existing item
						</Muted>
						<View className="flex flex-row justify-end gap-x-2">
							<Button
								variant="ghost"
								onPress={handleContribute}
								className=" w-40"
								icon={
									<Ionicons name="arrow-forward" size={14} color={iconColor} />
								}
								label="Contribute"
							/>
						</View>
					</View>

					<View className="flex-1 mt-6 w-full py-4 bg-card border border-border rounded-xl text-left flex flex-col justify-center px-4">
						<View className="flex flex-row items-center gap-x-2">
							<Feather name="plus" size={14} color={iconColor} />
							<P className="text-xl">New item</P>
						</View>
						<Muted className="text-left mt-2">
							What should we add next? If you are a brand please submit your
							products and lab data here
						</Muted>
						<View className="flex flex-row justify-end gap-x-2">
							<Button
								variant="ghost"
								onPress={handleRequest}
								icon={
									<Ionicons name="arrow-forward" size={14} color={iconColor} />
								}
								className="w-40"
								label="Request"
							/>
						</View>
					</View>
				</View>

				<View className="mt-6 w-full  py-4 bg-card border border-border rounded-xl text-left flex flex-col justify-center px-4">
					<View className="flex flex-row items-center gap-x-2">
						<Ionicons name="chatbubble-outline" size={14} color={iconColor} />
						<P className="text-left text-xl">Support</P>
					</View>
					<Muted className="text-left mt-2">
						Get help with any Oasis inquires or issues.
					</Muted>
					<View className="flex flex-row justify-end gap-x-2">
						<Button
							variant="ghost"
							onPress={handleCopyEmail}
							className="mw-40"
							icon={
								<Ionicons name="arrow-forward" size={14} color={iconColor} />
							}
							label="Email us"
						/>
					</View>
				</View>

				<View className="flex flex-col mt-14 mb-8">
					<View className="flex flex-row items-center gap-2 mb-2">
						<P className="text-xl">FAQ</P>
					</View>
					<Accordion
						type="multiple"
						value={openItems}
						onValueChange={setOpenItems}
					>
						{FAQ_LIST.map((faq) => (
							<AccordionItem
								key={faq.value}
								value={faq.value}
								className="mb-2 w-full"
							>
								<AccordionTrigger
									className="bg-card px-4 flex flex-row items-center justify-between w-full"
									style={{
										borderRadius: openItems.includes(faq.value) ? 16 : 16,
										borderTopLeftRadius: openItems.includes(faq.value)
											? 16
											: 16,
										borderTopRightRadius: openItems.includes(faq.value)
											? 16
											: 16,
										borderBottomLeftRadius: openItems.includes(faq.value)
											? 0
											: 16,
										borderBottomRightRadius: openItems.includes(faq.value)
											? 0
											: 16,
										shadowColor,
										shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.1,
										shadowRadius: 4,
										elevation: 5,
										overflow: "visible",
										zIndex: 99,
										position: "relative",
									}}
								>
									<View className="flex-1 mr-4">
										<P>{faq.trigger}</P>
									</View>
									<Feather
										name={openItems.includes(faq.value) ? "minus" : "plus"}
										size={14}
										color={iconColor}
									/>
								</AccordionTrigger>
								<AccordionContent className="bg-card rounded-lg px-4">
									<Muted>{faq.content}</Muted>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</View>
			</View>
		</ScrollView>
	);
}
