import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4">
			<View className="flex flex-1 items-center justify-center gap-y-4">
				<H1 className="text-center">Welcome to your Oasis</H1>
				<Muted className="text-center">
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
	);
}
