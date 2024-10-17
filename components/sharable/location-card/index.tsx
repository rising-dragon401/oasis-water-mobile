import { Image } from "expo-image";
import { View } from "react-native";

import { Circle } from "@/components/sharable/circle";
import { P } from "@/components/ui/typography";

export default function LocationCard({ location }: { location: any }) {
	return (
		<View className="relative rounded-xl my-2 w-44 h-24 max-h-24 overflow-hidden ">
			<Image
				source={{ uri: location.image }}
				style={{ width: "100%", height: "100%" }}
				alt={location.name}
			/>

			{/* Circle with full opacity, layered above the overla */}
			<View className="absolute top-2 right-2 z-10">
				<Circle
					value={location.score}
					size={32}
					strokeWidth={3}
					textClassName="text-muted"
				/>
			</View>

			{/* Overlay with location name */}
			<View className="absolute inset-0 bg-black/30 flex items-center justify-center h-full w-full z-0">
				<P className="text-white text-lg font-semibold">{location.name}</P>
			</View>
		</View>
	);
}
