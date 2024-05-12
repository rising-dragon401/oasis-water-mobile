import { useUserProvider } from "context/user-provider";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";

import FavoritesList from "@/components/sharable/favorites-list";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function OasisScreen() {
	const { uid, subscription, userFavorites } = useUserProvider();
	const router = useRouter();
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<View
			className="flex-1 items-center justify-between p-4 pb-10 pt-20"
			style={{ backgroundColor }}
		>
			<View className="flex flex-col items-center p-4 gap-y-4 w-full">
				{subscription && userFavorites ? (
					<FavoritesList userId={uid} />
				) : (
					<>
						{subscription && !userFavorites ? (
							<View className="w-full justify-center items-center gap-y-2">
								<View className="flex flex-col items-center p-4 gap-y-4 w-full">
									<H1 className="text-center mt-20">Your Oasis</H1>
									<Muted className="text-center ">
										You haven't added anything to your Oasis yet
									</Muted>
								</View>

								<Link
									className="w-full mt-8 text-center"
									href="/(public)/sign-in"
								>
									Sign in
								</Link>
							</View>
						) : (
							<View>
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
							</View>
						)}
					</>
				)}
			</View>
		</View>
	);
}
