import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import OasisLogo from "@/assets/oasis-word.png";
import SplashGraphic from "@/assets/welcome-scan-graphic.png";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H1 } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();

	// const backgroundImage = {
	// 	uri: "https://connect.live-oasis.com/storage/v1/object/public/website/images/Calm%20Water%20Touch%20by%20Yoann%20Boyer.jpg",
	// };

	return (
		<SafeAreaView className="flex flex-1 flex-col p-4 justify-between h-full">
			<View className="flex flex-1 mt-0 gap-y-2 items-center">
				<Image
					source={OasisLogo}
					style={{ width: "100%", height: 32 }}
					contentFit="contain"
				/>
				<H1 className="text-center text-primary mt-8 max-w-sm">
					Discover the best water based on science
				</H1>

				<View
					className="flex flex-col items-center justify-center h-full w-full"
					style={{
						// transform: [{ scale: 1.05 }],
						height: "100%",
					}}
				>
					<Image
						source={SplashGraphic}
						contentFit="contain"
						style={{
							width: "80%",
							height: "70%",
							marginBottom: 100,
						}}
					/>
				</View>
			</View>

			<View className="flex flex-col gap-y-6 justify-center items-center mt-4">
				<View className="flex flex-col gap-x-4 gap-y-4 max-w-sm w-full ">
					<Button
						size="default"
						variant="default"
						onPress={() => {
							router.push("/sign-up");
						}}
						label="Sign Up"
						className="!h-20"
						textClassName="!text-lg"
					/>
					<Button
						size="default"
						variant="outline"
						onPress={() => {
							router.push("/sign-in");
						}}
						label="Sign In"
						className="!h-20"
						textClassName="!text-lg"
					/>
				</View>

				<Separator className="max-w-sm" />

				<Button
					className=""
					size="default"
					variant="ghost"
					onPress={() => {
						router.push("/(protected)/search");
					}}
					label="or continue without an account"
				/>
			</View>
		</SafeAreaView>
	);
}
