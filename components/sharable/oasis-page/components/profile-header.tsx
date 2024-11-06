import Feather from "@expo/vector-icons/Feather";
import * as Linking from "expo-linking";
import { TouchableOpacity, View } from "react-native";

import Score from "@/components/sharable/score";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { H3, Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { PROFILE_AVATAR } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileHeader({
	profileData,
	showSocials,
	showScore = true,
	showBio = true,
	isAuthUser = false,
}: {
	profileData: any;
	showSocials?: boolean;
	showScore?: boolean;
	showBio?: boolean;
	isAuthUser?: boolean;
}) {
	const { iconColor } = useColorScheme();
	const { uid, userFavorites, userScores, subscription } = useUserProvider();

	const scoreTooltipContent = () => {
		if (!uid) {
			return "Login to see your score";
		} else if (profileData?.score > 0) {
			return "Based on average of all saved items";
		} else {
			return "Save items to see your score";
		}
	};

	const scoreSize =
		!uid || userFavorites?.length === 0 || !userFavorites ? "sm" : "sm";

	return (
		<View className="mb-2 gap-4 flex w-full flex-row justify-between items-start">
			<View className="flex flex-col">
				<View className="flex flex-row gap-x-4 items-start">
					<Avatar className="h-16 w-16" alt="oasis pfp">
						<AvatarImage src={profileData?.avatar_url || PROFILE_AVATAR} />
					</Avatar>

					<View className="flex flex-col">
						<H3 className="mb-0 pb-0">{profileData?.full_name || "Name"}</H3>

						{profileData?.username && (
							<Muted className="py-0 my-0">@{profileData?.username}</Muted>
						)}
					</View>
				</View>

				{profileData?.bio && showBio && (
					<P className="py-0 my-0 max-w-72 mt-2">{profileData?.bio}</P>
				)}

				{profileData?.socials && showSocials !== false && (
					<View className="flex flex-row flex-wrap gap-2 mt-1">
						{profileData?.socials?.instagram && (
							<TouchableOpacity
								onPress={() => Linking.openURL(profileData?.socials?.instagram)}
								className="p-2 bg-muted rounded-full"
							>
								<Feather name="instagram" size={16} color={iconColor} />
							</TouchableOpacity>
						)}

						{profileData?.socials?.twitter && (
							<TouchableOpacity
								onPress={() => Linking.openURL(profileData?.socials?.twitter)}
								className="p-2 bg-muted rounded-full"
							>
								<Feather name="twitter" size={16} color={iconColor} />
							</TouchableOpacity>
						)}

						{profileData?.socials?.youtube && (
							<TouchableOpacity
								onPress={() => Linking.openURL(profileData?.socials?.youtube)}
								className="p-2 bg-muted rounded-full"
							>
								<Feather name="youtube" size={16} color={iconColor} />
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>

			<View>
				{showScore && (
					<Score
						score={profileData?.score || userScores?.overallScore || 0}
						size={scoreSize}
						showScore={subscription}
						showTooltip
						tooltipContent={scoreTooltipContent()}
					/>
				)}
				{/* <TouchableOpacity onPress={() => shareProfile()}>
						<Octicons name="share" size={24} color={iconColor} />
					</TouchableOpacity> */}
			</View>
		</View>
	);
}
