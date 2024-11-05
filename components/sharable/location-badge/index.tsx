import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { Small } from "@/components/ui/typography";

export default function LocationBadge({ location }: { location: string }) {
	const router = useRouter();

	return (
		<TouchableOpacity
			onPress={() => router.push("/locationModal")}
			className="flex-row items-center gap-x-2  h-8 px-2 rounded-full"
		>
			<Feather name="map-pin" size={14} color="black" />
			<Small>
				{location?.length > 10 ? `${location?.substring(0, 10)}...` : location}
			</Small>
		</TouchableOpacity>
	);
}
