import { Image } from "react-native";

type ItemImageProps = {
	src: string;
	alt: string;
};

export default function ItemImage({ src, alt }: ItemImageProps) {
	console.log("ItemImage -> src", src);
	return (
		<Image
			src={src}
			alt={alt}
			width={1000}
			height={1000}
			className="rounded-lg w-full h-full object-cover"
		/>
	);
}
