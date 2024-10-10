import { useUserProvider } from "context/user-provider";
import { Link, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import FavoritesList from "@/components/sharable/favorites-list";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function OasisScreen() {
	const { uid, userFavorites } = useUserProvider();
	const { colorScheme } = useColorScheme();
	const router = useRouter();
	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<ScrollView
			className="flex-1 px-8 pb-10 pt-24"
			contentContainerStyle={{
				justifyContent: "space-between",
				paddingBottom: 100,
			}}
			style={{ backgroundColor }}
		>
			<H1>Favorites</H1>
			{uid ? (
				<View className="flex flex-col items-center py-4 gap-y-4 w-full">
					{userFavorites ? (
						<FavoritesList userId={uid} />
					) : (
						<>
							<View className="w-full justify-center gap-y-2">
								<View className="flex flex-col items-center p-4 gap-y-4 w-full">
									<H1 className="text-center mt-20">My products</H1>
									<Muted className="text-center ">
										You haven't added anything yet
									</Muted>
								</View>

								<Link
									className="w-full mt-8 text-center"
									href="/(protected)/search"
								>
									Explore
								</Link>
							</View>
						</>
					)}
				</View>
			) : (
				<View className="w-full gap-y-2">
					<View className="flex flex-col gap-y-4 w-full">
						<Muted className="">
							Sign in to add products and see your water score
						</Muted>
					</View>

					<Button
						label="Sign in"
						className="w-full mt-2 p-4"
						onPress={() => router.push("/(public)/sign-in")}
					/>
				</View>
			)}
		</ScrollView>
	);
}
