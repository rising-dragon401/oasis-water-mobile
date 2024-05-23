import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { addUserToAlgolia } from "@/actions/algolia";
import { updateUserData } from "@/actions/user";
import { ImageUpload } from "@/components/sharable/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserProvider } from "@/context/user-provider";

export default function EditNameForm() {
	const { userData, uid } = useUserProvider();

	const [newName, setNewName] = useState("");
	const [newBio, setNewBio] = useState("");
	const [newAvatar, setNewAvatar] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (userData && userData.full_name) {
			setNewName(userData.full_name || "");
			setNewBio(userData.bio || "");
			setNewAvatar(userData.avatar_url || "");
		}
	}, [userData]);

	const handleChangeName = async () => {
		if (!uid) {
			return;
		}

		setLoading(true);

		const res = await updateUserData(uid, "full_name", newName);
		const res2 = await updateUserData(uid, "bio", newBio);
		const res3 = await updateUserData(uid, "avatar_url", newAvatar);

		if (!res) {
			Alert.alert("Error", "Failed to update profile");
		}

		const userObject = {
			id: userData.id,
			name: newName,
			bio: newBio,
			is_oasis_public: userData.is_oasis_public,
			image: newAvatar,
		};

		addUserToAlgolia(userObject);

		setLoading(false);
	};

	return (
		<View className="flex flex-col mt-2 pb-10">
			<View className="mx-auto flex w-full flex-col space-y-6">
				<View className="">
					<Label nativeID="password" className="text-sm">
						Avatar
					</Label>
					<ImageUpload
						itemId={uid}
						label="Avatar"
						file={newAvatar}
						setFile={setNewAvatar}
					/>
				</View>

				<View className="flex flex-col w-full space-y-2">
					<Label nativeID="password" className="text-sm">
						Name
					</Label>
					<View className="flex flex-row w-full gap-2">
						<Input
							placeholder="Name"
							value={newName}
							onChangeText={(text) => setNewName(text)}
							className="w-full"
						/>
					</View>
				</View>

				<View className="flex flex-col w-full space-y-2">
					<Label nativeID="password" className="text-sm">
						Bio
					</Label>
					<View className="flex flex-row w-full gap-2">
						<Textarea
							placeholder="Bio"
							value={newBio}
							onChangeText={setNewBio}
							className="w-full"
						/>
					</View>
				</View>

				<Button
					variant="outline"
					loading={loading}
					onPress={handleChangeName}
					className="w-24 mt-2"
					label="Update"
				/>
			</View>
		</View>
	);
}
