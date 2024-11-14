import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { P } from "@/components/ui/typography";

type FileUploadProps = {
	file?: string | null;
	setFile?: (value: string) => void;
};

export function FileUpload({ file, setFile }: FileUploadProps) {
	const [loading, setLoading] = useState(false);

	const onFileChange = async () => {
		// setLoading(true);
		// try {
		// 	// Request permission to access media library
		// 	const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		// 	if (status !== 'granted') {
		// 		alert('Sorry, we need camera roll permissions to make this work!');
		// 		setLoading(false);
		// 		return;
		// 	}
		// 	// Launch image picker
		// 	const result = await ImagePicker.launchImageLibraryAsync({
		// 		mediaTypes: ImagePicker.MediaTypeOptions.All,
		// 		allowsEditing: true,
		// 		base64: true,
		// 	});
		// 	if (!result.cancelled) {
		// 		const uri = result.uri;
		// 		const base64Data = result.base64;
		// 		const fileName = uri.split('/').pop() || 'file';
		// 		const fileType = result.type === 'image' ? 'image/png' : 'application/pdf';
		// 		if (base64Data) {
		// 			const res = await uploadFile(
		// 				base64Data,
		// 				`<community />
		// 				<requests />${fileName}`,
		// 				fileName,
		// 			);
		// 			if (res && setFile) {
		// 				setFile(res.publicUrl);
		// 			}
		// 		} else {
		// 			throw new Error("No base64 data available for the selected file.");
		// 		}
		// 	}
		// } catch (e) {
		// 	console.error("Error selecting file: ", e);
		// } finally {
		// 	setLoading(false);
		// }
	};

	return (
		<TouchableOpacity
			onPress={onFileChange}
			className="flex relative justify-center items-center border border-gray-300 border-dashed rounded-full w-24 h-24"
		>
			{file ? (
				<>
					<P>{file.split("/").pop()}</P>
					<Ionicons
						name="document-outline"
						size={24}
						color="white"
						style={{ position: "absolute" }}
					/>
				</>
			) : (
				<P>Select File</P>
			)}
		</TouchableOpacity>
	);
}
