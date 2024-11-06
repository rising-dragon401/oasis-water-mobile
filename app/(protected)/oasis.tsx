import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import OasisPage from "@/components/sharable/oasis-page";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function OasisScreen() {
	const { uid, userFavorites } = useUserProvider();
	const { colorScheme } = useColorScheme();
	const router = useRouter();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<ScrollView
			className="flex px-8 pb-10"
			contentContainerStyle={{
				justifyContent: "space-between",
				paddingBottom: 100,
			}}
			style={{ backgroundColor }}
		>
			<View className="flex flex-col items-center  w-full">
				<OasisPage userId={uid} />
			</View>
		</ScrollView>
	);
}
