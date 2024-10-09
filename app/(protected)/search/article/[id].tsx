import { isUserLoggedIn } from "@/actions/user";
import { H2 } from "@/components/ui/typography";
import { placeHolderImageBlurHash } from "@/lib/constants/images";
import { getEntry } from "actions/blogs";
import { Image } from "expo-image";
import {
	Link,
	useGlobalSearchParams,
	useLocalSearchParams,
	useNavigation,
	usePathname,
	useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions,
} from "react-native";
import Markdown from "react-native-markdown-display";

export default function ArticlePage() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();
	const navigation = useNavigation();
	const { width: screenWidth } = useWindowDimensions();
	const pathname = usePathname();
	const router = useRouter();

	const imageWidth = screenWidth - 48;

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"1";

	const [entry, setEntry] = useState<any>(null);

	// check if user is logged in
	// only auth users can view items
	useEffect(() => {
		const checkLogin = async () => {
			console.log("pathname", pathname);
			if (!pathname.includes("/article")) {
				return;
			}

			const loggedIn = await isUserLoggedIn();
			if (!loggedIn) {
				Alert.alert(
					"Sign in to view",
					"You need to be signed in to view articles",
					[
						{
							text: "Go back",
							onPress: () => navigation.goBack(),
							style: "cancel",
						},
						{
							text: "Sign in",
							onPress: () => router.push("/(public)/sign-in"),
						},
					],
				);
			}
		};
		checkLogin();
	}, [glob, pathname]);

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
