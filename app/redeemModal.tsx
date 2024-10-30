import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";

import { redeemInviteCode } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function RedeemModal() {
	const { uid } = useUserProvider();
	const { colorScheme } = useColorScheme();

	const [loading, setLoading] = useState(false);
	const [code, setCode] = useState("");

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	const handleRedeemInviteCode = async () => {
		if (!uid) return;

		setLoading(true);

		const res = await redeemInviteCode(uid, code);

		if (res) {
			Alert.alert("Code redemeed!", "This will count towards your free month.");
			setCode("");
		} else {
			Alert.alert("Invalid code", "Please enter a valid code.");
		}

		setLoading(false);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4 pt-20 pb-10">
				<View />

				<View className="w-full flex flex-col items-center">
					<View className="mb-8">
						<Ionicons name="ticket-outline" size={24} color={iconColor} />
					</View>
					<H1 className="text-center">Redeem your invite code</H1>
					<P className="text-center max-w-sm">
						Entering this code rewards the person who shared it with you.
					</P>

					<View className="mt-8 w-full flex items-center flex-col gap-y-4">
						<Input
							placeholder="Redeem your invite code"
							value={code}
							onChangeText={setCode}
							className="w-96"
						/>

						<Button
							className="w-96"
							variant="default"
							label="Redeem"
							loading={loading}
							onPress={handleRedeemInviteCode}
						/>
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
