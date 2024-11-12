import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { View } from "react-native";

import { P, Small } from "@/components/ui/typography";

const PLACEHOLDER_TAP_WATER_IMAGE =
	"https://connect.live-oasis.com/storage/v1/object/public/website/images/placeholders/clear-water.jpg";
export default function LocationCard({
	location,
	size = "sm",
}: {
	location: any;
	size: "sm" | "lg";
}) {
	const scoreSize = size === "lg" ? 3 : 32;
	const stWidth = size === "lg" ? 4 : 3;
	const textClassName = size === "lg" ? "text-xl " : "text-sm";

	const getBgColor = () => {
		if (location?.score === null) {
			return "bg-zinc-300";
		} else if (location?.score > 70) {
			return "bg-emerald-300";
		} else if (location?.score > 50) {
			return "bg-amber-300";
		} else {
			return "bg-rose-300";
		}
	};

	return (
		<View
			className="relative rounded-xl my-2 flex-1 min-w-full h-full min-h-32 overflow-hidden "
			style={{
				minHeight: size === "lg" ? 120 : 80,
			}}
		>
			{location && (
				<Image
					source={{ uri: location.image || PLACEHOLDER_TAP_WATER_IMAGE }}
					style={{ width: "100%", height: "100%" }}
					alt={location.name}
				/>
			)}

			{/* Circle with full opacity, layered above the overla */}
			{location && location.score && (
				<View className="absolute top-4 right-4 z-10 flex-1">
					<View className="flex-row items-center gap-x-1 bg-muted rounded-full px-4 py-2">
						<View className={`w-3 h-3 rounded-full ${getBgColor()}`} />
						<Small>{location.score ? `${location.score}/100` : "0/100"}</Small>
					</View>
				</View>
			)}

			{/* Overlay with location name */}
			<View className="absolute inset-0 bg-black/50 flex items-center justify-center h-full w-full z-0">
				{location && location.id ? (
					<P className="text-white text-lg font-semibold">
						{location.name || "Add location"}
					</P>
				) : (
					<View className="flex flex-col gap-2 h-full  items-center justify-center">
						<Ionicons name="add-outline" size={24} color="hsl(0, 0%, 100%)" />
						<P className="text-white text-base">Add location</P>
					</View>
				)}
			</View>
		</View>
	);
}
