import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

import Search from "@/components/sharable/search";
import Skeleton from "@/components/sharable/skeleton";
import { H2, H4, Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { CATEGORIES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";
import { getFeaturedUsers } from "actions/admin";
import { getEntry } from "actions/blogs";
import axios from "axios";

export default function TabOneScreen() {
	const { userData, subscription, uid } = useUserProvider();
	const router = useRouter();
	const pathname = usePathname();
	const { textSecondaryColor, mutedColor } = useColorScheme();

	const [people, setPeople] = useState<any[]>([]);
	const [blogs, setBlogs] = useState<any[]>([]);
	const [loadingPeople, setLoadingPeople] = useState(false);

	useEffect(() => {
		getPeople();
		getBlogs();
	}, []);

	// show review modal if user has not reviewed the app
	useEffect(() => {
		if (
			userData &&
			uid &&
			subscription &&
			!userData?.has_reviewed_app &&
			pathname !== "/reviewModal"
		) {
			router.push("/reviewModal");
		}
	}, [userData, subscription, uid]);

	async function getBlogs() {
		try {
			try {
				const response = await axios.get(
					"https://favorable-chickens-2e4f30c189.strapiapp.com/api/articles",
				);
				const blogEntries = await Promise.all(
					response.data.data.map(async (item: any) => {
						const entry = await getEntry(item.id);
						return entry;
					}),
				);
				setBlogs(blogEntries);
			} catch (error) {
				console.error("Error fetching food data:", error);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	async function getPeople() {
		setLoadingPeople(true);
		const data = await getFeaturedUsers();

		setPeople(data || []);
		setLoadingPeople(false);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				alignItems: "center",
				paddingBottom: 60,
			}}
			showsVerticalScrollIndicator={false}
			className="flex flex-col my-4 p-4"
		>
			<H2 className="text-center max-w-xs border-none pb-0">
				Search healthy water
			</H2>

			<Muted className="text-center mb-4 max-w-md">
				Discover the best water products based on science.
			</Muted>

			<View className="mb-10 w-[90%] z-40">
				<Search />
			</View>

			<View className="flex-1 flex-col w-ful">
				<View className="flex flex-row justify-between w-full items-center">
					<H4 className="text-left">Product ratings</H4>

					<Link
						href="/(protected)/search/top-rated-all"
						className="flex flex-row items-center gap-2"
					>
						<View className="flex flex-row items-center gap-2">
							<Muted className="text-center m-0 p-0">top rankings</Muted>

							<Ionicons
								name="arrow-forward"
								size={16}
								color={textSecondaryColor}
							/>
						</View>
					</Link>
				</View>
				<FlatList
					data={CATEGORIES.sort(
						(a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0),
					)}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 8,
					}}
					className="overflow-x-scroll"
					renderItem={({ item: category }) => (
						<View className="mr-3 w-[140px] py-1 rounded-xl">
							<Link
								key={category.id}
								href={`/search/top-rated/${category.id}`}
								className="flex flex-col"
							>
								<View className="relative w-[140px] h-[140px] flex items-center justify-center rounded-xl bg-card">
									<Image
										source={{ uri: category.image }}
										alt={category.title}
										style={{
											width: "70%",
											height: "70%",
											borderRadius: 4,
										}}
									/>
									<View className="absolute bottom-0 left-0 w-full p-2">
										<P className="text-left text-md font-medium">
											{category.title}
										</P>
									</View>
								</View>
							</Link>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<View className="flex-1 w-full justify-start mt-10">
				<View className="flex flex-row justify-between w-full items-center">
					<H4 className="text-left">Featured users</H4>
					{/* <Link href="/(protected)/search/users">
						<Ionicons
							name="arrow-forward"
							size={16}
							color={textSecondaryColor}
						/>
					</Link> */}
				</View>
				{loadingPeople ? (
					<FlatList
						data={[1, 2, 3]} // Placeholder items
						horizontal
						renderItem={() => (
							<View className="mr-4">
								<Skeleton
									width={180}
									height={60}
									style={{ borderRadius: 30 }}
								/>
							</View>
						)}
						keyExtractor={(item) => item.toString()}
					/>
				) : (
					<FlatList
						data={[
							...people,
							{
								id: "create_yours",
								full_name: "Create yours",
								favorites: [],
								avatar_url: "",
							},
						]}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
						}}
						style={{ height: 80 }}
						className="overflow-x-scroll"
						renderItem={({ item: user }) =>
							user.id !== "create_yours" ? (
								<Link
									key={user.id}
									href={`/search/oasis/${user.id}`}
									className="mr-4"
								>
									<View className="flex-row items-center bg-card rounded-full p-3 pr-5">
										<View className="relative w-[40px] h-[40px] rounded-full overflow-hidden mr-4">
											<Image
												source={{
													uri: user.avatar_url,
												}}
												alt={user.full_name}
												style={{
													width: "100%",
													height: "100%",
												}}
												className="w-14 h-14"
											/>
										</View>
										<View>
											<P className="text-base font-medium">{user.full_name}</P>
											<P className="text-sm text-secondary">
												{user.favorites.length} products
											</P>
										</View>
									</View>
								</Link>
							) : (
								<Link
									key={user.id}
									href="https://www.oasiswater.app/affiliates"
									className="mr-4"
								>
									<View className="flex-row items-center bg-card rounded-full p-3 pr-5">
										<View className="relative w-[40px] h-[40px] rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center rounded-full">
											<Feather name="arrow-up-right" size={24} color="black" />
										</View>
										<View>
											<P className="text-base font-medium">Create yours</P>
											<P className="text-sm text-secondary">
												Share what you drink
											</P>
										</View>
									</View>
								</Link>
							)
						}
						keyExtractor={(item) => item.id}
					/>
				)}
			</View>

			<View className="flex-1 w-full justify-start mt-8">
				<View className="flex flex-row justify-between w-full items-center">
					<H4 className="text-left">Scientific research</H4>
					<Link href="/(protected)/research">
						<Ionicons
							name="arrow-forward"
							size={16}
							color={textSecondaryColor}
						/>
					</Link>
				</View>

				{blogs.length === 0 ? (
					<FlatList
						data={[1, 2, 3]}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							paddingHorizontal: 0,
						}}
						className="overflow-x-scroll"
						renderItem={() => (
							<Skeleton
								width={180}
								height={120}
								style={{
									borderRadius: 8,
									marginRight: 16,
								}}
							/>
						)}
						keyExtractor={(item) => item.toString()}
					/>
				) : (
					<FlatList
						data={blogs}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							paddingHorizontal: 0,
						}}
						className="overflow-x-scroll"
						renderItem={({ item }) => (
							<Link
								href={`/search/article/${item.id}`}
								className="flex flex-col mr-4"
							>
								<View style={{ width: 180 }}>
									<View
										style={{
											width: 180,
											height: 120,
											borderRadius: 8,
											overflow: "hidden",
											position: "relative",
										}}
									>
										<Image
											source={{ uri: item.cover }}
											alt={item.attributes.title}
											style={{
												width: "100%",
												height: "100%",
												borderRadius: 8,
											}}
										/>
										<View
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												right: 0,
												bottom: 0,
												backgroundColor: "rgba(0,0,0,0.3)",
												padding: 8,
												justifyContent: "flex-end",
											}}
										>
											<P
												className="text-left text-white font-bold text-sm"
												numberOfLines={3}
												ellipsizeMode="tail"
											>
												{item.attributes.title}
											</P>
										</View>
									</View>
								</View>
							</Link>
						)}
						keyExtractor={(item) => item.id}
					/>
				)}
			</View>
		</ScrollView>
	);
}
