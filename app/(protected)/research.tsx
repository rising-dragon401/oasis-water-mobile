import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { getResearch } from "@/actions/admin";
import Skeleton from "@/components/sharable/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1, Muted, P } from "@/components/ui/typography";
import { BlogContext } from "@/context/blogs-provider";
import { useUserProvider } from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme, iconColor } = useColorScheme();
	const { subscription } = useUserProvider();
	const { blogs } = useContext(BlogContext);
	const router = useRouter();

	const [tabValue, setTabValue] = useState("articles");
	const [research, setResearch] = useState<any[]>([]);

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	useEffect(() => {
		const fetchResearch = async () => {
			const research = await getResearch();

			if (research) {
				setResearch(research);
			}
		};

		fetchResearch();
	}, []);

	const handleAskOasisAI = () => {
		if (subscription) {
			router.push("/chatModal");
		} else {
			router.push("/subscribeModal");
		}
	};

	const handleOpenLink = (url: string) => {
		if (!url) return;
		Linking.openURL(url).catch((err) =>
			console.error("Couldn't load page", err),
		);
	};

	return (
		<View className="flex-1 justify-between px-4" style={{ backgroundColor }}>
			<H1 className="mt-24">Research</H1>
			<Muted>
				Stay current with scientific advances in product health and safety
			</Muted>
			{/* 
			<Button
				label="Ask Oasis AI"
				onPress={handleAskOasisAI}
				icon={
					subscription ? (
						<Feather
							name="message-circle"
							size={16}
							className="!text-offwhite"
						/>
					) : (
						<Feather name="lock" size={16} className="!text-offwhite" />
					)
				}
				className="mt-2"
			/> */}

			<Tabs value={tabValue} onValueChange={setTabValue} className="mt-4">
				<TabsList className="mb-1">
					<TabsTrigger value="articles">
						<P
							className={`${
								tabValue === "articles"
									? "text-secondary-foreground"
									: "text-primary"
							}`}
						>
							Articles
						</P>
					</TabsTrigger>
					<TabsTrigger value="research">
						<P
							className={`${
								tabValue === "research"
									? "text-secondary-foreground"
									: "text-primary"
							}`}
						>
							Studies
						</P>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="articles">
					<View className="flex-col">
						{blogs.length === 0 ? (
							<FlatList
								data={[1, 2, 3, 4, 5, 6]}
								numColumns={2}
								columnWrapperStyle={{ justifyContent: "space-between" }}
								contentContainerStyle={{ paddingVertical: 5 }}
								ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
								renderItem={() => (
									<View style={{ width: "48%" }}>
										<Skeleton
											width={180}
											height={150}
											style={{ borderRadius: 20, width: "100%" }}
										/>
										<Skeleton
											width={180}
											height={20}
											style={{ marginTop: 8, borderRadius: 4, width: "100%" }}
										/>
										<Skeleton
											width={144}
											height={20}
											style={{ marginTop: 4, borderRadius: 4, width: "80%" }}
										/>
									</View>
								)}
							/>
						) : (
							<FlatList
								data={blogs}
								numColumns={2}
								columnWrapperStyle={{ justifyContent: "space-between" }}
								contentContainerStyle={{ paddingVertical: 10 }}
								ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
								renderItem={({ item }) => (
									<Link
										href={`/search/article/${item.id}`}
										className="flex flex-col"
										style={{ width: "48%", marginBottom: 12 }}
									>
										<View>
											<Image
												source={{ uri: item.cover }}
												alt={item.attributes.title}
												style={{
													width: "100%",
													aspectRatio: 1.25,
													borderRadius: 20,
												}}
											/>

											<View>
												<P
													className="mt-2 text-left"
													numberOfLines={2}
													ellipsizeMode="tail"
												>
													{item.attributes.title}
												</P>
											</View>
										</View>
									</Link>
								)}
							/>
						)}
					</View>
				</TabsContent>

				<TabsContent value="research">
					<FlatList
						data={research}
						renderItem={({ item, index }) => (
							<TouchableOpacity
								onPress={() => handleOpenLink(item.file_url)}
								key={item.id}
								className="rounded-xl bg-muted p-4 transform transition-transform duration-500 ease-in-out hover:-translate-y-2 cursor-pointer block relative group"
							>
								<View style={{ position: "relative" }}>
									<Feather
										name="arrow-up-right"
										color={iconColor}
										style={{ position: "absolute", top: 4, right: 4 }}
									/>
									<P className="pr-6 line-clamp-5">{item.title}</P>
									<Muted className="text-secondary">
										{new Date(item.created_at).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</Muted>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={(item) => item?.id}
						contentContainerStyle={{
							flexGrow: 0,
							paddingBottom: 0,
							marginBottom: 0,
						}}
						scrollEnabled={false}
						ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
					/>
				</TabsContent>
			</Tabs>
		</View>
	);
}
