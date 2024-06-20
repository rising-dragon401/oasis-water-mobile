import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { addUserToAlgolia, deleteUserFromAlgolia } from "@/actions/algolia";
import { updateUserData } from "@/actions/user";

type Props = {
	userData: any;
	uid: string | null | undefined;
	subscription: any;
};

export function OasisSwitch({ userData, uid, subscription }: Props) {
	const router = useRouter();
	const [checked, setChecked] = useState(userData?.is_oasis_public);

	const handleChange = async (value: boolean) => {
		if (!uid || !subscription) {
			return;
		}

		setChecked(value);

		const res = await updateUserData(uid, "is_oasis_public", value);

		if (!res) {
			return;
		}

		const userObject = {
			id: userData.id,
			name: userData.full_name,
			is_oasis_public: value,
			image: userData.avatar_url,
		};

		if (value) {
			addUserToAlgolia(userObject);
		} else {
			deleteUserFromAlgolia(userData.id);
		}
	};

	const switchElement = (
		<Switch
			checked={checked}
			onCheckedChange={handleChange}
			nativeID="oasis-public-switch"
			disabled={!subscription}
		/>
	);

	return (
		<View className="flex flex-col items-left gap-2">
			<Label nativeID="oasis-public">Public profile</Label>
			{switchElement}
		</View>
	);
}
