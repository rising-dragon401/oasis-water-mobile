import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Share, TouchableOpacity, View } from "react-native";

import {
	awardFreeMonth,
	generateUserInviteCode,
	getUserInviteCode,
} from "@/actions/user";
import Loader from "@/components/sharable/loader";
import { Button } from "@/components/ui/button";
import { H1, H3, Muted, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function InviteModal() {
	const { uid, refreshUserData } = useUserProvider();
	const { colorScheme } = useColorScheme();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [inviteCode, setInviteCode] = useState("");
	const [redemptions, setRedemptions] = useState(0);
	const [loadingAward, setLoadingAward] = useState(false);

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;

	useEffect(() => {
		fetchUserInviteCode();
	}, [uid]);

	const fetchUserInviteCode = async () => {
		if (!uid) return;

		const res = await getUserInviteCode(uid);

		console.log("res", res);

		if (!res?.id) {
			handleGenerateUserInviteCode();
		} else {
			setInviteCode(res.id);
			setRedemptions(res.redemptions?.length || 0);
			setLoading(false);
		}
	};

	const handleGenerateUserInviteCode = async () => {
		if (!uid) return;

		const res = await generateUserInviteCode(uid);

		if (res) {
			setInviteCode(res);
		}

		setLoading(false);
	};

	const handlShareInviteCode = async () => {
		if (!inviteCode) return;

		const url =
			"https://apps.apple.com/us/app/oasis-water-health-ratings/id6499478532";

		await Share.share({
			message: `Check out this app that rates your water score. Use my code on sign up to help get one month free: ${inviteCode}`,
			url,
		});
	};

	const handleAwardFreeMonth = async () => {
		if (!uid) return;

		setLoadingAward(true);

		const res = await awardFreeMonth(uid);

		if (res) {
			Alert.alert(
				"Free month achieved!",
				"You now have one month access to Oasis Pro. You may need to reload the app.",
			);

			await refreshUserData();

			router.push("/(protected)/search");
		} else {
			Alert.alert(
				"Unable to redeem 1 month free",
				"Please contact support if this issue persists.",
			);
		}

		setLoadingAward(false);
	};

	return (
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4 pt-20 pb-10">
			<View />

			<View className="w-full flex flex-col items-center">
				<View className="mb-8">
					<Ionicons name="ticket-outline" size={48} color={iconColor} />
				</View>
				<H1 className="text-center">Share your invite code</H1>
				<P className="text-center max-w-md">
					When 3 people sign up using your code, you get one month of Oasis Pro
					for free!
				</P>
				<Muted className="mt-4">Redemptions: {redemptions}/3</Muted>

				<View className="mt-8 w-full flex items-center flex-col gap-y-4">
					<TouchableOpacity
						onPress={handlShareInviteCode}
						className="bg-muted p-4 rounded-full w-64"
					>
						{inviteCode && <H3 className="text-center">{inviteCode}</H3>}
						{loading && <Loader />}
					</TouchableOpacity>

					<Button
						className="w-96 mt-2 bg-blue-400"
						variant="default"
						label="Share"
						onPress={handlShareInviteCode}
					/>

					{redemptions > 2 && (
						<Button
							className="w-96 mt-2 bg-blue-400"
							variant="default"
							label="Redeem"
							onPress={handleAwardFreeMonth}
						/>
					)}
				</View>
			</View>
		</View>
	);
}
