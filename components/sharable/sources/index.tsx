import Feather from "@expo/vector-icons/Feather";
import * as Linking from "expo-linking";
import { TouchableOpacity, View } from "react-native";

import Typography from "../typography";

import { useColorScheme } from "@/lib/useColorScheme";

export default function Sources({ data }: any) {
	const { mutedForegroundColor } = useColorScheme();

	return (
		<View className="flex flex-col gap-4 my-10 w-full">
			<Typography size="2xl" fontWeight="normal">
				Lab results
			</Typography>

			<View className="grid md:grid-cols-2 grid-cols-1 gap-2">
				{data
					?.slice()
					.reverse()
					.map((source: any) => (
						<View key={source.url} className="flex flex-col gap-2">
							<TouchableOpacity
								onPress={() => {
									Linking.openURL(source.url);
								}}
								className="flex flex-row items-start justify-between w-full gap-2"
							>
								<Typography
									size="base"
									fontWeight="normal"
									className="underline max-w-xs"
								>
									{source.label}
								</Typography>
								<Feather
									name="arrow-up-right"
									size={16}
									color={mutedForegroundColor}
								/>
							</TouchableOpacity>
						</View>
					))}
			</View>
		</View>
	);
}
