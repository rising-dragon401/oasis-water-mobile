import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import ProfileHeader from "@/components/sharable/oasis-page/components/profile-header";
import ScoreCard from "@/components/sharable/score-card";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ScoreModal() {
	const { tapScore, userScores, userData } = useUserProvider();
	const { iconColor } = useColorScheme();
	const router = useRouter();

	return (
		<ScrollView>
			<View className="flex flex-col py-10 h-full px-8">
				<ProfileHeader profileData={userData} showSocials={false} />
				<View className="flex  flex-col gap-y-4 max-w-md">
					<ScoreCard
						title="Overall"
						description=""
						score={userScores?.overallScore?.score || 0}
						onPress={() => {
							// setTabValue("saved");
						}}
						type="square"
					/>

					<View className="flex flex-row justify-between gap-x-4">
						<ScoreCard
							title="Tap water"
							description="Based on your location"
							score={tapScore?.score || 0}
							onPress={() => {
								if (tapScore?.score > 0) {
									router.push(`/search/location/${tapScore?.id}`);
								} else {
									router.push("/locationModal");
								}
							}}
							type="square"
							healthEffects={tapScore?.health_effects}
						/>

						<ScoreCard
							title="Bottled water"
							description="Based on your waters"
							score={userScores?.bottledWaterScore || 0}
							onPress={() => {}}
							type="square"
							healthEffects={tapScore?.health_effects}
						/>
					</View>

					<ScoreCard
						title="Water filter"
						description="Based on your tap water and sink / home filter"
						score={userScores?.waterFilterScore || 0}
						onPress={() => {}}
						type="small_row"
						icon={<Ionicons name="water-outline" size={24} color={iconColor} />}
					/>

					<ScoreCard
						title="Shower filter"
						description="Based on your tap water and shower"
						score={userScores?.showersScore || 0}
						onPress={() => {}}
						type="small_row"
						icon={<FontAwesome6 name="shower" size={24} color={iconColor} />}
					/>
				</View>
			</View>
		</ScrollView>
	);
}
