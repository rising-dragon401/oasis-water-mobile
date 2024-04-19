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
			className="rounded-lg md:w-[600px] md:h-full w-72 h-72 object-cover"
		/>
	);
}
