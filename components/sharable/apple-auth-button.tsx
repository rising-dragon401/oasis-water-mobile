import { useSupabase } from "@/context/supabase-provider";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

export function AppleAuthButton() {
	const { signInWithApple } = useSupabase();

	if (Platform.OS === "ios")
		return (
			<AppleAuthentication.AppleAuthenticationButton
				buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
				buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
				cornerRadius={5}
				style={{ width: 200, height: 64 }}
				onPress={signInWithApple}
			/>
		);

	return null;
}
