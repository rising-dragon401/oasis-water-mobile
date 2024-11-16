import Ionicons from "@expo/vector-icons/Ionicons";
import { getFeaturedUsers } from "actions/admin";
import { Image } from "expo-image";
import { Link, usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
	FlatList,
	ImageBackground,
	TouchableOpacity,
	View,
} from "react-native";

import {
	getCategoryCounts,
	getMostRecentlyUpdatedItems,
} from "@/actions/admin";
import RecsBg from "@/assets/recs-bg.png";
import LocationCard from "@/components/cards/location-card";
import ItemPreviewCard from "@/components/sharable/item-preview-card";
import Search from "@/components/sharable/search";
import Skeleton from "@/components/sharable/skeleton";
import { H4, Muted, P, Small } from "@/components/ui/typography";
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
	const { userData, subscription, uid } = useUserProvider();
	const router = useRouter();
	const pathname = usePathname();
	const { textSecondaryColor, mutedColor } = useColorScheme();
	const { blogs } = useContext(BlogContext);

	const [people, setPeople] = useState<any[]>([]);
	const [loadingPeople, setLoadingPeople] = useState(false);
	const [searchInputActive, setSearchInputActive] = useState(false);
	const [loadingCategoryData, setLoadingCategoryData] = useState(true);
	const [categoryData, setCategoryData] = useState<any[]>([]);
	const [recentlyUpdatedItems, setRecentlyUpdatedItems] = useState<any[]>([]);
	const [loadingRecents, setLoadingRecents] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([
				getRecentlyUpdatedItems(),
				getPeople(),
				// refreshUserData(),
			]);

			const categoryCounts = await getCategoryCounts();
			if (categoryCounts) {
				setCategoryData(categoryCounts);
			} else {
				setCategoryData(CATEGORIES);
			}
			setLoadingCategoryData(false);

			setLoadingRecents(false);
		};
		fetchData();
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

	async function getRecentlyUpdatedItems() {
		const data = await getMostRecentlyUpdatedItems();
		setRecentlyUpdatedItems(data || []);
	}

	function handleCreateYourOwn() {
		if (userData) {
			router.push(`/search/oasis/${userData.id}`);
		} else {
			router.push("/sign-in");
		}
	}

	const handleTapWaterPress = () => {
		if (uid && userData?.tap_location_id) {
			router.push(`/search/location/${userData?.location?.city}`);
		} else if (uid) {
			router.push("/locationModal");
		} else {
			router.push("/(public)/sign-up");
		}
	};

	const sections = [
		{
			key: "recommended",
			show: false,
			render: () => (
				<ImageBackground
					source={RecsBg}
					style={{
						width: "100%",
						height: 120,
						borderRadius: 12,
						overflow: "hidden",
					}}
					className="mt-6"
					resizeMode="cover"
				>
					<TouchableOpacity
						className="flex flex-row items-center justify-between border border-accent rounded-xl px-6 py-2 overflow-hidden h-36 w-full bg-accent/20"
						onPress={() => {
							// @ts-ignore
							router.push(`/oasis?tab=for_you`);
						}}
						style={{
							width: "100%",
							height: "100%",
						}}
					>
						<View className="flex flex-col items-start gap-1 z-10">
							<P className="text-xl text-background">Recommended for you</P>
							<Muted className="text-stone-300 max-w-[60vw]">
								Waters and filters for you based on your location and
								preferences
							</Muted>
						</View>

						<View className="flex flex-col justify-end items-end h-full pb-4">
							<Ionicons
								name="arrow-forward"
								size={18}
								color="rgb(214 211 209)"
							/>
						</View>
					</TouchableOpacity>
				</ImageBackground>
			),
		},
		{
			key: "mostRecent",
			show: true,
			render: () => (
				<View className="flex-col w-full z-10 mt-6">
					<View className="flex flex-row justify-between w-full items-center mb-2">
						<H4 className="text-left">Recently tested</H4>
						<Link
							href="/(protected)/research"
							className="flex flex-row items-center gap-2"
						>
							<Muted className="text-center m-0 p-0">see all</Muted>
						</Link>
					</View>
					<View className="">
						{loadingRecents ? (
							<FlatList
								data={[1, 2, 3, 4, 5, 6]} // Placeholder items
								horizontal
								renderItem={() => (
									<View className="mr-4">
										<Skeleton
											width={120}
											height={120}
											style={{ borderRadius: 14 }}
										/>
									</View>
								)}
								keyExtractor={(item) => item.toString()}
							/>
						) : (
							<FlatList
								data={recentlyUpdatedItems}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{
									height: "100%",
								}}
								className="gap-4"
								renderItem={({ item }) => (
									<View className="mr-4 w-40">
										<ItemPreviewCard
											item={item}
											showFavorite={false}
											isAuthUser={false}
											isGeneralListing
											imageHeight={80}
											variation="square"
										/>
									</View>
								)}
								keyExtractor={(item) => item.id}
							/>
						)}
					</View>
				</View>
			),
		},
		{
			key: "featuredLocations",
			show: false,
			render: () => (
				<View className=" flex-col w-full mt-4">
					<View className="flex flex-row justify-between w-full items-end mb-2">
						<H4 className="text-left font-medium">Tap water quality</H4>
						<Link
							href="/(protected)/search/locations"
							className="flex flex-row items-center gap-2"
						>
							<Muted className="text-right m-0 p-0">see all</Muted>
						</Link>
					</View>
					<FlatList
						data={[...FEATURED_LOCATIONS]}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 8,
							maxHeight: 100,
						}}
						className="overflow-x-scroll"
						renderItem={({ item: location }) => (
							<View className="mr-4 w-44">
								<Link href={`/search/locations/state/${location.id}`}>
									<LocationCard location={location} size="sm" />
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
			show: false,
			render: () => (
				<View className="flex w-full justify-start mt-6 min-w-full">
					<View className="flex flex-row justify-between w-full items-center mb-2">
						<H4 className="text-left font-medium">What others are drinking</H4>
						<Link href="/(protected)/search/community">
							<Ionicons
								name="arrow-forward"
								size={16}
								color={textSecondaryColor}
							/>
						</Link>
					</View>
					{loadingPeople ? (
						<FlatList
							data={[1, 2, 3]} // Placeholder items
							horizontal
							renderItem={() => (
								<View className="mr-4">
									<Skeleton
										width={80}
										height={80}
										style={{ borderRadius: 99 }}
									/>
								</View>
							)}
							keyExtractor={(item) => item.toString()}
						/>
					) : (
						<FlatList
							data={[...people]}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								paddingTop: 8,
								paddingLeft: 0,
							}}
							style={{ height: 100 }}
							className="overflow-x-scroll"
							renderItem={({ item: user }) => (
								<Link
									key={user.id}
									href={`/search/oasis/${user.id}`}
									className="mr-10"
								>
									<View className="flex-col items-center justify-center rounded-full gap-2">
										<View className="w-20 h-20 rounded-full overflow-hidden">
											<Image
												source={{
													uri: user.avatar_url,
												}}
												alt={user.full_name}
												style={{
													width: "100%",
													height: "100%",
												}}
												className="w-14 h-14 rounded-full"
											/>
										</View>
										<View>
											<Small className="max-w-20 text-center">
												{user.full_name}
											</Small>
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
		{
			key: "newsAndResearch",
			show: true,
			render: () => (
				<View className="w-full justify-start mt-6">
					<View className="flex flex-row justify-between w-full items-center mb-2">
						<H4 className="text-left">News and research</H4>
						<Link
							href="/(protected)/search/articles"
							className="flex flex-row items-center gap-2"
						>
							<Muted className="m-0 p-0">see all</Muted>
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
									<View style={{ width: 160 }}>
										<View
											style={{
												width: 160,
												height: 100,
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
													className="text-left text-white  text-sm"
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
		{
			key: "categories",
			render: () => (
				<View className="flex-1 flex-col w-full mt-6 z-10 min-w-full">
					<View className="flex flex-row justify-between w-full items-center mb-2">
						<H4 className="text-left">Top rated</H4>
						<Link
							href="/(protected)/search/top-rated-all"
							className="flex flex-row items-center gap-2"
						>
							<Muted className="m-0 p-0">see all</Muted>
						</Link>
					</View>

					{loadingCategoryData ? (
						<View className="flex flex-col gap-4 w-full">
							<FlatList
								data={[1, 2, 3, 4, 5, 6]}
								renderItem={() => (
									<View className="mb-3 w-full">
										<Skeleton
											width="100%"
											height={56}
											style={{ borderRadius: 12 }}
										/>
									</View>
								)}
								keyExtractor={(item) => item.toString()}
							/>
						</View>
					) : (
						<View className="flex flex-col gap-4 w-full bg-card rounded-xl border border-border">
							<FlatList
								data={categoryData.sort(
									(a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0),
								)}
								keyExtractor={(item, index) => item.id + index.toString()}
								renderItem={({ item: category }) => (
									<View
										className="flex justify-center rounded-2xl border-b border-muted"
										style={{ maxHeight: 60, width: "100%" }}
									>
										<Link href={`/search/top-rated/${category.id}`}>
											<View className="flex flex-row items-center px-4 justify-between w-full">
												<View className="flex flex-row items-center gap-4">
													<View className="rounded-full overflow-hidden ">
														<Image
															source={{ uri: category.image }}
															alt={category.title}
															style={{
																width: 36,
																height: 36,
															}}
															contentFit="cover"
														/>
													</View>
													<View className="flex flex-col gap-1 h-full">
														<P className=" text-xl">{category.title}</P>
													</View>
												</View>
												<View className="flex flex-col justify-end items-center gap-2 h-full mr-2">
													<Ionicons
														name="chevron-forward"
														size={18}
														color={mutedColor}
													/>
													<View className="h-3" />
												</View>
											</View>
										</Link>
									</View>
								)}
							/>
						</View>
					)}
				</View>
			),
		},
	];

	return (
		<View className="px-6">
			<View className="flex justify-center items-center mt-4 mb-2 z-10">
				{/* <View className="w-full flex justify-start">
					<H3 className="text-left max-w-xs border-none pb-0">
						What are you drinking?
					</H3>
				</View> */}

				<View className="z-50 mt-2">
					<Search setActive={setSearchInputActive} />
				</View>
			</View>
			{/* 
			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					paddingBottom: 180,
					zIndex: 0,
				}}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				className="flex flex-col z-0"
			>
				{sections.map(
					(section) =>
						section.show !== false && (
							<View key={section.key} style={{ marginBottom: 10 }}>
								{section.render()}
							</View>
						),
				)}
			</ScrollView> */}
			<FlatList
				data={sections}
				renderItem={({ item: section }) =>
					section.show !== false ? (
						<View key={section.key} style={{ marginBottom: 10 }}>
							{section.render()}
						</View>
					) : null
				}
				keyExtractor={(item) => item.key}
				contentContainerStyle={{
					alignItems: "center",
					paddingBottom: 180,
					zIndex: 0,
				}}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				className="flex flex-col z-0"
			/>
		</View>
	);
}
