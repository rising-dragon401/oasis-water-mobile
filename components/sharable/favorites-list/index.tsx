import { Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Share, TouchableOpacity, View } from "react-native";

import { getCurrentUserData, getUserFavorites } from "@/actions/user";
import Score from "@/components/sharable/score";
import { H3, H4, Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { Avatar, AvatarImage } from "components/ui/avatar";
import { PROFILE_AVATAR } from "lib/constants";
import { default as useSWR } from "swr";
import ItemPreviewCard from "../item-preview-card";
import Loader from "../loader";

export default function FavoritesList({
	userId,
}: {
	userId: string | null | undefined;
}) {
	const { uid } = useUserProvider();

	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<any>(null);

	const isAuthUser = uid === userId;

	const fetchUserFavorites = async () => {
		const favorites = await getUserFavorites(userId || "");
		return favorites;
	};

	const { data: favorites } = useSWR("userFavorites", fetchUserFavorites);

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

	const shareProfile = async () => {
		// deep linking now redirecting to mobile for some reason
		// const url = `https://www.live-oasis.com/search/oasis/${userId}`;

		const url =
			"https://apps.apple.com/us/app/oasis-water-health-ratings/id6499478532";

		try {
			const result = await Share.share({
				message: `Check out my water health score on Oasis. Download and search for 👉 ${userData?.full_name}.`,
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
		<View className="pb-8 px-4">
			<View className="py-4 gap-4 mb-4 flex w-full flex-row justify-between">
				<View className="flex flex-col gap-2 mb-8">
					<Avatar className="h-36 w-36" alt="oasis pfp">
						<AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} />
					</Avatar>

					<H4>
						{`${userData?.full_name || userData?.email || "User"}'s Oasis`}
					</H4>
					{userData?.bio && <Muted>{userData?.bio}</Muted>}
				</View>

				<View className="max-h-24 flex flex-row">
					<Score score={userData.score || 0} size="md" showScore />
					<TouchableOpacity onPress={() => shareProfile()}>
						<Octicons name="share" size={24} color="muted" />
					</TouchableOpacity>
				</View>
			</View>

			{favorites && favorites.length > 0 ? (
				<FlatList
					data={favorites}
					renderItem={({ item }) => (
						<View key={item.id} style={{ width: "48%" }} className="mb-14">
							<ItemPreviewCard item={item} size="md" showFavorite />
						</View>
					)}
					keyExtractor={(item) => item.id}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					columnWrapperStyle={{ justifyContent: "space-between" }}
				/>
			) : (
				<View className="text-center">
					<H3>No favorites found</H3>
					<P>
						Start adding the products you use to your Oasis for them to show up
						here.
					</P>
				</View>
			)}
		</View>
	);
}
