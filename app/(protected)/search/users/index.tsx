import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { getUsersWithOasis } from "@/actions/user";
import UserPreviewCard from "@/components/sharable/user-preview-card";

export default function PeoplePage() {
	const navigation = useNavigation();

	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			navigation.setOptions({
				title: "People",
			});

			const users = await getUsersWithOasis();
			if (users) {
				setUsers(users);
			}

			setLoading(false);
		};

		fetch();
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingBottom: 80,
				paddingVertical: 20,
				paddingHorizontal: 20,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "space-between",
				}}
			>
				{users.map((user) => (
					<View style={{ width: "48%" }}>
						<UserPreviewCard key={user.id} item={user} />
					</View>
				))}
			</View>
		</ScrollView>
	);
}
