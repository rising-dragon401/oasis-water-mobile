import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, View } from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();

	const backgroundImage = {
		uri: "https://connect.live-oasis.com/storage/v1/object/public/website/images/Calm%20Water%20Touch%20by%20Yoann%20Boyer.jpg",
	};

	return (
		<ImageBackground source={backgroundImage} style={{ flex: 1 }}>
			<SafeAreaView className="flex flex-1 p-4">
				<View className="flex flex-1 mt-40 gap-y-4 items-center">
					<H1 className="text-center">Welcome to your Oasis</H1>
					<Muted className="text-center max-w-sm">
						Search, research and find the the healthiest waters for you based on
						science.
					</Muted>
				</View>
				<View className="flex flex-row gap-x-4">
					<Button
						className="flex-1"
						size="default"
						variant="default"
						onPress={() => {
							router.push("/sign-up");
						}}
						label="Sign Up"
					/>
					<Button
						className="flex-1"
						size="default"
						variant="secondary"
						onPress={() => {
							router.push("/sign-in");
						}}
						label="Sign In"
					/>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}
