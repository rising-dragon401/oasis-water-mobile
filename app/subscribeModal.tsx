import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";

export default function SubscribeModal() {
	const router = useRouter();

	return (
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Unlock your health</H1>
			<Muted className="text-center">$5 / month</Muted>

			<Button
				className="w-full"
				variant="default"
				size="default"
				label="Not now"
				onPress={() => {
					router.back();
				}}
			/>
		</View>
	);
}
