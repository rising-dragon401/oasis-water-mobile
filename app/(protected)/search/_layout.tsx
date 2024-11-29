import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import {
	Stack,
	useGlobalSearchParams,
	usePathname,
	useRouter,
} from "expo-router";
import { TouchableOpacity, View } from "react-native";

import {
	default as OasisLogo,
	default as OasisTextLogo,
} from "@/assets/oasis-text.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import ScoreBadge from "@/components/sharable/score-badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserProvider } from "@/context/user-provider";
import { PROFILE_AVATAR } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return (
		<View className="flex items-start justify-start  w-24 h-5">
			<Image
				source={OasisLogo}
				style={{ width: "100%", height: "100%" }}
				contentFit="contain"
			/>
		</View>
	);
}

function CommunityHeader() {
	const { iconColor } = useColorScheme();
	const router = useRouter();
	return (
		<View className="mr-0">
			<TouchableOpacity
				onPress={() => {
					router.push("/(protected)/search/community");
				}}
			>
				<Feather name="globe" size={24} color={iconColor} />
			</TouchableOpacity>
		</View>
	);
}

function ScoreBadgeHeader() {
	const { userScores } = useUserProvider();
	return (
		<View className="flex items-center justify-center">
			<ScoreBadge score={userScores?.overallScore || 0} />
		</View>
	);
}

function LogoHeader() {
	return (
		<View className="flex items-start justify-start w-16 h-5">
			<Image
				source={OasisTextLogo}
				style={{
					width: "100%",
					height: "100%",
				}}
				contentFit="contain"
			/>
		</View>
	);
}

function UserProfileHeader() {
	const { userData } = useUserProvider();
	const router = useRouter();
	return (
		<View className="mr-6">
			<TouchableOpacity
				onPress={() => {
					// @ts-ignore
					router.push("/(protected)/settings");
				}}
			>
				<Avatar className="h-8 w-8	" alt="oasis pfp">
					<AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} />
				</Avatar>
			</TouchableOpacity>
		</View>
	);
}

function ReportHeader() {
	const router = useRouter();

	return (
		<TouchableOpacity
			// @ts-ignore
			onPress={() => router.push("/contributeModal?kind=existing")}
		>
			<Ionicons name="alert-circle-outline" size={24} color="black" />
		</TouchableOpacity>
	);
}

export default function SearchLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	const globalParams = useGlobalSearchParams();

	// Determine back path
	const backPath = Array.isArray(globalParams?.backPath)
		? globalParams.backPath[0]
		: globalParams?.backPath || "";

	const isSearchPage = usePathname() === "/search";

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				// headerBackTitle: "Search",
				headerLeft: ({ canGoBack }) =>
					canGoBack &&
					!isSearchPage && <HeaderBackButton backPath={backPath} />,
				contentStyle: {
					backgroundColor,
				},
				headerStyle: {
					backgroundColor,
				},
				headerTitleStyle: {
					color: textColor,
				},
				headerTitle: () => <CustomHeader />,
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: true,
					headerTitle: "Check your water",
					headerLeft: () => <LogoHeader />,
					headerRight: () => <CommunityHeader />,
				}}
			/>
			<Stack.Screen
				name="item/[id]"
				options={{
					headerRight: () => <ReportHeader />,
				}}
			/>

			<Stack.Screen
				name="location/[id]"
				options={{
					headerRight: () => <ReportHeader />,
				}}
			/>
			<Stack.Screen name="ingredient/[id]" />
			<Stack.Screen
				name="top/index"
				options={{
					headerTitle: "Top rated",
				}}
			/>
			<Stack.Screen name="article/[id]" />
			<Stack.Screen name="bottled-waters/index" />
			<Stack.Screen name="tap-water/index" />
			<Stack.Screen name="filters/index" />
			<Stack.Screen name="oasis/[id]" />
			<Stack.Screen name="top-rated/[id]" />
			<Stack.Screen name="company/[id]" />
			<Stack.Screen name="articles/index" />
			<Stack.Screen name="community/index" />
		</Stack>
	);
}
