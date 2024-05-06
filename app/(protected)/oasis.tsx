import { useUserProvider } from "context/user-provider";
import { Link } from "expo-router";
import { View } from "react-native";

import { H1, Muted } from "@/components/ui/typography";

import FavoritesList from "@/components/sharable/favorites-list";

export default function OasisScreen() {
	const { uid, userFavorites } = useUserProvider();

	return (
		<View className="flex-1 items-center justify-between p-4 pb-10 pt-20">
			<View className="flex flex-col items-center p-4 gap-y-4 w-full">
				{userFavorites ? (
					<FavoritesList userId={uid} />
				) : (
					<View className="w-full justify-center items-center gap-y-2">
						<View className="flex flex-col items-center p-4 gap-y-4 w-full">
							<H1 className="text-center mt-20">Your Oasis</H1>
							<Muted className="text-center ">
								You haven't added anything to your Oasis yet
							</Muted>
						</View>

						<Link className="w-full mt-8 text-center" href="/(public)/sign-in">
							Sign in
						</Link>
					</View>
				)}
			</View>
		</View>
	);
}
