import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { P } from "@/components/ui/typography";

export default function BackButton() {
	const router = useRouter();

	return (
		<TouchableOpacity
			onPress={() => {
				router.back();
			}}
			className="mb-3 flex flex-row items-center gap-2"
		>
			<Octicons name="chevron-left" size={24} color="black" />
			<P className="self-start">back</P>
		</TouchableOpacity>
	);
}
