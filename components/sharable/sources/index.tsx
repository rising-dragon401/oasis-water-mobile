import * as Linking from "expo-linking";
import { TouchableOpacity, View } from "react-native";

import Typography from "../typography";

export default function Sources({ data }: any) {
	return (
		<View className="flex flex-col gap-6 my-10">
			<Typography size="2xl" fontWeight="normal">
				Sources
			</Typography>
			<View className="grid md:grid-cols-2 grid-cols-1 gap-6">
				{data?.map((source: any) => (
					<View key={source.url} className="flex flex-col gap-2">
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(source.url);
							}}
						>
							<Typography
								size="base"
								fontWeight="normal"
								className="text-secondary underline"
							>
								{source.label}
							</Typography>
						</TouchableOpacity>
					</View>
				))}
			</View>
		</View>
	);
}
