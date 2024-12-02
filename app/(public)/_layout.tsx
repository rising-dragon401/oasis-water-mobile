import { Image } from "expo-image";
import { Stack } from "expo-router";
import { View } from "react-native";

import OasisLogo from "@/assets/oasis-text.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return (
		<View className="flex items-start justify-start ml-6">
			<Image
				source={OasisLogo}
				style={{ width: 85, height: 20 }}
				contentFit="contain"
			/>
		</View>
	);
}

export default function PublicLayout() {
	const { backgroundColor } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerLeft: ({ canGoBack }) =>
					canGoBack && <HeaderBackButton backPath="" />,
				contentStyle: { backgroundColor },
				// headerTitle: () => <CustomHeader />,
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="sign-up"
				options={{
					headerShown: true,
					headerTitle: () => <CustomHeader />,
					headerLeft: ({ canGoBack }) =>
						canGoBack && <HeaderBackButton backPath="" />,
				}}
			/>
			<Stack.Screen
				name="sign-in"
				options={{
					headerShown: true,
					headerTitle: () => <CustomHeader />,
					headerLeft: ({ canGoBack }) =>
						canGoBack && <HeaderBackButton backPath="" />,
				}}
			/>
		</Stack>
	);
}
