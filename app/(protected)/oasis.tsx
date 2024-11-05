import { useUserProvider } from "context/user-provider";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import OasisPage from "@/components/sharable/oasis-page";
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
			className="flex px-8 pb-10"
			contentContainerStyle={{
				justifyContent: "space-between",
				paddingBottom: 100,
				paddingTop: 80,
			}}
			style={{ backgroundColor }}
		>
			<View className="flex flex-col items-center py-4 gap-y-4 w-full">
				<OasisPage userId={uid} />
			</View>
			{/* {uid ? (
				<View className="flex flex-col items-center py-4 gap-y-4 w-full">
					{userFavorites && (
						<OasisPage userId={uid} />
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
				<View className="flex flex-col items-center gap-y-2">
					<View className="flex flex-row max-w-lg justify-between w-full">
						<View className="flex flex-col gap-y-4 ">
							<H1>My oasis</H1>

							<View className="flex flex-col gap-y-4 ">
								<Muted className="max-w-[56vw]">
									Sign in to start saving your products and see your water score
								</Muted>
							</View>
						</View>

						<Score score={0} size="sm" showScore />
					</View>

					<P>Tap Score card</P>

					<P>Shower filter Score card</P>

					<P>Drinking water filtes Score card</P>

					<P>Mineral water Score card</P>

					<P>Contamiant profile card</P>

					<Button
						label="Sign in"
						className="w-full mt-6 p-4"
						onPress={() => router.push("/(public)/sign-in")}
					/>
				</View>
			)} */}
		</ScrollView>
	);
}
