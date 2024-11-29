import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, View } from "react-native";

import { getUserReferralStats } from "@/actions/admin";
import { addUserToAlgolia } from "@/actions/algolia";
import {
	getUserByUsername,
	updateUserData,
	updateUsername,
} from "@/actions/user";
import { ImageUpload } from "@/components/sharable/image-upload";
import Typography from "@/components/sharable/typography";
import UpgradeButton from "@/components/sharable/upgrade-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Large, Muted, P } from "@/components/ui/typography";
import { useSubscription } from "@/context/subscription-provider";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function SettingsScreen() {
	const { hasActiveSub, restorePurchases } = useSubscription();
	const { uid, user, userData, refreshUserData, logout } = useUserProvider();
	const { backgroundColor, iconColor } = useColorScheme();
	const showToast = useToast();
	const router = useRouter();

	const [newName, setNewName] = useState("");
	const [newUsername, setNewUsername] = useState("");
	const [newBio, setNewBio] = useState("");
	const [newAvatar, setNewAvatar] = useState("");
	const [newReferralCode, setNewReferralCode] = useState("");
	const [referralStats, setReferralStats] = useState({
		total_earnings: 0,
		total_paid_referrals: 0,
		total_trials: 0,
	});
	const [loading, setLoading] = useState(false);
	const [socials, setSocials] = useState({
		instagram: "",
		youtube: "",
		twitter: "",
	});
	const [loadingSocials, setLoadingSocials] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [loadingRestorePurchases, setLoadingRestorePurchases] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		// Add your refresh logic here, e.g., refetch user data

		await refreshUserData("all");

		setRefreshing(false);
		showToast("Refreshed data");
	};

	useEffect(() => {
		if (userData) {
			setNewName(userData.full_name || "");
			setNewBio(userData.bio || "");
			setNewAvatar(userData.avatar_url || "");
			setSocials({
				instagram: userData.socials?.instagram || "",
				youtube: userData.socials?.youtube || "",
				twitter: userData.socials?.twitter || "",
			});

			setNewUsername(userData.username || "");

			if (userData.referred_by) {
				referredByUser(userData.referred_by);
			}

			getReferralStats();
		}
	}, [userData]);

	// update avatar on update
	useEffect(() => {
		if (newAvatar) {
			handleUpdateAvatar();
		}
	}, [newAvatar]);

	const handleUpdateAvatar = async () => {
		if (!uid) {
			return;
		}

		const res = await updateUserData(uid, "avatar_url", newAvatar);
		if (!res) {
			Alert.alert("Error", "Failed to update avatar");
		}
	};

	// get the username of the user who referred the user
	const referredByUser = async (referredBy: string) => {
		const user = await getUserByUsername(referredBy);

		if (user) {
			setNewReferralCode(user.username);
		}
	};

	const getReferralStats = async () => {
		const stats = await getUserReferralStats(userData.id);
		setReferralStats(stats);
	};

	const handleUpdateProfile = async () => {
		if (!uid) {
			return;
		}

		setLoading(true);

		const username = await updateUsername(userData.id, newUsername);
		if (!username) {
			showToast("Username already taken");
			setLoading(false);
			return;
		}

		const res = await updateUserData(uid, "full_name", newName);
		const res2 = await updateUserData(uid, "bio", newBio);

		if (newReferralCode) {
			const user = await getUserByUsername(newReferralCode);
			if (user) {
				await updateUserData(uid, "referred_by", user.id);
			} else {
				showToast("Invalid referral code");
			}
		}

		if (!res || !res2) {
			showToast("Failed to update profile");
		}

		refreshUserData("userData");

		const userObject = {
			id: userData.id,
			name: newName,
			bio: newBio,
			is_oasis_public: userData.is_oasis_public,
			image: newAvatar,
		};

		addUserToAlgolia(userObject);

		setLoading(false);

		Alert.alert("Profile updated");
	};

	const handleRestorePurchases = async () => {
		setLoadingRestorePurchases(true);
		const res = await restorePurchases();
		showToast("Any applicable purchases have been restored");
		setLoadingRestorePurchases(false);
	};

	return (
		<>
			{userData ? (
				<ScrollView
					contentContainerStyle={{
						display: "flex",
						backgroundColor,
					}}
					className="overflow-y-scroll"
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
					}
				>
					<View className="w-full flex flex-col h-full justify-between items-center pb-14 px-8">
						<View className="flex flex-col mt-6 justify-center items-center">
							<ImageUpload
								itemId={uid}
								label="Avatar"
								file={newAvatar}
								setFile={setNewAvatar}
							/>
							<Large className="text-center">
								{userData.full_name || "Unknown name"}
							</Large>
							<Muted className="text-center">
								@{userData.username || "No username set"}
							</Muted>
						</View>

						<View className="flex flex-col gap-y-2 mt-6 w-full">
							<P className="text-muted-foreground">Current location</P>
							<View className="bg-card p-4 rounded-xl border border-border">
								{userData.location?.formattedAddress && (
									<P className="text-center flex-wrap">
										{userData.location?.formattedAddress}
									</P>
								)}

								{userData.location?.formattedAddress && (
									<Button
										variant="ghost"
										loading={loading}
										onPress={() => router.push("/locationModal")}
										className="w-full mt-4"
										label="Change"
									/>
								)}

								{!userData.location?.formattedAddress && (
									<Button
										variant="outline"
										onPress={() => router.push("/locationModal")}
										className="w-44"
										label="Set location"
									/>
								)}
							</View>

							{/* <LocationBadge
									location={userData.location?.formattedAddress}
								/> */}
						</View>

						<View className="flex flex-col gap-y-2 mt-6 w-full">
							<P className="text-muted-foreground">Membership</P>

							<View className="bg-card p-4 rounded-xl border border-border">
								{hasActiveSub ? (
									<>
										<View className="flex flex-row items-center gap-x-1">
											<MaterialCommunityIcons
												name="check-decagram-outline"
												size={18}
												color={iconColor}
											/>
											<Typography size="base" fontWeight="normal">
												Oasis member
											</Typography>
										</View>

										<View className="flex flex-col gap-4 text-center mt-2">
											<Muted>
												Thank you for supporting Oasis and the independent lab
												testing of water.
											</Muted>
										</View>
									</>
								) : (
									<View className="mt-2 flex flex-col items-center gap-0">
										<View className="px-4 w-full">
											<UpgradeButton />
										</View>

										{!hasActiveSub && (
											<Button
												className="w-full h-10"
												variant="ghost"
												label="Restore"
												loading={loadingRestorePurchases}
												onPress={handleRestorePurchases}
											/>
										)}

										{/* TODO bring this back but users get one unlock per friend invited and joined */}
										{/* {!userData?.has_redeemed_free_month && (
											<>
												<Button
													className="w-full"
													variant="outline"
													label="Invite 3 friends, get 1 month free 🤝"
													onPress={handleLoadInviteModal}
												/>

												<Button
													className="w-full"
													variant="ghost"
													label="Redeem invite code"
													onPress={handleLoadRedeemModal}
												/>
											</>
										)} */}
									</View>
								)}
							</View>
						</View>

						<View className="flex flex-col gap-y-2 mt-6">
							<P className="text-muted-foreground">Edit profile</P>
							<View className="bg-card p-4 rounded-xl border border-border flex flex-col items-center">
								<View className="flex flex-col w-full space-y-4">
									<Label nativeID="name" className="text-sm">
										Name
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="Name"
											value={newName}
											onChangeText={(text) => setNewName(text)}
											className="w-full border border-border  bg-background"
										/>
									</View>
								</View>

								<View className="flex flex-col w-full space-y-4 mt-4">
									<Label nativeID="username" className="text-sm">
										Username
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="Username"
											value={newUsername}
											onChangeText={(text) => setNewUsername(text)}
											className="w-full border border-border bg-background"
										/>
									</View>
								</View>

								<Button
									variant="ghost"
									loading={loading}
									onPress={handleUpdateProfile}
									className="w-36 mt-4"
									label="Update"
								/>
							</View>
						</View>

						<View className="flex flex-col gap-y-2 mt-6 w-full ">
							<P className="text-muted-foreground">Account</P>
							<View className="bg-card p-4 rounded-xl border border-border flex flex-col">
								<Typography size="base" fontWeight="normal" className="mt-2">
									Signed in as {user?.email}
								</Typography>

								<View className="w-full flex flex-row justify-center">
									<Button
										className="w-40 mt-4"
										variant="outline"
										label="Sign Out"
										onPress={logout}
									/>
								</View>
							</View>
						</View>

						<View className="flex flex-col mt-24 pb-8 gap-y-2">
							<Link
								className="w-full mt-2 text-muted-foreground text-center"
								// @ts-ignore
								href="/deleteAccountModal"
							>
								Delete account
							</Link>
						</View>
					</View>
				</ScrollView>
			) : (
				<View
					className="w-full min-h-screen justify-start gap-y-2 px-4"
					style={{ backgroundColor }}
				>
					{/* <View className="flex-row w-full justify-between items-center mt-24">
						<H1>Settings</H1>
						<View>
							<Link href="/(protected)/profile/settings/help">
								<Ionicons
									name="help-circle-outline"
									size={24}
									color={iconColor}
								/>
							</Link>
						</View>
					</View> */}
					<Muted>Looks like you're not logged in</Muted>

					<Button
						label="Sign in"
						className="w-full mt-2 p-4"
						onPress={() => router.push("/(public)/sign-in")}
					/>
				</View>
			)}
		</>
	);
}
