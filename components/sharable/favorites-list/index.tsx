import { getCurrentUserData, getUserFavorites } from "@/actions/user";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { default as useSWR } from "swr";

import ItemPreviewCard from "../item-preview-card";

import Score from "@/components/sharable/score";

import { Avatar, AvatarImage } from "components/ui/avatar";
import Typography from "../typography";

import { PROFILE_AVATAR } from "lib/constants";

export default function FavoritesList({
	userId,
}: {
	userId: string | null | undefined;
}) {
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState<any>(null);
	const [oasisScore, setOasisScore] = useState<number | null>(null);

	const fetchUserFavorites = async () => {
		const favorites = await getUserFavorites(userId || "");
		return favorites;
	};

	const { data: favorites } = useSWR("userFavorites", fetchUserFavorites);

	// calculate oasis score
	useEffect(() => {
		if (favorites) {
			calculateScore(favorites);
		}
	}, [favorites]);

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

	const calculateScore = async (favorites: any[]) => {
		let totalCount = 0;
		let totalScore = 0;

		await favorites.map((fav: any) => {
			totalScore += fav.score || 0;
			totalCount += 1;
		});

		const finalScore = Math.round(totalScore / totalCount);
		setOasisScore(finalScore);
	};

	return (
		<View className="pb-8">
			{!loading && (
				<View className="py-4 gap-4 flex w-full flex-row justify-between">
					<View className="flex flex-col gap-2 mb-8">
						<Avatar className="h-24 w-24" alt="oasis pfp">
							<AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} />
						</Avatar>

						<Typography size="2xl" fontWeight="normal">
							{`${userData?.full_name || userData?.email || "User"}'s oasis`}
						</Typography>
					</View>

					<View className="max-h-24">
						<Score score={oasisScore || 0} size="md" />
					</View>
				</View>
			)}

			<FlatList
				data={favorites}
				renderItem={({ item }) => (
					<View key={item.id} style={{ width: "48%" }} className="mb-24">
						<ItemPreviewCard item={item} size="md" showFavorite />
					</View>
				)}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={{ justifyContent: "space-between" }}
			/>
		</View>
	);
}
