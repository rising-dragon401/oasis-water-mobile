import { useUserProvider } from "context/user-provider";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { Large } from "@/components/ui/typography";

export default function ScoreScreen() {
	const glob = useGlobalSearchParams();
	const local = useLocalSearchParams();
	const { userScores } = useUserProvider();

	const id =
		(Array.isArray(local?.id) ? local?.id[0] : local?.id) ||
		(Array.isArray(glob?.id) ? glob?.id[0] : glob?.id) ||
		"1";

	// console.log("id", id);

	const userScoreData = userScores?.scoreMetadata?.[id];

	// console.log("userScoreData", JSON.stringify(userScoreData, null, 2));
	return (
		<View>
			<Large>{userScoreData?.scoreName}</Large>
		</View>
	);
}
