import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Share, TouchableOpacity, View } from "react-native";

import { getCurrentUserData, getUserFavorites } from "@/actions/user";
import Score from "@/components/sharable/score";
import { Button } from "@/components/ui/button";
import { H3, H4, Large, Muted, P } from "@/components/ui/typography";
import { Avatar, AvatarImage } from "components/ui/avatar";
import { PROFILE_AVATAR } from "lib/constants";
import useSWR from "swr";
import ItemPreviewCard from "../item-preview-card";
import Loader from "../loader";

export default function FavoritesList({
	userId,
}: {
	userId: string | null | undefined;
}) {
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<any>(null);

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
			<View className="py-4 gap-4 mb-4 flex w-full flex-row justify-between">
				<View className="flex flex-col">
					<Avatar className="h-24 w-24" alt="oasis pfp">
						<AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} />
					</Avatar>

					<H4 className="mt-2">{`${userData?.full_name || userData?.email || "Unknown name"}`}</H4>
					<Muted className="py-0 my-0">@{userData?.username}</Muted>

					{userData?.bio && (
						<Muted className="py-0 my-0">{userData?.bio}</Muted>
					)}
				</View>

				<View className="max-h-24 flex flex-row gap-4">
					<Score score={userData?.score || "?"} size="sm" showScore />
					<TouchableOpacity onPress={() => shareProfile()}>
						<Octicons name="share" size={24} color="muted" />
					</TouchableOpacity>
				</View>
			</View>

			<View className="flex flex-col">
				<Large>Products</Large>
				{favorites && favorites?.length > 0 ? (
					<>
						<FlatList
							data={favorites}
							renderItem={({ item, index }) => (
								<View
									key={item?.id}
									style={{ width: "48%" }}
									className={`mb-2 ${index < 2 ? "mt-2" : ""}`}
								>
									<ItemPreviewCard item={item} size="md" showFavorite />
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
					</>
				) : (
					<View className="text-center mt-10">
						<H3 className="text-center">No products found</H3>
						<P className="text-center">
							Start saving products to your Oasis account to see your health
							score
						</P>
						<Button
							variant="outline"
							className="mt-4"
							onPress={() => router.push("/(protected)/search")}
							label="Search products"
						/>
					</View>
				)}
			</View>
		</View>
	);
}
