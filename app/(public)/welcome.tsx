import { useRouter } from "expo-router";
import React from "react";
// import { ImageBackground, View } from "react-native";
import { View } from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import Logo from "@/components/sharable/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H1, P } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();

	const backgroundImage = {
		uri: "https://connect.live-oasis.com/storage/v1/object/public/website/images/Calm%20Water%20Touch%20by%20Yoann%20Boyer.jpg",
	};

	return (
		// <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
		<SafeAreaView className="flex flex-1 p-4">
			<View className="flex flex-1 mt-24 gap-y-2 items-center">
				<Logo />
				<H1 className="text-center text-primary mt-4">Welcome to Oasis</H1>
				<P className="text-center max-w-xs">
					Find the healthiest drinking water and filters based on science.
				</P>
			</View>
			<View className="flex flex-col gap-y-6 mb-14 justify-center items-center">
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
						variant="secondary"
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
		// </ImageBackground>
	);
}
