import { Image } from "expo-image";
import { Stack, useGlobalSearchParams } from "expo-router";

import OasisLogo from "@/assets/oasis-word.png";
import HeaderBackButton from "@/components/sharable/header-back-button";
import { useColorScheme } from "@/lib/useColorScheme";

function CustomHeader() {
	return <Image source={OasisLogo} style={{ width: 85, height: 24 }} />;
}

export default function ResearchLayout() {
	const { backgroundColor, textColor } = useColorScheme();

	const globalParams = useGlobalSearchParams();

	// Determine back path
	const backPath = Array.isArray(globalParams?.backPath)
		? globalParams.backPath[0]
		: globalParams?.backPath || "research";

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerLeft: ({ canGoBack }) =>
					canGoBack && <HeaderBackButton backPath={backPath} />,
				contentStyle: { backgroundColor },
				headerStyle: { backgroundColor },
				headerTitle: () => <CustomHeader />,
				headerTitleStyle: { color: textColor },
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />

			<Stack.Screen name="view-all/index" options={{ headerShown: true }} />
		</Stack>
	);
}
