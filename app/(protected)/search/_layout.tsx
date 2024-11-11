import { Image } from "expo-image";
import { Stack } from "expo-router";
import { View, useWindowDimensions } from "react-native";

import OasisLogo from "@/assets/oasis-word.png";
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
	const { backgroundColor, textColor } = useColorScheme();
	const { width } = useWindowDimensions();

	const { userData } = useUserProvider();

	const { userScores } = userData ?? {};

	const locationName = userData?.location?.city
		? `${userData?.location?.city}, ${userData?.location?.state}`
		: "Unknown";

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Search",
				contentStyle: {
					backgroundColor,
				},
				// headerLeft: () => (
				// 	<Ionicons name="arrow-back" size={24} color={iconColor} />
				// ),
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
