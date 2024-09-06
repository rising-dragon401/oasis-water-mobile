import { useUserProvider } from "context/user-provider";
import { Link } from "expo-router";
import { View } from "react-native";

import FavoritesList from "@/components/sharable/favorites-list";
import { H1, Muted, P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function OasisScreen() {
	const { uid, userFavorites } = useUserProvider();
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === "dark" ? theme.dark.background : theme.light.background;

	return (
		<View
			className="flex-1 justify-between px-4 pb-10 pt-20"
			style={{ backgroundColor }}
		>
			{uid ? (
				<View className="flex flex-col items-center p-4 gap-y-4 w-full">
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
					<View className="flex flex-colp-4 gap-y-4 w-full">
						<H1 className="\">My products</H1>
						<Muted className="">
							Sign in to add products and see your water score
						</Muted>
					</View>

					<Link className="w-full mt-2" href="/(public)/sign-in">
						<P>Sign in</P>
					</Link>
				</View>
			)}
		</View>
	);
}
