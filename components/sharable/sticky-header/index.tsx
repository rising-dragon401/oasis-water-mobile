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
	hideMargin,
	showContributions,
}: {
	title: string;
	icon?: string;
	path?: string;
	description?: string;
	hideMargin?: boolean;
	showContributions?: boolean;
}) {
	const router = useRouter();
	const { iconColor } = useColorScheme();

	return (
		<View
			className={`flex-row w-full justify-between items-start ${
				hideMargin ? "" : "mt-24"
			}`}
		>
			<View className="flex-col gap-y-1">
				<H1>{title}</H1>

				{description && <Muted>{description}</Muted>}
			</View>

			<View className="flex flex-row gap-x-4 items-center">
				{showContributions && (
					<TouchableOpacity
						onPress={() =>
							router.push("https://www.oasiswater.app/product-testing")
						}
						className="border border-accent rounded-full px-2 py-1 flex flex-row items-center gap-x-1"
					>
						<Muted className="text-accent">Contributions</Muted>
					</TouchableOpacity>
				)}

				<TouchableOpacity
					onPress={() => path && router.push(path as any)}
					className="!bg-transparent flex flex-row items-center gap-x-1"
				>
					<Feather name={icon as any} size={24} color={iconColor} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
