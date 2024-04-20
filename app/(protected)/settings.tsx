import { View } from "react-native";

import Typography from "@/components/sharable/typography";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { useUserProvider } from "context/user-provider";

export default function TabTwoScreen() {
	const { signOut } = useSupabase();
	const { user, userData, subscription } = useUserProvider();

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Profile</H1>
			{/* <Muted className="text-center">
				Sign out and return to the welcome screen.
			</Muted> */}
			<Typography size="base" fontWeight="normal" className="text-center">
				Signed in as {user?.email}
			</Typography>
			<Typography size="base" fontWeight="normal" className="text-center">
				Subscription: {subscription?.plan || "Free"}
			</Typography>
			<Button
				className="w-full"
				size="default"
				variant="default"
				label="Sign Out"
				onPress={() => {
					signOut();
				}}
			/>
		</View>
	);
}
