import { getEntry } from "actions/blogs";
import { Image } from "expo-image";
import {
	Link,
	useGlobalSearchParams,
	useLocalSearchParams,
	useNavigation,
} from "expo-router";
import { useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions,
} from "react-native";
import Markdown from "react-native-markdown-display";

import { H1, H2, P } from "@/components/ui/typography";
import { placeHolderImageBlurHash } from "@/lib/constants/images";

export default function ArticlePage() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();
	const navigation = useNavigation();
	const { width: screenWidth } = useWindowDimensions();

	const imageWidth = screenWidth - 48;

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"1";

	const [entry, setEntry] = useState<any>(null);

	useEffect(() => {
		const fetch = async () => {
			const entry = await getEntry(id);

			navigation.setOptions({
				title: entry?.attributes?.title || "Article",
			});

			// entry.attributes.blocks.forEach((block, index) => {
			// 	console.log(`Block ${index + 1}:`, block);
			// });

			setEntry(entry);
		};

		fetch();
	}, [id]);

	return (
		<ScrollView className="px-6 py-2 w-full">
			<View className="flex w-full justify-center py-2 ">
				<Image
					source={{ uri: entry?.attributes?.cover?.data?.attributes?.url }}
					style={{ width: "100%", height: 200, borderRadius: 20 }}
					className="px-8 py-4"
					placeholder={placeHolderImageBlurHash}
					transition={1000}
				/>
			</View>
			<H2 className="pt-2 pb-0">{entry?.attributes?.title}</H2>

			{entry?.attributes?.blocks.map((block: any, index: number) => {
				const content = (
					<Markdown
						key={block.id}
						style={markdownStyles}
						rules={{
							heading1: (node, children, parent, styles) => (
								<H1 key={node.key}>{children}</H1>
							),
							heading2: (node, children, parent, styles) => (
								<H2 key={node.key}>{children}</H2>
							),
							paragraph: (node, children, parent, styles) => (
								<P key={node.key}>{children}</P>
							),
							link: (node, children, parent, styles) => (
								<Link href={node.attributes.href} key={node.key}>
									{children}
								</Link>
							),
							image: (node) => (
								<Image
									key={node.key}
									source={{ uri: node.attributes.src }}
									style={{
										width: imageWidth,
										height: imageWidth * 0.75,
										borderRadius: 8,
									}}
									contentFit="cover"
								/>
							),
						}}
					>
						{block.body}
					</Markdown>
				);

				return content;

				// if (index === 0 || index === entry?.attributes?.blocks.length - 1) {
				// 	return content;
				// }

				// if (index > 0) {
				// 	return (
				// 		<PaywallContent
				// 			key={block.id}
				// 			label="Subscribe to access full article"
				// 			items={[
				// 				"Detailed analysis and insights 🔬",
				// 				"Expert opinions and recommendations 💡",
				// 				"Exclusive content and updates 📰",
				// 				"Product recommendations 🌿",
				// 			]}
				// 		>
				// 			{content}
				// 		</PaywallContent>
				// 	);
				// }
			})}

			<View style={{ height: 40 }} />
		</ScrollView>
	);
}

const markdownStyles = StyleSheet.create({
	heading1: {
		marginTop: 24,
		marginBottom: 8,
		fontSize: 24,
	},
	heading2: {
		marginTop: 20,
		marginBottom: 8,
		fontSize: 20,
	},
	heading3: {
		marginTop: 16,
		marginBottom: 8,
		fontSize: 16,
	},
});
