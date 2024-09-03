import { P } from "@/components/ui/typography";
import { theme } from "@/lib/constants";
import { placeHolderImageBlurHash } from "@/lib/constants/images";
import { useColorScheme } from "@/lib/useColorScheme";
import { determineLink } from "@/lib/utils";
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";

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
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{
				position: "absolute",
				width: "100%",
				maxHeight: 240,
				marginTop: 46,
				zIndex: 100,
			}}
		>
			<View
				style={{
					backgroundColor:
						colorScheme === "dark" ? theme.dark.card : theme.light.card,
					borderRadius: 8,
					overflow: "hidden",
					borderWidth: 1,
					borderColor,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
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
								<View className="flex flex-row gap-2 items-center justify-between w-full py-1">
									<View className="flex flex-row gap-4 items-center justify-center pl-2">
										<Image
											source={{ uri: result.image || "" }}
											alt={result.name || ""}
											style={{ width: 32, height: 32, borderRadius: 5 }}
											placeholder={{ blurhash: placeHolderImageBlurHash }}
										/>
										<P className="max-w-72 font-medium">{result.name}</P>
									</View>

									{/* {getIcon(result)} */}
								</View>
							</Link>
						</View>
					)}
					nestedScrollEnabled
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				/>
			</View>
		</KeyboardAvoidingView>
	);
}
