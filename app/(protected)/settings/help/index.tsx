import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { H1, H3, Large, Muted, P } from "@/components/ui/typography";

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
			"Scoring for waters and filters is mainly based on contaminant levels and performance data presented in the lab reports. Check How scoring works page for more details.",
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
];

export default function TabTwoScreen() {
	const [copyStatus, setCopyStatus] = useState("Copy email");

	const handleCopyEmail = async () => {
		await Clipboard.setStringAsync("cormac@live-oasis.com");
		setCopyStatus("Copied!");
		setTimeout(() => setCopyStatus("Copy email"), 2000);
	};

	return (
		<ScrollView className="flex-1">
			<View className="w-full flex flex-col justify-between pb-14 px-8">
				<H1 className="mt-6">Help</H1>

				<View className="mt-6 w-full h-64 py-4 bg-muted rounded-xl text-left flex flex-col justify-center px-8">
					<H3 className="text-left">Contact us</H3>
					<P className="text-left">
						We may be in the lab or out searching for the best water but we will
						get back to you as soon as possible. Email cormac@live-oasis.com for
						the quickest response.
					</P>
					<Button
						variant="secondary"
						onPress={handleCopyEmail}
						className="mt-4"
						label={copyStatus}
					/>
				</View>

				<View className="flex flex-col mt-8 mb-8">
					<Large>Frequently asked questions</Large>
					<Accordion type="multiple">
						{FAQ_LIST.map((faq) => (
							<AccordionItem key={faq.value} value={faq.value}>
								<AccordionTrigger>
									<P>{faq.trigger}</P>
								</AccordionTrigger>
								<AccordionContent>
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