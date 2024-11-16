import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { uploadFile } from "@/actions/files";
import { P } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

type FileUploadProps = {
	file?: string | null;
	setFile?: (value: string) => void;
};

export function FileUpload({ file, setFile }: FileUploadProps) {
	const { mutedForegroundColor } = useColorScheme();

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

			console.log("fileName", fileName);

			if (!base64Data) {
				throw new Error("No base64 data available for the selected image.");
			}

			if (uri) {
				const response = await fetch(uri);
				const blob = await response.blob();
				const file = new File([blob], fileName, { type: "image/png" });

				if (file) {
					const res = await uploadFile(
						file,
						`data/community/requests`,
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
			className="bg-card border border-border rounded-xl px-4 py-2 w-full flex flex-row items-center gap-2 m-1"
		>
			<Feather name="paperclip" size={18} color={mutedForegroundColor} />

			{file ? (
				<>
					<P className="max-w-64 ml-2" numberOfLines={1}>
						{file.split("/").pop()}
					</P>
				</>
			) : (
				<P className="text-muted-foreground">Select File</P>
			)}
		</TouchableOpacity>
	);
}
