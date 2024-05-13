import { P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import { FlatList, Image, ScrollView, View } from "react-native";

type Props = {
	results: any[];
};

export default function ResultsRow({ results }: Props) {
	const { colorScheme } = useColorScheme();

	const iconColor =
		colorScheme === "dark" ? theme.dark.primary : theme.light.primary;
	const borderColor = colorScheme === "dark" ? "#333" : "#ddd";

	const getIcon = (result: any) => {
		if (result.type === "tap_water") {
			return <Feather name="droplet" size={18} color={iconColor} />;
		} else if (result.type === "filter") {
			return <Feather name="filter" size={18} color={iconColor} />;
		} else if (result.type === "ingredient") {
			return <MaterialCommunityIcons name="atom" size={18} color={iconColor} />;
		} else if (result.type === "company") {
			return <FontAwesome name="building-o" size={18} color={iconColor} />;
		} else if (result.type === "user") {
			return <AntDesign name="user" size={18} color={iconColor} />;
		} else {
			return (
				<MaterialCommunityIcons
					name="bottle-soda-classic-outline"
					size={18}
					color={iconColor}
				/>
			);
		}
	};

	return (
		<ScrollView
			style={{
				position: "absolute",
				backgroundColor:
					colorScheme === "dark"
						? theme.dark.background
						: theme.light.background,
				width: "100%",
				maxHeight: 240,
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
				borderColor,
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
							<View className="flex flex-row gap-2 items-center justify-between w-full px-1 pr-4">
								<View className="flex flex-row gap-2 items-center justify-center">
									<Image
										source={{ uri: result.image || "" }}
										alt={result.name || ""}
										style={{ width: 28, height: 28, borderRadius: 5 }}
									/>
									<P className="max-w-64 font-bold ml-2">{result.name}</P>
								</View>

								{getIcon(result)}
							</View>
						</Link>
					</View>
				)}
				nestedScrollEnabled
				showsVerticalScrollIndicator={false}
			/>
		</ScrollView>
	);
}
