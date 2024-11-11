import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { useColorScheme } from "@/lib/useColorScheme";

export default function ProfileLayout() {
	const { backgroundColor, textColor } = useColorScheme();
	const router = useRouter();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Profile",
				contentStyle: { backgroundColor },
				headerStyle: { backgroundColor },
				headerTitleStyle: { color: textColor },
				headerTitleAlign: "center",
				headerShadowVisible: false,
			}}
		>
			{/* Profile index screen */}
			<Stack.Screen name="index" options={{ headerShown: false }} />

			{/* Settings screen */}
			<Stack.Screen
				name="settings/index"
				options={{
					headerTitle: "Settings",
					headerRight: () => (
						<TouchableOpacity
							onPress={() => router.push("/(protected)/profile/settings/help")}
						>
							<Ionicons
								name="help-circle-outline"
								size={24}
								color={textColor}
							/>
						</TouchableOpacity>
					),
				}}
			/>

			<Stack.Screen name="settings/help" options={{ headerTitle: "Help" }} />
		</Stack>
	);
}
