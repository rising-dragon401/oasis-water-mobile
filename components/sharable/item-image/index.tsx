import FavoriteButton from "components/sharable/favorite-button";
import { Image } from "expo-image";
import { View } from "react-native";

type ItemImageProps = {
	src: string;
	alt: string;
	thing: any;
};

export default function ItemImage({ src, alt, thing }: ItemImageProps) {
	console.log("src", src);

	return (
		<View style={{ position: "relative", width: "100%", height: "100%" }}>
			<Image
				source={src}
				accessibilityLabel={alt}
				style={{ width: "100%", height: "100%", borderRadius: 8 }}
			/>
			<View style={{ position: "absolute", top: 10, right: 10, zIndex: 99 }}>
				<FavoriteButton item={thing} />
			</View>
		</View>
	);
}
