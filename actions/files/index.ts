import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

import { supabase } from "@/config/supabase";

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

export const uploadCameraImage = async (
	fileUri: string,
	path: string,
	name: string,
) => {
	try {
		// Read the file as base64
		const base64Image = await FileSystem.readAsStringAsync(fileUri, {
			encoding: FileSystem.EncodingType.Base64,
		});

		// Upload to Supabase
		const { data, error } = await supabase.storage
			.from(path)
			.upload(name, decode(base64Image), {
				contentType: "image/jpeg",
				upsert: false,
			});

		if (error) {
			throw error;
		}

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

export const uploadFile = async (file: File, path: string, name: string) => {
	try {
		const { data, error } = await supabase.storage
			.from(path)
			.upload(name, file);

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
