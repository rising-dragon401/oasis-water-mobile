import FavoriteButton from "components/sharable/favorite-button";
import { Image } from "expo-image";
import { View } from "react-native";

type ItemImageProps = {
	src: string;
	alt: string;
	thing: any;
	showFavorite?: boolean;
};

export default function ItemImage({
	src,
	alt,
	thing,
	showFavorite = true,
}: ItemImageProps) {
	return (
		<View
			style={{ position: "relative", width: "100%", height: "100%" }}
			className="rounded-xl shadow-lg shadow-muted/80 "
		>
			<Image
				source={src}
				accessibilityLabel={alt}
				style={{ width: "100%", height: "100%", borderRadius: 14 }}
				transition={500}
			/>
			{showFavorite && (
				<View style={{ position: "absolute", top: 12, right: 12, zIndex: 99 }}>
					<FavoriteButton item={thing} />
				</View>
			)}
		</View>
	);
}
