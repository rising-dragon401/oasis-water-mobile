import { useRouter } from "expo-router";
import { View } from "react-native";

import Search from "@/components/sharable/search";
import { H1 } from "@/components/ui/typography";

import ItemRow from "@/components/sharable/item-row";

export default function TabOneScreen() {
	const router = useRouter();

	return (
		<View className="flex items-center justify-center bg-background p-4 gap-y-4 h-screen">
			<H1 className="text-center mb-8 max-w-md">Find your healthiest water</H1>

			<View className="w-full bg-background border border-input rounded-md flex items-center px-4">
				<Search />
			</View>

			<View className="w-full mt-14">
				<ItemRow />
			</View>

			{/* <Muted className="text-center">
				You are now authenticated and this session will persist even after
				closing the app.
			</Muted> */}
			{/* <Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => {
					router.push("/modal");
				}}
			>
				<Text>Open Modal</Text>
			</Button> */}
		</View>
	);
}
