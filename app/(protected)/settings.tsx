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
		<View className="flex-1 items-center justify-between bg-background p-4 py-10">
			<View>
				<H1 className="text-center mt-20">Profile</H1>
				{/* <Muted className="text-center">
				Sign out and return to the welcome screen.
			</Muted> */}
				<Typography
					size="base"
					fontWeight="normal"
					className="text-center mt-4"
				>
					Signed in as {user?.email}
				</Typography>
				<Typography size="base" fontWeight="normal" className="text-center">
					Subscription: {subscription?.plan || "Free"}
				</Typography>
			</View>
			<Button
				className="w-full"
				variant="secondary"
				label="Sign Out"
				onPress={() => {
					signOut();
				}}
			/>
		</View>
	);
}
