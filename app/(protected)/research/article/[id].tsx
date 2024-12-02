import { getEntry } from "actions/blogs";
import { Image } from "expo-image";
import {
	Link,
	useGlobalSearchParams,
	useLocalSearchParams,
	useNavigation,
	useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
	ScrollView,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";
import Markdown from "react-native-markdown-display";

import { Button } from "@/components/ui/button";
import { H1, H2, H3, P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { placeHolderImageBlurHash } from "@/lib/constants/images";

export default function ArticlePage() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();
	const { hasActiveSub } = useSubscription();
	const navigation = useNavigation();
	const router = useRouter();
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
					style={{ width: "100%", height: 160, borderRadius: 20 }}
					className="px-8 py-4"
					placeholder={placeHolderImageBlurHash}
					transition={1000}
				/>
			</View>
			<H2 className="py-4 pb-0">{entry?.attributes?.title}</H2>

			{entry?.attributes?.blocks.map((block: any, index: number) => {
				const content = (
					<Markdown
						key={block.id}
						rules={{
							heading1: (node, children, parent, styles) => (
								<H1 key={node.key} className="mb-4 mt-2">
									{children}
								</H1>
							),
							heading2: (node, children, parent, styles) => (
								<H2 key={node.key} className="mb-4">
									{children}
								</H2>
							),
							heading3: (node, children, parent, styles) => (
								<H3 key={node.key} className="mb-4">
									{children}
								</H3>
							),
							paragraph: (node, children, parent, styles) => (
								<P key={node.key} className="mb-2">
									{children}
								</P>
							),
							link: (node, children, parent, styles) => (
								<Link href={node.attributes.href} key={node.key}>
									{children}
								</Link>
							),
							image: (node) => (
								<View className="flex flex-col py-4 rounded-2xl overflow-hidden">
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
								</View>
							),
						}}
					>
						{block.body}
					</Markdown>
				);

				if (index === 0 || index === entry.attributes.blocks.length - 1) {
					return content;
				}

				if (index > 0 && !hasActiveSub) {
					return (
						<View className="flex flex-col py-4 rounded-2xl relative">
							<TouchableOpacity onPress={() => router.push("/subscribeModal")}>
								<View className="flex hover:cursor-pointer w-[90vw] bg-secondary p-4 py-6 rounded-xl gap-x-4 items-center gap-y-4">
									<P className="text-muted-foreground text-xl border-b border-border my-2">
										Unlock all research
									</P>
									<View className="w-full justify-center items-center gap-y-4">
										<P>❤️ Stay on top of your health</P>
										<P>🔬 Latest studies and lab findings</P>
										<P>🌿 Product recommendations</P>
										<P>💡 Lists of top rated products</P>
									</View>

									<Button
										variant="default"
										className="mt-4"
										label="Continue reading for free 🔓"
										onPress={() => router.push("/subscribeModal")}
									/>
								</View>
							</TouchableOpacity>
						</View>
					);
				}

				if (index > 0 && hasActiveSub) {
					return content;
				}
			})}

			<View style={{ height: 40 }} />
		</ScrollView>
	);
}
