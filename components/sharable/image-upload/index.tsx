import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, TouchableOpacity } from "react-native";

import { uploadImage } from "@/actions/files";
import { P } from "@/components/ui/typography";

type ImageUploadProps = {
	itemId: string | null | undefined;
	label: string;
	file?: string | null;
	setFile?: (value: string) => void;
};

export function ImageUpload({
	itemId,
	label,
	file,
	setFile,
}: ImageUploadProps) {
	const [loading, setLoading] = useState(false);

	const onFileChange = async () => {
		setLoading(true);

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			const uri = result?.assets?.[0]?.uri;
			const base64Data = result?.assets?.[0]?.base64 || "";

			const getFileNameFromUri = (uri: string) => {
				const uriParts = uri.split("/");
				return uriParts[uriParts.length - 1];
			};

			// Extract the file name from the first asset's URI
			const fileName = getFileNameFromUri(uri || "");

			if (!base64Data) {
				throw new Error("No base64 data available for the selected image.");
			}

			if (uri) {
				const response = await fetch(uri);
				const blob = await response.blob();
				const file = new File([blob], fileName, { type: "image/png" });

				if (file) {
					const res = await uploadImage(
						base64Data,
						`users/${itemId}`,
						fileName,
					);

					if (res && setFile) {
						setFile(res.publicUrl);
					}
				}
			} else {
				console.error("No URI available for the selected image.");
			}
		} catch (e) {
			console.error("Error selecting image: ", e);
		}
	};

	return (
		<TouchableOpacity
			onPress={onFileChange}
			className="flex relative justify-center items-center border border-gray-300 border-dashed rounded-full w-24 h-24"
		>
			{file ? (
				<>
					<Image source={{ uri: file }} className="rounded-full w-24 h-24" />
					<Ionicons
						name="camera-outline"
						size={24}
						color="white"
						style={{ position: "absolute" }}
					/>
				</>
			) : (
				<P>{label}</P>
			)}
		</TouchableOpacity>
	);
}
