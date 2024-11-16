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

import OasisLogo from "@/assets/oasis-word.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
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

function HomeHeader() {
	const router = useRouter();

	return (
		<View className="flex flex-row items-center justify-between w-full pr-6">
			<View className="flex items-start justify-start">
				<Image source={OasisLogo} style={{ width: 85, height: 24 }} />
			</View>

			<View className="w-10 mr-2">
				<TouchableOpacity
					onPress={() => router.push("/(protected)/search/community")}
				>
					<Feather name="globe" size={24} color="black" />
				</TouchableOpacity>
			</View>
		</View>
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
					headerTitle: () => <HomeHeader />,
					headerLeft: () => null,
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
				name="filter/[id]"
				options={{
					headerRight: () => <ReportHeader />,
				}}
			/>
			<Stack.Screen name="article/[id]" />
			<Stack.Screen name="bottled-waters/index" />
			<Stack.Screen name="tap-water/index" />
			<Stack.Screen name="filters/index" />
			<Stack.Screen name="oasis/[id]" />
			<Stack.Screen name="top-rated/[id]" />
			<Stack.Screen name="top-rated-all/index" />
			<Stack.Screen name="company/[id]" />
			<Stack.Screen name="articles/index" />
			<Stack.Screen name="community/index" />
		</Stack>
	);
}
