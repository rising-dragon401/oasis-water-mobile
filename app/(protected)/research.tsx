import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { getResearch } from "@/actions/admin";
import Skeleton from "@/components/sharable/skeleton";
import StickyHeader from "@/components/sharable/sticky-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Large, Muted, P } from "@/components/ui/typography";
import { BlogContext } from "@/context/blogs-provider";
import { useUserProvider } from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ResearchScreen() {
	const { colorScheme, iconColor } = useColorScheme();
	const { subscription } = useUserProvider();
	const { blogs } = useContext(BlogContext);
	const router = useRouter();

	const [tabValue, setTabValue] = useState("labTesting");
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
		<View className="flex-1 justify-between px-8" style={{ backgroundColor }}>
			<StickyHeader
				title="Lab testing"
				description="Stay updated with the latest research and lab testing"
			/>

			<Tabs value={tabValue} onValueChange={setTabValue} className="mt-4">
				<TabsList className="mb-1">
					<TabsTrigger value="labTesting">
						<P
							className={`${
								tabValue === "labTesting"
									? "text-secondary-foreground"
									: "text-primary"
							}`}
						>
							Lab Testing
						</P>
					</TabsTrigger>
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

				<TabsContent value="labTesting">
					<View className="flex-col justify-start h-full mt-2">
						<Large>🚧 Coming Soon 🚧 </Large>
						<P className="mt-2">
							Track the progress of our current lab testing and vote on the
							products we should test next.
						</P>
						{/* <Large>In Progress</Large>
						<Muted>
							Our lab testing is currently in development. Check back soon!
						</Muted>

						<Large>Funding</Large>
						<Muted>Contribute to future lab testing and research.</Muted> */}
					</View>
				</TabsContent>

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

			{/* <Tabs value={tabValue} onValueChange={setTabValue} className="mt-4">
				<TabsList className="mb-1">
					<TabsTrigger value="planned">
						<P
							className={`${
								tabValue === "planned"
									? "text-secondary-foreground"
									: "text-primary"
							}`}
						>
							Planned
						</P>
					</TabsTrigger>
					<TabsTrigger value="inProgress">
						<P
							className={`${
								tabValue === "inProgress"
									? "text-secondary-foreground"
									: "text-primary"
							}`}
						>
							In Progress
						</P>
					</TabsTrigger>
					<TabsTrigger value="completed">
						<P
							className={`${
								tabValue === "completed"
									? "text-secondary-foreground"
									: "text-primary"
							}`}
						>
							Completed
						</P>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="planned">
					<View className="flex-col justify-start mt-2 ">
						<CardRow
							image="https://www.oasiswater.app/_next/image?url=https%3A%2F%2Fconnect.live-oasis.com%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fwebsite%2Fitems%2F237%2FFiuggi%2520Still%2520Water%2520.jpg&w=2048&q=75"
							title="Fiuggi"
							description="Standard testing"
						/>
					</View>
				</TabsContent>

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
			</Tabs> */}
		</View>
	);
}
