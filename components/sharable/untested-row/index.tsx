import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { upvoteThing } from "@/actions/labs";
import { checkIfUserUpvoted } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Large, Muted } from "@/components/ui/typography";
import { useToast } from "@/context/toast-provider";
import { useUserProvider } from "@/context/user-provider";
import { ITEM_TYPES } from "@/lib/constants/categories";
import { useColorScheme } from "@/lib/useColorScheme";

export default function UntestedRow({ thing }: { thing: any }) {
	const { uid, refreshUserData } = useUserProvider();
	const { iconColor } = useColorScheme();
	const showToast = useToast();
	const router = useRouter();
	const [isUpvoted, setIsUpvoted] = useState(false);

	useEffect(() => {
		checkIfUpvoted();
	}, [thing]);

	const checkIfUpvoted = async () => {
		if (!uid || !thing.id || !thing.type) return;
		const res = await checkIfUserUpvoted(uid, thing.id, thing.type);
		setIsUpvoted(res);
	};

	const handleUpvote = async () => {
		if (uid) {
			const identified = ITEM_TYPES.find((t) => t.dbTypes.includes(thing.type));
			const type = identified?.typeId;
			const id = thing.id;
			const table = identified?.tableName;

			console.log("handleUpvote", { type, id, table });

			if (!type || !id || !table) {
				console.error("No type found for", thing.type);
				return;
			}

			const res = await upvoteThing(id, type, table, uid);

			if (res) {
				showToast("Thanks for your request!");
				setIsUpvoted(true);
				refreshUserData("requests");
			}
		}
	};

	return (
		<View className="w-full mt-4 bg-white rounded-xl px-4 py-4 border border-red-500 flex flex-col gap-y-2">
			<View className="flex flex-row items-start justify-between gap-x-2">
				<View className="flex flex-row items-center gap-x-2">
					<Feather name="shield-off" size={20} color="black" />
					<Large>Untested</Large>
				</View>

				<Button
					onPress={() => router.push(`/(protected)/research`)}
					variant="outline"
					label="Check status"
					className="!h-10 !py-0"
				/>

				{/* <Button
					onPress={handleUpvote}
					variant={isUpvoted ? "outline" : "outline"}
					disabled={isUpvoted}
					label={isUpvoted ? "Requested" : "Request"}
					icon={
						<Feather
							name={isUpvoted ? "check" : "plus"}
							size={20}
							color={iconColor}
						/>
					}
					className="!h-10 !py-0"
				/> */}
			</View>
			<Muted>
				This item does not have verified lab results, so its quality and safety
				remain unknown. Want to see it tested?
			</Muted>
		</View>
	);
}
