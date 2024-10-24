import Feather from "@expo/vector-icons/Feather";
import { Avatar, AvatarImage } from "components/ui/avatar";
import { useUserProvider } from "context/user-provider";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { PROFILE_AVATAR } from "lib/constants";
import { useEffect, useState } from "react";
import { FlatList, Share, TouchableOpacity, View } from "react-native";
import useSWR from "swr";

import ItemPreviewCard from "../item-preview-card";
import Loader from "../loader";

import { getCurrentUserData, getUserFavorites } from "@/actions/user";
import Score from "@/components/sharable/score";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H3, H4, Large, Muted, P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

const WATER_TYPES = ["bottled_water", "water_gallon"];

const FILTER_TYPES = ["filter", "shower_filter", "bottle_filter"];

export default function FavoritesList({
	userId,
}: {
	userId: string | null | undefined;
}) {
	const router = useRouter();
	const { uid } = useUserProvider();
	const { iconColor } = useColorScheme();
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<any>(null);
	const [tabValue, setTabValue] = useState("all");

	const isAuthUser = userId === uid;

	const fetchUserFavorites = async () => {
		const favorites = await getUserFavorites(userId || "");
		return favorites;
	};

	const { data: favorites } = useSWR(
		`userFavorites-${userId}`,
		fetchUserFavorites,
	);

	// load user favorites
	useEffect(() => {
		if (userId) {
			fetchThisUserData(userId);
		}
	}, [userId]);

	const fetchThisUserData = async (userId: string) => {
		const userData = await getCurrentUserData(userId);
		setUserData(userData);
		setLoading(false);
	};

	useEffect(() => {
		if (userId) {
			fetchThisUserData(userId);
		}
	}, [userId, favorites]);

	const shareProfile = async () => {
		if (!userData.username) return;

		const url = `https://www.oasiswater.app/${userData.username}`;

		// TODO: setup deep linking
		// const url =
		// 	"https://apps.apple.com/us/app/oasis-water-health-ratings/id6499478532";

		try {
			const result = await Share.share({
				message: `Check out my water health score on Oasis`,
				url,
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
					console.log("Shared with activity type:", result.activityType);
				} else {
					// shared
					console.log("Profile shared");
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
				console.log("Share dismissed");
			}
		} catch (error) {
			console.error("Error sharing profile:", error);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<View className="pb-0 mb-0">
			<View className="py-4 gap-4 flex w-full flex-row justify-between">
				<View className="flex flex-col">
					<View className="flex flex-row gap-4">
						<Avatar className="h-20 w-20" alt="oasis pfp">
							<AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} />
						</Avatar>

						<View className="flex flex-col">
							<H4 className="mt-2">{`${userData?.full_name || userData?.email || "Unknown name"}`}</H4>
							<Muted className="py-0 my-0">@{userData?.username}</Muted>
							{userData?.socials && (
								<View className="flex flex-row flex-wrap gap-4 mt-1">
									{userData?.socials?.instagram && (
										<TouchableOpacity
											onPress={() =>
												Linking.openURL(userData?.socials?.instagram)
											}
										>
											<Feather name="instagram" size={16} color={iconColor} />
										</TouchableOpacity>
									)}

									{userData?.socials?.twitter && (
										<TouchableOpacity
											onPress={() =>
												Linking.openURL(userData?.socials?.twitter)
											}
										>
											<Feather name="twitter" size={16} color={iconColor} />
										</TouchableOpacity>
									)}

									{userData?.socials?.youtube && (
										<TouchableOpacity
											onPress={() =>
												Linking.openURL(userData?.socials?.youtube)
											}
										>
											<Feather name="youtube" size={16} color={iconColor} />
										</TouchableOpacity>
									)}
								</View>
							)}
						</View>
					</View>

					{userData?.bio && (
						<Muted className="py-0 my-0 max-w-72 mt-2">{userData?.bio}</Muted>
					)}
				</View>

				<View className="max-h-24 flex flex-row gap-4">
					<Score score={userData?.score || "?"} size="sm" showScore />
					{/* <TouchableOpacity onPress={() => shareProfile()}>
						<Octicons name="share" size={24} color={iconColor} />
					</TouchableOpacity> */}
				</View>
			</View>

			<View className="flex flex-col">
				{favorites && favorites?.length > 0 ? (
					<>
						<Large>Products</Large>

						<Tabs value={tabValue} onValueChange={setTabValue}>
							<TabsList>
								<TabsTrigger value="all">
									<P>All</P>
								</TabsTrigger>
								<TabsTrigger value="water">
									<P>Water</P>
								</TabsTrigger>
								<TabsTrigger value="filters">
									<P>Filters</P>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="all">
								<FlatList
									data={favorites}
									renderItem={({ item, index }) => (
										<View
											key={item?.id}
											style={{ width: "48%" }}
											className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
										>
											<ItemPreviewCard
												item={item}
												showFavorite
												isAuthUser={isAuthUser}
											/>
										</View>
									)}
									keyExtractor={(item) => item?.id}
									numColumns={2}
									showsVerticalScrollIndicator={false}
									columnWrapperStyle={{ justifyContent: "space-between" }}
									contentContainerStyle={{
										flexGrow: 0,
										paddingBottom: 0,
										marginBottom: 0,
									}}
									scrollEnabled={false}
								/>
							</TabsContent>
							<TabsContent value="water">
								<FlatList
									data={favorites?.filter((item) =>
										WATER_TYPES.includes(item.type),
									)}
									renderItem={({ item, index }) => (
										<View
											key={item?.id}
											style={{ width: "48%" }}
											className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
										>
											<ItemPreviewCard
												item={item}
												showFavorite
												isAuthUser={isAuthUser}
											/>
										</View>
									)}
									keyExtractor={(item) => item?.id}
									numColumns={2}
									showsVerticalScrollIndicator={false}
									columnWrapperStyle={{ justifyContent: "space-between" }}
									contentContainerStyle={{
										flexGrow: 0,
										paddingBottom: 0,
										marginBottom: 0,
									}}
									scrollEnabled={false}
								/>
							</TabsContent>
							<TabsContent value="filters">
								<FlatList
									data={favorites?.filter((item) =>
										FILTER_TYPES.includes(item.type),
									)}
									renderItem={({ item, index }) => (
										<View
											key={item?.id}
											style={{ width: "48%" }}
											className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
										>
											<ItemPreviewCard
												item={item}
												showFavorite
												isAuthUser={isAuthUser}
											/>
										</View>
									)}
									keyExtractor={(item) => item?.id}
									numColumns={2}
									showsVerticalScrollIndicator={false}
									columnWrapperStyle={{ justifyContent: "space-between" }}
									contentContainerStyle={{
										flexGrow: 0,
										paddingBottom: 0,
										marginBottom: 0,
									}}
									scrollEnabled={false}
								/>
							</TabsContent>
						</Tabs>
					</>
				) : (
					<View className="text-center mt-4 bg-secondary p-4 rounded-lg ">
						<H3 className="text-center">No products found</H3>
						<P className="text-center">
							Start saving products to see your health score
						</P>
						<Button
							variant="outline"
							className="mt-4"
							onPress={() => router.push("/(protected)/search")}
							label="Explore"
						/>
					</View>
				)}
			</View>
		</View>
	);
}
