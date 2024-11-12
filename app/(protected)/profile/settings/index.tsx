import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useUserProvider } from "context/user-provider";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
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
import { Textarea } from "@/components/ui/textarea";
import { Large, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useToast } from "@/context/toast-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function SettingsScreen() {
	const {
		uid,
		user,
		userData,
		subscription,
		subscriptionData,
		subscriptionProvider,
		refreshUserData,
		logout,
	} = useUserProvider();
	const { restorePurchases } = useRevenueCat();
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

	const handleSocialsUpdate = async () => {
		try {
			setLoadingSocials(true);

			const res = await updateUserData(userData.id, "socials", {
				instagram: socials.instagram,
				youtube: socials.youtube,
				twitter: socials.twitter,
			});

			console.log("res", res);

			if (res) {
				showToast("Socials updated");
				refreshUserData("userData");
			} else {
				showToast("Error updating socials");
			}
		} catch (error) {
			console.error("Error updating socials:", error);
			showToast("Error updating socials");
		}

		setLoadingSocials(false);
	};

	const handleManageSubscription = () => {
		Linking.openURL(subscriptionData.metadata?.managementURL || "");
	};

	const handleRestorePurchases = async () => {
		setLoadingRestorePurchases(true);
		const res = await restorePurchases();
		showToast("Any applicable purchases have been restored");
		setLoadingRestorePurchases(false);
	};

	const handleLoadInviteModal = () => {
		router.push("/inviteModal");
	};

	const handleLoadRedeemModal = () => {
		router.push("/redeemModal");
	};

	const handleCopyReferralCode = async () => {
		await Clipboard.setStringAsync(userData.username);
		Alert.alert("Referral code copied to clipboard");
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
					<View className="w-full flex flex-col h-full justify-between pb-14 px-8">
						<View className="flex flex-col mt-6">
							<ImageUpload
								itemId={uid}
								label="Avatar"
								file={newAvatar}
								setFile={setNewAvatar}
							/>
							<Large>{userData.full_name || "Unknown name"}</Large>
							<Muted>@{userData.username || "No username set"}</Muted>
						</View>

						<View className="flex flex-col gap-y-2 mt-6">
							<P className="text-muted-foreground">Membership</P>

							<View className="bg-muted p-4 rounded-xl border border-accent shadow-sm shadow-blue-500/50">
								{subscription ? (
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

										{subscriptionData?.cancel_at_period_end && (
											<Typography size="base" fontWeight="normal">
												Expires on{" "}
												{new Date(
													subscriptionData?.current_period_end,
												).toLocaleDateString()}
											</Typography>
										)}

										<View className="flex flex-col gap-4 text-center mt-2">
											<Muted>
												Thank you for supporting Oasis and the independent lab
												testing of water.
											</Muted>
										</View>
									</>
								) : (
									<View className="mt-2 flex flex-col items-center gap-y-2">
										<View className="flex flex-row items-center gap-x-1 mb-4">
											<P className="text-lg">Current plan:</P>
											<P className="font-bold text-lg">Free</P>
										</View>

										<UpgradeButton />

										{!subscription && (
											<Button
												className="w-full"
												variant="ghost"
												label="Restore purchases"
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
							<View className="bg-muted p-4 rounded-xl border border-border">
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

								<View className="flex flex-col w-full space-y-2 mt-4">
									<Label nativeID="password" className="text-sm">
										Bio
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Textarea
											placeholder="Bio"
											value={newBio}
											onChangeText={setNewBio}
											className="w-full"
										/>
									</View>
								</View>

								<View className="flex flex-col w-full space-y-2 mt-4">
									<Label nativeID="referred_by" className="text-sm">
										Who referred you?
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="username (don't include @)"
											value={newReferralCode}
											onChangeText={(text) => setNewReferralCode(text)}
											className="w-full border border-border bg-background"
										/>
									</View>
								</View>

								<Button
									variant="secondary"
									loading={loading}
									onPress={handleUpdateProfile}
									className="w-36 mt-4"
									label="Update"
								/>
							</View>
						</View>

						{/* <View className="flex flex-col gap-y-2 mt-6">
							<P className="text-muted-foreground">Socials</P>
							<View className="bg-muted p-4 rounded-xl border border-border">
								<View className="flex flex-col w-full space-y-2 mt-4">
									<Label nativeID="instagram" className="text-sm">
										Instagram
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="https://www.instagram.com/oasiswaterapp"
											value={socials.instagram}
											onChangeText={(text) =>
												setSocials({ ...socials, instagram: text })
											}
											className="w-full border border-border rounded-md bg-background"
										/>
									</View>
								</View>
								<View className="flex flex-col w-full space-y-2 mt-4">
									<Label nativeID="youtube" className="text-sm">
										YouTube
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="https://www.youtube.com/@oasiswaterapp"
											value={socials.youtube}
											onChangeText={(text) =>
												setSocials({ ...socials, youtube: text })
											}
											className="w-full border border-border rounded-md bg-background"
										/>
									</View>
								</View>
								<View className="flex flex-col w-full space-y-2 mt-4">
									<Label nativeID="twitter" className="text-sm">
										X (Twitter)
									</Label>
									<View className="flex flex-row w-full gap-2">
										<Input
											placeholder="https://x.com/oasiswaterapp"
											value={socials.twitter}
											onChangeText={(text) =>
												setSocials({ ...socials, twitter: text })
											}
											className="w-full border border-border rounded-md bg-background"
										/>
									</View>
								</View>
								<Button
									variant="secondary"
									loading={loadingSocials}
									onPress={handleSocialsUpdate}
									className="w-36 mt-4"
									label="Update"
								/>
							</View>
						</View> */}

						{/* <View className="flex flex-col gap-y-2 mt-6">
							<P className="text-muted-foreground">Referrals and Earnings</P>
							<View className="bg-muted p-4 rounded-xl border border-border">
								<View className="flex flex-col gap-y-2">
									<Muted>
										Earn 20% each time someone becomes an Oasis member using
										your username as the referral code.
									</Muted>
									<TouchableOpacity
										onPress={handleCopyReferralCode}
										className="flex flex-row bg-card w-full gap-2 h-10 items-center justify-center rounded-lg cursor-pointer"
									>
										<Octicons name="copy" size={14} color="black" />
										<P>{userData.username}</P>
									</TouchableOpacity>
								</View>

								<View className="flex flex-row justify-between mt-4 gap-4">
									<View className="flex-1 h-20 rounded-lg flex flex-col items-center justify-center border">
										<Typography size="base" fontWeight="normal">
											${referralStats.total_earnings}
										</Typography>
										<Typography
											size="xs"
											fontWeight="normal"
											className="py-1 bg-muted rounded-lg"
										>
											Earnings
										</Typography>
									</View>
									<View className="flex-1 h-20 rounded-lg flex flex-col items-center justify-center border">
										<Typography size="lg" fontWeight="normal">
											{referralStats.total_paid_referrals}
										</Typography>
										<Typography
											size="xs"
											fontWeight="normal"
											className="py-1 bg-muted rounded-lg"
										>
											Paid referrals
										</Typography>
									</View>
									<View className="flex-1 h-20 rounded-lg flex flex-col items-center justify-center border">
										<Typography size="lg" fontWeight="normal">
											{referralStats.total_trials}
										</Typography>
										<Typography
											size="xs"
											fontWeight="normal"
											className="py-1 bg-muted rounded-lg"
										>
											Trial referrals
										</Typography>
									</View>
								</View>
							</View>
						</View> */}

						<View className="flex flex-col gap-y-2 mt-6">
							<P className="text-muted-foreground">Account</P>
							<View className="bg-muted p-4 rounded-xl border border-border">
								<Typography size="base" fontWeight="normal" className="mt-2">
									Signed in as {user?.email}
								</Typography>
								<Button
									className="w-40 mt-4"
									variant="outline"
									label="Sign Out"
									onPress={logout}
								/>
							</View>
						</View>

						<View className="flex flex-col mt-10 pb-8 gap-y-2">
							<Link
								className="w-full mt-2 text-red-500 text-center"
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
