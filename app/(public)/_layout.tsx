import { Image } from "expo-image";
import { Stack } from "expo-router";

import OasisLogo from "@/assets/oasis-word.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
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
				name="welcome"
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
