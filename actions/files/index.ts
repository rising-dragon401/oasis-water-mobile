import { supabase } from "@/config/supabase";
import { decode } from "base64-arraybuffer";

export const uploadImage = async (file: string, path: string, name: string) => {
	try {
		const { error } = await supabase.storage
			.from(path)
			.upload(name, decode(file), {
				contentType: "image/png",
			});

		if (error) {
			throw error;
		}

		const { data: urlData } = supabase.storage.from(path).getPublicUrl(name);

		return urlData;
	} catch (e) {
		console.error("Error uploading file: ", e);
		return false;
	}
};
