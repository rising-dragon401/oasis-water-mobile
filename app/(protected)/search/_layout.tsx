import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
	Stack,
	useLocalSearchParams,
	usePathname,
	useRouter,
} from "expo-router";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";

import OasisLogo from "@/assets/oasis-word.png";
import { P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
}

function HomeHeader({
	screenWidth,
	location,
	score,
}: {
	screenWidth: number;
	location: any;
	score: number | null;
}) {
	return (
		<View className="flex flex-row items-center justify-between w-full pr-6">
			<View className="flex items-start justify-start">
				<Image source={OasisLogo} style={{ width: 85, height: 24 }} />
			</View>

			<View className="w-10">{/* <ScoreBadge /> */}</View>
		</View>
	);
}

export default function SearchLayout() {
	const { backgroundColor, textColor, iconColor } = useColorScheme();
	const { width } = useWindowDimensions();

	const { userData } = useUserProvider();

	const { userScores } = userData ?? {};

	const locationName = userData?.location?.city
		? `${userData?.location?.city}, ${userData?.location?.state}`
		: "Unknown";

	const params = useLocalSearchParams();
	const router = useRouter();

	// Determine back path
	const backPath = params?.backPath || "search";

	const isSearchPage = usePathname() === "/search";

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Search",
				headerLeft: ({ canGoBack }) =>
					canGoBack &&
					!isSearchPage && (
						<TouchableOpacity
							onPress={() => {
								if (backPath === "saved") {
									router.push("/saved");
								} else {
									router.back();
								}
							}}
							className="flex flex-row items-center gap-1"
						>
							<Ionicons name="arrow-back" size={20} color={iconColor} />
							<P className="text-base">Back</P>
						</TouchableOpacity>
					),
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
					headerTitle: () => (
						<HomeHeader
							screenWidth={width}
							location={locationName}
							score={userScores?.overallScore}
						/>
					),
					headerLeft: () => null,
				}}
			/>
			<Stack.Screen name="item/[id]" />
			<Stack.Screen name="location/[id]" />
			<Stack.Screen name="ingredient/[id]" />
			<Stack.Screen name="filter/[id]" />
			<Stack.Screen name="article/[id]" />
			<Stack.Screen name="bottled-waters/index" />
			<Stack.Screen name="tap-water/index" />
			<Stack.Screen name="filters/index" />
			<Stack.Screen name="oasis/[id]" />
			<Stack.Screen name="top-rated/[id]" />
			<Stack.Screen name="top-rated-all/index" />
			<Stack.Screen name="company/[id]" />
		</Stack>
	);
}
