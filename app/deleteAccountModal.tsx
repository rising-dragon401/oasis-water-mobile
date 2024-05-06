import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, View } from "react-native";

import { handleDeleteUser } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";

export default function DeleteAccountModal() {
	const { subscription, uid, logout } = useUserProvider();
	const router = useRouter();

	useEffect(() => {
		if (subscription?.active) {
			router.back();
		}
	}, [subscription]);

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
		<View className="flex flex-1 items-center justify-between bg-background p-4 gap-y-4 pt-20 pb-10">
			<View className="w-full ">
				<H1 className="text-center">
					Are you sure you want to delete your account?
				</H1>
				<Muted className="text-center">
					All user data and subscription info will be immediately lost.{" "}
				</Muted>

				<View className="w-full gap-y-6 mt-20">
					<Button
						className="w-full"
						variant="default"
						label="No, nevermind"
						onPress={() => router.back()}
					/>

					<Button
						className="w-full "
						variant="secondary"
						label="Yes delete"
						onPress={handleDeleteAccout}
					/>
				</View>
			</View>
		</View>
	);
}
