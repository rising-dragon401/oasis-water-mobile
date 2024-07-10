import { updateUserData } from "@/actions/user";
import Logo from "@/components/sharable/logo";
import { H1, P } from "@/components/ui/typography";
import { useUserProvider } from "@/context/user-provider";
import { useColorScheme } from "@/lib/useColorScheme";

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as StoreReview from "expo-store-review";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

export default function ReviewModal() {
	const { uid } = useUserProvider();
	const { iconColor } = useColorScheme();
	const router = useRouter();

	const [rating, setRating] = useState(0); // Add state to track rating

	const requestReview = async () => {
		if (!uid) {
			router.back();
			return;
		}

		if (await StoreReview.hasAction()) {
			StoreReview.requestReview();

			updateUserData(uid, "has_reviewed_app", true);

			setTimeout(() => {
				router.back();
			}, 500);
		}
	};

	const handleLowRating = () => {
		if (!uid) {
			router.back();
			return;
		}

		Alert.alert("Thank you for your feedback! ");
		updateUserData(uid, "has_reviewed_app", true);

		setTimeout(() => {
			router.back();
		}, 1000);
	};

	return (
		<View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4 pt-20 pb-10">
			<View />

			<View className="w-full flex flex-col items-center px-12">
				<Logo />
				<H1 className="text-center mt-3">Enjoying Oasis?</H1>
				<P className="text-center max-w-md mt-2">
					We are a team of 1 trying to create transparency in the water world.
					Please support with your feedback.
				</P>

				<View className="flex flex-row gap-x-2 mt-10">
					{[1, 2, 3, 4, 5].map((star) => (
						<TouchableOpacity
							key={star}
							onPress={async () => {
								setRating(star);

								if (star === 5) {
									await requestReview();
								} else {
									handleLowRating();
								}
							}}
						>
							<AntDesign
								name={star <= rating ? "star" : "staro"}
								size={32}
								color={iconColor}
							/>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</View>
	);
}
