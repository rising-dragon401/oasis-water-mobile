import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import UserHeader from "@/components/sharable/oasis-page/components/user-header";
import ScoreCard from "@/components/sharable/score-card";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreModal() {
	const { tapScore, userScores, userData, uid, userFavorites } =
		useUserProvider();
	const { iconColor } = useColorScheme();
	const router = useRouter();

	const handleExploreProducts = () => {
		router.back();
		// router.push("/(protected)/search/top-rated-all");
	};

	const handleOverallPress = () => {
		router.back();
		if (uid) {
			router.push("/(protected)/profile");
		} else {
			router.push("/(public)/sign-up");
		}
	};

	const handleTapWaterPress = () => {
		if (!uid) {
			router.back();
			router.push("/(public)/sign-up");
			return;
		}

		router.back();
		if (userData?.tap_location_id) {
			router.push(`/search/location/${userData?.tap_location_id}`);
		} else {
			router.push("/locationModal");
		}
	};

	const handleBottledWaterPress = () => {
		if (!uid) {
			router.back();
			router.push("/(public)/sign-up");
			return;
		}

		router.back();
		// @ts-ignore
		router.push("/(protected)/oasis?tab=waters");
	};

	const handleWaterFilterPress = () => {
		if (!uid) {
			router.back();
			router.push("/(public)/sign-up");
			return;
		}

		router.back();
		// @ts-ignore
		router.push("/(protected)/oasis?tab=filters");
	};

	const handleShowerFilterPress = () => {
		if (!uid) {
			router.back();
			router.push("/(public)/sign-up");
			return;
		}
		router.back();
		// @ts-ignore
		router.push("/(protected)/oasis?tab=filters");
	};

	const renderGuideButtons = () => {
		if (!uid) {
			return (
				<View className="flex flex-col gap-y-2">
					<Button
						label="Login to get your score"
						onPress={() => router.push("/(public)/sign-in")}
					/>
				</View>
			);
		} else if (!userData?.tap_location_id || !userFavorites?.length) {
			return (
				<View className="flex flex-col gap-y-2">
					<Muted>Getting started:</Muted>
					{!userData?.tap_location_id && (
						<Button
							label="Sync location to get tap scores"
							onPress={() => router.push("/locationModal")}
						/>
					)}

					{!userFavorites?.length && (
						<Button
							label="Add waters and filters to see your scores"
							variant="outline"
							onPress={handleExploreProducts}
						/>
					)}
				</View>
			);
		}
	};

	return (
		<ScrollView>
			<View className="flex flex-col pt-4 pb-10 h-full px-8">
				<View className="flex flex-col items-start mb-4">
					<UserHeader
						profileData={userData}
						showSocials={false}
						showScore={false}
						showBio={false}
					/>
					<H1 className="mb-4">Scores</H1>

					{renderGuideButtons()}
				</View>

				<View className="flex flex-col gap-y-4 max-w-md">
					<ScoreCard
						title="Overall"
						description=""
						score={userScores?.overallScore?.score || 0}
						onPress={handleOverallPress}
						type="square"
					/>

					<View className="flex flex-row justify-between gap-x-4">
						<ScoreCard
							title="Tap water"
							description="Based on your location"
							score={tapScore?.score || 0}
							onPress={handleTapWaterPress}
							type="square"
							healthEffects={tapScore?.health_effects}
						/>

						<ScoreCard
							title="Bottled water"
							description="Based on your waters"
							score={userScores?.bottledWaterScore || 0}
							onPress={handleBottledWaterPress}
							type="square"
							healthEffects={tapScore?.health_effects}
						/>
					</View>

					<ScoreCard
						title="Water filter"
						description="Based on your tap water and sink / home filter"
						score={userScores?.waterFilterScore || 0}
						onPress={handleWaterFilterPress}
						type="small_row"
						icon={<Ionicons name="water-outline" size={24} color={iconColor} />}
					/>

					<ScoreCard
						title="Shower filter"
						description="Based on your tap water and shower"
						score={userScores?.showersScore || 0}
						onPress={handleShowerFilterPress}
						type="small_row"
						icon={<FontAwesome6 name="shower" size={24} color={iconColor} />}
					/>
				</View>

				<Button
					className="mt-8"
					variant="outline"
					label="Explore waters and filters"
					icon={<Ionicons name="arrow-forward" size={20} color={iconColor} />}
					onPress={handleExploreProducts}
				/>
			</View>
		</ScrollView>
	);
}
