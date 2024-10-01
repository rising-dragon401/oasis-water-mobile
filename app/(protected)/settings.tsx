import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useUserProvider } from "context/user-provider";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { H1, Large, Muted, P } from "@/components/ui/typography";
import { useRevenueCat } from "@/context/revenue-cat-provider";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TabTwoScreen() {
	const { uid, user, userData, subscription, fetchUserData, logout } =
		useUserProvider();
	const { restorePurchases } = useRevenueCat();
	const { backgroundColor, iconColor } = useColorScheme();
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

	useEffect(() => {
		if (userData) {
			setNewName(userData.full_name || "");
			setNewBio(userData.bio || "");
			setNewAvatar(userData.avatar_url || "");
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
			Alert.alert("Username already taken");
			setLoading(false);
			return;
		}

		const res = await updateUserData(uid, "full_name", newName);
		const res2 = await updateUserData(uid, "bio", newBio);

		if (newReferralCode) {
			console.log("newReferralCode", newReferralCode);
			const user = await getUserByUsername(newReferralCode);
			if (user) {
				await updateUserData(uid, "referred_by", user.id);
			} else {
				Alert.alert("Invalid referral code");
			}
		}

		if (!res || !res2) {
			Alert.alert("Error", "Failed to update profile");
		}

		fetchUserData(userData.id);

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

	const handleManageSubscription = () => {
		Linking.openURL(subscription.metadata?.managementURL || "");
	};

	const provider = subscription?.metadata?.provider || "stripe";

	const handleRestorePurchases = async () => {
		await restorePurchases();
		alert("Any applicable purchases have been restored.");
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
		<ScrollView
			contentContainerStyle={{
				display: "flex",
				// alignItems: "center",
				// justifyContent: "space-between",
				backgroundColor,
				// height: "100%",
				paddingBottom: 64,
			}}
			className="overflow-y-scroll"
		>
			{userData ? (
				<View className="w-full flex flex-col h-full justify-between pb-14 px-8">
					<H1 className="mt-24">Account</H1>

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
										className="w-full border border-border rounded-md bg-background"
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
										className="w-full border border-border rounded-md bg-background"
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
										className="w-full border border-border rounded-md bg-background"
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

					<View className="flex flex-col gap-y-2 mt-6">
						<P className="text-muted-foreground">Subscription</P>
						<View className="bg-muted p-4 rounded-xl border border-border">
							{subscription ? (
								<>
									<View className="flex flex-row items-center gap-x-1">
										<MaterialCommunityIcons
											name="check-decagram-outline"
											size={18}
											color={iconColor}
										/>
										<Typography size="base" fontWeight="normal">
											{subscription?.plan === "Pro" && "💫"}
											Oasis member
										</Typography>
									</View>

									{subscription.cancel_at_period_end && (
										<Typography size="base" fontWeight="normal">
											Expires on{" "}
											{new Date(
												subscription.current_period_end,
											).toLocaleDateString()}
										</Typography>
									)}

									{provider === "revenue_cat" ? (
										<View className="flex flex-col gap-4 text-center mt-2">
											<Button
												variant="outline"
												label="Manage subscription"
												onPress={handleManageSubscription}
											/>
										</View>
									) : (
										<Muted>Manage your subscription online</Muted>
									)}
								</>
							) : (
								<View className="mt-4 flex flex-col items-center gap-y-2">
									<UpgradeButton />

									{!userData?.has_redeemed_free_month && (
										<>
											<Separator />

											<Button
												className="w-full bg-blue-500"
												variant="default"
												label="Invite 3 friends, get 1 month free 🤝"
												onPress={handleLoadInviteModal}
											/>

											<Button
												className="w-full"
												variant="outline"
												label="Redeem invite code"
												onPress={handleLoadRedeemModal}
											/>
										</>
									)}
								</View>
							)}
						</View>
					</View>

					<View className="flex flex-col gap-y-2 mt-6">
						<P className="text-muted-foreground">Referrals and Earnings</P>
						<View className="bg-muted p-4 rounded-xl border border-border">
							<View className="flex flex-col gap-y-2">
								<Muted>
									Earn 20% each time someone becomes an Oasis member using your
									username as the referral code.
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
					</View>

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

					<View className="flex flex-col mt-10 pb-20">
						<View className="mt-8">
							<Button
								variant="ghost"
								label="Restore purchases"
								onPress={handleRestorePurchases}
							/>
						</View>
						<Link
							className="w-full mt-2 text-red-500 text-center"
							// @ts-ignore
							href="/deleteAccountModal"
						>
							Delete account
						</Link>
					</View>
				</View>
			) : (
				<View
					className="w-full min-h-screen justify-start gap-y-2 px-8 mt-2"
					style={{ backgroundColor }}
				>
					<H1 className="mt-24">Acount</H1>
					<Muted>Looks like you're not logged in</Muted>

					<Link className="w-full mt-2 p-4" href="/(public)/sign-in">
						<Button label="Sign in" className="w-full" />
					</Link>
				</View>
			)}
		</ScrollView>
	);
}
