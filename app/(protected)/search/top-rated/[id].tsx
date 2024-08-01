import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import RankingList from "@/components/sharable/ranking-list";
import { useColorScheme } from "@/lib/useColorScheme";

export default function TopRatedItems() {
	const local = useLocalSearchParams();
	const { backgroundColor } = useColorScheme();

	return (
		<View
			className="flex-1 items-center justify-between p-4 pb-10 "
			style={{ backgroundColor }}
		>
			<View className="md:px-0 px-2 ">
				<RankingList categoryId={local.id as string} />
			</View>
		</View>
	);
}
