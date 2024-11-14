import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserProvider } from "context/user-provider";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

import ProfileHeader from "@/components/sharable/profile-header";
import StickyHeader from "@/components/sharable/sticky-header";
import { Button } from "@/components/ui/button";
import { Muted, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileScreen() {
	const { userScores, userData, subscription, tapScore, userFavorites } =
		useUserProvider();
	const { colorScheme } = useColorScheme();
	const { iconColor, mutedForegroundColor } = useColorScheme();
	const router = useRouter();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	const score = userScores?.overallScore || 0;

	const blurryBadge = (name: string, type: string) => {
		const color =
			type === "harm"
				? "rgba(255, 0, 0, 0.2)"
				: type === "benefit"
					? "rgba(0, 128, 0, 0.2)" // Darker emerald green
					: "rgba(255, 255, 0, 0.2)";

		return (
			<TouchableOpacity onPress={() => router.push("/subscribeModal")}>
				<P className="text-sm px-2 py-1">{name}</P>

				<BlurView
					intensity={14}
					tint="regular"
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						right: 0,
						bottom: 20,
						borderRadius: 16,
						height: "100%",
						paddingHorizontal: 8,
						paddingVertical: 4,
						overflow: "hidden",
						backgroundColor: color,
					}}
				/>
			</TouchableOpacity>
		);
	};

	const itemBadge = (name: string, type: string) => {
		if (subscription) {
			const bgColor =
				type === "harm"
					? "bg-red-200"
					: type === "benefit"
						? "bg-emerald-200"
						: "bg-amber-200";
			return (
				<View
					key={name}
					className={`flex flex-row gap-2 rounded-full px-2 py-1 ${bgColor}`}
				>
					<P className="text-sm">{name}</P>
				</View>
			);
		} else {
			return blurryBadge(name, type);
		}
	};

	const renderAmount = (amount: number) => {
		return <P className="text-2xl">{amount}</P>;
		// if (subscription) {
		// 	return <P className="text-2xl">{amount}</P>;
		// } else {
		// 	return (
		// 		<TouchableOpacity
		// 			className="flex flex-row items-center justify-center gap-2 "
		// 			onPress={() => router.push("/subscribeModal")}
		// 		>
		// 			<Ionicons name="lock-closed-outline" size={20} color={iconColor} />
		// 		</TouchableOpacity>
		// 	);
		// }
	};

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
					<>
						<View className="flex flex-col gap-0 mt-4">
							<View className="flex flex-row items-center gap-2 w-full mb-2">
								<Ionicons name="skull-outline" size={20} color={iconColor} />
								<P className=" text-xl">Contaminants found:</P>
								{renderAmount(userScores?.allContaminants?.length)}
							</View>
							<View className="flex flex-row flex-wrap gap-2">
								{userScores?.allContaminants?.map((ingredient: any) => (
									<>{itemBadge(ingredient.name, "harm")}</>
								))}
							</View>
						</View>

						<View className="flex flex-col gap-0 mt-8">
							<View className="flex flex-row items-center gap-2 w-full mb-2">
								<Ionicons name="warning-outline" size={20} color={iconColor} />

								<P className="text-xl">Health risks:</P>
								{renderAmount(userScores?.allHarms?.length)}
							</View>
							<View className="flex flex-row flex-wrap gap-2">
								{userScores?.allHarms?.map((harm: any) => (
									<>{itemBadge(harm.name, "harm")}</>
								))}
							</View>
						</View>

						<View className="flex flex-col gap-0 mt-8">
							<View className="flex flex-row items-center gap-2 w-full mb-2">
								<Ionicons name="leaf-outline" size={20} color={iconColor} />
								<P className="text-xl">Benefits:</P>
								{renderAmount(userScores?.allBenefits?.length)}
							</View>
							<View className="flex flex-row flex-wrap gap-2">
								{userScores?.allBenefits?.map((benefit: any) => (
									<>{itemBadge(benefit.name, "benefit")}</>
								))}
							</View>
						</View>
					</>
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
