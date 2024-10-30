import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getFeaturedUsers } from "actions/admin";
import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

import LocationCard from "@/components/sharable/location-card";
import Search from "@/components/sharable/search";
import Skeleton from "@/components/sharable/skeleton";
import { H2, H4, Muted, P } from "@/components/ui/typography";
import { BlogContext } from "@/context/blogs-provider";
import { useUserProvider } from "@/context/user-provider";
import { CATEGORIES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";

const FEATURED_LOCATIONS = [
	{
		id: "California",
		name: "California",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/california.jpg?t=2024-10-16T21%3A16%3A45.884Z",
		score: 18,
	},
	{
		id: "New York",
		name: "New York",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/new_york.jpg?t=2024-10-16T21%3A37%3A24.980Z",
		score: 14,
	},
	{
		id: "Florida",
		name: "Florida",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/florida.jpg?t=2024-10-16T21%3A42%3A04.239Z",
		score: 22,
	},
	{
		id: "Washington",
		name: "Washington",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/washington.jpg?t=2024-10-16T21%3A48%3A53.558Z",
		score: 15,
	},
	{
		id: "Texas",
		name: "Texas",
		image:
			"https://connect.live-oasis.com/storage/v1/object/public/website/images/locations/texas.jpg?t=2024-10-16T21%3A50%3A33.613Z",
		score: 11,
	},
];

export default function TabOneScreen() {
	const { userData, subscription, uid, refreshUserData } = useUserProvider();
	const router = useRouter();
	const pathname = usePathname();
	const { textSecondaryColor } = useColorScheme();
	const { blogs } = useContext(BlogContext);

	const [people, setPeople] = useState<any[]>([]);
	const [loadingPeople, setLoadingPeople] = useState(false);
	const [searchInputActive, setSearchInputActive] = useState(false);

	useEffect(() => {
		getPeople();
		// manually refresh user data to be safe
		refreshUserData();
	}, []);

	// show review modal if user has not reviewed the app
	useEffect(() => {
		if (
			userData &&
			uid &&
			subscription &&
			!userData?.has_reviewed_app &&
			pathname !== "/reviewModal" &&
			userData?.is_onboarded
		) {
			router.push("/reviewModal");
		}
	}, [userData, subscription, uid]);

	async function getPeople() {
		setLoadingPeople(true);
		const data = await getFeaturedUsers();

		setPeople(data || []);
		setLoadingPeople(false);
	}

	function handleCreateYourOwn() {
		if (userData) {
			router.push(`/search/oasis/${userData.id}`);
		} else {
			router.push("/sign-in");
		}
	}

	const sections = [
		{
			key: "topWaters",
			render: () => (
				<View className="flex-col w-full mb-10 z-10">
					<View className="flex flex-row justify-between w-full items-center">
						<H4 className="text-left">Top waters and filters</H4>
						<Link
							href="/(protected)/search/top-rated-all"
							className="flex flex-row items-center gap-2"
						>
							<View className="flex flex-row items-center gap-2">
								<Muted className="text-center m-0 p-0">all categories</Muted>
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
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							height: "100%",
						}}
						className="overflow-x-scroll flex"
						renderItem={({ item: category, index }) => (
							<View className="mr-3 w-[120px] py-1 rounded-xl">
								<Link
									key={category.id + index.toString()}
									href={`/search/top-rated/${category.typeId}?tags=${category.tags}`}
									className="flex flex-col"
								>
									<View className="relative w-[120px] h-[120px] flex items-center justify-center rounded-xl bg-card">
										<Image
											source={{ uri: category.image }}
											alt={category.title}
											style={{
												width: "60%",
												height: "60%",
												borderRadius: 4,
											}}
											className="mb-4"
										/>
										<View className="absolute bottom-0 left-0 w-full p-2 pb-2 mt-4">
											<P className="text-center text-base">{category.title}</P>
										</View>
									</View>
								</Link>
							</View>
						)}
						keyExtractor={(item) => item.id}
					/>
				</View>
			),
		},
		{
			key: "featuredLocations",
			render: () => (
				<View className=" flex-col w-full mb-10">
					<View className="flex flex-row justify-between w-full items-center">
						<H4 className="text-left">Tap water ratings</H4>
						<Link
							href="/(protected)/search/locations"
							className="flex flex-row items-center gap-2"
						>
							<View className="flex flex-row items-center gap-2">
								<Muted className="text-center m-0 p-0">all locations</Muted>
								<Ionicons
									name="arrow-forward"
									size={16}
									color={textSecondaryColor}
								/>
							</View>
						</Link>
					</View>
					<FlatList
						data={FEATURED_LOCATIONS}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							maxHeight: 100,
						}}
						className="overflow-x-scroll"
						renderItem={({ item: location }) => (
							<View className="mr-4">
								<Link href={`/search/locations/state/${location.id}`}>
									<LocationCard location={location} />
								</Link>
							</View>
						)}
						keyExtractor={(item) => item.id}
					/>
				</View>
			),
		},
		{
			key: "whatOthersAreDrinking",
			render: () => (
				<View className=" w-full justify-start mb-6">
					<View className="flex flex-row justify-between w-full items-center">
						<H4 className="text-left">What others are drinking</H4>
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
												<P className="text-base font-medium">
													{user.full_name}
												</P>
												<P className="text-sm text-secondary">
													{user.favorites.length} products
												</P>
											</View>
										</View>
									</Link>
								) : (
									<TouchableOpacity
										key={user.id}
										onPress={handleCreateYourOwn}
										className="mr-4"
									>
										<View className="flex-row items-center bg-card rounded-full p-3 pr-5">
											<View className="relative w-[40px] h-[40px] rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center rounded-full">
												<Feather
													name="arrow-up-right"
													size={24}
													color="black"
												/>
											</View>
											<View>
												<P className="text-base font-medium">Create yours</P>
												<P className="text-sm text-secondary">
													Share what you drink
												</P>
											</View>
										</View>
									</TouchableOpacity>
								)
							}
							keyExtractor={(item) => item.id}
						/>
					)}
				</View>
			),
		},
		{
			key: "newsAndResearch",
			render: () => (
				<View className="w-full justify-start mb-6">
					<View className="flex flex-row justify-between w-full items-center">
						<H4 className="text-left">News and research</H4>
						<Link
							href="/(protected)/research"
							className="flex flex-row items-center gap-2"
						>
							<View className="flex flex-row items-center gap-2">
								<Muted className="text-center m-0 p-0">all research</Muted>
								<Ionicons
									name="arrow-forward"
									size={16}
									color={textSecondaryColor}
								/>
							</View>
						</Link>
					</View>

					{blogs.length === 0 ? (
						<FlatList
							data={[1, 2, 3]}
							horizontal
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
							horizontal
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
			),
		},
	];

	return (
		<View>
			<View className="flex justify-center items-center mt-4 z-10">
				<H2 className="text-center max-w-xs border-none pb-0">
					What's in your water?
				</H2>

				<Muted className="text-center mb-4 max-w-md">
					90% of water contains toxins most filters don't remove them
				</Muted>

				<View className="w-[90%] z-50">
					<Search setActive={setSearchInputActive} />
				</View>
			</View>

			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					paddingBottom: 180,
					zIndex: 0,
				}}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				className="flex flex-col p-4 px-4 mt-4 z-0"
			>
				{sections.map((section) => (
					<View key={section.key}>{section.render()}</View>
				))}
			</ScrollView>
		</View>
	);
}
