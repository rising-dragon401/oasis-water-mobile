import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function StickyHeader({
	title,
	icon,
	path,
	description,
}: {
	title: string;
	icon?: string;
	path?: string;
	description?: string;
}) {
	const router = useRouter();
	const { iconColor } = useColorScheme();

	return (
		<View className="flex-row w-full justify-between items-center mt-24">
			<View className="flex-col gap-y-1">
				<H1>{title}</H1>

				{description && <Muted>{description}</Muted>}
			</View>

			<TouchableOpacity
				onPress={() => path && router.push(path as any)}
				className="!bg-transparent"
			>
				<Feather name={icon as any} size={24} color={iconColor} />
			</TouchableOpacity>
		</View>
	);
}
