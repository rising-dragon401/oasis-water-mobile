import { Image } from "react-native";

type ItemImageProps = {
	src: string;
	alt: string;
};

export default function ItemImage({ src, alt }: ItemImageProps) {
	return (
		<Image
			src={src}
			alt={alt}
			width={1000}
			height={1000}
			className="rounded-lg w-96 h-96  object-cover p-2"
		/>
	);
}
