import Feather from "@expo/vector-icons/Feather";
import * as Linking from "expo-linking";
import { TouchableOpacity, View } from "react-native";

import Score from "@/components/sharable/score";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { H3, Muted, P } from "@/components/ui/typography";
import { PROFILE_AVATAR } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileHeader({
	profileData,
	showSocials,
}: {
	profileData: any;
	showSocials?: boolean;
}) {
	const { iconColor } = useColorScheme();

	return (
		<View className="mb-2 gap-4 flex w-full flex-row justify-between items-start">
			<View className="flex flex-col">
				<View className="flex flex-col">
					<Avatar className="h-20 w-20" alt="oasis pfp">
						<AvatarImage src={profileData?.avatar_url || PROFILE_AVATAR} />
					</Avatar>

					<View className="flex flex-col">
						<H3 className="mb-0 pb-0 mt-2">{`${profileData?.full_name || profileData?.email || "Not logged in"}`}</H3>

						{profileData?.username && (
							<Muted className="py-0 my-0">@{profileData?.username}</Muted>
						)}
						{/* {profileData?.location?.city && (
							<LocationBadge location={profileData?.location?.city} />
						)} */}
					</View>
				</View>

				{profileData?.bio && (
					<P className="py-0 my-0 max-w-72 mt-1">{profileData?.bio}</P>
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
				<Score
					score={profileData?.score || 0}
					size="sm"
					showScore
					showTooltip
					tooltipContent={
						profileData?.score > 0
							? "Based on average of all saved items"
							: "Save items to see your score"
					}
				/>
				{/* <TouchableOpacity onPress={() => shareProfile()}>
						<Octicons name="share" size={24} color={iconColor} />
					</TouchableOpacity> */}
			</View>
		</View>
	);
}
