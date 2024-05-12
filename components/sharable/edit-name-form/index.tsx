import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { addUserToAlgolia } from "@/actions/algolia";
import { updateUserData } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProvider } from "@/context/user-provider";

export default function EditNameForm() {
	const { userData, uid } = useUserProvider();

	const [newName, setNewName] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (userData && userData.full_name) {
			setNewName(userData.full_name);
		}
	}, [userData]);

	const handleChangeName = async () => {
		if (!newName || !uid) {
			return;
		}

		setLoading(true);

		const res = await updateUserData(uid, "full_name", newName);

		if (!res) {
			Alert.alert("Error", "Failed to update name");
		}

		const userObject = {
			id: userData.id,
			name: newName,
			is_oasis_public: userData.is_oasis_public,
			image: userData.avatar_url,
		};

		addUserToAlgolia(userObject);

		setLoading(false);
	};

	return (
		<View className="flex flex-col mt-2">
			<View className="mx-auto flex w-full flex-col space-y-6 ">
				<View className="flex flex-col w-full  space-y-2">
					<Label nativeID="password" className="text-sm">
						Name
					</Label>
					<View className="flex flex-row w-full gap-2">
						<Input
							placeholder="Name"
							value={newName}
							onChangeText={(text) => setNewName(text)}
							className="w-80"
						/>
						<Button
							variant="ghost"
							loading={loading}
							onPress={handleChangeName}
							className="w-24"
							label="Update"
						/>
					</View>
				</View>
			</View>
		</View>
	);
}
