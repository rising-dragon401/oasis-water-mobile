import {
	Feather,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";

import { Link } from "expo-router";
import { FlatList, Image, ScrollView, View } from "react-native";

import Typography from "@/components/sharable/typography";

import { determineLink } from "@/lib/utils";

type Props = {
	results: any[];
};

export default function ResultsRow({ results }: Props) {
	const getIcon = (result: any) => {
		if (result.type === "tap_water") {
			return (
				<Feather name="droplet" size={16} color="text-secondary-foreground" />
			);
		} else if (result.type === "filter") {
			return (
				<Feather name="filter" size={16} color="text-secondary-foreground" />
			);
		} else if (result.type === "ingredient") {
			return (
				<MaterialCommunityIcons
					name="atom"
					size={16}
					color="text-secondary-foreground"
				/>
			);
		} else if (result.type === "company") {
			return (
				<FontAwesome
					name="building-o"
					size={16}
					color="text-secondary-foreground"
				/>
			);
		} else {
			return (
				<MaterialCommunityIcons
					name="bottle-soda-classic-outline"
					size={18}
					color="text-secondary-foreground"
				/>
			);
		}
	};

	return (
		<ScrollView
			style={{
				position: "absolute",
				backgroundColor: "white",
				width: "100%",
				height: 240,
				borderRadius: 8,
				overflow: "scroll",
				paddingTop: 8,
				zIndex: 100,
				elevation: 100,
				marginTop: 46,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				borderWidth: 1,
				borderColor: "#ddd",
			}}
		>
			<FlatList
				data={results}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item: result }) => (
					<View className="p-2">
						<Link
							// @ts-ignore
							href={determineLink(result)}
						>
							<View className="flex flex-row gap-2 items-center justify-between w-full">
								<View className="flex flex-row gap-2 items-center justify-center">
									<Image
										source={{ uri: result.image || "" }}
										alt={result.name || ""}
										style={{ width: 50, height: 50, borderRadius: 5 }}
									/>
									<Typography
										size="base"
										fontWeight="normal"
										className="max-w-64 overflow-hidden max-h-12"
									>
										{result.name}
									</Typography>
								</View>

								{getIcon(result)}
							</View>
						</Link>
					</View>
				)}
			/>
		</ScrollView>
	);
}
