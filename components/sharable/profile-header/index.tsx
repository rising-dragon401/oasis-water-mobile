import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { H3, Muted, P } from "@/components/ui/typography";
import { PROFILE_AVATAR } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileHeader({
	profileData,
	score,
	subscription,
}: {
	profileData: any;
	score?: number;
	subscription?: boolean;
}) {
	const { iconColor } = useColorScheme();
	const router = useRouter();

	return (
		<View className="mb-2 gap-4 pt-6 flex w-full flex-row justify-between items-start">
			<View className="flex flex-col">
				<View className="flex flex-row gap-x-4 items-start">
					<Avatar className="h-16 w-16" alt="oasis pfp">
						<AvatarImage src={profileData?.avatar_url || PROFILE_AVATAR} />
					</Avatar>

					<View className="flex flex-col">
						{profileData && (
							<H3 className="mb-0 pb-0">
								{profileData?.full_name || "No name"}
							</H3>
						)}

						{profileData?.username && (
							<Muted className="py-0 my-0">@{profileData?.username}</Muted>
						)}
					</View>
				</View>
			</View>

			<View>
				{subscription ? (
					<View>
						<P className="text-4xl font-bold">{score || "TBD"}</P>
						<Muted className="text-right"> / 100</Muted>
					</View>
				) : (
					<TouchableOpacity
						onPress={() => router.push("/subscribeModal")}
						className="flex flex-col items-end"
					>
						<Feather name="lock" size={20} color={iconColor} />
						<Muted> / 100</Muted>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
