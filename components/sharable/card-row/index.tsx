import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { View } from "react-native";

import { Muted, P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function CardRow({
	image,
	title,
	description,
}: {
	image: string;
	title: string;
	description: string;
}) {
	const { mutedForegroundColor } = useColorScheme();

	return (
		<View className="flex flex-row items-center px-2 justify-between w-full h-full max-h-24 rounded-2xl bg-card mb-4">
			<View className="flex flex-row items-center gap-2 py-2">
				<View className="rounded-md overflow-hidden ">
					<Image
						source={{ uri: image }}
						alt={title}
						style={{
							width: 56,
							height: 56,
						}}
						contentFit="cover"
					/>
				</View>
				<View className="flex flex-col gap-1 h-full">
					<P className="font-medium text-xl">{title}</P>
					<Muted className="text-base">{description}</Muted>
				</View>
			</View>
			<View className="flex flex-col justify-end gap-2 h-full  mr-2">
				<Ionicons name="arrow-forward" size={18} color={mutedForegroundColor} />
				<View className="h-2" />
			</View>
		</View>
	);
}
