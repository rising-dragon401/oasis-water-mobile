import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

import { useSupabase } from "@/context/supabase-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export function AppleAuthButton() {
	const { signInWithApple } = useSupabase();
	const { colorScheme } = useColorScheme();

	if (Platform.OS === "ios")
		return (
			<AppleAuthentication.AppleAuthenticationButton
				buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
				buttonStyle={
					colorScheme === "dark"
						? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
						: AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
				}
				cornerRadius={100}
				style={{ width: "100%", height: 42 }}
				onPress={signInWithApple}
			/>
		);

	return null;
}
