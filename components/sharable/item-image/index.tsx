import FavoriteButton from "components/sharable/favorite-button";
import { Image, View } from "react-native";

type ItemImageProps = {
	src: string;
	alt: string;
	thing: any;
};

export default function ItemImage({ src, alt, thing }: ItemImageProps) {
	return (
		<View style={{ position: "relative", width: "100%", height: "100%" }}>
			<Image
				source={{ uri: src }}
				accessibilityLabel={alt}
				style={{ width: "100%", height: "100%", borderRadius: 8 }}
				onError={(e) =>
					console.log("Image loading error:", e.nativeEvent.error)
				}
			/>
			<View style={{ position: "absolute", top: 10, right: 10, zIndex: 99 }}>
				<FavoriteButton item={thing} />
			</View>
		</View>
	);
}
