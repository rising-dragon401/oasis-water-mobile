import { supabase } from "@/config/supabase";

export const handleDeleteUser = async (uid: string) => {
	try {
		const { error } = await supabase
			.from("deletion_requests")
			.insert({ user_id_to_delete: uid });

		if (error) throw error;

		console.log(`Deletion request added for user [${uid}]`);

		return true;
	} catch (error) {
		console.error("Error adding deletion request:", error);
		return false;
	}
};
