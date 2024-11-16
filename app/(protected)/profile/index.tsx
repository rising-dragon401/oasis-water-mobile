import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import ProfileHeader from "@/components/sharable/profile-header";
import ProfileScores from "@/components/sharable/profile-scores";
import StickyHeader from "@/components/sharable/sticky-header";
import { Button } from "@/components/ui/button";
import { Muted, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileScreen() {
	const { userScores, userData, subscription, tapScore, userFavorites } =
		useUserProvider();
	const { colorScheme } = useColorScheme();
	const { iconColor } = useColorScheme();
	const router = useRouter();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const score = userScores?.overallScore || 0;

	const userHasFavorites = userFavorites && userFavorites.length > 0;

	const userHasTapScore = tapScore && tapScore.id;

	return (
		<ScrollView
			style={{ backgroundColor }}
			contentContainerStyle={{ paddingBottom: 100 }}
		>
			<View className=" px-8">
				<StickyHeader
					title="Profile"
					icon="settings"
					path="/(protected)/profile/settings"
				/>

				<View className="flex flex-col justify-center items-center py-2 mt-2">
					<ProfileHeader
						profileData={userData}
						score={score}
						subscription={subscription}
					/>
				</View>

				{userHasTapScore || userHasFavorites ? (
					<View className="my-8 w-full">
						<ProfileScores userScores={userScores} />
					</View>
				) : (
					<View className="mt-6 py-6 px-8  flex flex-col border border-border rounded-lg p-4 bg-card">
						<P className="text-xl">Find out what's lurking in your water</P>
						<Muted className="text-sm">
							Add your tap score, bottled waters and filters to see whats in
							your water
						</Muted>

						<View className="flex flex-col gap-2 my-4 w-full">
							<View className="flex flex-row items-center gap-2">
								<Ionicons name="skull-outline" size={20} color={iconColor} />
								<P className=" text-xl">Contaminants</P>
							</View>
							<View className="flex flex-row items-center gap-2">
								<Ionicons name="warning-outline" size={20} color={iconColor} />
								<P className="text-xl">Health risks</P>
							</View>
							<View className="flex flex-row items-center gap-2">
								<Ionicons name="leaf-outline" size={20} color={iconColor} />
								<P className="text-xl">Benefits</P>
							</View>
						</View>

						<Button
							variant="default"
							onPress={() => router.push("/(protected)/saved")}
							label="Add products and tap water"
							className="mt-232"
						/>
					</View>
				)}
			</View>
		</ScrollView>
	);
}
