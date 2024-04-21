import { Image } from "react-native";

type ItemImageProps = {
	src: string;
	alt: string;
};

export default function ItemImage({ src, alt }: ItemImageProps) {
	return (
		<Image
			source={{ uri: src }}
			accessibilityLabel={alt}
			style={{ width: "100%", height: "100%", borderRadius: 8 }}
		/>
	);
}
