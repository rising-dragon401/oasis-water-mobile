import { useUserProvider } from "context/user-provider";
import {
	Link,
	useGlobalSearchParams,
	useLocalSearchParams,
	useNavigation,
	useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { getCurrentUserData, getUserFavorites } from "@/actions/user";
import FavoritesList from "@/components/sharable/favorites-list";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function OasisScreen() {
	const navigation = useNavigation();
	const { uid, userData, subscription, userFavorites } = useUserProvider();
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const local = useLocalSearchParams();
	const global = useGlobalSearchParams();

	const [oasisUser, setOasisUser] = useState<any>({});
	const [favorites, setFavorites] = useState<any>([]);

	const userId = Array.isArray(local?.id) ? local.id[0] : local?.id || uid;

	const isCurrentUser = userId === uid;

	useEffect(() => {
		if (userId) {
			fetchUserData(userId);
			fetchUserFavorites(userId);
		} else {
			navigation.setOptions({
				title: "Oasis",
			});
		}
	}, [userId]);

	const fetchUserData = async (userId: string) => {
		const data = await getCurrentUserData(userId);

		if (data) {
			setOasisUser(data);

			navigation.setOptions({
				title: `${data?.full_name || "user"}'s Oasis`,
			});
		}
	};

	const fetchUserFavorites = async (userId: string) => {
		const data = await getUserFavorites(userId);

		if (data) {
			setFavorites(data);
		}
	};

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<ScrollView
			className="flex-1"
			contentContainerStyle={{
				alignItems: "center",
				justifyContent: "space-between",
				paddingHorizontal: 8,
				paddingBottom: 40,
				flexGrow: 1,
			}}
			style={{ backgroundColor }}
		>
			<View className="flex flex-col items-center p-4 gap-y-4 w-full flex-grow">
				{favorites ? (
					<>
						<View style={{ flex: 0, width: "100%" }}>
							<FavoritesList userId={userId} />
						</View>
					</>
				) : (
					<>
						{subscription && !favorites ? (
							<View className="w-full justify-center items-center gap-y-2 pt-20">
								<View className="flex flex-col items-center p-4 gap-y-4 w-full">
									<H1 className="text-center mt-20">Your Oasis</H1>
									<Muted className="text-center ">
										You haven't added anything to your Oasis yet
									</Muted>
								</View>

								<Link
									className="w-full mt-8 text-center"
									href="/(protected)/search"
								>
									Explore
								</Link>
							</View>
						) : (
							<View className="pt-20">
								{!userData ? (
									<View className="flex flex-col items-center p-4 gap-y-4 w-full">
										<H1 className="text-center mt-20">Your Oasis</H1>
										<Muted className="text-center ">
											Sign in and subscribe to start building your Oasis
										</Muted>
										<Button
											className="w-full mt-6"
											variant="default"
											size="default"
											label="Sign in"
											onPress={() => {
												// @ts-ignore
												router.push("/(public)/auth/sign-in");
											}}
										/>
									</View>
								) : (
									<View className="flex flex-col items-center p-4 gap-y-4 w-full">
										<H1 className="text-center mt-20">Your Oasis</H1>
										<Muted className="text-center ">
											Subscribe to start building your Oasis
										</Muted>
										<Button
											className="w-full mt-6"
											variant="default"
											size="default"
											label="Subscribe"
											onPress={() => {
												// @ts-ignore
												router.push("/subscribeModal");
											}}
										/>
									</View>
								)}
							</View>
						)}
					</>
				)}
			</View>

			{/* {!isCurrentUser && (
				<View className="rounded-full bg-card shadow-md h-14 mt-8">
					<Link href="https://www.oasiswater.app/affiliates">
						<View className="flex flex-col items-center p-4 px-6">
							<Large className="text-center">
								Share what you drink and earn 💸
							</Large>
						</View>
					</Link>
				</View>
			)} */}
		</ScrollView>
	);
}
