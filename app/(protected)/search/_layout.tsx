import OasisLogo from "@/assets/oasis-word.png";
import { Image } from "expo-image";
import { Stack } from "expo-router";

import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
}

export default function SearchLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Search",
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
			<Stack.Screen name="index" />
			<Stack.Screen name="item/[id]" />
			<Stack.Screen name="location/[id]" />
			<Stack.Screen name="filter/[id]" />
			<Stack.Screen name="article/[id]" />
			<Stack.Screen name="bottled-waters/index" />
			<Stack.Screen name="tap-water/index" />
			<Stack.Screen name="filters/index" />
			<Stack.Screen name="oasis/[id]" />
			<Stack.Screen name="top-rated/[id]" />
			<Stack.Screen name="top-rated-all/index" />
		</Stack>
	);
}
