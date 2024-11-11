import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserProvider } from "context/user-provider";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { Circle } from "@/components/sharable/circle";
import Score from "@/components/sharable/score";
import StickyHeader from "@/components/sharable/sticky-header";
import { Button } from "@/components/ui/button";
import { Large, Muted, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

const healthRisks = ["Hair loss", "Dry skin", "Nausea", "Low sperm count"];

const benefits = [
	"Strong mineral content",
	"Increased energy levels",
	"Enhanced fertility",
];

export default function ProfileScreen() {
	const { userScores, tapScore } = useUserProvider();
	const { colorScheme } = useColorScheme();
	const { iconColor } = useColorScheme();
	const router = useRouter();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const handleOpenLocationModal = () => {
		router.push("/locationModal");
	};

	return (
		<ScrollView style={{ backgroundColor }}>
			<View className="flex justify-between px-8">
				<StickyHeader
					title="Profile & score"
					icon="settings"
					path="/(protected)/profile/settings"
				/>

				<View className="flex flex-col items-center mt-6">
					<Score score={userScores?.overallScore || 0} size="lg" showScore />
					<Muted>Overall score</Muted>
				</View>

				<View className="flex flex-col items-center w-full mt-6 ">
					{/* Tap water score */}
					<TouchableOpacity
						className="relative rounded-xl my-2 w-full h-32 max-h-32 overflow-hidden"
						onPress={handleOpenLocationModal}
					>
						<Image
							source={{ uri: tapScore.image }}
							style={{ width: "100%", height: "100%" }}
							alt="Tap water"
						/>

						{/* Circle with full opacity, layered above the overlay */}
						<View className="absolute top-4 right-4 z-10">
							<Circle
								value={tapScore.score}
								size={48}
								strokeWidth={3}
								textClassName={
									colorScheme !== "dark" ? "text-muted" : "text-primary"
								}
							/>
						</View>

						{/* Overlay with location name */}
						<View className="absolute inset-0 bg-black/30 flex items-center justify-center h-full w-full z-0">
							<P className="text-white text-lg font-semibold">
								{tapScore.name}
							</P>
						</View>
					</TouchableOpacity>
				</View>

				<View className="flex flex-row items-start w-full  justify-between gap-4">
					<View className="mt-6 flex-1 flex-col gap-4 rounded-xl p-4 bg-muted">
						<Large>Health risks</Large>
						<View className="flex flex-col gap-2">
							{healthRisks.map((risk) => (
								<View key={risk} className="flex flex-row gap-2">
									<View className="w-4 h-4 bg-red-500 rounded-full" />
									<P>{risk}</P>
								</View>
							))}
						</View>
					</View>

					<View className="mt-6 flex-1 flex-col gap-4 rounded-xl p-4 bg-muted">
						<Large>Benefits</Large>
						<View className="flex flex-col gap-2">
							{benefits.map((benefit) => (
								<View key={benefit} className="flex flex-row gap-2">
									<View className="w-4 h-4 bg-green-500 rounded-full" />
									<P>{benefit}</P>
								</View>
							))}
						</View>
					</View>
				</View>

				<View className="mt-6">
					<Button
						variant="outline"
						onPress={() => router.push("/(protected)/search/top-rated-all")}
						label="Explore top rated"
						icon={<Ionicons name="arrow-forward" size={20} color={iconColor} />}
					/>
				</View>
			</View>
		</ScrollView>
	);
}
