import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

import { handleDeleteUser } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function DeleteAccountModal() {
	const { uid, logout } = useUserProvider();
	const router = useRouter();
	const { iconColor } = useColorScheme();

	const handleDeleteAccout = async () => {
		if (!uid) return alert("User not found");

		const res = await handleDeleteUser(uid);
		if (res) {
			Alert.alert(
				"Account deleted successfully",
				"Your data will automically be deleted in 24 hours",
			);
			router.back();
			logout();
			router.push("/(protected)/search");
		} else {
			alert("Account deletion failed");
		}
	};

	return (
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4 pt-20 pb-10">
			<View className="w-full flex flex-col items-center gap-y-4">
				<Feather name="alert-circle" size={64} color={iconColor} />
				<H1 className="text-center">
					Are you sure you want to delete your account?
				</H1>
				<P className="text-center mt-2 max-w-sm">
					Any active subscriptions will not be cancelled. However all user data
					will be lost.{" "}
				</P>

				<View className="w-full gap-y-6 mt-20">
					<Button
						className="w-full"
						variant="default"
						label="No, nevermind"
						onPress={() => router.back()}
					/>

					<Button
						className="w-full"
						textClassName="!text-red-500"
						variant="ghost"
						label="Yes permanently delete"
						onPress={handleDeleteAccout}
					/>
				</View>
			</View>
		</View>
	);
}
